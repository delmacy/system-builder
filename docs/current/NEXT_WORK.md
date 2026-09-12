# Next Work — G2-WP-08 Construction B Planning/Materialization

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority is `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-08 owns `G2-WBS-07`; prerequisites from WP-06/WP-07 are canonically closed.

## Integrated predecessor
Construction A `TASK-527 -> TASK-528 -> TASK-529 -> TASK-530` is fully integrated. TASK-530 landed by PR #713 as fresh main `f81362a542c38fdce7f6da9c903fbb1b6092c489` after exact-head Deterministic CI #1715, Heavy Product Tests #1303 and Automation Handoff #2285/#2288 passed.

## Current mandatory gate
Integrate the fresh-main Construction A Sprint Review. The review is PASS and determines Construction B is required. After integration, rebuild fresh main and perform bounded Construction B Planning/Materialization from pinned research/WBS authority before any Construction B product mutation.

The decomposition must remain within WP-08 ownership and address only evidence-supported residual concerns such as provider coexistence/substitution, callbacks/integration mappings, notifications, offline buffering and residual subscription/message/callback drainage. Exact TASK identities/dependencies belong to the materialization gate and must not be inferred here.

## Preserved exclusions
Do not pre-materialize Construction C or absorb concrete broker/provider SDKs, DB/runtime/deployment realization, apps/UI, Production Readiness, WP-09+ ownership or DEFER/DO_NOT_BUILD findings.
