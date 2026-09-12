# Next Work — G2-WP-08 Construction B / TASK-531

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority is `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-08 owns `G2-WBS-07`; prerequisites from WP-06/WP-07 are canonically closed.

## Integrated predecessor
Construction A `TASK-527 -> TASK-528 -> TASK-529 -> TASK-530` is fully integrated. Construction A Sprint Review PR #714 is PASS and integrated as `main@04df60e4f3bd58f15e529bd2d5a56ef409c0cb0e`.

## Materialized dependency chain
`TASK-531 -> TASK-532 -> TASK-533 -> TASK-534`.

TASK-531 is READY. TASK-532..534 remain predecessor-gated.

## Current mandatory gate
Integrate this Construction B materialization after exact-head gates pass. Then rebuild fresh main and execute only **TASK-531 — provider coexistence/substitution evidence semantics**.

## Preserved exclusions
Do not pre-materialize Construction C or absorb concrete broker/provider SDKs, DB/runtime/deployment realization, apps/UI, Production Readiness, WP-09+ ownership or DEFER/DO_NOT_BUILD findings.
