# Hard rules

- Get explicit user approval on a plan before editing code
- Never run `gh pr merge` without explicit user approval
- Never force-push or amend on `main`
- Every commit must build and pass tests

# Conventions

- If `CONTRIBUTING.md` exists, it is the source of truth for this project and overrides everything below
- Match the surrounding code: idiomatic naming, layout, and line length for the language and its linter
- Prefer descriptive names over comments - if a comment explains what code does, rename it first
- Keep nesting shallow: early returns and guard clauses over nested conditionals
- Extract shared logic once repetition is real, not anticipated

# Commits

Commit and squash-merge message rules live in `skills/conventional-commits` - load it before writing any commit message.

# Workflows

Load the matching skill when the task starts; do not wait to be asked.

- Feature or fix work that ends in a PR - `skills/plan-workflow` (plan, issue, worktree, implement, review, merge)
- Any commit, amend, or squash merge - `skills/conventional-commits`
- Reviewing a PR or branch diff - `skills/code-review`
- Writing or updating a repo's `CONTRIBUTING.md` - `skills/contributing-doc`
- Publishing, tagging, or cutting a release - `skills/github-release`
