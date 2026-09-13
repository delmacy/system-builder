# Next Work — G2-WP-09 Construction C / TASK-544

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-09 owns G2-WBS-12, G2-WBS-13 and G2-WBS-14; internal order remains build/material -> artifact/release -> deployment/runtime.

## Integrated predecessors
Construction A / G2-WBS-12 and Construction B / G2-WBS-13 are integrated and PASS. Construction B Sprint Review PR #752 merged and decided `PASS / CONSTRUCTION C REQUIRED` with no bounded rework. Construction C TASK-543 was corrected after semantic review and integrated by PR #754 with canonical deployment intent plus independent desired/observed/effective generation/currentness semantics.

## Current gate
After this reconciliation integrates on fresh main, execute TASK-544 only. TASK-544 defines provider-neutral deployment actuation outcomes, preserves APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN distinctions, and requires reconcile-before-retry for unsafe ambiguous mutation. TASK-545..546 remain predecessor-gated.

## CI evidence model
For each eligible PR, keep exact-head proof (`Deterministic CI`, `Heavy Product Tests`) distinct from the current synthetic integration proof (`Merge Candidate CI`). If main advances, the prior merge-candidate evidence is stale and must be regenerated/revalidated. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
Do not absorb concrete providers, distributed topology/traffic/scaling implementation, hierarchical deployment authority, DB/runtime-core rewrites, apps/UI, Production Readiness, WP-10+ ownership or DEFER/DO_NOT_BUILD findings.
