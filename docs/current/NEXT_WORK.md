# Next Work — G2-WP-05 Construction A Sprint Review

Generation 2 execution remains rolling-wave and dependency-safe.

## Materialized chain
G2-WP-05 Construction A `G2-CANONICAL-DATA-MIGRATION-FOUNDATION-01` is integrated/materialized as `TASK-505 -> TASK-506 -> TASK-507 -> TASK-508 -> TASK-509`. Planning & Materialization exact head `dfa4a665ffbc97e3223c20136334330f9bbd1bd9` passed Deterministic CI #1569, Heavy Product Tests #1123 and Automation Handoff #1707.

TASK-505 is integrated by PR #639. Exact head `65cbdd5c6a5ed5c5f67c8082c0c801c2fb8cc0a3` passed Deterministic CI #1572, Heavy Product Tests #1128 and Automation Handoff.
TASK-506 is integrated by PR #641. Exact head `f604f6fb707bdd5215cc44e48686cf2dbdad65d4` passed Deterministic CI #1574, Heavy Product Tests #1132 and Automation Handoff #1734.
TASK-507 is integrated by PR #643. Exact head `75c85ba8af51fa9660070a694b215cd11d8468cb` passed Deterministic CI #1577, Heavy Product Tests #1137 and Automation Handoff #1749.
TASK-508 is integrated by PR #645. Exact head `000ff8b4991115e1bda620ad7a7b46bdb0558785` passed Deterministic CI #1585, Heavy Product Tests #1147 and Automation Handoff #1779.
TASK-509 is integrated by PR #647. Exact head `4c8e2f1d59ef8a37be82b4cb9162dec4f0bed215` passed Deterministic CI #1587, Heavy Product Tests #1151 and Automation Handoff #1791 and merged as fresh `main@0573415581cbf07ac96d4a5e9269d9afe29d09ca`.

## Next mandatory work
Perform Construction A Sprint Review over TASK-505..509 from fresh main. Verify task/spec coverage, authoritative commit lineage, positive/negative/adversarial/recovery proof, revision/currentness/population semantics, source-of-truth/fencing/lineage/residual cohorts, `PARTIAL/UNKNOWN`, source-of-truth/coexistence boundaries, and repository memory. Determine from evidence whether Construction B is required; do not materialize or execute it before this review gate passes.

Construction B/C, WP-06+, concrete DB/provider/runtime migration, Production Readiness and unrelated DEFER/DO_NOT_BUILD findings remain unmaterialized.