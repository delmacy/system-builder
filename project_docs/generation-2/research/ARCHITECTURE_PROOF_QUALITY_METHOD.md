# Generation 2 — Architecture Proof & Quality Method

Status: AUTHORITATIVE RESEARCH-TO-ACCEPTANCE METHOD

## Purpose

Generation 2 research must not stop at descriptive findings. Every capability, cross-cutting primitive, provider boundary and architectural hypothesis must ultimately produce explicit **proof obligations**: tests or executable acceptance scenarios that demonstrate the intended behavior, failure handling, portability, authority, evolution and quality of the architecture.

This method applies **retroactively to all previously researched capabilities** and prospectively to all future dossiers/hypotheses. Existing dossiers are not considered invalid because they predate this method, but they acquire a mandatory proof-backfill obligation before final Product Proof / Acceptance planning can close.

Research workers do not execute product code during RESEARCH_ELICITATION. They define, challenge and refine the tests that later implementation/CI/product-proof stages must execute.

## Constitutional rule

> A material architectural claim is incomplete until the project can state what observable test would prove it, what negative/adversarial test would falsify it, and what evidence would be retained.

A documentation statement such as “provider is replaceable”, “tenant is isolated”, “workflow is durable”, “build is reproducible”, or “authority is non-amplifying” is not sufficient by itself.

## Required proof classes for every capability

Each capability dossier or synthesis entry must eventually cover the applicable classes below. `N_A` is allowed only with rationale.

1. **Semantic correctness proof**
   - canonical identity/meaning is preserved;
   - required inputs/outputs/contracts are enforced;
   - domain invariants/postconditions hold.

2. **Positive functional proof**
   - representative happy-path behavior works through the real architectural path rather than only mocks/fixtures.

3. **Negative / adversarial proof**
   - invalid, stale, unauthorized, incompatible or malformed input is rejected or safely degraded;
   - forbidden side effects do not occur.

4. **Authority / security proof**
   - authentication does not imply authorization;
   - decision/evaluation authority does not imply mutation authority;
   - delegated authority is non-amplifying;
   - cross-tenant/cross-Station/cross-provider privilege escalation is prevented where applicable.

5. **Failure / resilience proof**
   - partial failure, timeout, retry exhaustion, provider outage, corrupted/stale evidence and dependency loss produce bounded behavior;
   - recovery/failover/rollback semantics are observable and do not silently change meaning.

6. **Idempotency / concurrency / ordering proof**
   - applicable operations behave correctly under duplicate, concurrent, delayed, reordered or replayed execution;
   - invariants remain protected.

7. **Version / migration / coexistence proof**
   - old and new revisions coexist when required;
   - migration/cutover/rollback preserve explicit lineage;
   - in-flight work is not silently upgraded.

8. **Provider substitution / portability proof**
   - at least two materially different realizations can satisfy the same portable semantic requirement when the capability claims provider-neutrality;
   - incompatible providers are rejected or marked partial instead of weakening mandatory semantics.

9. **Offline / autonomous closure proof**
   - if autonomy/offline operation is claimed, the exact local interpretation/execution/trust/recovery/evidence closure is sufficient without Builder control-plane availability.

10. **Observability / evidence proof**
    - desired/effective/observed states can be distinguished;
    - evidence names exact subject/revision/scope/provider/attempt/time and can express stale/unknown/inconclusive where appropriate.

11. **Determinism / reproducibility proof**
    - same declared inputs/snapshots produce the same logical resolution/artifact where deterministic behavior is claimed;
    - cache hits or provider acknowledgements are not mistaken for semantic equivalence.

12. **Performance / scalability / capacity proof**
    - only where the capability makes capacity/scaling claims;
    - test realistic load, burst, resource limits, saturation and backpressure rather than a single nominal request.

13. **Isolation / blast-radius proof**
    - applicable tenant, trust, data, runtime, provider, Station or failure-domain boundaries are experimentally shown to contain faults/access.

14. **Usability / operational simplicity proof**
    - where the product claims simple-system ergonomics, prove the simple path does not require enterprise/distributed-system ceremony;
    - where AGWS/operator workflows are involved, prove user intent can be materialized without bypassing semantic/governance boundaries.

15. **Reversibility / rollback / recovery proof**
    - show what can be reversed, what is irreversible, required checkpoints and postcondition evidence.

16. **Brownfield / interoperability proof**
    - where external systems are supported, prove semantic mapping/binding without making external provider identifiers canonical business identity.

## Per-proof minimum specification

Every material proof must eventually declare:

```text
Proof ID
Capability / primitive / hypothesis
Architectural claim
Preconditions / fixtures
Authority context
Provider/topology/profile revisions
Execution steps
Expected semantic outcome
Expected evidence
Negative/adversarial variant
Failure injection (if applicable)
Cleanup / rollback expectations
Automation level: UNIT | CONTRACT | INTEGRATION | E2E | CHAOS/FAULT | PERFORMANCE | CONFORMANCE | MANUAL-GOVERNANCE
Where it must run: deterministic CI | heavy product tests | provider conformance | deployment proof | release gate | operational drill
```

The exact taxonomy may evolve, but every proof must be reproducible enough that a later worker can implement it without inventing the acceptance criterion.

## Proof pyramid — avoid both under-testing and universal E2E

Do not convert every finding into an expensive end-to-end test. Select the lowest test layer that proves the claim, while retaining cross-capability product proofs for interactions.

Preferred layering:

- **Unit/property tests** — local invariants, deterministic functions, merge/resolution rules.
- **Contract/conformance tests** — semantic contracts, adapters, providers, schemas, compatibility profiles.
- **Integration tests** — capability-to-capability and capability-to-provider boundaries.
- **E2E product proofs** — selected high-value end-to-end journeys across multiple planes.
- **Fault/chaos tests** — partial failure, failover, network/provider loss, stale state, retries.
- **Performance/capacity tests** — only for material throughput/resource/scaling properties.
- **Security/adversarial tests** — authority, tenant isolation, injection, confused deputy, trust boundaries.
- **Migration/recovery drills** — revision coexistence, cutover, rollback, restore and forward recovery.

## Cross-capability architectural product proofs

In addition to per-capability tests, Generation 2 must maintain a small set of growing product proofs that exercise architecture interactions. Candidate mandatory journeys include:

1. **Greenfield simple system** — ProcessMirror/Recipe -> SystemDefinition -> capability resolution -> one simple runtime -> build -> release -> deploy -> autonomous operation.
2. **Provider replacement** — replace identity/storage/workflow/deployment/integration provider while preserving semantic requirement identity and proving compatibility/migration/evidence.
3. **Brownfield coexistence** — bind an existing external system to canonical capabilities/entities without forced migration.
4. **Durable workflow evolution** — in-flight run survives definition/provider/policy revision with explicit migration or historical binding.
5. **Cumulative execution context** — multiple capability operations append/provide canonical results while each receives only minimum authorized projections.
6. **Transaction/consistency** — concurrent/duplicate/distributed effects preserve business invariants and evidence.
7. **Topology simple-to-mature** — same semantic system moves from grouped runtime to split/scaled units without semantic rewrite.
8. **Tenant fleet/edge routing** — 20+ customers across shared/dedicated placements route correctly, remain isolated, and one tenant migrates without hostname/semantic change.
9. **Station/AGWS authority** — Enterprise -> Station -> Role -> Person personalization/automation cannot amplify authority; promotion and rollback retain lineage.
10. **Offline/autonomous closure** — generated runtime remains correctly interpretable/operable under its declared profile without Builder availability and later reconciles evidence.
11. **Build/release provenance** — partial build reuses unaffected artifacts while changed closure is rebuilt, signed/provenanced and deployed to exact topology revision.
12. **Failure/recovery** — provider/runtime failure produces bounded failover/recovery without silently weakening security/semantics.

These proofs should grow as synthesis reveals additional architectural junctions; avoid duplicating the same behavior across many suites.

## Retroactive backfill rule for the 25 active capabilities

Every active capability researched before this method must acquire an explicit `Proof Obligations / Quality Tests` section or equivalent entry in a canonical proof matrix before `PLANNING_E_PRODUCT_PROOF_ACCEPTANCE` can close.

Backfill may be performed incrementally during later revisits and synthesis. It must not mechanically rewrite all old dossiers in one noisy commit if a centralized matrix can preserve traceability better.

For each capability record at least:

- 3–8 highest-value proofs;
- at least one negative/adversarial proof;
- at least one provider/boundary proof where providerization is claimed;
- at least one failure/recovery proof for runtime-impacting capabilities;
- at least one version/migration proof where revisions/state exist;
- authority/security proof when capability can mutate/read protected state;
- evidence/observability proof;
- explicit `N_A` rationale for omitted proof classes.

## Synthesis and planning gates

### CAPABILITY_SYNTHESIS
Must reconcile duplicate proofs and identify reusable cross-capability conformance suites. A primitive cannot be called universal if no cross-domain proof demonstrates its reuse.

### PLANNING_A/B/C/D
Must preserve proof ownership while reconciling target architecture and migration strategy.

### PLANNING_E_PRODUCT_PROOF_ACCEPTANCE
Must convert research proof obligations into executable acceptance definitions, assigning test layer, fixture/provider needs, CI/gate location and pass/fail evidence.

### ARCHITECTURE_RECONCILIATION
Every `KEEP/HARDEN/GENERALIZE/PROVIDERIZE/INTEGRATE/REPLACE` decision must point to one or more proof obligations. `DEFER/DO_NOT_BUILD` must explain which proofs are intentionally not required.

### WBS / Work Package Design
Work Packages must carry the relevant proof obligations into Sprint/task acceptance instead of treating tests as cleanup after implementation.

## Quality characteristics to preserve

Proof selection must collectively test not only feature correctness but architectural quality:

- semantic integrity;
- modularity and ownership boundaries;
- replaceability/portability;
- determinism/reproducibility;
- security/least privilege/non-amplification;
- isolation;
- resilience/recoverability;
- observability/auditability;
- compatibility/evolvability;
- operational simplicity;
- cost/resource efficiency where material;
- accessibility/usability where relevant;
- autonomy/self-hostability where claimed.

## Anti-patterns

Do not accept these as sufficient proof:

- CI green without a test tied to the architectural claim;
- testing only generated fixtures/mocks when the real path is available;
- provider API `200 OK` as proof of domain postcondition;
- build/cache success as proof of semantic equivalence;
- deployment health as proof of business correctness;
- authentication success as proof of authorization;
- one-provider success as proof of provider-neutral architecture;
- one happy path as proof of resilience;
- documentation statements without executable or objectively inspectable evidence.
