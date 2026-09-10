# Current Execution Milestone — Generation 2 / G2-WP-06 Construction A

## Milestone state
`G2-WP-01..G2-WP-05` are canonically CLOSED. Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a` and remains `READY_FOR_WORKER_HANDOFF / PASS` through the research state, WBS decomposition/dependency graph, Work Package Design and handoff artifacts.

G2-WP-06 Planning & Materialization is integrated. Construction A is materialized as `TASK-510 -> TASK-511 -> TASK-512 -> TASK-513 -> TASK-514 -> TASK-515`; Construction B/C remain `NOT MATERIALIZED`.

TASK-510 is integrated by PR #655. TASK-511 is integrated by PR #658 from authoritative head `cfb1abd4a128d07a866a8e3e068f8b1da2b7d6f4`; exact-head Deterministic CI #1613 and Heavy Product Tests #1188 passed before expected-head-protected merge. Fresh product main is `main@afbfa7d160fb9a813a6412ea3ebd17a79ea69e2e`.

## Current gate
TASK-512 is dependency-safe and is the active Construction A gate. Execute only TASK-512 from fresh main, preserving its materialized scope and exact-head validation requirements.

TASK-512 owns external identity reuse/rebinding protection and coexistence/source-of-truth lineage. External IDs never become globally canonical identity by reuse. Preserve evidence qualification, provider/scope/revision/epoch lineage, one canonical truth per scope/epoch, stale-authority fencing and visible residual populations. Local/Station/Fleet truth remains locality-qualified and reconciliation-aware. Physical/Peripheral remains bounded integration/governance only; no generic physical actuation authority is inferred. Product Proof remains separate from Production Readiness.