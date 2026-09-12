# Next Work — close G2-WP-07, then revalidate G2-WP-08

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
`G2-WP-01..G2-WP-06` are CANONICALLY CLOSED. G2-WP-07 Construction A is integrated through PR #692, Construction B through PR #700, Construction B Sprint Review through PR #701, and Package Integration & Review through PR #702 on fresh `main@f6d6066fae77399d868b300063878f4da506c3ac`.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, `READY_FOR_WORKER_HANDOFF / PASS`. G2-WP-07 owns `G2-WBS-06`, `G2-WBS-08`, `G2-WBS-11`.

## Current mandatory gate
Execute and integrate only **G2-WP-07 Documentation & Closure**. Closure is documentation/traceability work only: reconcile repository memory, package evidence, WBS/DAG/readiness, residual risks and successor eligibility. Do not add product behavior.

## After closure integration
Reconstruct fresh `main`, revalidate the pinned Generation 2 dependency graph and select/materialize only the first dependency-safe **G2-WP-08 Planning & Materialization** gate. Forecast is not commitment; no G2-WP-08 Construction TASK is eligible until that planning gate materializes it.

## Preserved exclusions
Concrete vendor adapters, messaging/notification realization, DB/runtime/deployment realization, Production Readiness and DEFER/DO_NOT_BUILD findings remain excluded unless separately materialized and authorized.