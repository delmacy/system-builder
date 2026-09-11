# Next Work — G2-WP-06 Construction B / TASK-516

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
`G2-WP-01..G2-WP-05` are CANONICALLY CLOSED. G2-WP-06 Planning & Materialization and Construction A are integrated. TASK-510..515 are integrated; TASK-515 closed Construction A by PR #667 after exact-head Deterministic CI #1626, Heavy Product Tests #1209 and Automation Handoff #1966 PASS.

## Construction A Sprint Review
Review against fresh `main@461ba9f20601aaf544b773d8f11a20dbac339e6d` passed the foundation and established a real Construction B hardening need already inside WP-06: recovery when provider/Brownfield evidence loses currentness or conflicts, explicit reconciliation before retry, and preservation of fencing/residual visibility through rebinding/reconnection. This also satisfies the policy requirement that a new Work Package receive two bounded Construction Sprints rather than proceeding from Construction A directly to Package Review.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, `READY_FOR_WORKER_HANDOFF / PASS`. WP-06 continues to own `G2-WBS-09`, `G2-WBS-23`, `G2-WBS-10` and consumes closed WP-01/WP-02/WP-04/WP-05 semantics.

## Materialized Construction B
`TASK-516 -> TASK-517 -> TASK-518`

- TASK-516 READY: currentness/revision/locality degradation recovery and authoritative reconcile-before-retry.
- TASK-517 BLOCKED on TASK-516: rebinding/reconnection fencing, canonical-truth uniqueness and visible residual drainage through recovery.
- TASK-518 BLOCKED on TASK-517: integrated adversarial/recovery Product Proof across Construction A+B and bounded Physical/Peripheral recovery boundaries.

## Next mandatory gate
Integrate this materialization from exact fresh main; reconstruct fresh main; execute only TASK-516. Do not execute TASK-517/518 early. Construction C remains `NOT MATERIALIZED` and Package Integration & Review remains ineligible until Construction B is integrated and reviewed.

Preserve owner/revision/currentness/locality, hybrid evidence semantics, `AI inference != authority`, conservative `PARTIAL/UNKNOWN/INCONCLUSIVE`, `UNKNOWN -> reconcile-before-retry`, source-of-truth/coexistence/residual drainage, provider qualification, Local/Station/Fleet boundaries, and Product Proof != Production Readiness. Do not absorb concrete adapters/devices, deployment, WP-07+ or DEFER/DO_NOT_BUILD findings.