# Next Work — G2-WP-07 Construction A

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
`G2-WP-01..G2-WP-06` are CANONICALLY CLOSED on fresh `main@a711231373c98b35b0338f70c20b99105ec30025`. G2-WP-06 closure is integrated by PR #678 as `a711231373c98b35b0338f70c20b99105ec30025` after exact head `f7263dfc8759ed9a6a59e93e5184305a5a248b9f` passed Deterministic CI #1653, Heavy Product Tests #1238 and Automation Handoff #2064.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, `READY_FOR_WORKER_HANDOFF / PASS`. G2-WP-07 owns `G2-WBS-06`, `G2-WBS-08`, `G2-WBS-11` with typed prerequisites from closed WP-01/WP-03/WP-04/WP-05/WP-06.

## Materialized Construction A
`G2-DURABLE-EXECUTION-FOUNDATION-01` is materialized as:

`TASK-519 -> TASK-520 -> TASK-521 -> TASK-522`

Only TASK-519 is READY. TASK-520..522 remain predecessor-gated.

TASK-519 establishes durable execution identity/state/journal and producing-revision pinning. TASK-520 establishes external-effect identity, qualified idempotency and reconcile-before-retry. TASK-521 establishes units/population-qualified finite-flow capacity/backpressure/drainage. TASK-522 is integrated Product Proof only.

## Next mandatory gate
First pass exact-head CI and semantic review for this Planning & Materialization change. After integration and fresh-main reconciliation, execute only TASK-519.

Construction B, optional Construction C, Package Integration & Review and Documentation & Closure remain NOT MATERIALIZED. Do not absorb storage Construction-B semantics early, concrete adapters, messaging/notification semantics owned by WP-08, DB/runtime/deployment work, Production Readiness or DEFER/DO_NOT_BUILD findings.