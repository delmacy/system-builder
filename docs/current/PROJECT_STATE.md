# Project State

Date: 2026-09-16

## Generation 2 — G2-WP-11 PLANNING & MATERIALIZATION
G2-WP-01..G2-WP-10 are CANONICALLY CLOSED. G2-WP-10 Documentation & Closure integrated via PR #804; post-closure authority reconciliation integrated via PR #809. Fresh-main DAG revalidation promoted only G2-WP-11 Planning & Materialization via PR #810.

## Current commitment horizon
The authoritative planning ref is `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`. `RESEARCH_PIPELINE_STATE.json` is `READY_FOR_WORKER_HANDOFF`. Work Package Design assigns G2-WP-11 to `G2-WBS-17` Observability/Incident/Reconciliation Operations and `G2-WBS-18` Developer/Operator/Self-hosting Surfaces. Its typed prerequisites are WP-01, WP-04, WP-06, WP-07, WP-08 and WP-09; all are canonically closed.

The current gate is G2-WP-11 Planning & Materialization. Planning must derive the actual Construction Sprint/TASK decomposition from WBS-17/WBS-18 and current repository truth, materialize only dependency-safe work, make only the first eligible Construction TASK READY, and leave successors blocked by their declared predecessors. No Construction starts from successor promotion alone.

## Preserved truth
`Signal != ConfirmedConflict`; signal != condition != alert != incident. Telemetry gaps/currentness remain visible. Reconciliation evidence is population-qualified. Command/API/job ACK != converged effect. Emergency/manual operator paths preserve authority/evidence and reconnect reconciliation. Projection != canonical truth; visibility != authority != action eligibility; AI inference != authority. Source, candidate and canonical identity/revision/currentness remain distinct. Stale/PARTIAL/UNKNOWN/INCONCLUSIVE/CONFLICTED remain explicit and non-strengthening. Local/Station/Fleet qualification is preserved. Product Proof remains distinct from Production Readiness.

## Package boundary
G2-WP-11 covers only its materialized WBS-17/WBS-18 observability, incident, reconciliation and operator-surface slices. G2-WP-12/13, autonomous-agent authority, generic direct side-effect authority, Production Readiness claims and unmaterialized DEFER/DO_NOT_BUILD findings remain excluded.

## CI evidence truth
PR #810 integrated successor promotion on `main@3b9a5f7dc41ef1500912f581b567c55b18e89442`. Exact-head evidence remains distinct from synthetic merge-candidate evidence. Workflow changes require Workflow Lint, and `npm run verify` includes `check:docs`.
