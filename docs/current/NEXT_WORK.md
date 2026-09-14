# Next Work — Fresh-Main Generation 2 Authority Revalidation

Generation 2 remains rolling-wave and dependency-safe.

## Closed predecessor
G2-WP-09 is `PASS / INTEGRATED / CANONICALLY CLOSED` through Documentation & Closure PR #769, merged as `main@b479c73a3900f47627352ba3e77e4b501bbf780c`.

## Current mandatory gate
Revalidate fresh `main`, `AGENTS.md`, the current `research/g2-capability-pipeline` commit, research state, WBS/dependency graph, Work Package Design and Ready for Worker Handoff. Select a successor only when those authorities identify a dependency-safe Planning & Materialization gate.

No successor is selected by this reconciliation. Numeric adjacency is insufficient authority; G2-WP-10+ Construction must not begin as a side effect of G2-WP-09 closure.

## CI evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
Do not absorb concrete providers, generalized distributed topology/traffic/scaling infrastructure, hierarchical deployment authority, DB/runtime-core rewrites, apps/UI, Production Readiness or DEFER/DO_NOT_BUILD findings without separate materialization and authorization.
