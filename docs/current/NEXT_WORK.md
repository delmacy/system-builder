# Next Work — G2-WP-06 Construction A / TASK-513

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
`G2-WP-01..G2-WP-05` are CANONICALLY CLOSED. G2-WP-06 Planning & Materialization is integrated. Construction A is materialized as `TASK-510 -> TASK-511 -> TASK-512 -> TASK-513 -> TASK-514 -> TASK-515`; Construction B/C remain `NOT MATERIALIZED`.

## Integrated predecessors
TASK-510 (`Define multidimensional provider and binding qualification`) is integrated by PR #655. TASK-511 (`Define evidence-first Brownfield inventory and assimilation`) is integrated by PR #658 from authoritative head `cfb1abd4a128d07a866a8e3e068f8b1da2b7d6f4`; exact-head Deterministic CI #1613 and Heavy Product Tests #1188 passed before merge. TASK-512 (`Protect external identity reuse rebinding and coexistence lineage`) is integrated by PR #660 from authoritative head `f626839f8982dabc93cf86cf76de087cfdf4fc0f`; exact-head Deterministic CI #1616 and Heavy Product Tests #1193 passed before merge. Post-TASK-512 ready-gate reconciliation is integrated by PR #661. Fresh product main is `main@56570e569eb5948cf8eb2dbf8e7b12f7609c4cfe`.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, with `RESEARCH_PIPELINE_STATE.json` at `READY_FOR_WORKER_HANDOFF / PASS`. WP-06 owns `G2-WBS-09`, `G2-WBS-23`, `G2-WBS-10` and consumes closed WP-01/WP-02/WP-04/WP-05 semantics.

## Next mandatory gate
TASK-513 is dependency-safe and READY. Execute only TASK-513 from fresh main. Its materialized scope is locality-qualified local/Station/Fleet truth and reconciliation with explicit currentness, authority distinction, conflict/partition uncertainty, residual lineage and reconcile-before-retry for UNKNOWN authority-sensitive conflict.

Do not promote local/Station/Fleet truth to global truth, strengthen stale=>current, interpret disconnected=>absent, treat UNKNOWN conflict as resolved, infer generic physical actuation authority, or absorb networking topology, scheduler/deployment behavior, concrete vendor/device adapters, DB migration execution, WP-07+ or DEFER/DO_NOT_BUILD findings. Product Proof remains distinct from Production Readiness.
