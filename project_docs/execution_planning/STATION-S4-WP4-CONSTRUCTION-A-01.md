# Station S4 WP4 — Construction A 01
Date: 2026-10-10
Sprint ID: STATION-S4-WP4-CONSTRUCTION-A-01
State: COMMITTED effective only after validated Planning integration
Branch: sprint/station-s4-wp4-construction-a
Intended base: fresh main after Planning PR integration
Committed TASK set: TASK-658 only, depends on TASK-657
Authority: Addendum 005 and WP4 Plan 01

## Goal and integrated exit proof
Implement pure 50-entry undo/redo for validated span edits. Use real source catalog/editor/projections; source topology and accepted baseline retained; revisions monotonic, stale/overflow invalid transitions fail closed. Cover limits, branching/no-op/empty history, immutable results and codec isolation. No UI yet.

## Boundary and validation
Confirm TASK-658 exact six allowed paths, forbidden paths, max_files/dependency/context before writing. Final npm run verify, Station build and all 21 predecessor browser journeys; exact-head/current-base CI, heavy/handoff/build/browser proof required. One authoritative TASK commit and one branch/PR. Stop for collisions, conflicting scope, forbidden paths or L3/L4/dependency changes.

## Successor
B stays forecast until A is integrated and fresh-main UI/checkpoint readiness is materialized. Optional C, Package Review and Closure are not construction authority.
