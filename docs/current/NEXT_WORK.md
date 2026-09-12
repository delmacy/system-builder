# Next Work — G2-WP-09 Planning & Materialization

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
`G2-WP-01..G2-WP-08` are CANONICALLY CLOSED. G2-WP-08 Documentation & Closure is integrated by PR #725 as fresh `main@307f6c4a344cc38c59218ef542ea012097997f0f`.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, `READY_FOR_WORKER_HANDOFF / PASS`.

## Current mandatory gate
From fresh main, revalidate `RESEARCH_PIPELINE_STATE.json`, WBS decomposition/dependency graph, Work Package Design and Ready for Worker Handoff, then execute only **G2-WP-09 Planning & Materialization** if the DAG proves it dependency-safe. Materialize only the first real bounded Construction Sprint and preserve explicit predecessors, ownership and allowed/forbidden paths.

## Not yet eligible
No G2-WP-09 Construction TASK is committed by G2-WP-08 closure or this reconciliation. Construction becomes eligible only after the planning gate explicitly materializes bounded TASK specs/DAG and integrates with exact-head gates green.

## Preserved exclusions
Do not absorb DEFER/DO_NOT_BUILD or unrelated findings. Concrete provider/runtime/deployment realization, apps/UI and Production Readiness remain excluded unless G2-WP-09 planning authority explicitly owns and materializes them.
