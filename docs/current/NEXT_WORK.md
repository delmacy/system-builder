# Next Work — G2-WP-05 Construction A / TASK-508

Generation 2 execution remains rolling-wave and dependency-safe.

## Materialized chain
G2-WP-05 Construction A `G2-CANONICAL-DATA-MIGRATION-FOUNDATION-01` is integrated/materialized as `TASK-505 -> TASK-506 -> TASK-507 -> TASK-508 -> TASK-509`. Planning & Materialization exact head `dfa4a665ffbc97e3223c20136334330f9bbd1bd9` passed Deterministic CI #1569, Heavy Product Tests #1123 and Automation Handoff #1707.

TASK-505 is integrated by PR #639. Exact head `65cbdd5c6a5ed5c5f67c8082c0c801c2fb8cc0a3` passed Deterministic CI #1572, Heavy Product Tests #1128 and Automation Handoff.
TASK-506 is integrated by PR #641. Exact head `f604f6fb707bdd5215cc44e48686cf2dbdad65d4` passed Deterministic CI #1574, Heavy Product Tests #1132 and Automation Handoff #1734.
TASK-507 is integrated by PR #643. Exact head `75c85ba8af51fa9660070a694b215cd11d8468cb` passed Deterministic CI #1577, Heavy Product Tests #1137 and Automation Handoff #1749 and merged as fresh `main@00748a312c78dcb726e3bbcde9d39ed8ff36debe`.

## Next mandatory work
Execute only TASK-508 as the next dependency-safe product task, preserving its allowed/forbidden paths and exact acceptance obligations. Revalidate exact-head CI/review before integration, then reconstruct fresh main before TASK-509.

Do not begin TASK-509 before predecessor integration/reconciliation. Construction B/C, WP-06+, concrete DB/provider/runtime migration, Production Readiness and unrelated DEFER/DO_NOT_BUILD findings remain unmaterialized.