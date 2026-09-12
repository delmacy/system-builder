# Next Work — G2-WP-08 Construction A / TASK-528

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority is `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-08 owns `G2-WBS-07`; prerequisites from WP-06/WP-07 are canonically closed.

## Materialized dependency chain
`TASK-527 -> TASK-528 -> TASK-529 -> TASK-530`.

TASK-527 is integrated on fresh main `3daa15b7010a92655a1bcdcb9e606180e17b9eff`. TASK-528 is READY. TASK-529..530 remain blocked on their declared predecessors.

## Current mandatory gate
Integrate this repository-memory reconciliation after exact-head gates pass. Then rebuild fresh main and execute only **TASK-528 — delivery attempt/provider acknowledgement versus business-effect reconciliation**.

## Preserved exclusions
Do not pre-materialize Construction B/C or absorb concrete brokers/providers, DB/runtime/deployment realization, Production Readiness, WP-09+ ownership or DEFER/DO_NOT_BUILD findings.
