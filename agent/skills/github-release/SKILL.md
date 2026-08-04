---
name: github-release
description: Cut a GitHub release with gh release create, including tag scheme detection, release-note generation, and approval gates on content and release type. Use when asked to publish, tag, or cut a release.
---

# GitHub Release

Two approval gates: content review, then release type. Do not create the release until both are cleared.

1. **Collect content** - check the existing scheme with `git tag --sort=-v:refname | head -5` (semver, calver, etc.), then generate notes via `gh release create --notes "" --dry-run` or build them from `git log --oneline <prev_tag>..HEAD`.
2. **Display and confirm** - show the full tag, title, and notes, and ask for explicit approval.
3. **Choose type** - ask whether this is `--draft`, `--prerelease`, or latest (no flag).
4. **Create** - only after approval:

```bash
gh release create <tag> --title "<title>" --notes "<release notes>" [--draft | --prerelease]
```
