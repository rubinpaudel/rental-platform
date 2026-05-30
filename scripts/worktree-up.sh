#!/usr/bin/env bash
# make worktree-up — provision a per-worktree DB clone, write worktree-scoped
# env with deterministic non-clashing ports, and start `pnpm dev` detached.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./worktree-lib.sh
source "$SCRIPT_DIR/worktree-lib.sh"

wt_resolve_branch_and_slug
wt_compute_ports

STATE_DIR="$(wt_state_dir)"
mkdir -p "$STATE_DIR"

ENV_LOCAL="$WORKTREE_ROOT/.env.local"
ENV_EXAMPLE="$WORKTREE_ROOT/.env.example"
WEB_ENV_LOCAL="$WORKTREE_ROOT/apps/web/.env.local"

if [[ ! -d "$WORKTREE_ROOT/node_modules" ]]; then
  echo "→ installing dependencies (no node_modules yet; pnpm install --frozen-lockfile)"
  pnpm -C "$WORKTREE_ROOT" install --frozen-lockfile
fi

# Library packages must have their dist/ on disk before api boots; tsup --watch
# in the dev tree builds in parallel and the api races it on first boot.
if [[ ! -d "$WORKTREE_ROOT/packages/config/dist" ]]; then
  echo "→ first-time build of library packages (so the API can resolve their dist/)"
  pnpm -C "$WORKTREE_ROOT" turbo run build --filter='./packages/*'
fi

echo "→ ensuring shared dev stack is up"
pnpm -C "$WORKTREE_ROOT" stack:up >/dev/null
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
  cd "$WORKTREE_ROOT"
  PORT="$WEB_PORT" API_PORT="$API_PORT" \
    nohup pnpm turbo run dev \
      --filter=@rental-platform/api --filter=@rental-platform/web \
    >"$LOG_FILE" 2>&1 </dev/null &
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

cat <<SUMMARY

✓ branch:    $BRANCH
✓ db:        $DB_NAME
✓ env:       .env.local + apps/web/.env.local
▶ pnpm dev   pid $DEV_PID, logs → $rel_log

  API:  http://localhost:$API_PORT
  Web:  http://localhost:$WEB_PORT

SUMMARY
