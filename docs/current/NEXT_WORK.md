# Next Work — G2-WP-09 Package Integration & Review

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-09 owns G2-WBS-12, G2-WBS-13 and G2-WBS-14; internal order remains build/material -> artifact/release -> deployment/runtime.

## Integrated construction
Construction A / G2-WBS-12 is integrated and PASS. Construction B / G2-WBS-13 is integrated and PASS. Construction C / G2-WBS-14 first Sprint `TASK-543 -> TASK-544 -> TASK-545 -> TASK-546` is integrated; TASK-546 merged by PR #764 onto `main@50ff0dd8d00a37fceed73a21954cdb0f0edf62df` after exact-head CI/Heavy and merge-candidate verification.

## Current gate
Execute G2-WP-09 Package Integration & Review only. Reconcile Construction A/B/C evidence against the package purpose, Work Package Design and pinned authority; verify repository memory, source-of-truth/coexistence/currentness boundaries and package-level residual risk; decide PASS vs bounded rework. Do not use Package Review as overflow implementation.

## CI evidence model
For any review/reconciliation PR, keep exact-head proof (`Deterministic CI`, `Heavy Product Tests`) distinct from the current synthetic integration proof (`Merge Candidate CI`). If main advances, the prior merge-candidate evidence is stale and must be regenerated/revalidated. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
Do not absorb concrete providers, generalized distributed topology/traffic/scaling infrastructure, hierarchical deployment authority, DB/runtime-core rewrites, apps/UI, Production Readiness, WP-10+ ownership or DEFER/DO_NOT_BUILD findings.
