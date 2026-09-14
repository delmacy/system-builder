# Next Work — G2-WP-09 Construction C / TASK-546

Generation 2 execution remains rolling-wave and dependency-safe.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. G2-WP-09 owns G2-WBS-12, G2-WBS-13 and G2-WBS-14; internal order remains build/material -> artifact/release -> deployment/runtime.

## Integrated predecessors
Construction A / G2-WBS-12 and Construction B / G2-WBS-13 are integrated and PASS. Construction B Sprint Review PR #752 merged and decided `PASS / CONSTRUCTION C REQUIRED` with no bounded Construction B rework. Construction C TASK-543 was corrected after semantic review and integrated by PR #754. TASK-544 was corrected after semantic review and integrated by PR #758. TASK-545 was hardened for explicit prior-generation and directionally valid coexistence and integrated by PR #761 on fresh `main@11d40ff84b55b9efb95ad08d4bab1b7ffcf02f06`.

## Current gate
After this repository-memory reconciliation integrates on fresh main, execute TASK-546 only. TASK-546 is proof-only and must compose TASK-543..545 into one deterministic Product Proof without adding contracts or new semantic ownership.

## CI evidence model
For each eligible PR, keep exact-head proof (`Deterministic CI`, `Heavy Product Tests`) distinct from the current synthetic integration proof (`Merge Candidate CI`). If main advances, the prior merge-candidate evidence is stale and must be regenerated/revalidated. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
Do not absorb concrete providers, distributed topology/traffic/scaling implementation, hierarchical deployment authority, DB/runtime-core rewrites, apps/UI, Production Readiness, WP-10+ ownership or DEFER/DO_NOT_BUILD findings.
