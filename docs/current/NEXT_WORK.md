# Next Work — G2-WP-09 Planning & Materialization eligibility

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority is `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. `G2-WP-01..G2-WP-08` are canonically closed.

## Closed predecessor
G2-WP-08 Documentation & Closure PR #725 passed exact-head Deterministic CI #1729, Heavy Product Tests #1317 and Automation Handoff #2339/#2342 and integrated as fresh `main@307f6c4a344cc38c59218ef542ea012097997f0f`.

## Current mandatory gate
Rebuild/revalidate fresh main against the pinned WBS decomposition, typed dependency graph, Work Package Design and Ready for Worker Handoff. If G2-WP-09 is dependency-safe, execute **G2-WP-09 Planning & Materialization only**.

Planning may materialize only the first eligible Construction Sprint emerging from the real package scope. Do not compress or inflate Sprint count, pre-materialize later Construction, or absorb unrelated DEFER/DO_NOT_BUILD/findings.

## Preserved exclusions
No G2-WP-09 product implementation is authorized merely by this post-closure reconciliation; it requires explicit materialization under the Planning gate. Production Readiness and unrelated future ownership remain excluded unless separately materialized.
