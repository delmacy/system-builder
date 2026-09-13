# Next Work — G2-WP-09 Construction B / TASK-540

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-09 owns G2-WBS-12, G2-WBS-13 and G2-WBS-14; internal order remains build/material -> artifact/release -> deployment/runtime.

## Integrated predecessor
Construction A / G2-WBS-12 (`TASK-535 -> TASK-538`) is integrated and fresh-main Sprint Review PR #738 decided `PASS / CONSTRUCTION B REQUIRED`. TASK-539 is INTEGRATED by PR #743 on `main@71745ce78d9e9b40760a0dadc1f5d31d573cc118`.

## Materialized Construction B Sprint
`TASK-539 -> TASK-540 -> TASK-541 -> TASK-542`.

Only TASK-540 is READY. TASK-541..542 remain predecessor-gated. Execute TASK-540 only after this reconciliation head is integrated and fresh main is revalidated.

## Boundary
Do not pre-materialize G2-WBS-14 deployment/runtime. Concrete providers/registries/signing/deployment adapters, DB/runtime realization, apps/UI, Production Readiness, WP-10+ ownership and DEFER/DO_NOT_BUILD findings remain excluded.
