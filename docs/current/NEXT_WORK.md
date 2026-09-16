# Next Work — Generation 2 / G2-WP-11 Post-Construction-A Reconciliation

Generation 2 remains rolling-wave and dependency-safe.

## Canonically closed predecessors
G2-WP-01..G2-WP-10 are canonically closed. G2-WP-11 Planning & Materialization is integrated, and Construction A / `G2-WBS-17`, materialized as `TASK-555 -> TASK-556 -> TASK-557 -> TASK-558`, is fully completed and integrated.

## Integrated progress
TASK-555 is completed and integrated via PR #813. TASK-556 is completed and integrated via PR #815. TASK-557 is completed and integrated via PR #818. TASK-558 is completed and integrated via PR #820 on `main@4d428dc3f81952f66c52a376c1649943e7e4c955`; the TASK-558 exact PR head was `df475495de208dfb79d381294652ccd2109d80fc`.

## Current executable gate
Perform only the fresh-main post-Construction-A reconciliation and explicit promotion/materialization decision for **G2-WBS-18 / Construction B**. G2-WBS-18 remains FORECAST and is not executable until that separate gate is materialized and integrated. Do not treat completion of TASK-558 as implicit Construction B authority.

Preserve `Signal != ConfirmedConflict`; signal != condition != alert != incident; telemetry gaps/currentness remain visible; stale/PARTIAL/UNKNOWN evidence cannot strengthen state; provenance, population and Local/Station/Fleet qualification remain explicit.

## Evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
AI inference != authority. Preserve owner/revision/currentness, PARTIAL/UNKNOWN non-strengthening, reconcile-before-retry where applicable, source-of-truth/coexistence/residual drainage, replaceable provider qualification, Local/Station/Fleet semantics and Product Proof distinct from Production Readiness. Do not absorb G2-WP-12/13, autonomous-agent authority, direct side-effect authority, unmaterialized DEFER/DO_NOT_BUILD findings, or unrelated product scope.
