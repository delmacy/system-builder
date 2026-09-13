# Next Work — G2-WP-09 Construction A / TASK-537

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority is `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-09 owns `G2-WBS-12`, `G2-WBS-13`, `G2-WBS-14`; closed prerequisites satisfy its package entry. Internal order remains build/material -> artifact/release -> deployment/runtime.

## Materialized Construction A
`TASK-535 -> TASK-536 -> TASK-537 -> TASK-538`.

TASK-535 is INTEGRATED by PR #729. TASK-536 is INTEGRATED by PR #731. TASK-537 is READY. TASK-538 remains blocked by its explicit predecessor.

## Current mandatory gate
From fresh `main@9d69511b4b83e59ec9ec7b6a02fdaa622ad5d685`, execute only TASK-537 — define qualified reproducibility claims, cache lineage and residual runner/cache drainage semantics while preserving TASK-535 material lineage and TASK-536 execution-context qualification.

Do not promote TASK-538 until TASK-537 passes its declared validations, exact-head gates and integration. Do not pre-materialize G2-WBS-13/G2-WBS-14 Construction work before fresh-main Construction A Sprint Review.

## Preserved exclusions
Concrete CI/build providers, registry/deployment adapters, DB/runtime realization, apps/UI, Production Readiness, WP-10+ ownership and DEFER/DO_NOT_BUILD findings remain excluded unless separately materialized.