# Current Execution Milestone — Generation 2 / G2-WP-06 Construction B

## Milestone state
`G2-WP-01..G2-WP-05` are canonically CLOSED. Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a` and remains `READY_FOR_WORKER_HANDOFF / PASS` through the research state, WBS decomposition/dependency graph, Work Package Design and handoff artifacts.

G2-WP-06 Planning & Materialization and Construction A are integrated. Construction A `TASK-510 -> ... -> TASK-515` is complete.

Construction B is materialized as `TASK-516 -> TASK-517 -> TASK-518`; Construction C remains `NOT MATERIALIZED`. TASK-516 is integrated by PR #670 as squash commit `36900a3dc059a78ac3e0c02e80a069f65fb9664a` after exact-head Deterministic CI #1635, Heavy Product Tests #1219 and Automation Handoff #1997 PASS.

## Current gate
After this repository-memory reconciliation is integrated from fresh `main@36900a3dc059a78ac3e0c02e80a069f65fb9664a`, execute **TASK-517** only. TASK-518 remains predecessor-gated.

TASK-517 must preserve stale-authority fencing, canonical-truth uniqueness, provider/external identity boundaries, explicit residual cohort visibility until drainage/reconciliation evidence exists, locality/currentness-qualified reconciliation, conservative `PARTIAL/UNKNOWN/INCONCLUSIVE`, and `UNKNOWN/conflict -> reconcile-before-retry`. Local/Station/Fleet reconnection must not strengthen local state into global truth. Product Proof remains separate from Production Readiness.

Construction C is optional and may be materialized only after Construction B integration/review if fresh evidence shows additional bounded construction is necessary.