# Release Notes Template

Release notes are organized into three sections, each a bullet list. Items are
written for users, not maintainers. Keep the tone neutral and non-sensational.

## Sections

### What's New
The most important changes in this release.

- **Bold lead-in** followed by a brief description.
- Bold lead-ins are 1-4 words naming the feature or area ("Connection handling",
  "XYZ selection").
- Each item is 1-2 sentences, preferring brevity.
- Always describe the impact on the user experience - what changed for the
  person using the product ("more reliable connections", "streamlined XYZ
  selection").
- Omit items that have no meaningful user-facing impact; move them to **More**.

### Fixed
Smaller bug fixes that may not directly affect the user experience.

- **Bold lead-in** followed by a brief description.
- Bug fixes, error corrections, and regressions that are worth surfacing without
  elevating to "What's New".
- Keep items to 1-2 sentences.

### More
Changes that don't belong in the other sections.

- **Bold lead-in** followed by a brief description.
- CI, build, tooling, dependency, documentation, and other development
  improvements.
- Internal refactors with no user-facing impact.

## Formatting rules

- Every item leads with a bold lead-in of 1-4 words naming the feature or area.
- If a description follows, separate it from the lead-in with a dash
  (" **lead-in** - description").
- If the bold lead-in is the entire item (a complete thought with no
  description), add no separator.
- Prefer brevity over verbosity; 1-2 sentences per item.
- One blank line between sections.
- If a section has no items, omit the section entirely rather than leaving it
  empty.
- Match the existing tag scheme (semver/calver) for the version title; notes
  content does not include the version number.

## Example

### What's New

- **Connection handling** - retries are now more reliable under poor network
  conditions.
- **XYZ selection** - the picker is streamlined to fewer steps.
- **Version bump to 2.1**

### Fixed

- **Null date parsing** - rare timestamps no longer crash the importer.

### More

- **CI cache** - build dependencies are cached between runs.
- **Dependency update**