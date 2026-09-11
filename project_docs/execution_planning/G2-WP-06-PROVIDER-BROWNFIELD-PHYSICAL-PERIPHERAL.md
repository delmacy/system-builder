# G2-WP-06 — Provider, Brownfield & Bounded Physical/Peripheral Integration

Status: `CONSTRUCTION A ACTIVE / TASK-510..512 INTEGRATED / TASK-513 READY`
Planning base: `main@74ea711940c36608cd2e351069b38f2d54807b37`
Current product main: `main@a6250f5f4624d99da22f68b9a6b93efd1a727a94`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
WBS owners: `G2-WBS-09`, `G2-WBS-23`, `G2-WBS-10`

## Package goal
Establish portable provider/binding qualification, evidence-first Brownfield assimilation, and bounded Physical/Peripheral integration semantics without treating feature/API parity as support, without converting AI inference into authority, and without granting generic physical actuation authority.

## Dependency and authority revalidation
G2-WP-01..05 are canonically closed. WP-06 consumes semantic/revision identity from WP-01, evidence/currentness from WP-02, authority/trust from WP-04 and canonical data/source-of-truth/coexistence/residual-drainage semantics from WP-05. The pinned Generation 2 research authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, READY_FOR_WORKER_HANDOFF/PASS.

## Construction A — G2-PROVIDER-BROWNFIELD-INTEGRATION-FOUNDATION-01
Dependency-safe chain:

`TASK-510 -> TASK-511 -> TASK-512 -> TASK-513 -> TASK-514 -> TASK-515`

- TASK-510: multidimensional provider/binding qualification and explicit unsupported/partial/unknown semantics — `INTEGRATED` by PR #655.
- TASK-511: evidence-first Brownfield inventory/assimilation with provenance, owner/revision/currentness and AI inference != authority — `INTEGRATED` by PR #658 from authoritative head `cfb1abd4a128d07a866a8e3e068f8b1da2b7d6f4`; exact-head Deterministic CI #1613 PASS and Heavy Product Tests #1188 PASS.
- TASK-512: external identity reuse/rebinding protection and coexistence/source-of-truth lineage — `INTEGRATED` by PR #660 from authoritative head `f626839f8982dabc93cf86cf76de087cfdf4fc0f`; exact-head Deterministic CI #1616 PASS and Heavy Product Tests #1193 PASS.
- TASK-513: locality-aware local/Station/Fleet truth and reconciliation boundaries — `READY` after TASK-512 integration.
- TASK-514: bounded Physical/Peripheral integration/governance contracts without generic actuation authority — predecessor-gated.
- TASK-515: integrated positive/negative/adversarial/recovery Product Proof across TASK-510..514 — predecessor-gated.

Construction B and C are `NOT MATERIALIZED`; they may be materialized only from fresh-main evidence after Construction A Sprint Review.

## Integrated invariants
Provider support is a qualification vector, not a boolean inferred from API/feature parity. Qualification evidence is binding-revision/currentness aware and distinguishes AUTHORITATIVE, OBSERVED and INFERRED authority. `PARTIAL/UNKNOWN/INCONCLUSIVE` never strengthen to supported. Stale or UNKNOWN authority-sensitive evidence requires reconcile-before-retry. Provider-realization identity does not replace canonical semantic identity. Brownfield discovery is evidence, not authority; evidence carries provenance, owner, revision/currentness and locality, and stale/conflicting/UNKNOWN evidence remains visible rather than silently replacing canonical truth. External identifiers remain provider/scope/revision/epoch qualified; reuse/rebinding requires explicit authoritative evidence, stale bindings cannot resurrect fenced authority, and residual binding cohorts remain visible until drained/reconciled.

## Continuing invariants
Coexistence preserves one canonical source-of-truth per scope/epoch and visible residual drainage. Local/Station/Fleet truth is locality-qualified and reconciliation-aware. Physical/Peripheral scope covers integration, observation, qualification and governance only; no generic physical actuation authority is created. Product Proof remains separate from Production Readiness.

## Explicit exclusions
No concrete vendor adapter, device driver, PLC/robotics/vehicle actuation, generic hardware control plane, deployment topology, production credentials, DB migration execution, UI, billing, unrelated WP-07+ work, or DEFER/DO_NOT_BUILD finding is absorbed.

## Gate
TASK-513 is the current dependency-safe Construction A gate. Execute only TASK-513 from fresh main and preserve one authoritative commit per TASK where required.
