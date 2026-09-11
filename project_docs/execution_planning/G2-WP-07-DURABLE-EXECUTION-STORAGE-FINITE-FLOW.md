# G2-WP-07 — Durable Execution, Storage & Finite-Flow Semantics

Status: `PLANNING / CONSTRUCTION A MATERIALIZED`
Planning base: `main@a711231373c98b35b0338f70c20b99105ec30025`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
WBS owners: `G2-WBS-06`, `G2-WBS-08`, `G2-WBS-11`

## Package goal
Establish durable workflow/external-effect semantics, canonical document/media identity across provider copies, and units/population-qualified finite-flow semantics without collapsing attempt/delivery into effect, provider keys/hashes into canonical identity, or queue aggregates into proof of drainability.

## Dependency and authority revalidation
G2-WP-01..06 are canonically closed on fresh `main@a711231373c98b35b0338f70c20b99105ec30025`. WP-07 consumes WP-01 semantic/revision identity, WP-03 semantic analysis boundaries, WP-04 authority/trust, WP-05 canonical data/coexistence semantics, and WP-06 provider qualification only for provider-backed storage. Pinned Generation 2 authority remains `READY_FOR_WORKER_HANDOFF / PASS`.

## Construction A — G2-DURABLE-EXECUTION-FOUNDATION-01
Materialized dependency-safe chain:

`TASK-519 -> TASK-520 -> TASK-521 -> TASK-522`

Goal: establish durable execution identity/revision pinning, external-effect identity and retry/reconciliation semantics, finite-flow capacity/drainability qualification, then close the increment with integrated Product Proof.

Exit proof: in-flight work retains producing revision; `accepted != processed != converged`; effect identity remains separate from attempt/delivery identity; unsafe `UNKNOWN` requires reconciliation before retry; idempotency scope/horizon is explicit; capacity is units/population qualified; replay/recovery cannot manufacture unbounded duplicate work; declared residual populations are demonstrably drainable under stated assumptions.

Only TASK-519 is `ready` initially. TASK-520..522 remain predecessor-gated.

## Construction B forecast — G2-STORAGE-FINITE-FLOW-INTEGRATION-01
Forecast only; NOT MATERIALIZED.

Goal: add canonical document/media identity and provider-copy lifecycle semantics, integrate multipart/resumable/offline transfer and disposition with provider qualification and finite-flow constraints, and extend the growing proof across WBS-06/08/11.

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
No concrete queue/storage vendor adapter, DB migration execution, deployment topology, messaging/notification semantics owned by WP-08, UI, billing, Production Readiness, or DEFER/DO_NOT_BUILD finding is absorbed. Construction B/C and later gates remain forecast until separately promoted by fresh evidence.