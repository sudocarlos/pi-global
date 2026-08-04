---
name: code-review
description: Review a branch diff or pull request for correctness, edge cases, and consistency with surrounding code, then post categorized findings to the PR. Use when reviewing your own PR before merge (plan-workflow Step 4) or when asked to review someone else's PR or branch.
---

# Code Review

Review the full diff for **correctness**, **edge cases**, and **consistency** with surrounding code and project patterns. Ignore pedantic formatting, missing docstrings (unless project rules require them), and anything a linter or typechecker already flags.

## Step 1. Gather context and scope

```bash
git diff main --name-only HEAD          # every touched file: code, tests, configs, docs
gh pr diff <ID>                         # or review via the PR itself
```

Review every touched file: tests for real assertions, config/YAML for syntax and safety, `.md` files for doc accuracy. For source files, read the **full file**, not just the diff — local conventions, available imports, and existing helpers only show up in context. Check for `AGENTS.md` or `CONTRIBUTING.md` in the touched directories and hold the diff to those rules.

## Step 2. Review against the three pillars

1. **Correctness & edge cases** — logical bugs, off-by-one errors, null/undefined handling, unhandled promise/async states, missing boundary checks, improper resource cleanup, unhandled errors, breaking changes to signatures or API contracts used elsewhere.
2. **Consistency & idioms** — blends with surrounding style; does not reinvent an existing helper, constant, or utility; error messages, log levels, and type definitions match adjacent code.
3. **Test coverage & safety** — new edge cases and changed paths are covered by tests; no race conditions or side effects on shared state.

## Step 3. Post findings

Tag each finding `[Bug]`, `[Consistency]`, or `[Edge Case]`, give a `file:line` reference, and group into **blockers**, **warnings**, and **suggestions**. Check existing feedback first and skip anything already raised:

```bash
gh pr view <ID> --json reviews,comments
gh pr review --comment --body-file -    # consolidated review, read from stdin
```

For a second opinion, run a dedicated `pi` session on the PR URL in another tmux pane.

## Step 4. Output summary

Report in chat before finishing:

- Files reviewed, and any deliberately skipped with the reason
- Findings by severity — blockers and warnings first, with `file:line` references
- An explicit "looks good to merge" when the diff is clean, otherwise the fixes needed before merge
