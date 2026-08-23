---
name: forgejo-cli
description: Use the forgejo-cli `fj` command to work with Forgejo repositories, issues, pull requests, reviews, CI status, and releases. Use for Forgejo or Codeberg work, especially when another skill gives equivalent GitHub `gh` commands that must be translated to `fj` without weakening its workflow or approval gates.
compatibility: Requires `fj`, `git`, and access to a Forgejo instance.
---

# Forgejo CLI (`fj`)

Use `fj` for Forgejo-specific operations and `git` for branches, commits, worktrees,
fetching, and pushing. Treat `fj` as the Forgejo counterpart to GitHub's `gh`, not
as a replacement for `git`.

When another skill contains `gh` commands, preserve that skill's intent, ordering,
review requirements, and approval gates while translating only the hosting-service
operations to `fj`. In particular:

- Pair feature and fix work with `skills/plan-workflow`.
- Pair reviews with `skills/code-review`.
- Pair commits and squash merges with `skills/conventional-commits`.
- Use `skills/github-release` for release-note structure and its two approval gates,
  but use the `fj release` commands below instead of `gh release`.
- Never merge, publish a release, or perform another destructive operation without
  every approval required by the applicable skill and project instructions.

## Discover the installed interface

`fj` evolves independently of `gh`. Before relying on an unfamiliar flag, inspect
the installed command rather than guessing from a `gh` command:

```bash
fj version                    # `fj --version` is not supported
fj --help
fj pr --help
fj pr create --help
```

Do not invent `gh` flags such as `--json`, `--jq`, `--draft`, `--notes-generate`, or
`--dry-run`; `fj` does not currently provide direct equivalents for them.

## Authentication and target selection

```bash
fj auth login --host codeberg.org
printf '%s\n' "$FJ_TOKEN" | fj auth add-token --host codeberg.org
fj auth list
fj whoami --host codeberg.org
```

Prefer sending a token through stdin rather than placing it in an argument, shell
history, log, issue, or PR body.

Inside a checkout, `fj` normally infers the instance and repository from the sole
Git remote or the current branch's tracking remote. Disambiguate explicitly when
needed:

- `--host HOST` / `-H HOST` selects an instance.
- `--remote NAME` / `-R NAME` selects a local Git remote where supported. Some
  command groups require this option before the subcommand; check `--help`.
- `--repo OWNER/REPO` / `-r OWNER/REPO` selects a repository where supported.
- `HOST/OWNER/REPO` is a fully qualified repository argument.
- `OWNER/REPO#42` identifies an issue or PR outside the inferred repository.
- `--cwd PATH` / `-C PATH` runs as if started in another directory.

Use `git remote -v` and `fj repo view` to confirm the inferred target before a
write, merge, release, or delete operation.

## Common `gh` to `fj` translations

| GitHub intent | Forgejo command |
| --- | --- |
| `gh auth status` | `fj auth list` and `fj whoami` |
| `gh repo view` | `fj repo view` |
| `gh issue list --search QUERY` | `fj issue search "QUERY"` |
| `gh issue create --title T --body B` | `fj issue create "T" --body "B"` |
| `gh issue view 42` | `fj issue view 42` |
| `gh issue comment 42 --body B` | `fj issue comment 42 "B"` |
| `gh issue edit 42 --body B` | `fj issue edit 42 body "B"` |
| `gh pr list` | `fj pr search` |
| `gh pr create --base main --title T --body B` | `fj pr create "T" --base main --body "B"` |
| `gh pr view 42` | `fj pr view 42` |
| `gh pr diff 42` | `fj pr view 42 diff` |
| `gh pr checks 42 --watch` | `fj pr status 42 --wait` |
| `gh pr checkout 42` | `fj pr checkout 42` |
| `gh pr comment 42 --body B` | `fj pr comment 42 "B"` |
| `gh pr merge 42 --squash --delete-branch` | `fj pr merge 42 --method squash --delete` |
| `gh release list` | `fj release list` |
| `gh release view TAG` | `fj release view TAG --by-tag` |
| `gh release create TAG ...` | `fj release create NAME --tag TAG ...` |

Prefer body files or stdin for multiline Markdown when the command supports them:

```bash
fj issue create "Title" --body-file issue.md
fj pr create "Title" --base main --body-file plan.md
fj pr comment 42 --body-file - <<'EOF'
Review summary here.
EOF
```

`fj issue create` may require `--template NAME` when blank issues are disabled. If
templates exist but a blank issue is intentionally allowed, pass `--no-template`.
Never use `--no-template` merely to bypass required project process.

## Feature and fix workflow

Follow `skills/plan-workflow`, replacing its `gh` operations as follows.

### 1. Find or create the issue

```bash
fj issue search "search terms" --state all
fj issue create "<plan title>" --body "<what and why only>"
```

Use `fj issue templates` before creation when the repository uses issue templates.
To update an existing issue, use `fj issue edit <ID> title` or
`fj issue edit <ID> body`; omitting the new value opens the configured editor.

### 2. Branch, worktree, and draft PR

Continue using `git worktree`, `git branch`, `git push`, and the approved branching
strategy from `skills/plan-workflow`. `fj` does not create local branches for normal
PR creation.

Forgejo represents a draft PR by prefixing its title with `WIP: `:

```bash
git push -u origin "$(git branch --show-current)"
fj pr create "WIP: <title>" --base main --body-file plan.md
```

If Forgejo rejects a PR because the branch has no changes, create it immediately
after the first approved, tested, and pushed logical commit. Keep the full approved
plan in the PR body and link the issue with the repository's supported closing
syntax, commonly `Closes #<ID>`.

Find existing PRs with `fj pr search`. `fj` has no `gh pr view --json headRefName`
equivalent; inspect `fj pr view <ID>` and the local remotes, or use
`fj pr checkout <ID>`, rather than scraping decorative output as stable JSON.

Mark a PR ready by removing the `WIP: ` prefix:

```bash
fj pr edit <ID> title "<ready title>"
```

### 3. Review

Gather the complete scope and inspect every touched file as required by
`skills/code-review`:

```bash
git diff main...HEAD --name-only
fj pr view <ID> diff
fj pr view <ID> files
fj pr view <ID> commits --oneline
fj pr view <ID> comments
fj pr review <ID> list --comments --all
```

`fj pr review` currently lists reviews but does not submit a GitHub-style formal
`APPROVE`, `REQUEST_CHANGES`, or `COMMENT` review. Post the required consolidated,
categorized review as a PR comment instead:

```bash
fj pr comment <ID> --body-file - <<'EOF'
## Review

### Blockers
- [Bug] `path/to/file:42` - explanation

### Warnings
- None.
EOF
```

Do not claim that a comment is a formal approval. Report that limitation when the
workflow requires an approval state that `fj` cannot submit.

### 4. Wait for checks

```bash
fj pr status <ID> --wait
```

Inspect the displayed mergeability and every expected status. Do not treat a zero
process exit alone as proof that all checks passed. Fix failures in new commits,
push, and run the status command again.

### 5. Merge

Merging requires explicit user approval. Prepare the title and body with
`skills/conventional-commits`, check status again, and pass both explicitly:

```bash
fj pr merge <ID> --method squash --delete \
  --title "feat(scope): concise description" \
  --message "$(cat <<'EOF'
- summarize the first logical change
- summarize the second logical change

closes #<ISSUE>
EOF
)"
```

Never run `fj pr merge` merely because checks pass. Supported methods are `merge`,
`rebase`, `rebase-merge`, `squash`, and `manual`; use the repository's required
method rather than assuming squash.

## Releases

Use the note-writing guidance and both approval gates from `skills/github-release`.
Unlike `gh release create`, `fj release create` has no generated-notes or dry-run
mode. Build the proposed notes before approval from repository history, for example:

```bash
git tag --sort=-v:refname | head -5
git log --oneline <previous-tag>..HEAD
```

Show the user the exact tag, release name, notes, attachments, and whether it will
be stable, draft, or prerelease. Only after content approval and release-type
selection, run one of:

```bash
# Existing tag, stable release
fj release create "<name>" --tag "<tag>" --body "$(cat release-notes.md)"

# Create the tag and stable release together
fj release create "<name>" --create-tag "<tag>" --branch main \
  --body "$(cat release-notes.md)"

# Add exactly one of these when selected
# --draft
# --prerelease
```

Repeat `--attach FILE` for assets, or use `--attach FILE:ASSET_NAME`. No flag means
a stable release; `fj` has no separate `latest` selection flag. Verify afterward:

```bash
fj release view "<tag>" --by-tag
```

## Important limitations and safety

- `fj` does not offer general `--json`/`--jq` output. Prefer explicit commands and
  human inspection; do not build fragile automation by parsing styled output.
- Draft PRs use `WIP: ` in the title, not `--draft`.
- PR status waiting is not the same as GitHub's `gh pr checks` contract; inspect
  all expected statuses and mergeability.
- Review submission is not available through `fj pr review`; use a PR comment and
  describe it accurately.
- Release note generation and dry runs are not available; stage and show all
  release content before creation.
- Confirm the target host and repository before `fj repo delete`, `fj release
  delete`, `fj release asset delete`, `fj issue close`, or `fj pr close`.
- Keep using `git` for local history. `fj` handles Forgejo API operations alongside
  it; it does not replace `git`.
