# Station S4 WP1 Visual Workbench Construction Evidence 01

Date: 2026-10-10
Status: IMPLEMENTED / BROWSER PROVEN ON IMPLEMENTATION HEAD / FINAL-HEAD GATES PENDING
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

## Observed implementation-head execution and evidence correction
Implementation head `bf25208ff10b751e12a6e6377903ba6be1db90ce`, PR #1031. Dedicated browser run 38050281745 built Station and passed 4/4 real Chromium tests, including keyboard-only focus preservation. Exact-head 38050281728, heavy 38050281664, handoff 38050281717, workflow lint 38050281682, existing frontend interaction/browser 38050281729 and Ubuntu/Windows build 38050281720 passed. These results are historical head evidence, not proof for this correction commit. Merge-candidate was still pending when this report was prepared.

Artifact lookup found no uploaded evidence despite passing browser tests: relative Playwright output directories resolved outside workflow upload paths. Corrected test/report output to absolute repository-root paths and made missing upload files an error. Final-head browser run must both pass and expose the report/screenshot artifact before integration. Do not claim a reviewed screenshot or durable artifact until actually retrieved.

React review applied: lazy initialization, pure reducer, derived session projections/dirty state, stable ref map, native labels and controls, no effects for derived state, no extra canonical store. Screen-reader audit, general WCAG certification, Firefox/WebKit and full package closure remain UNPROVEN.
