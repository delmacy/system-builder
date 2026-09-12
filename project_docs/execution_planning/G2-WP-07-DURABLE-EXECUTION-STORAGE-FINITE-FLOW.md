# G2-WP-07 — Durable Execution, Storage & Finite-Flow Semantics

Status: `CONSTRUCTION A INTEGRATED / CONSTRUCTION B MATERIALIZED`
Planning base: `main@a711231373c98b35b0338f70c20b99105ec30025`
Fresh materialization base: `main@c3f12800582f0f80ad7405c1457b59ff03ddf692`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
WBS owners: `G2-WBS-06`, `G2-WBS-08`, `G2-WBS-11`

## Package goal
Establish durable workflow/external-effect semantics, canonical document/media identity across provider copies, and units/population-qualified finite-flow semantics without collapsing attempt/delivery into effect, provider keys/hashes into canonical identity, or queue aggregates into proof of drainability.

## Dependency and authority revalidation
G2-WP-01..06 remain canonically closed. Pinned Generation 2 authority remains `READY_FOR_WORKER_HANDOFF / PASS`. WP-07 consumes WP-01 semantic/revision identity, WP-03 semantic analysis boundaries, WP-04 authority/trust, WP-05 canonical data/coexistence semantics, and WP-06 provider qualification only for provider-backed storage.

## Construction A — G2-DURABLE-EXECUTION-FOUNDATION-01
Integrated chain:

`TASK-519 -> TASK-520 -> TASK-521 -> TASK-522`

TASK-522 integrated by PR #692 on `main@c3f12800582f0f80ad7405c1457b59ff03ddf692`; exact-head `e07ae86317baa354bca760872e5ffa8f3c8a4aeb` passed Deterministic CI #1675, Heavy Product Tests #1260 and Automation Handoff #2142.

Exit proof is satisfied for the Construction A boundary: producing revision remains pinned; `accepted != processed != converged`; effect identity is distinct from attempt/delivery; unsafe UNKNOWN reconciles before retry; idempotency is scope/horizon qualified; finite-flow capacity and residual drainage are units/population/time qualified. No storage semantic ownership was introduced early.

## Construction B — G2-STORAGE-FINITE-FLOW-INTEGRATION-01
Materialized dependency-safe chain:

`TASK-523 -> TASK-524 -> TASK-525 -> TASK-526`

Goal: add canonical document/media identity and provider-copy lifecycle semantics, integrate multipart/resumable/offline transfer and disposition with provider qualification and finite-flow constraints, then close with integrated Product Proof across WBS-06/08/11.

TASK-523 alone is READY initially. TASK-524..526 are predecessor-gated.

Expected exit proof: object key/hash/provider copy never becomes canonical object identity; upload ACK does not prove durable/integrity-qualified availability; dedup does not merge authority/lifecycle; deletion/disposition covers qualified populations and residual copies; storage transfer/replay remains bounded by explicit capacity/drainage assumptions.

## Optional Construction C
Forecast candidate only; NOT MATERIALIZED. Promote only if fresh integrated evidence after Construction B proves a bounded gap necessary to the Package Goal.

## Package Integration & Review
NOT MATERIALIZED. Regress the complete WP-07 chain for revision/currentness/provenance, external-effect reconciliation, idempotency horizons, provider-copy coexistence, finite drainability, architecture/dependency fitness, trust/security and technical debt. This gate is not overflow construction.

## Documentation & Closure
NOT MATERIALIZED. Reconcile repository memory, WBS/DAG/readiness/risks/lessons, package evidence and successor eligibility. No new product behavior.

## Growing proof invariants
- in-flight execution retains its producing semantic revision;
- workflow acceptance, processing and converged external effect are distinct facts;
- effect identity is not attempt, delivery or provider-operation identity;
- stale/UNKNOWN effect state is fail-closed and reconcile-before-retry;
- idempotency is qualified by key authority, scope, payload equivalence and retention horizon;
- queue/capacity evidence carries units, population and time assumptions;
- backlog, telemetry loss and residual cohorts remain visible until drainage/reconciliation;
- provider-backed storage consumes WP-06 qualification without converting provider IDs into canonical object identity;
- Product Proof remains distinct from Production Readiness.

## Explicit exclusions
No concrete queue/storage vendor adapter, DB migration execution, deployment topology, messaging/notification semantics owned by WP-08, UI, billing, Production Readiness, or DEFER/DO_NOT_BUILD finding is absorbed. Construction C and later gates remain forecast until separately promoted by fresh evidence.