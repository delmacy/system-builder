# Current Execution Milestone — Generation 2 / G2-WP-06 Construction B

## Milestone state
`G2-WP-01..G2-WP-05` are canonically CLOSED. Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a` and remains `READY_FOR_WORKER_HANDOFF / PASS` through the research state, WBS decomposition/dependency graph, Work Package Design and handoff artifacts.

G2-WP-06 Planning & Materialization and Construction A are integrated. Construction A `TASK-510 -> ... -> TASK-515` is complete.

Construction A Sprint Review against fresh `main@461ba9f20601aaf544b773d8f11a20dbac339e6d` identified dependency-safe recovery hardening within existing package scope. In accordance with the rolling-wave Sprint Generation Policy, Construction B is materialized as `TASK-516 -> TASK-517 -> TASK-518`; Construction C remains `NOT MATERIALIZED`.

## Current gate
Integrate the Construction B materialization and execute **TASK-516** only from reconstructed fresh main. TASK-517 and TASK-518 remain predecessor-gated.

TASK-516 must preserve provider qualification, Brownfield evidence authority/provenance, owner/revision/currentness/locality, conservative `PARTIAL/UNKNOWN/INCONCLUSIVE`, `AI inference != authority`, and `UNKNOWN -> reconcile-before-retry`. Recovery after stale/unknown/conflicting evidence must not silently preserve or manufacture authority. Product Proof remains separate from Production Readiness.

Construction C is optional and may be materialized only after Construction B integration/review if fresh evidence shows additional bounded construction is necessary.