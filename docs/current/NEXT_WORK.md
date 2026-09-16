# Next Work — Generation 2 / G2-WP-11 Construction A

Generation 2 remains rolling-wave and dependency-safe.

## Canonically closed predecessors
G2-WP-01..G2-WP-10 are canonically closed. G2-WP-11 Planning & Materialization is integrated, and Construction A / `G2-WBS-17` is materialized as `TASK-555 -> TASK-556 -> TASK-557 -> TASK-558`.

## Integrated progress
TASK-555 is completed and integrated via PR #813. TASK-556 is completed and integrated via PR #815. TASK-557 is completed and integrated via PR #818 on `main@5b994d865ba6d5454f3806a60a6a39fed0f7cd8d`. The TASK-557 exact PR head was `e92be5e4e403626f47bdbcda67739fa953e0ef7e`.

## Current executable gate
Execute **TASK-558** only. TASK-558 depends on completed and integrated TASK-557 and is therefore the first dependency-safe successor. G2-WBS-18 / Construction B remains outside the current Construction A horizon until promoted by its own gate.

Preserve `Signal != ConfirmedConflict`; signal != condition != alert != incident; telemetry gaps/currentness remain visible; stale/PARTIAL/UNKNOWN evidence cannot strengthen state; provenance, population and Local/Station/Fleet qualification remain explicit.

## Evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
AI inference != authority. Preserve owner/revision/currentness, PARTIAL/UNKNOWN non-strengthening, reconcile-before-retry where applicable, source-of-truth/coexistence/residual drainage, replaceable provider qualification, Local/Station/Fleet semantics and Product Proof distinct from Production Readiness. Do not absorb G2-WP-12/13, autonomous-agent authority, direct side-effect authority, unmaterialized DEFER/DO_NOT_BUILD findings, or unrelated product scope.
