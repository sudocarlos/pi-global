---
name: plan-workflow
description: End-to-end workflow for non-trivial feature or fix work - plan and get approval, open a GitHub issue and draft PR, set up a git worktree, implement, review, and merge. Use when starting a new feature, bug fix, or refactor that will produce a pull request.
---

# Plan Workflow

pi has no built-in agent modes or sub-agents. These are phases in one session, not agents to switch between. Explore with `read`/`bash`/`grep`/`find`, write the plan, present it, and get **explicit approval before editing code**.

If the project supplies its own helper extension, skill, or prompt template (check the startup banner, `/hotkeys`, and `.pi/` or `~/.pi/agent/` for `extensions/`, `skills/`, `prompts/`), prefer it over the manual steps below.

## Step 1. Issue + draft PR

Reuse an existing issue/PR if one matches, otherwise create them.

```bash
gh issue list --search "..."
gh issue create --title "<plan title>" --body "<what & why only>"
gh pr list --head "$(git branch --show-current)"
gh pr create --draft --base main --title "..." --body "<full plan>"
# update existing: gh issue update <ID> / gh pr edit <ID>
```

Issue body = what and why only, no steps or acceptance criteria. PR body = the full plan, linked to the issue.

## Step 2. Worktree

```bash
git worktree list                            # reuse if one exists
git worktree add -b <branch> ../<dir> main   # new branch
git worktree add ../<dir> <existing-branch>  # existing branch
```

Continuing an existing PR? Get the branch first with `gh pr view <ID> --json headRefName`.

## Step 3. Implementation

Keep the approved plan, the absolute worktree path, and the branch name in scope. `cd` into the worktree (or use absolute paths) so edits land in the right checkout, and re-read the plan from the PR body before the first edit.

Study neighboring code before writing any: new code must read like existing code. Fix failing tests before moving on. Commit after each logical unit of work; push when the step is complete.

For independent parallel subtasks, spawn separate `pi` instances in other tmux panes.

## Step 4. Review

After the push succeeds, follow `skills/code-review` to review the full diff and post findings to the PR. Address blockers and warnings as new commits on the same branch, then re-review the updated diff.

Report the implementation summary and review outcome to the user only after the push succeeds.

## Step 5. Merge

Requires explicit user approval. Follow `skills/conventional-commits` for the squash subject and body.
