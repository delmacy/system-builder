# Station S4 WP4 — Construction B 01
Date: 2026-10-10
Sprint ID: STATION-S4-WP4-CONSTRUCTION-B-01
State: COMMITTED after integrated A #1051 and fresh-main revalidation
Branch: sprint/station-s4-wp4-construction-b
Intended base: main@d1e42e3fb2a31da72a81fcb6c37870ae59cac74d
Committed TASK set: TASK-659 only; depends on TASK-658
Authority: Addendum 005; WP4 Plan 01

## Goal and growing proof
Integrate the proven pure history into the actual route/window workbench. One history wrapper owns current session, controls/shortcuts derive availability; native text undo untouched. Preserve fields/selection on blocked history; reset only successful explicit checkpoints/replacements. Browser grows from 21 to 29 journeys, including real 51-edit boundary and download/storage/cancel/native-text/window lifecycle.

## TASK boundary and validation
Confirm TASK-659 exact six allowed paths, forbidden paths, max_files and context. npm run verify, npm run station:build and real Chromium suite required; exact-head/current-base Actions, heavy/handoff/platform builds/browser must pass before integration. One materialization commit plus one authoritative TASK commit and one Sprint PR. No dependencies/schema/ADR/source topology/history-engine/workflows changes.

## Stop and successor
Stop for collisions, forbidden paths, conflicting authority, contract/schema drift or missing capability requiring relaxation. After B validated merge revalidate fresh main; optional C only for observed unmet goal. Package Review/Closure remain forecast until separately materialized.
