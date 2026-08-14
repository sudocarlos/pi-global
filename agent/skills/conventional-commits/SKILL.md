---
name: conventional-commits
description: Write Conventional Commit messages and squash-merge subjects/bodies. Use whenever creating a git commit, amending a message, or squash-merging a PR with gh pr merge.
---

# Conventional Commits

Format: `<type>[scope]: <description>` in imperative mood.

- **Types**: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`
- **Scope**: lowercase module or directory name; omit if app-wide
- **Header**: max 50 chars, no period, focus on why not how
- **Body**: one sentence explaining the motivation, then a bulleted summary of the change (one bullet per logical sub-change, up to 5), each wrapped at 72 chars; omit the whole body if the header suffices
- **Breaking**: append `!` after the type and add a `BREAKING CHANGE:` footer
- **Atomic**: one logical change per commit; squash fixups with `git rebase -i` before opening a PR

Every commit must build and pass tests.

## Regular commit body

Single motivation sentence, then a bulleted summary:

```
feat(webui): configurable per-relay icon

Add a user-configurable icon to each relay for visual identification in the
dashboard.

- add IconURL to ServeRelay with ValidateIconURL scheme allow-list + data cap
- plumb icon_url through HTTPS multipart and TCP/funnel JSON handlers (400 on bad)
- add RelayIcon component: <img> with fallback glyph + corner status dot in cards
- modal icon field with preview, favicon auto-suggest on blur, Use/Clear controls
- cover with Go unit/handler tests, pytest round-trip, openapi.yaml + CHANGELOG
```

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
