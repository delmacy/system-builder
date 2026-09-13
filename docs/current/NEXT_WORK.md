# Next Work — G2-WP-09 Construction A / TASK-538

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority is `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-09 owns `G2-WBS-12`, `G2-WBS-13`, `G2-WBS-14`; closed prerequisites satisfy its package entry. Internal order remains build/material -> artifact/release -> deployment/runtime.

## Materialized Construction A
`TASK-535 -> TASK-536 -> TASK-537 -> TASK-538`.

TASK-535 is INTEGRATED by PR #729. TASK-536 is INTEGRATED by PR #731. TASK-537 is INTEGRATED by PR #733 on `main@84e63a20f9dc8b11a59c3fb993351ebb2abcd47b`. TASK-538 is READY.

## Current mandatory gate
Execute only TASK-538 — integrated Construction A Product Proof across TASK-535..537. TASK-538 is proof-only and must not introduce new semantic ownership.

Require its declared validations and exact-head Deterministic CI, Heavy Product Tests and Automation Handoff before integration. Any semantic gap discovered by TASK-538 returns as bounded rework to TASK-535..537 or Sprint Review.

Do not pre-materialize G2-WBS-13/G2-WBS-14 Construction work before fresh-main Construction A Sprint Review.

## Preserved exclusions
Concrete CI/build providers, registry/deployment adapters, DB/runtime realization, apps/UI, Production Readiness, WP-10+ ownership and DEFER/DO_NOT_BUILD findings remain excluded unless separately materialized.