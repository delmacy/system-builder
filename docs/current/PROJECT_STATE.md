# Project State

Date: 2026-09-14

## Generation 2 — G2-WP-10 PLANNING & MATERIALIZATION / CONSTRUCTION A MATERIALIZED
G2-WP-01..G2-WP-09 are CANONICALLY CLOSED. Fresh-main authority revalidation after post-closure reconciliation selected G2-WP-10 — Generated Experience & AI-Mediated Assistance — from the typed Work Package DAG, not numeric adjacency. Authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`.

## Current commitment horizon
G2-WP-10 owns G2-WBS-15 and G2-WBS-16. Only the first dependency-safe Construction A slice for G2-WBS-15 is materialized: `TASK-547 -> TASK-548 -> TASK-549 -> TASK-550`. TASK-547 is READY; successors are blocked by explicit predecessors. G2-WBS-16 AI-mediated assistance is not yet materialized and requires fresh-main Sprint Review.

## Preserved truth
Projection != canonical truth; visibility != authority != action eligibility. Source identity/revision/currentness and generated projection identity/revision/currentness remain distinct. Stale/PARTIAL/UNKNOWN/INCONCLUSIVE/CONFLICTED states remain explicit and non-strengthening. Generated artifacts retain source/evidence/revision lineage and are not canonicalized merely by rendering or user acceptance. Existing semantic, authority, data, workflow, provider and operability owners remain authoritative. Product Proof remains distinct from Production Readiness.

## CI evidence truth
Deterministic CI and Heavy Product Tests prove the exact PR head. Merge Candidate CI separately proves the current GitHub synthetic merge revision against current `main`; a `main` advance stales prior merge-candidate proof. Workflow changes require Workflow Lint, and `npm run verify` includes `check:docs`.

## Not materialized
G2-WBS-16 AI/model-provider invocation, prompt orchestration, autonomous agent authority, apps-wide UI redesign, persistence/DB, runtime-core, new provider adapters, WP-11+, Production Readiness and DEFER/DO_NOT_BUILD findings remain excluded unless separately materialized.
