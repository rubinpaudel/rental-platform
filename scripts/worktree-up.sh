#!/usr/bin/env bash
# make worktree-up — provision a per-worktree DB clone, write worktree-scoped
# env with deterministic non-clashing ports, and start `pnpm dev` detached.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./worktree-lib.sh
source "$SCRIPT_DIR/worktree-lib.sh"

# If we're running from the main repo, interactively create a worktree and
# re-exec inside it. Otherwise fall through to the provisioning flow.
WORKTREE_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" \
  || wt_die "not in a git working tree"
MAIN_REPO="$(git rev-parse --path-format=absolute --git-common-dir)"
MAIN_REPO="${MAIN_REPO%/.git}"

if [[ "$WORKTREE_ROOT" == "$MAIN_REPO" ]]; then
  echo "→ no worktree here — let's create one off the main repo"
  read -rp "  New branch name (e.g. feat/foo-bar): " NEW_BRANCH
  [[ -n "$NEW_BRANCH" ]] || wt_die "branch name required"
  read -rp "  Base branch [main]: " BASE_BRANCH
  BASE_BRANCH="${BASE_BRANCH:-main}"

  # Directory convention: branches use '/', dirs use '+' (matches existing
  # fix+auth-orgid-... naming so the dashboard stays consistent).
  DIR_SLUG="$(printf '%s' "$NEW_BRANCH" | tr '/' '+')"
  NEW_PATH="$WORKTREE_ROOT/.claude/worktrees/$DIR_SLUG"

  [[ -e "$NEW_PATH" ]] && wt_die "directory already exists: $NEW_PATH"

  if git -C "$WORKTREE_ROOT" show-ref --verify --quiet "refs/heads/$NEW_BRANCH"; then
    echo "→ branch '$NEW_BRANCH' already exists, checking it out (base '$BASE_BRANCH' ignored)"
    git -C "$WORKTREE_ROOT" worktree add "$NEW_PATH" "$NEW_BRANCH"
  else
    if ! git -C "$WORKTREE_ROOT" show-ref --verify --quiet "refs/heads/$BASE_BRANCH"; then
      wt_die "base branch '$BASE_BRANCH' does not exist locally"
    fi
    echo "→ creating worktree at $NEW_PATH (branch '$NEW_BRANCH' off '$BASE_BRANCH')"
    git -C "$WORKTREE_ROOT" worktree add -b "$NEW_BRANCH" "$NEW_PATH" "$BASE_BRANCH"
  fi

  echo "→ re-invoking worktree-up inside the new worktree"
  # Run this same script (from the main repo path, which has it) but with cwd
  # in the new worktree, so the second invocation resolves WORKTREE_ROOT there.
  # This also works when the base branch doesn't have scripts/ yet.
  cd "$NEW_PATH"
  exec bash "$SCRIPT_DIR/worktree-up.sh"
fi

wt_resolve_branch_and_slug
wt_compute_ports

STATE_DIR="$(wt_state_dir)"
mkdir -p "$STATE_DIR"

ENV_LOCAL="$WORKTREE_ROOT/.env.local"
ENV_EXAMPLE="$WORKTREE_ROOT/.env.example"
WEB_ENV_LOCAL="$WORKTREE_ROOT/apps/web/.env.local"

# pnpm 10's `-C dir <subcommand>` misparses non-builtin subcommands like
# `turbo`, so run pnpm from within the worktree throughout.
cd "$WORKTREE_ROOT"

if [[ ! -d "$WORKTREE_ROOT/node_modules" ]]; then
  echo "→ installing dependencies (no node_modules yet; pnpm install --frozen-lockfile)"
  pnpm install --frozen-lockfile
fi

# Library packages must have their dist/ on disk before api boots; tsup --watch
# in the dev tree builds in parallel and the api races it on first boot.
if [[ ! -d "$WORKTREE_ROOT/packages/config/dist" ]]; then
  echo "→ first-time build of library packages (so the API can resolve their dist/)"
  pnpm turbo run build --filter='./packages/*'
fi

echo "→ ensuring shared dev stack is up"
pnpm stack:up >/dev/null
wt_wait_for_postgres

echo "→ checking database $DB_NAME"
exists="$(wt_pg -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" || true)"
if [[ "$exists" == "1" ]]; then
  echo "  ✓ database exists, reusing"
else
  echo "  • cloning $WT_PG_TEMPLATE_DB → $DB_NAME (pg_dump | pg_restore)"
  docker exec \
    -e PGPASSWORD="$WT_PG_PASSWORD" \
    "$WT_PG_CONTAINER" \
    createdb -U "$WT_PG_USER" "$DB_NAME"
  docker exec \
    -e PGPASSWORD="$WT_PG_PASSWORD" \
    "$WT_PG_CONTAINER" \
    pg_dump -U "$WT_PG_USER" -d "$WT_PG_TEMPLATE_DB" -Fc \
    | docker exec -i \
        -e PGPASSWORD="$WT_PG_PASSWORD" \
        "$WT_PG_CONTAINER" \
        pg_restore -U "$WT_PG_USER" -d "$DB_NAME" --no-owner
  echo "  ✓ clone complete"
fi

echo "→ writing worktree-scoped env"
[[ -f "$ENV_LOCAL" ]] || cp "$ENV_EXAMPLE" "$ENV_LOCAL"
wt_set_env "$ENV_LOCAL" API_PORT "$API_PORT"
wt_set_env "$ENV_LOCAL" DATABASE_URL "postgres://${WT_PG_USER}:${WT_PG_PASSWORD}@localhost:${WT_PG_HOST_PORT}/${DB_NAME}"
wt_set_env "$ENV_LOCAL" BETTER_AUTH_URL "http://localhost:${API_PORT}"
wt_set_env "$ENV_LOCAL" WEB_APP_URL "http://localhost:${WEB_PORT}"
wt_set_env "$ENV_LOCAL" AUTH_TRUSTED_ORIGINS "http://localhost:${WEB_PORT},plekje://,exp://"

mkdir -p "$(dirname "$WEB_ENV_LOCAL")"
[[ -f "$WEB_ENV_LOCAL" ]] || : >"$WEB_ENV_LOCAL"
wt_set_env "$WEB_ENV_LOCAL" PORT "$WEB_PORT"
wt_set_env "$WEB_ENV_LOCAL" NEXT_PUBLIC_API_URL "http://localhost:${API_PORT}"

PID_FILE="$STATE_DIR/dev.pid"
LOG_FILE="$STATE_DIR/dev.log"
META_FILE="$STATE_DIR/meta.json"

already_running=0
if [[ -f "$PID_FILE" ]]; then
  existing_pid="$(cat "$PID_FILE")"
  if [[ -n "$existing_pid" ]] && kill -0 "$existing_pid" 2>/dev/null; then
    already_running=1
  else
    rm -f "$PID_FILE"
  fi
fi

if (( already_running )); then
  echo "→ dev already running (pid $existing_pid), skipping start"
  DEV_PID="$existing_pid"
else
  echo "→ starting api + web dev (detached; libs pre-built — rerun build on lib changes)"
  # Spawn the two apps directly (bypassing `turbo run dev`) so we control the
  # web port without depending on apps/web/package.json's --port flag, which
  # not every branch has been updated to make configurable.
  cd "$WORKTREE_ROOT"
  : >"$LOG_FILE"
  nohup bash -c "
    set -e
    cd '$WORKTREE_ROOT/apps/api'
    node --env-file-if-exists=../../.env.local --import tsx --watch src/main.ts \
      2>&1 | awk '{print \"[api] \"\$0; fflush()}' &
    cd '$WORKTREE_ROOT/apps/web'
    PORT='$WEB_PORT' pnpm exec next dev --port '$WEB_PORT' \
      2>&1 | awk '{print \"[web] \"\$0; fflush()}' &
    wait
  " >"$LOG_FILE" 2>&1 </dev/null &
  DEV_PID=$!
  disown "$DEV_PID" 2>/dev/null || true
  echo "$DEV_PID" >"$PID_FILE"
  cd - >/dev/null
fi

started_at="$(date -u +%FT%TZ)"
cat >"$META_FILE" <<JSON
{
  "branch": "$BRANCH",
  "slug": "$SLUG",
  "db": "$DB_NAME",
  "api_port": $API_PORT,
  "web_port": $WEB_PORT,
  "pid": $DEV_PID,
  "log": "$LOG_FILE",
  "started_at": "$started_at",
  "worktree_root": "$WORKTREE_ROOT"
}
JSON

rel_log="${LOG_FILE#$WORKTREE_ROOT/}"

# Wait until both ports respond (or give up after WT_READY_TIMEOUT seconds).
WT_READY_TIMEOUT="${WT_READY_TIMEOUT:-120}"
echo "→ waiting for api + web to come up (up to ${WT_READY_TIMEOUT}s — first boot can be slow)"
api_ready=0; web_ready=0; dev_died=0
deadline=$(( $(date +%s) + WT_READY_TIMEOUT ))
while (( $(date +%s) < deadline )); do
  if ! kill -0 "$DEV_PID" 2>/dev/null; then
    dev_died=1
    echo "  ✗ dev process exited prematurely — tail $rel_log for details" >&2
    break
  fi
  if (( ! api_ready )) && curl -sf -m 1 "http://localhost:$API_PORT/health" >/dev/null 2>&1; then
    api_ready=1
    echo "  ✓ api ready ($API_PORT)"
  fi
  if (( ! web_ready )) && curl -sI -m 1 "http://localhost:$WEB_PORT/" >/dev/null 2>&1; then
    web_ready=1
    echo "  ✓ web ready ($WEB_PORT)"
  fi
  (( api_ready && web_ready )) && break
  sleep 1
done
if (( ! dev_died )); then
  (( api_ready )) || echo "  ⚠ api still not responding ($API_PORT) — check $rel_log" >&2
  (( web_ready )) || echo "  ⚠ web still not responding ($WEB_PORT) — check $rel_log" >&2
fi

cat <<SUMMARY

✓ branch:    $BRANCH
✓ db:        $DB_NAME
✓ env:       .env.local + apps/web/.env.local
▶ pnpm dev   pid $DEV_PID, logs → $rel_log

  API:  http://localhost:$API_PORT
  Web:  http://localhost:$WEB_PORT

SUMMARY
