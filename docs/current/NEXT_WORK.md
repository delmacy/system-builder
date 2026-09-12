# Next Work — G2-WP-08 Construction A / TASK-530

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority is `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-08 owns `G2-WBS-07`; prerequisites from WP-06/WP-07 are canonically closed.

## Materialized dependency chain
`TASK-527 -> TASK-528 -> TASK-529 -> TASK-530`.

TASK-527, TASK-528 and TASK-529 are integrated. TASK-529 landed on fresh main `b011df68303c755f473492e1221387103ffa69cc` after exact-head Deterministic CI, Heavy Product Tests and Automation Handoff passed. TASK-530 is READY.

## Current mandatory gate
Integrate this repository-memory reconciliation after exact-head gates pass. Then rebuild fresh main and execute only **TASK-530 — integrated Product Proof across TASK-527..529 without new semantic ownership**.

## Preserved exclusions
Do not pre-materialize Construction B/C or absorb concrete brokers/providers, DB/runtime/deployment realization, Production Readiness, WP-09+ ownership or DEFER/DO_NOT_BUILD findings.
