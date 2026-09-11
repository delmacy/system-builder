# Current Execution Milestone — Generation 2 / G2-WP-06 Construction A

## Milestone state
`G2-WP-01..G2-WP-05` are canonically CLOSED. Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a` and remains `READY_FOR_WORKER_HANDOFF / PASS` through the research state, WBS decomposition/dependency graph, Work Package Design and handoff artifacts.

G2-WP-06 Planning & Materialization is integrated. Construction A is materialized as `TASK-510 -> TASK-511 -> TASK-512 -> TASK-513 -> TASK-514 -> TASK-515`; Construction B/C remain `NOT MATERIALIZED`.

TASK-510..513 are integrated. TASK-514 is integrated by PR #665 from exact head `b1b0774773c2137d11c17a26d4552d55495aa8b1`; Deterministic CI #1624, Heavy Product Tests #1205 and Automation Handoff #1952 passed before expected-head-protected squash merge to authoritative main commit `6d55d9e665fe2fdb9be72534ff1f73e10fc520ce`.

## Current gate
TASK-515 is dependency-safe and is the active Construction A proof gate after TASK-514 integration. Execute only TASK-515 from fresh main, preserving its materialized scope and exact-head validation requirements.

TASK-515 must provide integrated happy, negative, adversarial and recovery Product Proof across provider qualification, Brownfield evidence, external identity/coexistence, locality/currentness and bounded Physical/Peripheral governance. Preserve `PARTIAL/UNKNOWN`, evidence authority/provenance, residual visibility, Local/Station/Fleet boundaries and observation/requested-intent/external-authorization/confirmed-effect separation. Product Proof is not Production Readiness; no new semantic ownership, adapters/devices, deployment or WP-07+ scope may be absorbed.