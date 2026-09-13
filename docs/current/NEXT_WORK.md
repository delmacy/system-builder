# Next Work — G2-WP-09 Construction B Planning & Materialization

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority is `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-09 owns `G2-WBS-12`, `G2-WBS-13`, `G2-WBS-14`; closed prerequisites satisfy its package entry. Internal order remains build/material -> artifact/release -> deployment/runtime.

## Integrated Construction A
`TASK-535 -> TASK-536 -> TASK-537 -> TASK-538` is integrated. Construction A Sprint Review PR #738 is integrated on `main@3e762b18f9c8396d6df30ce9a44c82f113f1c9c2` with decision `PASS / CONSTRUCTION B REQUIRED`.

## Current mandatory gate
Revalidate the pinned research authority and materialize only the first dependency-safe Construction B Sprint for `G2-WBS-13` artifact/release/SBOM/provenance lifecycle. Preserve one authoritative commit per TASK and predecessor gating.

Do not pre-materialize `G2-WBS-14` deployment/runtime. Construction C remains optional/forecast only. Product Proof remains distinct from Production Readiness.

## Preserved exclusions
Concrete CI/build providers, registry/deployment adapters, DB/runtime realization, apps/UI, Production Readiness, WP-10+ ownership and DEFER/DO_NOT_BUILD findings remain excluded unless separately materialized.