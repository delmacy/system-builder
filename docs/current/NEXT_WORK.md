# Next Work — G2-WP-10 / Construction A / TASK-549

Generation 2 remains rolling-wave and dependency-safe.

## Closed predecessor
G2-WP-01..G2-WP-09 are canonically closed. G2-WP-10 was selected from the typed DAG. TASK-547 and TASK-548 are integrated on fresh main with their exact-head plus merge-candidate gates complete.

## Current mandatory gate
Execute only `TASK-549-G2-GENERATED-EXPERIENCE-STATE-LINEAGE` from the materialized Construction A chain `TASK-547 -> TASK-548 -> TASK-549 -> TASK-550`.

TASK-550 remains blocked until TASK-549 integrates. Do not pre-materialize G2-WBS-16; a fresh-main Sprint Review after Construction A decides whether AI-mediated assistance becomes the next bounded slice.

## CI evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
Do not absorb AI/model providers, prompt orchestration, autonomous agent authority, apps-wide UI redesign, persistence/DB, runtime-core, WP-11+, Production Readiness or DEFER/DO_NOT_BUILD findings.
