#!/usr/bin/env bash
# Shared helpers for worktree-up.sh and worktree-down.sh.
# Sourced, not executed: do not `set -e` here — the caller controls error mode.

WT_PG_CONTAINER="${WT_PG_CONTAINER:-rental-postgres}"
WT_PG_USER="${WT_PG_USER:-rental}"
WT_PG_PASSWORD="${WT_PG_PASSWORD:-rental}"
WT_PG_TEMPLATE_DB="${WT_PG_TEMPLATE_DB:-rental}"
WT_PG_HOST_PORT="${WT_PG_HOST_PORT:-5433}"

wt_die() {
  printf 'worktree: %s\n' "$*" >&2
  exit 1
}

wt_resolve_branch_and_slug() {
  WORKTREE_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" \
    || wt_die "not in a git working tree"

  local main_repo
  main_repo="$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null)"
  main_repo="${main_repo%/.git}"
  if [[ "$WORKTREE_ROOT" == "$main_repo" ]]; then
    wt_die "refusing to run from the main repo — switch into a worktree under .claude/worktrees/"
  fi

  BRANCH="$(git -C "$WORKTREE_ROOT" branch --show-current)"
  [[ -n "$BRANCH" ]] || wt_die "could not resolve current branch (detached HEAD?)"

  # Slug: lowercase, replace /+ with _, drop anything else weird.
  SLUG="$(printf '%s' "$BRANCH" \
    | tr '[:upper:]' '[:lower:]' \
    | tr '/+' '__' \
    | tr -c 'a-z0-9_-' '_' \
    | sed 's/_\{2,\}/_/g; s/^_//; s/_$//')"
  [[ -n "$SLUG" ]] || wt_die "branch '$BRANCH' produced empty slug"

  DB_NAME="rental_${SLUG}"
  # Postgres identifier limit is 63 bytes; truncate if needed.
  DB_NAME="${DB_NAME:0:63}"
}

wt_compute_ports() {
  [[ -n "${BRANCH:-}" ]] || wt_die "wt_compute_ports called before wt_resolve_branch_and_slug"
  # cksum is portable (macOS + GNU). With stdin: "<crc> <bytes>".
  OFFSET="$(printf '%s' "$BRANCH" | cksum | awk '{print ($1 % 99) + 1}')"
  API_PORT=$((4000 + OFFSET))
  WEB_PORT=$((3000 + OFFSET))
}

wt_state_dir() {
  printf '%s/.claude/local' "$WORKTREE_ROOT"
}

# wt_pg: run psql inside the rental-postgres container with auth wired up.
# All args are forwarded to psql.
wt_pg() {
  docker exec -i \
    -e PGPASSWORD="$WT_PG_PASSWORD" \
    "$WT_PG_CONTAINER" \
    psql -U "$WT_PG_USER" "$@"
}

wt_wait_for_postgres() {
  local tries=30
  until docker exec "$WT_PG_CONTAINER" pg_isready -U "$WT_PG_USER" -d "$WT_PG_TEMPLATE_DB" >/dev/null 2>&1; do
    ((tries--)) || wt_die "postgres did not become ready in 30s"
    sleep 1
  done
}

# Idempotent KEY=VALUE upsert in an env file. Replaces an existing assignment
# (anchored at start of line) or appends if absent. Value is written literally
# — caller is responsible for quoting if needed.
wt_set_env() {
  local file="$1" key="$2" value="$3"
  [[ -f "$file" ]] || wt_die "env file does not exist: $file"
  if grep -qE "^${key}=" "$file"; then
    # Use | as sed delimiter so / in URLs doesn't conflict.
    local escaped
    escaped="$(printf '%s' "$value" | sed -e 's/[\\&|]/\\&/g')"
    sed -i '' -e "s|^${key}=.*|${key}=${escaped}|" "$file"
  else
    printf '%s=%s\n' "$key" "$value" >>"$file"
  fi
}
