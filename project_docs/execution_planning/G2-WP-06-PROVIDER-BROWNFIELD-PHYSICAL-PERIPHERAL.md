# G2-WP-06 — Provider, Brownfield & Bounded Physical/Peripheral Integration

Status: `CONSTRUCTION A REVIEWED / CONSTRUCTION B MATERIALIZED / TASK-516 READY`
Planning base: `main@74ea711940c36608cd2e351069b38f2d54807b37`
Current product main: `main@461ba9f20601aaf544b773d8f11a20dbac339e6d`
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
WBS owners: `G2-WBS-09`, `G2-WBS-23`, `G2-WBS-10`

## Package goal
Establish portable provider/binding qualification, evidence-first Brownfield assimilation, and bounded Physical/Peripheral integration semantics without treating feature/API parity as support, converting AI inference into authority, or granting generic physical actuation authority.

## Dependency and authority revalidation
G2-WP-01..05 are canonically closed. WP-06 consumes semantic/revision identity from WP-01, evidence/currentness from WP-02, authority/trust from WP-04 and canonical data/source-of-truth/coexistence/residual-drainage semantics from WP-05. Pinned Generation 2 authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, READY_FOR_WORKER_HANDOFF/PASS.

## Construction A — G2-PROVIDER-BROWNFIELD-INTEGRATION-FOUNDATION-01
Integrated dependency chain:

`TASK-510 -> TASK-511 -> TASK-512 -> TASK-513 -> TASK-514 -> TASK-515`

TASK-510..515 are integrated. TASK-515 closed the Construction A growing Product Proof by PR #667 from exact head `aa75507cc0c0de25adc6d03d9a0f930e1c6f0b89`, with Deterministic CI #1626, Heavy Product Tests #1209 and Automation Handoff #1966 PASS before squash integration.

### Construction A Sprint Review
Review base: fresh `main@461ba9f20601aaf544b773d8f11a20dbac339e6d`.

Result: `PASS WITH REQUIRED CONSTRUCTION-B HARDENING`.

Fresh integrated evidence confirms the package foundation but leaves the recovery dimension to the second required Construction Sprint: authority/currentness may degrade after a previously valid state; provider/Brownfield evidence can conflict or become revision/locality-stale; rebinding and reconnection must retain fencing and residual visibility; retry must occur only after authoritative reconciliation. This is within existing WP-06 ownership and is not new capability scope.

The repository Sprint Generation Policy requires two Construction Sprints by default/minimum and requires Construction Sprint 2 to be a bounded integrated increment derived from actual predecessor evidence. Construction B below is therefore materialized from the recovery/hardening evidence, not from task-count quota or forecast promotion.

## Construction B — G2-PROVIDER-BROWNFIELD-RECOVERY-HARDENING-01
Committed dependency-safe chain:

`TASK-516 -> TASK-517 -> TASK-518`

- TASK-516: harden provider/Brownfield recovery when currentness, revision or locality degrades; `READY`.
- TASK-517: preserve stale-authority fencing, canonical-truth uniqueness and visible residual drainage through rebinding/reconnection recovery; predecessor-gated.
- TASK-518: integrated adversarial/recovery Product Proof across Construction A+B, including bounded Physical/Peripheral recovery boundaries; predecessor-gated.

Construction B goal: prove that loss and restoration of evidence/currentness cannot manufacture support, authority, canonical identity, global truth, drained residual state, actuation authority or confirmed physical effect.

Construction B exit proof: exact-head core/heavy Product Proof demonstrates conservative degradation, explicit reconciliation, retry-after-current-authority, stale fencing, residual visibility, one canonical truth per scope/epoch, locality-qualified recovery and Physical/Peripheral boundedness.

Construction C remains `NOT MATERIALIZED`. After Construction B Sprint Review, reconstruct fresh main and materialize C only if fresh integrated evidence shows additional bounded construction is necessary for the package goal.

## Integrated invariants
Provider support is a multidimensional qualification vector, not parity inference. Evidence is binding-revision/currentness/locality-aware and distinguishes AUTHORITATIVE, OBSERVED and INFERRED. `PARTIAL/UNKNOWN/INCONCLUSIVE` do not strengthen. Stale/UNKNOWN authority-sensitive evidence requires reconcile-before-retry. Brownfield discovery remains evidence rather than authority. External IDs remain provider/scope/revision/epoch qualified; rebinding requires authoritative evidence; stale bindings cannot resurrect fenced authority; residual cohorts remain visible until drained/reconciled. Local/Station/Fleet state remains locality/currentness qualified and cannot silently become global truth. Physical/Peripheral connectivity/capability does not grant actuation authority; observation, requested intent, external owning-domain authorization and confirmed effect remain separate facts.

## Continuing invariants
Coexistence preserves one canonical source-of-truth per scope/epoch and visible residual drainage. Product Proof remains separate from Production Readiness.

## Explicit exclusions
No concrete vendor adapter, device driver, PLC/robotics/vehicle actuation, generic hardware control plane, deployment topology, production credentials, DB migration execution, UI, billing, unrelated WP-07+ work, or DEFER/DO_NOT_BUILD finding is absorbed.

## Gate
Integrate this materialization from exact fresh main, then execute only TASK-516. TASK-517 and TASK-518 remain predecessor-gated. Construction C and Package Integration & Review are not execution-eligible before Construction B is integrated and reviewed.