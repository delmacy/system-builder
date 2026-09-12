# Next Work — G2-WP-07 Package Integration & Review

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
`G2-WP-01..G2-WP-06` are CANONICALLY CLOSED. G2-WP-07 Construction A `TASK-519 -> TASK-520 -> TASK-521 -> TASK-522` is integrated through PR #692. Construction B `TASK-523 -> TASK-524 -> TASK-525 -> TASK-526` is fully integrated through PR #700 on fresh `main@1e2eac3f5dd0f990bcb7ac9434d1510edf310e37`.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, `READY_FOR_WORKER_HANDOFF / PASS`. G2-WP-07 owns `G2-WBS-06`, `G2-WBS-08`, `G2-WBS-11`.

## Construction B Sprint Review
Decision: **PASS**. TASK-526 exact head `3226bc15e577687aa18444940993216cc9a6cdbc` passed Deterministic CI #1693, Heavy Product Tests #1280 and Automation Handoff #2205. Review found no unresolved review threads or remaining bounded construction gap required by the Package Goal.

Optional Construction C is **NOT REQUIRED** by fresh integrated evidence.

## Next mandatory gate
After this review/repository-memory reconciliation passes exact-head gates and integrates, materialize and execute only **G2-WP-07 Package Integration & Review** from fresh main.

The review must regress the complete Construction A+B package for:
- revision/currentness/provenance and lineage;
- `accepted != processed != converged` and external-effect reconciliation;
- idempotency scope/horizon and unsafe retry handling;
- canonical identity vs provider-copy/source-of-truth coexistence;
- residual cohorts, `PARTIAL/UNKNOWN`, telemetry gaps and finite drainage;
- units/population/time/replay qualification;
- architecture/dependency fitness, trust/security and technical debt.

Package Integration & Review is not overflow functional construction. Documentation & Closure remains predecessor-gated until package review passes.

Concrete vendor adapters, messaging/notification semantics owned by WP-08, DB/runtime/deployment work, Production Readiness and DEFER/DO_NOT_BUILD findings remain excluded.