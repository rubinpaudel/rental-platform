#!/usr/bin/env bash
# make worktree-down — stop dev servers, drop this worktree's DB, remove state.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./worktree-lib.sh
source "$SCRIPT_DIR/worktree-lib.sh"

# If we're running from the main repo, list non-main worktrees and prompt for
# the one to tear down, then re-exec inside it. Otherwise fall through.
WORKTREE_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" \
  || wt_die "not in a git working tree"
MAIN_REPO="$(git rev-parse --path-format=absolute --git-common-dir)"
MAIN_REPO="${MAIN_REPO%/.git}"

if [[ "$WORKTREE_ROOT" == "$MAIN_REPO" ]]; then
  # Collect worktrees, excluding the main one. (`while read` for bash 3.2.)
  WT_PATHS=()
  while IFS= read -r line; do
    [[ -n "$line" ]] && WT_PATHS+=("$line")
  done < <(
    git -C "$WORKTREE_ROOT" worktree list --porcelain \
      | awk '/^worktree / {print substr($0, 10)}' \
      | grep -vxF "$MAIN_REPO" || true
  )
  if (( ${#WT_PATHS[@]} == 0 )); then
    wt_die "no worktrees to tear down (only the main repo is registered)"
  fi

  echo "→ pick a worktree to tear down:"
  for i in "${!WT_PATHS[@]}"; do
    wt_branch="$(git -C "${WT_PATHS[$i]}" branch --show-current 2>/dev/null || echo '(detached)')"
    printf "  %d) %s   %s\n" "$((i+1))" "$wt_branch" "${WT_PATHS[$i]}"
  done
  read -rp "  number [1-${#WT_PATHS[@]}]: " choice
  [[ "$choice" =~ ^[0-9]+$ ]] || wt_die "not a number: $choice"
  (( choice >= 1 && choice <= ${#WT_PATHS[@]} )) || wt_die "out of range: $choice"
  TARGET="${WT_PATHS[$((choice-1))]}"

  echo "→ re-invoking worktree-down inside $TARGET"
  cd "$TARGET"
  exec bash "$SCRIPT_DIR/worktree-down.sh"
fi

wt_resolve_branch_and_slug

STATE_DIR="$(wt_state_dir)"
PID_FILE="$STATE_DIR/dev.pid"

# Recursively kill a pid and all its descendants. macOS-compatible.
wt_kill_tree() {
  local root_pid="$1" sig="${2:-TERM}"
  local pids=("$root_pid")
  # Collect descendants breadth-first via pgrep -P.
  local frontier=("$root_pid")
  while ((${#frontier[@]})); do
    local next=()
    local p
    for p in "${frontier[@]}"; do
      local children
      children="$(pgrep -P "$p" 2>/dev/null || true)"
      [[ -z "$children" ]] && continue
      while IFS= read -r c; do
        [[ -n "$c" ]] || continue
        pids+=("$c")
        next+=("$c")
      done <<<"$children"
    done
    frontier=("${next[@]:-}")
    # If the only element is the empty placeholder, treat as empty.
    if [[ ${#frontier[@]} -eq 1 && -z "${frontier[0]}" ]]; then
      frontier=()
    fi
  done
  # Kill leaves first by reversing.
  local i
  for ((i=${#pids[@]}-1; i>=0; i--)); do
    kill -"$sig" "${pids[i]}" 2>/dev/null || true
  done
}

if [[ -f "$PID_FILE" ]]; then
  pid="$(cat "$PID_FILE")"
  if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
    echo "→ stopping pnpm dev tree (root pid $pid)"
    wt_kill_tree "$pid" TERM
    # Grace period.
    for _ in 1 2 3 4 5; do
      kill -0 "$pid" 2>/dev/null || break
      sleep 1
    done
    if kill -0 "$pid" 2>/dev/null; then
      echo "  • forcing KILL (graceful TERM didn't take)"
      wt_kill_tree "$pid" KILL
    fi
    echo "  ✓ stopped"
  else
    echo "→ stale pid file ($pid not alive), removing"
  fi
  rm -f "$PID_FILE"
else
  echo "→ no dev.pid recorded, skipping process stop"
fi

# Drop the DB. Postgres ≥13 supports WITH (FORCE) to disconnect sessions.
echo "→ dropping database $DB_NAME"
if wt_pg -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null | grep -q 1; then
  wt_pg -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\" WITH (FORCE);" >/dev/null
  echo "  ✓ dropped"
else
  echo "  • database not present, nothing to drop"
fi

# Remove state dir (logs, meta.json, etc).
if [[ -d "$STATE_DIR" ]]; then
  echo "→ removing state dir $STATE_DIR"
  rm -rf "$STATE_DIR"
fi

cat <<SUMMARY

✓ worktree '$BRANCH' is down.
  • db dropped: $DB_NAME
  • .env.local left in place (gitignored; \`make worktree-up\` will repatch it)

SUMMARY
