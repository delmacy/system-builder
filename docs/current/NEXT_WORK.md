# Next Work — G2-WP-08 Construction B / TASK-534

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority is `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-08 owns `G2-WBS-07`; prerequisites from WP-06/WP-07 are canonically closed.

## Integrated predecessor
Construction A `TASK-527 -> TASK-528 -> TASK-529 -> TASK-530` is fully integrated. Construction A Sprint Review PR #714 is PASS and integrated as `main@04df60e4f3bd58f15e529bd2d5a56ef409c0cb0e`.

Construction B materialization PR #715 is integrated. TASK-531 provider coexistence/substitution evidence semantics is integrated by PR #716 as `main@875fadf1c874f5338c0099da663a4c3f0baf7ec2`. TASK-532 callback/integration mapping reconciliation is integrated by PR #718 as `main@dfd96f28967797a37f1bdad1c3384049626f512e`. TASK-533 notification/offline buffering and residual drainage is integrated by PR #720 as `main@0708d1d5f9f4bb861fc140757cf4c32286531fc6`.

## Materialized dependency chain
`TASK-531 -> TASK-532 -> TASK-533 -> TASK-534`.

TASK-531, TASK-532 and TASK-533 are integrated. TASK-534 is READY and is proof-only.

## Current mandatory gate
Integrate this repository-memory reconciliation after exact-head gates pass. Then rebuild fresh main and execute only **TASK-534 — integrated Construction B Product Proof**. Do not introduce or modify semantic contracts in TASK-534; route any exposed semantic gap back to bounded retrabalho in TASK-531..533.

## Preserved exclusions
Do not pre-materialize Construction C or absorb concrete broker/provider SDKs, DB/runtime/deployment realization, apps/UI, Production Readiness, WP-09+ ownership or DEFER/DO_NOT_BUILD findings.
