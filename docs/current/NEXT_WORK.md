# Next Work — G2-WP-06 Construction A / TASK-514

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
`G2-WP-01..G2-WP-05` are CANONICALLY CLOSED. G2-WP-06 Planning & Materialization is integrated. Construction A is materialized as `TASK-510 -> TASK-511 -> TASK-512 -> TASK-513 -> TASK-514 -> TASK-515`; Construction B/C remain `NOT MATERIALIZED`.

## Integrated predecessors
TASK-510 (`Define multidimensional provider and binding qualification`) is integrated by PR #655. TASK-511 (`Define evidence-first Brownfield inventory and assimilation`) is integrated by PR #658 from authoritative head `cfb1abd4a128d07a866a8e3e068f8b1da2b7d6f4`; exact-head Deterministic CI #1613 and Heavy Product Tests #1188 passed before merge. TASK-512 (`Protect external identity reuse rebinding and coexistence lineage`) is integrated by PR #660 from authoritative head `f626839f8982dabc93cf86cf76de087cfdf4fc0f`; exact-head Deterministic CI #1616 and Heavy Product Tests #1193 passed before merge. TASK-513 (`Define local Station Fleet truth and reconciliation boundaries`) is integrated by PR #662 from exact head `a0f2a6039de91383a5759a34a3145c73bcf06944`; Deterministic CI #1619, Heavy Product Tests #1198 and Automation Handoff #1932 passed before expected-head-protected squash merge to authoritative main commit `85f5f1f4c151978f4b721ffc034f9d6b2c6ecea5`.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, with `RESEARCH_PIPELINE_STATE.json` at `READY_FOR_WORKER_HANDOFF / PASS`. WP-06 owns `G2-WBS-09`, `G2-WBS-23`, `G2-WBS-10` and consumes closed WP-01/WP-02/WP-04/WP-05 semantics.

## Next mandatory gate
TASK-514 is dependency-safe and READY after post-TASK-513 repository-memory reconciliation. Execute only TASK-514 from fresh main. Its materialized scope is bounded Physical/Peripheral integration/governance: provider/revision/currentness/locality-aware qualification; explicit separation of observation, requested intent, external owning-domain authorization and confirmed physical effect; conservative unsupported/PARTIAL/UNKNOWN handling; no authority inferred from connectivity or provider capability.

Do not infer connected=>authorized, command accepted=>effect, telemetry missing=>safe/absent, provider capability=>generic actuation authority, or absorb direct device actuation, safety certification, concrete drivers/hardware orchestration, DB migration execution, WP-07+ or DEFER/DO_NOT_BUILD findings. TASK-515 remains predecessor-gated. Product Proof remains distinct from Production Readiness.
