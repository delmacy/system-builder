# Current Execution Milestone — Generation 2 / G2-WP-06 Construction A

## Milestone state
`G2-WP-01..G2-WP-05` are canonically CLOSED. Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a` and remains `READY_FOR_WORKER_HANDOFF / PASS` through the research state, WBS decomposition/dependency graph, Work Package Design and handoff artifacts.

G2-WP-06 Planning & Materialization is integrated. Construction A is materialized as `TASK-510 -> TASK-511 -> TASK-512 -> TASK-513 -> TASK-514 -> TASK-515`; Construction B/C remain `NOT MATERIALIZED`.

TASK-510 is integrated by PR #655. Its authoritative head `40ace249747806b3c3d6c47bbea720a17e52154b` passed Deterministic CI #1607, Heavy Product Tests #1179 and Automation Handoff #1875 before expected-head-protected merge. The bounded post-TASK-510 repository-memory reconciliation is integrated in fresh `main@5effbdb1ea949de591333457b53e8e8028092942`.

## Current gate
TASK-511 is dependency-safe and is the active Construction A gate. Execute only TASK-511 from fresh main, preserving its materialized scope and exact-head validation requirements.

TASK-511 owns evidence-first Brownfield inventory/assimilation with explicit provenance, ownership, revision and currentness. Discovery and AI inference are evidence, not authority. Preserve `PARTIAL/UNKNOWN/INCONCLUSIVE`, provider qualification locality/currentness, external-ID reuse protection, source-of-truth/coexistence/residual drainage and local/Station/Fleet truth. Physical/Peripheral remains bounded integration/governance only; no generic physical actuation authority is inferred. Product Proof remains separate from Production Readiness.