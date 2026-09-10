# Next Work — G2-WP-05 Construction A / TASK-505

Generation 2 execution remains rolling-wave and dependency-safe.

## Materialized chain
G2-WP-05 Construction A `G2-CANONICAL-DATA-MIGRATION-FOUNDATION-01` is integrated/materialized as `TASK-505 -> TASK-506 -> TASK-507 -> TASK-508 -> TASK-509`. Planning & Materialization exact head `dfa4a665ffbc97e3223c20136334330f9bbd1bd9` passed Deterministic CI #1569, Heavy Product Tests #1123 and Automation Handoff #1707 and merged into fresh `main@6ba0bb96163425d1d36ab63a5ebc3c8243625428`.

## Next mandatory work
Execute only TASK-505 as the first dependency-safe product task, preserving its allowed/forbidden paths and exact acceptance obligations. Revalidate exact-head CI/review before integration, then reconstruct fresh main before TASK-506.

Do not begin TASK-506+ before predecessor integration/reconciliation. Construction B/C, WP-06+, concrete DB/provider/runtime migration, Production Readiness and unrelated DEFER/DO_NOT_BUILD findings remain unmaterialized.