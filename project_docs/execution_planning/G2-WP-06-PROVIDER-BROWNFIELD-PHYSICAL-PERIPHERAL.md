# G2-WP-06 — Provider, Brownfield & Bounded Physical/Peripheral Integration

Status: `PLANNED / CONSTRUCTION A MATERIALIZED`
Planning base: `main@74ea711940c36608cd2e351069b38f2d54807b37`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
WBS owners: `G2-WBS-09`, `G2-WBS-23`, `G2-WBS-10`

## Package goal
Establish portable provider/binding qualification, evidence-first Brownfield assimilation, and bounded Physical/Peripheral integration semantics without treating feature/API parity as support, without converting AI inference into authority, and without granting generic physical actuation authority.

## Dependency and authority revalidation
G2-WP-01..05 are canonically closed. WP-06 consumes semantic/revision identity from WP-01, evidence/currentness from WP-02, authority/trust from WP-04 and canonical data/source-of-truth/coexistence/residual-drainage semantics from WP-05. The exact pinned Generation 2 research authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, READY_FOR_WORKER_HANDOFF/PASS.

## Construction A — G2-PROVIDER-BROWNFIELD-INTEGRATION-FOUNDATION-01
Dependency-safe chain:

`TASK-510 -> TASK-511 -> TASK-512 -> TASK-513 -> TASK-514 -> TASK-515`

- TASK-510: multidimensional provider/binding qualification and explicit unsupported/partial/unknown semantics.
- TASK-511: evidence-first Brownfield inventory/assimilation with provenance, owner/revision/currentness and AI inference != authority.
- TASK-512: external identity reuse/rebinding protection and coexistence/source-of-truth lineage.
- TASK-513: locality-aware local/Station/Fleet truth and reconciliation boundaries.
- TASK-514: bounded Physical/Peripheral integration/governance contracts without generic actuation authority.
- TASK-515: integrated positive/negative/adversarial/recovery Product Proof across TASK-510..514.

Construction B and C are `NOT MATERIALIZED`; they may be materialized only from fresh-main evidence after Construction A Sprint Review.

## Invariants
Provider support is a qualification vector, not a boolean inferred from API/feature parity. `PARTIAL/UNKNOWN/INCONCLUSIVE` never strengthen to supported. Evidence carries provenance, owner/revision/currentness and locality; stale or UNKNOWN evidence requires reconcile-before-retry where authority could change. Brownfield discovery is evidence, not authority. External identifiers are reuse/rebinding-sensitive. Coexistence preserves one canonical source-of-truth per scope/epoch and visible residual drainage. Local/Station/Fleet truth is locality-qualified and reconciliation-aware. Physical/Peripheral scope covers integration, observation, qualification and governance only; no generic physical actuation authority is created. Product Proof remains separate from Production Readiness.

## Explicit exclusions
No concrete vendor adapter, device driver, PLC/robotics/vehicle actuation, generic hardware control plane, deployment topology, production credentials, DB migration execution, UI, billing, unrelated WP-07+ work, or DEFER/DO_NOT_BUILD finding is absorbed.

## Gate
Execute TASK-510 first from fresh main only after this Planning & Materialization PR passes exact-head gates and integrates. Preserve one authoritative commit per TASK where required.