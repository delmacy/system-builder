# Current Execution Milestone — Generation 2 / G2-WP-05 Construction A

## Milestone state
`G2-WP-01..G2-WP-04` are canonically CLOSED. Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`.

G2-WP-05 Planning & Materialization PR #637 exact head `dfa4a665ffbc97e3223c20136334330f9bbd1bd9` passed Deterministic CI #1569, Heavy Product Tests #1123 and Automation Handoff #1707 and integrated.

Fresh product base is `main@00748a312c78dcb726e3bbcde9d39ed8ff36debe`.

## Materialized work
Construction A `G2-CANONICAL-DATA-MIGRATION-FOUNDATION-01`: `TASK-505 -> TASK-506 -> TASK-507 -> TASK-508 -> TASK-509`.

TASK-505 is INTEGRATED by PR #639. Exact head `65cbdd5c6a5ed5c5f67c8082c0c801c2fb8cc0a3` passed Deterministic CI #1572, Heavy Product Tests #1128 and Automation Handoff.
TASK-506 is INTEGRATED by PR #641. Exact head `f604f6fb707bdd5215cc44e48686cf2dbdad65d4` passed Deterministic CI #1574, Heavy Product Tests #1132 and Automation Handoff #1734.
TASK-507 is INTEGRATED by PR #643. Exact head `75c85ba8af51fa9660070a694b215cd11d8468cb` passed Deterministic CI #1577, Heavy Product Tests #1137 and Automation Handoff #1749 and merged as `main@00748a312c78dcb726e3bbcde9d39ed8ff36debe`.

Preserve directional compatibility; historical/current populations; reader/writer coexistence; `ABSENT != NULL != DEFAULT != DELETE`; units/precision/lossiness; explicit source-of-truth fencing; lineage-preserving backfill/CDC/dual-write; residual cohorts; and `migration success != convergence`.

## Current gate
TASK-508 is READY as the next dependency-safe product task. Do not begin TASK-509 before predecessor integration/reconciliation. Construction B/C remain NOT MATERIALIZED; WP-06+, Production Readiness and DEFER/DO_NOT_BUILD remain excluded.