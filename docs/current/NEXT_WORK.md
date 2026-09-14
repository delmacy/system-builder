# Next Work — G2-WP-10 / Construction A Sprint Review

Generation 2 remains rolling-wave and dependency-safe.

## Closed predecessor
G2-WP-01..G2-WP-09 are canonically closed. G2-WP-10 was selected from the typed DAG. TASK-547, TASK-548, TASK-549 and TASK-550 are integrated on fresh main; Construction A for G2-WBS-15 is complete.

## Current mandatory gate
Execute only the fresh-main **Construction A Sprint Review** for G2-WP-10 / G2-WBS-15. Review the integrated TASK-547..550 slice, its Product Proof, semantic boundaries, residual findings and repository truth.

The Sprint Review decides whether bounded rework is required or whether G2-WBS-16 AI-mediated assistance may be materialized as the next dependency-safe Construction slice. Do not pre-materialize or implement G2-WBS-16 before that review decision.

## CI evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
Do not absorb AI/model providers, prompt orchestration, autonomous agent authority, apps-wide UI redesign, persistence/DB, runtime-core, WP-11+, Production Readiness or DEFER/DO_NOT_BUILD findings.
