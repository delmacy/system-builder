# Next Work — G2-WP-05 Construction A / TASK-509

Generation 2 execution remains rolling-wave and dependency-safe.

## Materialized chain
G2-WP-05 Construction A `G2-CANONICAL-DATA-MIGRATION-FOUNDATION-01` is integrated/materialized as `TASK-505 -> TASK-506 -> TASK-507 -> TASK-508 -> TASK-509`. Planning & Materialization exact head `dfa4a665ffbc97e3223c20136334330f9bbd1bd9` passed Deterministic CI #1569, Heavy Product Tests #1123 and Automation Handoff #1707.

TASK-505 is integrated by PR #639. Exact head `65cbdd5c6a5ed5c5f67c8082c0c801c2fb8cc0a3` passed Deterministic CI #1572, Heavy Product Tests #1128 and Automation Handoff.
TASK-506 is integrated by PR #641. Exact head `f604f6fb707bdd5215cc44e48686cf2dbdad65d4` passed Deterministic CI #1574, Heavy Product Tests #1132 and Automation Handoff #1734.
TASK-507 is integrated by PR #643. Exact head `75c85ba8af51fa9660070a694b215cd11d8468cb` passed Deterministic CI #1577, Heavy Product Tests #1137 and Automation Handoff #1749.
TASK-508 is integrated by PR #645. Exact head `000ff8b4991115e1bda620ad7a7b46bdb0558785` passed Deterministic CI #1585, Heavy Product Tests #1147 and Automation Handoff #1779 and merged as fresh `main@e624572b775a9c185129ca7669413d1b12f37d99`.

## Next mandatory work
Execute only TASK-509 as the next dependency-safe product task. It must consume the integrated public contracts from TASK-505..508 and add the integrated positive/negative/adversarial/recovery Product Proof required by its materialized specification, with no new semantic ownership unless a bounded predecessor defect is discovered and separately attributed.

Revalidate exact-head CI/review before integration, then reconstruct fresh main and perform Construction A Sprint Review. Construction B/C, WP-06+, concrete DB/provider/runtime migration, Production Readiness and unrelated DEFER/DO_NOT_BUILD findings remain unmaterialized.