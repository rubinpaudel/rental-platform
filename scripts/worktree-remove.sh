#!/usr/bin/env bash
# make worktree-remove — fully delete a worktree: stop dev, drop DB, `git
# worktree remove`. Keeps the branch (the user can `git branch -D` if needed).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./worktree-lib.sh
source "$SCRIPT_DIR/worktree-lib.sh"

MAIN_REPO="$(git rev-parse --path-format=absolute --git-common-dir)"
MAIN_REPO="${MAIN_REPO%/.git}"

# Target may be passed as $1 (used by the dashboard) or picked interactively.
TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  WT_PATHS=()
  while IFS= read -r line; do
    [[ -n "$line" ]] && WT_PATHS+=("$line")
  done < <(
    git -C "$MAIN_REPO" worktree list --porcelain \
      | awk '/^worktree / {print substr($0, 10)}' \
      | grep -vxF "$MAIN_REPO" || true
  )
  if (( ${#WT_PATHS[@]} == 0 )); then
    wt_die "no worktrees to remove (only the main repo is registered)"
  fi

  echo "→ pick a worktree to remove (will also drop DB):"
  for i in "${!WT_PATHS[@]}"; do
    wt_branch="$(git -C "${WT_PATHS[$i]}" branch --show-current 2>/dev/null || echo '(detached)')"
    printf "  %d) %s   %s\n" "$((i+1))" "$wt_branch" "${WT_PATHS[$i]}"
  done
  read -rp "  number [1-${#WT_PATHS[@]}]: " choice
  [[ "$choice" =~ ^[0-9]+$ ]] || wt_die "not a number: $choice"
  (( choice >= 1 && choice <= ${#WT_PATHS[@]} )) || wt_die "out of range: $choice"
  TARGET="${WT_PATHS[$((choice-1))]}"
fi

# Sanity checks.
[[ -d "$TARGET" ]] || wt_die "not a directory: $TARGET"
TARGET_ABS="$(cd "$TARGET" && pwd)"
[[ "$TARGET_ABS" != "$MAIN_REPO" ]] || wt_die "refusing to remove the main repo"

# Verify it's actually a registered worktree.
if ! git -C "$MAIN_REPO" worktree list --porcelain \
     | awk '/^worktree / {print substr($0, 10)}' \
     | grep -qxF "$TARGET_ABS"; then
  wt_die "not a registered git worktree: $TARGET_ABS"
fi

echo "→ tearing down dev + DB for $TARGET_ABS"
( cd "$TARGET_ABS" && bash "$SCRIPT_DIR/worktree-down.sh" ) || \
  echo "  • teardown reported issues, continuing with removal"

echo "→ git worktree remove --force $TARGET_ABS"
git -C "$MAIN_REPO" worktree remove --force "$TARGET_ABS"

cat <<SUMMARY

✓ removed worktree at $TARGET_ABS
  • branch kept (use \`git branch -D <branch>\` to also delete it)

SUMMARY
