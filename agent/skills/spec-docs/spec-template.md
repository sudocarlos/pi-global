# Spec Template

Copy this structure when creating a new feature spec. Keep it focused: the
goal is to let a reader understand what the feature does and why, without
reading the implementation. Omit any section that does not apply to the
feature rather than leaving it empty.

## Frontmatter

```
Status: draft | active | deprecated
```

A single line at the top so a reader knows whether to trust the spec. Date
optional. No elaborate versioning.

## Sections

### Overview
What the feature does, in plain language, for someone who won't read the
code. One or two paragraphs. No implementation detail.

### Key behaviors
The important guarantees - what it does, what it deliberately does *not*
do, and why. Each behavior is a bullet or short subsection:

- A clear statement of the behavior.
- The rationale for the decision (one or two lines, ADR-style but
  lightweight - no separate archive).
- Edge cases and boundaries worth knowing.

### External contracts
Any API / CLI / config / UI the feature exposes, described at the contract
level. Describe the shape and the guarantees, not every parameter.

### Diagrams
Data flow or state transitions where they earn their place. ASCII or Mermaid
so they render and diff cleanly. Skip if prose is clearer.

### See also
Links to the tests that verify these behaviors, with a short note on what
each covers. Behavior truth lives in tests; intent lives here.

## Rules

- One spec per **feature**, not per file.
- Document intent and contracts, not implementation mechanics.
- Describe what the feature does now; mark aspirational changes as
  "intended" separately so they're never mistaken for current behavior.
- Reference conventions already in `CONTRIBUTING.md` - don't restate them.
- Update the spec in the same commit/PR as the behavior change.
- Prefer several small focused specs over one giant doc.
- If a feature is removed, deprecate or delete its spec rather than leaving
  it to rot.

## Example

```
Status: active

# Connection retry

## Overview

Failed network requests are retried with exponential backoff before surfacing
an error to the user. This applies to all outbound API calls in the client.

## Key behaviors

- Retries up to 4 times, doubling the wait between each attempt starting at
  500ms. Chosen to balance recoverability against perceived latency.
- Does not retry on 4xx responses - these are client errors, not transient
  failures, and retrying would waste the user's time.
- Jitter is added to each wait to avoid thundering herd retries when many
  clients hit a recovered endpoint simultaneously.

## External contracts

- `request(url, options)` accepts an optional `retries` override (default 4)
  and `retryOn` predicate (default: 5xx and network errors).
- On exhaustion, rejects with the last error; the `attempts` field reports how
  many tries were made.

## Diagrams

    attempt 1 --fail--> wait 500ms +/- jitter
        |
        v
    attempt 2 --fail--> wait 1000ms +/- jitter
        |
        v
    attempt 3 --fail--> wait 2000ms +/- jitter
        |
        v
    attempt 4 --fail--> reject with last error + { attempts: 4 }

## See also

- `./tests/retry.test.ts` - backoff timing, jitter bounds, 4xx non-retry,
  exhaustion reporting.
```