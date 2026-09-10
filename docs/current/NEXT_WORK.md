# Next Work — G2-WP-05 Construction A gate

Generation 2 execution remains rolling-wave and dependency-safe.

## Materialized successor
G2-WP-05 Construction A `G2-CANONICAL-DATA-MIGRATION-FOUNDATION-01` is materialized as `TASK-505 -> TASK-506 -> TASK-507 -> TASK-508 -> TASK-509` from fresh `main@6b0aebfade030088e412f3d8f70c1328b136370b`.

## Next mandatory gate
Run exact-head repository verification for this Planning & Materialization commit. If green and review-clean, integrate with expected-head protection, reconstruct fresh main, then execute only TASK-505 as the first dependency-safe product task.

Do not begin TASK-506+ before predecessor integration/reconciliation. Construction B/C, WP-06+, concrete DB/provider/runtime migration, Production Readiness and unrelated DEFER/DO_NOT_BUILD findings remain unmaterialized.