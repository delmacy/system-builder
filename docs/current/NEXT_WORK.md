# Next Work — G2-WP-08 Planning & Materialization

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
`G2-WP-01..G2-WP-07` are CANONICALLY CLOSED. G2-WP-07 Documentation & Closure is integrated by PR #703 as fresh `main@3d037c2f445fd420534d359d8214bf1a91ce2b5b`.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, `READY_FOR_WORKER_HANDOFF / PASS`.

## Current mandatory gate
From fresh main, revalidate the Generation 2 WBS/dependency graph and execute only **G2-WP-08 Planning & Materialization**. Planning must determine the real Sprint decomposition from package scope, preserve ownership/boundaries, and materialize only the first dependency-safe Construction Sprint.

## Not yet eligible
No G2-WP-08 Construction TASK is committed merely by predecessor closure. Construction becomes eligible only after the planning gate explicitly materializes bounded TASK specs/DAG and integrates with exact-head gates green.

## Preserved exclusions
Concrete vendor adapters, DB/runtime/deployment realization, Production Readiness and DEFER/DO_NOT_BUILD findings remain excluded unless separately materialized and authorized.
