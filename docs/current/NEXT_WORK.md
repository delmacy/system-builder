# Next Work — G2-WP-09 Construction C / TASK-543

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-09 owns G2-WBS-12, G2-WBS-13 and G2-WBS-14; internal order remains build/material -> artifact/release -> deployment/runtime.

## Integrated predecessors
Construction A / G2-WBS-12 and Construction B / G2-WBS-13 are integrated and PASS. Fresh-main Construction B Sprint Review PR #752 merged on `main@39a5c47d120b391b4abf5e5c137a43706c290a6f` and decided `PASS / CONSTRUCTION C REQUIRED` with no bounded rework.

## Current gate
Execute TASK-543 only after this materialization PR passes exact-head gates and integrates. TASK-543 defines canonical deployment intent plus desired/observed/effective generation semantics. TASK-544..546 remain predecessor-gated.

## Boundary
Do not absorb concrete providers, distributed topology/traffic/scaling implementation, hierarchical deployment authority, DB/runtime-core rewrites, apps/UI, Production Readiness, WP-10+ ownership or DEFER/DO_NOT_BUILD findings.
