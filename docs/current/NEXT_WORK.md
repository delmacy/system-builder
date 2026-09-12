# Next Work — G2-WP-09 Construction A

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority is `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-09 owns `G2-WBS-12`, `G2-WBS-13`, `G2-WBS-14`; closed prerequisites satisfy its package entry. Internal order remains build/material -> artifact/release -> deployment/runtime.

## Materialized Construction A
`TASK-535 -> TASK-536 -> TASK-537 -> TASK-538`.

Only TASK-535 is READY. TASK-536..538 are blocked by explicit predecessors.

## Current mandatory gate
First integrate this Planning & Materialization head with exact-head gates green. From fresh main, execute only TASK-535 — build dependency/fetched-material identity and revision/provenance lineage.

Do not pre-materialize G2-WBS-13/G2-WBS-14 Construction work before fresh-main Construction A Sprint Review.

## Preserved exclusions
Concrete CI/build providers, registry/deployment adapters, DB/runtime realization, apps/UI, Production Readiness, WP-10+ ownership and DEFER/DO_NOT_BUILD findings remain excluded unless separately materialized.