---
name: conventional-commits
description: Write Conventional Commit messages and squash-merge subjects/bodies. Use whenever creating a git commit, amending a message, or squash-merging a PR with gh pr merge.
---

# Conventional Commits

Format: `<type>[scope]: <description>` in imperative mood.

- **Types**: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`
- **Scope**: lowercase module or directory name; omit if app-wide
- **Header**: max 50 chars, no period, focus on why not how
- **Body**: wrap at 72 chars, explain motivation; omit if the header suffices
- **Breaking**: append `!` after the type and add a `BREAKING CHANGE:` footer
- **Atomic**: one logical change per commit; squash fixups with `git rebase -i` before opening a PR

Every commit must build and pass tests.

## Squash merges

A squash merge needs an explicit conventional-commit subject and a body of up to 5 bullets summarizing the change. Never accept the default `Merge branch '...' into 'main'`, and never rely on the PR title or description — pass both flags.

Where `main` is protected, a post-merge amend cannot be force-pushed, so get `--subject` and `--body` right the first time.

```bash
gh pr merge 45 --repo sudocarlos/tailrelay --squash --delete-branch \
  --subject "chore: update Tailscale to v1.98.8 and Node to 24.18.0" \
  --body "$(cat <<'EOF'
- bump TAILSCALE_VERSION to v1.98.8 in Dockerfile
- bump NODE_VERSION to 24.18.0 in Dockerfile and CI workflows
- add CHANGELOG entry under [Unreleased]

closes #44

see pull request #45
EOF
)"
```
