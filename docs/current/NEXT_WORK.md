# Next Work — G2-WP-08 Construction A / TASK-527

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority is `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-08 owns `G2-WBS-07`; prerequisites from WP-06/WP-07 are canonically closed.

## Materialized dependency chain
`TASK-527 -> TASK-528 -> TASK-529 -> TASK-530`.

Only TASK-527 is READY after Planning & Materialization integrates. TASK-528..530 remain blocked on their declared predecessors.

## Current mandatory gate
First pass exact-head CI/review and integrate the Planning & Materialization PR. Then rebuild fresh main and execute only **TASK-527 — event/message/subscription identity and occurrence lineage**.

## Preserved exclusions
Do not pre-materialize Construction B/C or absorb concrete brokers/providers, DB/runtime/deployment realization, Production Readiness, WP-09+ ownership or DEFER/DO_NOT_BUILD findings.