---
name: spec-docs
description: Write and maintain per-feature spec docs that explain what a feature does and why, plus tests under ./tests that encode input/output expectations and verify continued functioning. Use when implementing or modifying a non-trivial feature so humans and agents can understand behavior without reading the implementation code.
---

# Spec Docs

Spec docs explain **what a feature does and why it behaves that way**, so a reader - human or agent - can understand it without reverse-engineering the implementation. Tests in `./tests` **encode expectations** (inputs - outputs) and **verify** the feature and project keep working. The two reinforce each other: the spec captures intent, the tests capture behavior.

Always pair with `skills/plan-workflow` (spec writing is an implementation step, not a separate pass) and `skills/contributing-doc` (which governs repo-wide conventions, not per-feature behavior).

## When to invoke

- Implementing or modifying a non-trivial feature - write or update the spec as part of the same work.
- Reviewing a diff that changes behavior - check spec - code - test consistency (see `skills/code-review`).

## When NOT to invoke

- Trivial changes: cosmetic edits, renames, formatting, dependency bumps with no behavior change.
- One-off scripts or throwaway code where maintaining a spec costs more than it saves.

## Where docs live

- Default: one spec per feature in `docs/specs/`, with an index at `docs/specs/README.md` listing each spec with a one-line summary and a link.
- If the repo already co-locates docs beside code, follow that convention instead.
- One spec per **feature**, not per file - files are implementation detail.
- Keep the index short: one line per feature, current status. It is the deterministic entry point for a new reader.

## Spec structure

Follow `spec-template.md` (in this skill directory). The core sections:

- **Overview** - what the feature does, in plain language, for someone who won't read the code.
- **Key behaviors** - the important guarantees; what it does, what it deliberately does *not* do, and why. Decisions and rationale here, lightweight (one or two lines).
- **External contracts** - any API / CLI / config / UI the feature exposes, described at the contract level, not re-listing every parameter.
- **Diagrams** - data flow or state transitions where they earn their place. ASCII or Mermaid so they render and diff cleanly. Skip if prose is clearer.
- **See also** - links to the tests that verify these behaviors so the reader can cross-check expectations.

## What a spec deliberately does NOT contain

- No "current state / next steps" - that's the issue tracker's job.
- No redoing what the code already shows verbatim (type signatures, full function listings).
- No rote restating of conventions already in `CONTRIBUTING.md` - reference them.

A spec documents **intent and contracts**, not implementation mechanics.

## State

A single line at the top: `Status: draft | active | deprecated` so a reader knows whether to trust the spec. Date optional. No elaborate versioning.

## Tests (`./tests`)

- Default location: `./tests` at the repo root, mirroring the module layout of the source. If the project already has a test convention (e.g. `tests/` + pytest, Rust `#[test]`), follow it rather than relocating.
- Tests do two things, and both matter:
  1. **Expectations** - name tests after the behavior or contract they verify (`renders error when input is empty`, not `test1`) so the file reads like a spec on its own. Design cases to make the I/O obvious at a glance.
  2. **Verification** - running them confirms the system still meets the expectation.
- Cover the layers the project needs: unit (pure logic), integration (components together), end-to-end (user-facing flows, lighter). Match existing conventions before inventing structure.
- Every key behavior the spec claims should be testable, and ideally tested. If a contract isn't worth a test, question whether it belongs in the spec.

## Spec - test alignment

- When behavior changes, update spec and tests in the same PR.
- When spec and tests disagree, **tests are the source of truth for what happens**; **the spec is the source of truth for what should happen and why**. Reconcile deliberately - decide which is right, then update the other. Don't edit one to match the other blindly.

## Preventing drift

- Living document, same philosophy as `contributing-doc`: describe what the feature actually does now; mark aspirational changes as "intended" separately so they're never mistaken for current behavior.
- Update the spec in the same commit/PR as the feature change. Spec-only change - `docs:` conventional commit (see `skills/conventional-commits`). Code change that alters behavior - spec update rides along in the same atomic commit.
- Prefer several small focused specs over one giant doc. A stale section is worse than a missing one - if a feature is removed, deprecate or delete its spec rather than leaving it to rot.

## Review dimension

`skills/code-review` already checks `.md` accuracy. This skill defines what should exist, so review can check **spec - code - test consistency** as a real pillar: does the code do what the spec says, do the tests verify what the spec claims, and do the tests' names make the expectations legible?