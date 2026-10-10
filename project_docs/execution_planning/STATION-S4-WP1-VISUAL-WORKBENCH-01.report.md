# Station S4 WP1 Visual Workbench Construction Evidence 01

Date: 2026-10-10
Status: IMPLEMENTED ON CONSTRUCTION BRANCH / VALIDATION PENDING
Planning predecessor: PR #1030, `fd3387aed18da4c2205c6f33f002f67f57ba0e53`
TASK: TASK-643

## Implementation

The component-editor route connects StationEditorWorkbench to public WP1-A–G session APIs. One reducer owns the canonical EditorSession; hierarchy, Inspector, visual grid Preview and dirty state are derived. Form strings are unapplied control values only. Focus and expansion are separate presentation state; keyboard arrows move focus while Enter/Space select. The earlier component-contract laboratory remains unchanged.

Explicit save accepts a Station-local draft; discard restores the last accepted baseline. Labels, focus rings, validation feedback and live announcements are present. No Core, persistence, new package APIs or arbitrary pixel editing.

## Declared proof

Four Playwright Chromium journeys cover actual production route edit/save/edit/discard with revision and rendered-width assertions; malformed/incompatible rejection and recovery; keyboard-only editing/save/discard with focus preserved; read-only root, orthogonal focus/selection/expansion and narrow layout. A dedicated exact-head browser workflow builds Station, runs those journeys and preserves HTML reports/traces/screenshots.

Playwright 1.64.0 dev packages are pinned with npm registry integrity metadata. Existing locked dependencies are preserved. Browser infrastructure is isolated from the deterministic product classifier.

## Evidence state

IMPLEMENTED: branch code and executable browser assertions. PROVEN: NOT YET; no executed browser or Station build result claimed before Actions complete. INTEGRATED: NO. General accessibility certification, screen-reader testing, Firefox/WebKit and package closure remain UNPROVEN.

## Gate and handoff

Require repository exact-head verify, current merge-candidate verify, heavy, handoff and station-editor-browser Action on final head. Record final run IDs and head/base after completion; any new commit invalidates earlier exact-head evidence. One authoritative TASK integration through PR squash only after all gates. WP1-H is not materialized in this construction change.
