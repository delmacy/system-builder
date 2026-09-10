# Next Work — G2-WP-06 Construction A / TASK-511

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
`G2-WP-01..G2-WP-05` are CANONICALLY CLOSED. G2-WP-06 Planning & Materialization is integrated. Construction A is materialized as `TASK-510 -> TASK-511 -> TASK-512 -> TASK-513 -> TASK-514 -> TASK-515`; Construction B/C remain `NOT MATERIALIZED`.

## Integrated predecessor
TASK-510 (`Define multidimensional provider and binding qualification`) integrated by PR #655 from authoritative head `40ace249747806b3c3d6c47bbea720a17e52154b` to fresh `main@310a82827a97f829e87ffaa43ec5b3970740e424`. Exact-head Deterministic CI #1607, Heavy Product Tests #1179 and Automation Handoff #1875 passed before merge. The integrated contract preserves multidimensional revision/currentness-qualified provider support, conservative `SUPPORTED/PARTIAL/UNSUPPORTED/UNKNOWN/INCONCLUSIVE` semantics, evidence authority separation, reconcile-before-retry for stale/UNKNOWN authority-sensitive evidence, and provider-specific identity != canonical semantic identity.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, with `RESEARCH_PIPELINE_STATE.json` at `READY_FOR_WORKER_HANDOFF / PASS`. WP-06 owns `G2-WBS-09`, `G2-WBS-23`, `G2-WBS-10` and consumes closed WP-01/WP-02/WP-04/WP-05 semantics.

## Next mandatory gate
First integrate this bounded post-TASK-510 repository-memory reconciliation. Then reconstruct fresh main and execute only TASK-511, whose materialized scope is evidence-first Brownfield inventory/assimilation with provenance, owner/revision/currentness and `AI inference != authority`.

Do not infer support from parity, strengthen `PARTIAL/UNKNOWN/INCONCLUSIVE`, reconnect reused external IDs, promote local/Station/Fleet truth to global truth, infer generic physical actuation authority, or absorb concrete vendor/device adapters, deployment, DB migration execution, WP-07+ or DEFER/DO_NOT_BUILD findings. Product Proof remains distinct from Production Readiness.