# Generation 2 — System Builder Longitudinal Process Model

Status: USER-DIRECTED / ARCHITECTURAL MENTAL MODEL / RESEARCH AUTHORITY ONLY / NOT YET TARGET-ARCHITECTURE AUTHORITY

## Purpose

This document records a user-directed architectural understanding for how System Builder processes should be mentally modeled and later tested during Capability Synthesis.

The analogy is a manufacturing assembly line surrounded by specialized work cells or robotic arms. The item being assembled progresses longitudinally along the line; specialized stations contribute operations, decisions, data, evidence or human work when required; gates determine whether the evolving item is qualified to advance to the next stage.

For System Builder, the item moving along the line is not a physical product. It is the live process/saga execution and its evolving semantic state.

Candidate principle:

> **The process advances longitudinally; capabilities are consumed transversally.**

This is a conceptual formation, not a frozen runtime implementation or final primitive taxonomy.

## The assembly-line analogy

Approximate mapping:

```text
Manufacturing assembly line          System Builder
---------------------------          --------------
car under assembly                   WorkflowRun / ProcessInstance / Saga instance
assembly plan                        WorkflowDefinition / process semantics
assembly sector                      process stage / saga stage
robotic work cell                    CapabilityOperation realization
manual station                       HumanTask / review / approval handoff
part/tool supplier                   Provider / external system
quality checkpoint                   Gate / validation / policy / postcondition check
production traveler/history          execution evidence / provenance / lineage
partially assembled car              accumulated semantic process state
finished car                         process output / business outcome
```

The analogy is intentionally directional: it explains composition and progress, not physical topology. A capability does not have to be a separate process, container, service or machine merely because it appears as an independent work cell in the conceptual view.

## Longitudinal axis — process progression

The longitudinal axis represents the continuity of one business process from input to outcome.

Conceptually:

```text
INPUT
  ↓
Stage / Saga Segment 1
  ↓
Gate 1
  ↓
Stage / Saga Segment 2
  ↓
Gate 2
  ↓
Stage / Saga Segment 3
  ↓
...
  ↓
OUTPUT / BUSINESS OUTCOME
```

The axis is not necessarily one central software engine. It represents continuity of semantic execution, state, lineage, authority and evidence across the process.

A process stage may contain or invoke multiple operations before its exit condition can be satisfied.

Example:

```text
Stage: Analysis
  ├─ Documents.Verify
  ├─ Risk.Evaluate
  ├─ Workforce.CheckAvailability
  └─ Authorization.Evaluate
          ↓
     Analysis Gate
          ↓
     next stage
```

## Transversal axis — capability access

Capabilities sit around the longitudinal process as reusable specialist abilities.

A process reaches transversally into the capability suite when it needs a semantic operation, human interaction, decision, external integration or supporting function.

Illustrative view:

```text
                     capability space

          Authorization     Documents      Payment
                \               |             /
                 \              |            /
INPUT ── Stage ── Gate ── Stage ── Gate ── Stage ── OUTPUT
                 /              |            \
          Workforce        Human Work      Notification
```

Important candidate rule:

> **A workflow/process does not move from module to module as if modules were pages in a wizard. It advances through its own semantic lifecycle and invokes capabilities as needed.**

This allows the same capability operation to serve many unrelated processes without becoming owned by any one process.

## Radial layers / sectors

The graphical model may place capabilities in multiple radial layers or sectors around the longitudinal process. Additional outer layers may exist.

Possible organizational dimensions include, but are not limited to:

- core/common capabilities;
- support capabilities;
- advanced/specialized capabilities;
- domain-specific capabilities;
- external/provider-backed capabilities;
- Station-specific or tenant-exposed capabilities;
- extensions/plugins.

Research must not freeze a universal meaning such as `Layer 1 = core` or `Layer 2 = support` merely because a diagram uses that legend. Layers are initially a visualization and organization aid. Capability identity and semantic ownership must remain independent from radial position.

Candidate principle:

> **Longitudinal position expresses process progression; radial position expresses capability availability/organization, not business ownership or deployment topology.**

## Gates as saga-progression boundaries

A gate is more than a visual `if`. The longitudinal model treats gates as qualified boundaries between stages of the process/saga.

Candidate rule:

> **A saga advances through a longitudinal gate only when the required semantic conditions, authority, invariants and evidence for that transition are satisfied.**

A capability may have completed a technical attempt while the process still cannot cross the gate.

This must reconcile with deep-research findings that distinguish states such as:

```text
ATTEMPTED
ACKNOWLEDGED
LOCALLY_COMMITTED
BUSINESS_EFFECTIVE
OBSERVED / VALIDATED
```

and failure/ambiguity states such as:

```text
FAILED
CONFLICT
OUTCOME_UNKNOWN / INCONCLUSIVE
PARTIAL
COMPENSATING
COMPENSATED
```

Exact vocabulary remains subject to synthesis. The invariant is that provider acknowledgement or local technical completion is not automatically sufficient evidence to authorize process progression.

Examples of gate requirements may include:

- authorization decision valid for exact subject/action/resource/revision;
- required form/data complete and semantically valid;
- human approval by a currently authorized actor;
- external payment or settlement postcondition evidenced;
- required business invariant preserved;
- required provider effect reconciled after ambiguous acknowledgement;
- mandatory documents/evidence present;
- required failure/recovery state resolved;
- freshness and revision preconditions still valid.

## Workflow as the path through the assembly environment

A workflow is the configured route by which one process execution traverses stages, invokes operations, waits for human/external events, branches, rejoins and crosses gates.

It therefore may compose:

```text
OperationInvocation
HumanTask / handoff
Approval / semantic decision realization
Wait / timer / external event
Branch / join / loop
Gate / transition qualification
Retry / redrive / compensation / quarantine
Subworkflow / subordinate saga
```

The workflow is not the semantic owner of every operation it invokes. Capability/domain ownership remains separate.

Candidate rule:

> **Capabilities own reusable semantic work; workflow owns durable composition and progression of work.**

## Cumulative semantic execution state

The longitudinal process carries an evolving logical state/context, analogous to a product accumulating components as it moves through an assembly line.

Conceptually:

```text
C(n+1) = C(n) ⊕ O(n)
```

where `C` is the reconstructable execution context/state and `O` is a typed result/fact/evidence/reference produced by the current operation or stage.

This does not imply repeatedly copying one giant JSON payload.

The preferred research direction remains:

- cumulative logical state/context for the process;
- immutable or lineage-preserving outputs where appropriate;
- explicit namespaces/semantic identities;
- deterministic reconstruction/snapshots where required;
- minimum-authorized projection to each invoked capability;
- secrets/credentials excluded or referenced through governed handles;
- large documents/media represented by references;
- provenance for producer, revision, time and evidence;
- explicit branch/merge behavior;
- explicit schema/revision compatibility for long-lived runs.

Candidate principle:

> **The process may know cumulatively what it has legitimately learned; each capability receives only what it is authorized and needs to consume.**

## Humans as assembly stations, not module navigation

A human participant is often another work station on the longitudinal process rather than a user who must navigate module boundaries.

For example:

```text
Process A ──► approval
Process B ──► review
Process C ──► exception handling
Process D ──► physical task
                  │
                  ▼
                AGWS
```

An Adaptive Governed Work Surface may project the human work currently requiring the person's intervention across many processes, regardless of which modules/capabilities own the underlying semantics.

This supports a process-oriented user experience:

```text
My Work
  3 approvals
  2 reviews
  1 exception
  4 physical tasks
```

instead of requiring the user to understand or navigate the internal modular decomposition of the system.

The authority rule remains strict: possession of a task/handoff does not create semantic decision authority.

## Providers as equipment, not process meaning

The manufacturing analogy also clarifies provider leverage.

A production plan may require a welding capability without making the business meaning depend on one robot manufacturer. Likewise, an SB process should require a semantic capability/operation without turning a provider endpoint, job type, webhook, ARN, queue or DTO into process identity.

Candidate formation:

```text
Process need
  → CapabilityOperation requirement
  → admission / compatibility / binding
  → provider or native realization
  → semantic result + evidence
```

Examples:

```text
Payment.Settle       → provider A or provider B
Identity.Authenticate → Keycloak / Entra / other compatible realization
Integration.Sync     → n8n / native implementation / other provider
Documents.Store      → MinIO / compatible storage provider
```

The process continues to depend on semantic requirements, not provider mechanics.

Candidate principle:

> **Own the semantics; delegate the mechanics.**

## Two scales of assembly

The analogy reveals two related but distinct forms of assembly.

### 1. Design-time system assembly

System Builder forms an autonomous system from the business model:

```text
Processes
+ Rules / policies / invariants
+ Users / roles / authority
+ Data / entities / schemas
+ Capabilities / modules
+ Work surfaces / interfaces
+ Integrations
+ Provider requirements
+ Topology/environment requirements
        ↓
SystemDefinition / reconciled semantic model
        ↓
Capability resolution
        ↓
AssemblyPlan
        ↓
Validation
        ↓
Build / Compilation
        ↓
Release
        ↓
Deployment
        ↓
Autonomous client system
```

Exact contract names may evolve in Generation 2, but the distinction between semantic definition and materialization remains mandatory.

### 2. Runtime process assembly

The deployed system repeatedly produces business outcomes by executing longitudinal sagas/processes:

```text
Input
  ↓
Stage ↔ capability operations
  ↓
Gate
  ↓
Stage ↔ human/external/capability work
  ↓
Gate
  ↓
...
  ↓
Business outcome
```

Candidate principle:

> **Design-time assembly builds the system; runtime longitudinal execution builds each business outcome.**

The two must not be collapsed into the same lifecycle.

## System as an aggregate of process-bearing semantics

A generated/integrated system is not merely a set of screens or modules. Candidate formation:

```text
System
  = processes / sagas
  + rules / policies / invariants
  + users / roles / authority
  + data / entities / state
  + capabilities / operations
  + human work / work surfaces
  + interfaces / integration borders
  + provider bindings
  + topology/runtime realization
  + evidence / version lineage
```

The complete System Builder suite provides the broader catalog/factory needed to understand, resolve, validate, materialize and evolve these compositions. Each client runtime materializes only its required closure.

## Three graphs plus one longitudinal projection

Existing Generation 2 formation already distinguishes:

1. semantic capability graph — `Modules → Capabilities → Operations`;
2. operational/process graph — operation/human/control flow;
3. realization graph — binding/provider/runtime/topology.

The longitudinal model is best understood as a projection through these graphs for one process/saga execution:

```text
Longitudinal process progression
       │
       ├─ selects semantic operations from capability graph
       ├─ follows control/handoff/gate relations from process graph
       └─ invokes concrete realizations from binding/provider graph
```

The visual diagram may combine these views, but synthesis must preserve their distinct ownership and revision semantics.

## Failure and adversarial implications

The longitudinal model must survive at least these failure classes:

- capability operation succeeds technically but business postcondition is not proven;
- provider acknowledges request but effect is ambiguous;
- human task is completed by an actor whose authority became stale;
- two concurrent operations threaten the same invariant;
- branch outputs conflict at merge;
- provider changes while a long-running saga remains active;
- required evidence becomes stale before the next gate;
- Station goes offline and lacks enough qualified local closure to continue;
- compensation occurs after an irreversible external effect;
- a provider-specific result shape attempts to leak into downstream semantic state;
- a capability becomes unavailable and the process must degrade, wait, reroute or fail explicitly rather than silently weaken requirements.

## Required proof scenarios

Before the target architecture freezes this formation, demonstrate conceptually and later executably:

1. **Longitudinal progression proof:** one process crosses at least three saga stages, each consuming different capabilities, while preserving one process/run identity and evidence lineage.
2. **Gate qualification proof:** provider ACK exists but required business postcondition evidence is absent; the process must not cross the gate.
3. **Transversal reuse proof:** the same capability operation is invoked by two unrelated longitudinal processes without changing operation identity.
4. **Human station proof:** a human approval is surfaced through AGWS; task completion without current semantic authority cannot advance the saga.
5. **Layer independence proof:** move a capability between visual/radial organizational layers without changing workflow or semantic operation identity.
6. **Provider substitution proof:** replace one capability provider while preserving process semantics and historical evidence when compatibility requirements are satisfied.
7. **Context projection proof:** later stage can reconstruct prior legitimate context, while an invoked capability is denied unrelated sensitive fields.
8. **Ambiguous-effect proof:** lost acknowledgement after an external effect causes reconciliation/quarantine rather than blind progress or duplicate effect.
9. **Concurrency/invariant proof:** two parallel paths cannot both cross a gate when doing so would violate a declared business invariant.
10. **Offline Station proof:** a disconnected Station advances only through gates for which local authority/data/provider/evidence closure is qualified.
11. **Simple realization proof:** the same longitudinal model works when many capabilities are colocated in one simple runtime.
12. **Mature realization proof:** the same semantic process works when selected capabilities are distributed/replicated or externally provided.
13. **System assembly proof:** processes + rules + users/authority + data + capabilities resolve to a reproducible system assembly and autonomous deployment without embedding the complete Builder control plane.
14. **Runtime autonomy proof:** after deployment, process sagas continue with Builder unavailable according to their qualified runtime closure.

## Synthesis questions

Capability Synthesis must decide:

1. Is `Stage` / `SagaStage` a useful portable concept, a workflow specialization, or only a visualization/grouping pattern?
2. Is `Gate` a universal primitive, workflow transition specialization, policy/decision composition or pattern?
3. Which conditions must a gate reference: postconditions, invariants, authority, evidence, freshness, revision or all through a generalized requirement model?
4. How does a workflow express a longitudinal stage containing multiple operations without making the stage a monolithic executable unit?
5. How do parallel branches and multiple radial capability accesses map back into one coherent longitudinal progression?
6. How should process context distinguish domain state, execution state, evidence, references and temporary working data?
7. How are long-lived process stages/version migrations represented?
8. How does AGWS project human stations from many concurrent process sagas?
9. How does this model reconcile with transaction/consistency/concurrency requirements?
10. Which aspects are universal semantics versus UI/editor visualization conventions?
11. How should the system builder editor visualize additional radial layers without implying deployment or authority hierarchy that does not exist?
12. How does this longitudinal model compose with brownfield operations realized by external enterprise systems?

## Relationship to other Generation 2 research

This model must be reconciled with:

- `SYSTEM_BUILDER_SUITE_COMPOSITION_FORMATION.md`;
- `EXECUTABLE_CAPABILITY_COMPOSITION_AND_CUMULATIVE_CONTEXT.md`;
- Workflow & Durable Execution research;
- Process & Application Modeling research;
- Transaction / Consistency / Concurrency hypothesis and deep research;
- Provider / Binding / Capability Negotiation;
- Adaptive Governed Work Surfaces / Station authority;
- Topology / Build / Runtime Realization;
- Tenant Fleet / Edge / Ingress;
- Evidence / Provenance / Observability;
- autonomous runtime and brownfield integration.

## Candidate constitutional statements for synthesis

The following statements are intentionally candidate formulations, not accepted ADRs:

> **The process advances longitudinally; capabilities are consumed transversally.**

> **Capabilities own reusable semantic work; workflow owns durable composition and progression of work.**

> **A saga advances through a gate only when the required semantic conditions, authority, invariants and evidence are qualified.**

> **Design-time assembly builds the system; runtime longitudinal execution builds each business outcome.**

> **A system is a governed composition of processes, rules, authority, data, capabilities, interfaces and realization constraints that System Builder can validate, build, deploy and evolve.**

## Gate consequence

Capability Synthesis and later target architecture must explicitly disposition this longitudinal formation. If retained, the target architecture must preserve the distinction among process progression, capability access, provider realization and physical topology, and must produce acceptance proofs for longitudinal gate qualification, transversal capability reuse, human work, context lineage, provider substitution, concurrency/invariants and runtime autonomy.
