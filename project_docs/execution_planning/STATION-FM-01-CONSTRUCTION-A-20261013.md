# FM-01 — Construction A: characterization of existing File Manager

Date: 2026-10-13
Status: CANDIDATE — acceptance requires exact-head browser/CI evidence
Predecessor: FM-01 Planning PR #1201 merged `b6fa587e`

## Characterization implemented

Extended the existing WP11 browser suite `tests/browser/station-editor-workbench.spec.ts` rather than adding a second harness. It launches the actual File Manager via Station, creates and enters a folder, switches grid/list, toggles Inspector, navigates back to root and compares the serialized local workspace before/after UI-only operations. It also verifies the Up control's enabled/disabled boundaries and accessible pressed status.

This test deliberately relies on the existing real workspace APIs and proves no new data authority. It does not treat the File Manager's proprietary folder tree as compliant with full WAI-ARIA tree semantics. That question belongs to Construction B and FM-02.

## Existing regression coverage retained

- Product workspace tests cover capacity limits, valid import codec, malformed inputs, conflicting storage and copy boundaries.
- WP11 browser tests already cover nested folders, editor round-trip, Inspector, revision storage, invalid imports and storage failures.
- FM-01 Construction A adds a focused UI-only invariance regression, not a replacement for these suites.

## Review and exit conditions

1. Browser checks must run on exact PR HEAD.
2. The test must pass on desktop without modifying persistence/production files.
3. Correct failures rather than weakening expected behavior.
4. No claim of FM-01 closure or File Manager-ready until Construction B's shared navigation prototype, Test Review and Documentation & Enclosure.

All original File Manager artifacts remain on `station:artifact-workspace:v1`. No rename/delete/move or remote filesystem implementation has been introduced.
