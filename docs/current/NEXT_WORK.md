# Next Work — G2-WP-08 Package Integration & Review

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority is `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-08 owns `G2-WBS-07`; prerequisites from WP-06/WP-07 are canonically closed.

## Integrated predecessor
Construction A `TASK-527 -> TASK-528 -> TASK-529 -> TASK-530` is fully integrated and its Sprint Review required Construction B.

Construction B `TASK-531 -> TASK-532 -> TASK-533 -> TASK-534` is fully integrated through PR #722 as fresh `main@490c55e80e47788cc6652f6171fe82ba05be82aa`. TASK-534 exact head `655fe627776decf5feed70ae0db6fb2c558a2197` passed Deterministic CI #1726, Heavy Product Tests #1314 and Automation Handoff #2327.

Fresh-main Construction B review is PASS and finds no evidence-supported residual package gap. Optional Construction C is NOT REQUIRED and remains unmaterialized.

## Current mandatory gate
Integrate the bounded Construction B Sprint Review/repository-memory reconciliation after exact-head gates pass. Then rebuild fresh main and execute **G2-WP-08 Package Integration & Review**.

Package Integration & Review must regress the integrated package, classify blocking/non-blocking debt, verify architecture/contracts/readiness and preserve package boundaries. It must not add delayed product behavior or absorb excluded findings.

## Preserved exclusions
Do not materialize Construction C without new evidence. Do not absorb concrete broker/provider SDKs, DB/runtime/deployment realization, apps/UI, Production Readiness, WP-09+ ownership or DEFER/DO_NOT_BUILD findings.
