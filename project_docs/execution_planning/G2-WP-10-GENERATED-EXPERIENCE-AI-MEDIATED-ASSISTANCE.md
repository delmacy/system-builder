# G2-WP-10 — Generated Experience & AI-Mediated Assistance

Status: PLANNING & MATERIALIZATION / ACTIVE
Base: `main@7785ea0620fa33d9c85b4dc5f33d5700a8e11897`
Authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`

## Package ownership
G2-WP-10 owns only `G2-WBS-15` (UI, low-code and generated experience) and `G2-WBS-16` (AGWS / AI-mediated generation and assistance). Package grouping does not transfer canonical ownership from semantic, identity, data, workflow, provider, operability or analytical domains.

## Revalidated typed prerequisites
The authoritative Work Package Design requires WP-01 semantic/revision, WP-02 evidence, WP-03 analytical semantics where AI proposes analytical structures, WP-04 authority/trust, WP-05 data, WP-06 provider and WP-07 semantic/operability prerequisites. G2-WP-01..G2-WP-09 are canonically closed on fresh main, so the package is dependency-safe for Planning & Materialization.

## Commitment horizon
Materialize only Construction A for `G2-WBS-15`. Construction A establishes generated-experience projection/currentness, visibility-vs-authority/action gating, stale/UNKNOWN/conflicted representation and source/evidence/revision lineage, followed by integrated Product Proof.

Chain: `TASK-547 -> TASK-548 -> TASK-549 -> TASK-550`.

Only TASK-547 is READY. TASK-548..550 remain blocked by explicit predecessors. `G2-WBS-16` AI-mediated assistance is not pre-materialized; it requires a fresh-main Sprint Review after Construction A.

## Non-strengthening invariants
- projection != canonical truth;
- visibility != authority;
- rendered/generated status cannot strengthen source status/currentness;
- stale, PARTIAL, UNKNOWN, INCONCLUSIVE and CONFLICTED remain representable and non-strengthening;
- generated actions require canonical authority and applicable workflow/domain semantics, not UI visibility;
- source/evidence/revision/currentness lineage remains inspectable;
- generated artifacts do not become canonical solely because they are rendered or accepted by a client;
- Product Proof != Production Readiness.

## Exclusions
AI model/provider invocation and prompt orchestration, autonomous agent authority, concrete UI framework rewrites, apps-wide redesign, DB/runtime-core changes, new provider adapters, WP-11 observability/operator surfaces, WP-12 governance/commercial/FinOps, Production Readiness and unmaterialized DEFER/DO_NOT_BUILD findings remain outside Construction A.
