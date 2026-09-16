# Next Work — Generation 2 / G2-WP-11 Construction A

Generation 2 remains rolling-wave and dependency-safe.

## Canonically closed predecessors
G2-WP-01..G2-WP-10 are canonically closed. G2-WP-11 Planning & Materialization is integrated, and Construction A / `G2-WBS-17` is materialized as `TASK-555 -> TASK-556 -> TASK-557 -> TASK-558`.

## Integrated progress
TASK-555 is completed and integrated via PR #813. TASK-556 is completed and integrated via PR #815 on `main@85ea814a7f4b9dc44253498bed14a9766603f211`. The TASK-556 exact PR head was `2f4f496af701f3786d939510e6a50074628878a7`; the merge has parents `710121559bafb0de470c5963d8d5fe67f3a9fd73` and that exact head.

## Current executable gate
Execute **TASK-557** only. TASK-557 depends on completed TASK-556 and is therefore the first dependency-safe successor. TASK-558 remains blocked by TASK-557. G2-WBS-18 / Construction B remains outside the current Construction A horizon until promoted by its own gate.

Preserve `Signal != ConfirmedConflict`; signal != condition != alert != incident; telemetry gaps/currentness remain visible; stale/PARTIAL/UNKNOWN evidence cannot strengthen state; provenance, population and Local/Station/Fleet qualification remain explicit.

## Evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
AI inference != authority. Preserve owner/revision/currentness, PARTIAL/UNKNOWN non-strengthening, reconcile-before-retry where applicable, source-of-truth/coexistence/residual drainage, replaceable provider qualification, Local/Station/Fleet semantics and Product Proof distinct from Production Readiness. Do not absorb G2-WP-12/13, autonomous-agent authority, direct side-effect authority, unmaterialized DEFER/DO_NOT_BUILD findings, or unrelated product scope.
