# Next Work — Generation 2 / G2-WP-11 Planning & Materialization

Generation 2 remains rolling-wave and dependency-safe.

## Canonically closed predecessors
G2-WP-01..G2-WP-10 are canonically closed. G2-WP-10 Documentation & Closure integrated via PR #804 and the post-closure repository-memory reconciliation integrated via PR #809 on `main@b95c90eed62f44667579565bb33ae1eaab0a6687`.

## Authority revalidation
Fresh-main successor reconciliation revalidated the authoritative Generation 2 planning branch `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, including `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`, WBS decomposition/dependency graph, Work Package Design and Ready for Worker Handoff.

The authority is a Git branch/ref, not a directory expected on `main`. No authority reconstruction is required.

The package design assigns G2-WP-11 ownership of `G2-WBS-17` and `G2-WBS-18`: Observability, Incident, Reconciliation & Operator Surfaces. Its typed package prerequisites are WP-01, WP-04, WP-06, WP-07, WP-08 and WP-09; all are canonically closed. The WBS DAG places WBS-17/WBS-18 in the operations layer and confirms their prerequisite evidence/locality/operability/authority/trust routes are supplied by those closed predecessors. Therefore G2-WP-11 is the first dependency-safe successor after WP-10.

## Current executable gate
Execute **G2-WP-11 Planning & Materialization only** from fresh `main` before Construction. Materialization must derive the real Sprint/TASK count from `G2-WBS-17` and `G2-WBS-18`, preserve their canonical owners and typed dependencies, and make only the first dependency-safe Construction TASK READY. Do not pre-authorize a false fixed Sprint count.

G2-WP-11 closure obligations include: `Signal != ConfirmedConflict`; signal != condition != alert != incident; telemetry gaps/currentness remain visible; reconciliation evidence remains population-qualified; command/API/job ACK != converged effect; emergency/manual operator paths preserve authority/evidence and reconnect reconciliation.

## Evidence model
Exact-head proof (`Deterministic CI`, `Heavy Product Tests`) remains distinct from synthetic integration proof (`Merge Candidate CI`). If `main` advances, previous merge-candidate evidence is stale. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.

## Boundary
AI inference != authority. Preserve owner/revision/currentness, PARTIAL/UNKNOWN non-strengthening, reconcile-before-retry where applicable, source-of-truth/coexistence/residual drainage, replaceable provider qualification, Local/Station/Fleet semantics and Product Proof distinct from Production Readiness. Do not absorb G2-WP-12/13, autonomous-agent authority, direct side-effect authority, unmaterialized DEFER/DO_NOT_BUILD findings, or unrelated product scope into G2-WP-11 Planning & Materialization.
