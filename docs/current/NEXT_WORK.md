# Next Work — Generation 2 / G2-WP-11 Construction A

Generation 2 remains rolling-wave and dependency-safe.

## Canonically closed predecessors
G2-WP-01..G2-WP-10 are canonically closed. G2-WP-11 Planning & Materialization is integrated, and Construction A / `G2-WBS-17` is materialized as `TASK-555 -> TASK-556 -> TASK-557 -> TASK-558`.

## Integrated progress
TASK-555 is completed and integrated via PR #813 on `main@75938b00fc7b7fc1f93c83effc79f9eb82b6043a`. The merge has parents `7f49f652cf489e9d64d547523ef88aaa3429b465` and exact PR head `93b6ffb90b496a0b4c5fc2effc21809b51a00b15`.

## Current executable gate
Execute **TASK-556 — G2 observability SLI/SLO/currentness** only. TASK-556 depends on completed TASK-555 and is therefore the first dependency-safe successor. TASK-557 and TASK-558 remain blocked by their explicit predecessors. G2-WBS-18 / Construction B remains outside the current Construction A horizon until promoted by its own gate.

Preserve `Signal != ConfirmedConflict`; signal != condition != alert != incident; telemetry gaps/currentness remain visible; stale/PARTIAL/UNKNOWN evidence cannot strengthen state; provenance, population and Local/Station/Fleet qualification remain explicit.

## Evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
AI inference != authority. Preserve owner/revision/currentness, PARTIAL/UNKNOWN non-strengthening, reconcile-before-retry where applicable, source-of-truth/coexistence/residual drainage, replaceable provider qualification, Local/Station/Fleet semantics and Product Proof distinct from Production Readiness. Do not absorb G2-WP-12/13, autonomous-agent authority, direct side-effect authority, unmaterialized DEFER/DO_NOT_BUILD findings, or unrelated product scope.
