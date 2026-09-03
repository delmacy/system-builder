# Generation 2 — Semantic Assembly-Line Process Model

Status: USER-DIRECTED / ARCHITECTURAL MENTAL MODEL / RESEARCH AUTHORITY ONLY / NOT YET TARGET-ARCHITECTURE AUTHORITY

## Purpose

This artifact preserves a user-directed mental model for how the System Builder should understand the assembly and execution of business processes. It is intentionally architectural rather than visual: the conveyor/robotic-arm metaphor is used to expose ownership, composition, authority, state and realization boundaries that later Capability Synthesis must either KEEP, GENERALIZE, SPECIALIZE, MERGE or reject.

It does not freeze exact class names, layer counts, workflow DSL syntax or physical deployment topology.

## Core metaphor

Imagine a vehicle moving longitudinally along an assembly line. Around that line are specialized stations, sectors and robotic arms. The vehicle does not become one of those stations; it moves through a sequence of assembly stages and receives the parts, decisions, inspections and work required at each stage.

For System Builder:

```text
assembly-line item        ≈ ProcessInstance / WorkflowRun / Saga instance
assembly plan             ≈ WorkflowDefinition / process composition
longitudinal conveyor     ≈ progression of the process through stages
robotic arm / station     ≈ capability operation or human work station
factory sector            ≈ capability layer / grouping / domain sector
quality checkpoint        ≈ Gate / validation / policy / transition condition
inspection record         ≈ Evidence / provenance / decision record
part added to the car     ≈ semantic result / state transition / domain effect
robot vendor              ≈ provider realization
```

The metaphor is normative only for the relationships above. It must not cause physical-factory assumptions to leak into software semantics.

## Longitudinal process, transversal capabilities

Candidate constitutional formulation:

> **The process advances longitudinally; capabilities are accessed transversally.**

The process owns progression through its business saga. Capabilities are reusable specialist abilities that the process invokes when a stage requires them.

```text
INPUT
  │
  ▼
Saga Stage A ───────↔ Capability operations
  │
 [Gate]
  │
  ▼
Saga Stage B ───────↔ Capability operations / human work
  │
 [Gate]
  │
  ▼
Saga Stage C ───────↔ Capability operations / external providers
  │
 [Gate]
  │
  ▼
OUTPUT
```

A workflow therefore should not be reduced to `Module A → Module B → Module C`. A more accurate semantic reading is:

```text
Process stage
  → invoke required capability operation(s)
  → collect facts/effects/evidence
  → perform human/agent/external handoffs where needed
  → satisfy transition gate
  → advance to next saga stage
```

## Layers are capability sectors, not necessarily priority levels

The radial/layered visual representation may contain multiple concentric or stacked layers. Research must not assume fixed meanings such as `Layer 1 = core`, `Layer 2 = support`, `Layer 3 = advanced` unless synthesis later proves such a taxonomy useful.

A layer may eventually represent one or more of:

- capability family;
- domain sector;
- exposure boundary;
- Station scope;
- extension/provider boundary;
- security/trust zone;
- maturity/profile grouping;
- operational/topological projection.

The important invariant is that the workflow can traverse multiple capability sectors while preserving one coherent process identity and execution lineage.

## Gates as saga-stage boundaries

A Gate is not merely a graphical `if` statement in this mental model. It is a declarative and auditable condition that governs whether the process may advance from one semantic stage of the saga to another.

Illustrative structure:

```text
REQUEST
  ↓
[Gate: admissible input]
  ↓
ANALYSIS
  ├─ Documents.Verify
  ├─ Risk.Calculate
  ├─ Workforce.CheckAvailability
  └─ Authorization.Evaluate
  ↓
[Gate: analysis complete + authority/evidence satisfied]
  ↓
APPROVAL
  ├─ Human work / review
  └─ Domain decision operation
  ↓
[Gate: authorized decision effective]
  ↓
EXECUTION
  ├─ provider-bound effects
  ├─ external integration
  └─ durable waits/events
  ↓
[Gate: required effects/postconditions evidenced]
  ↓
CLOSURE / OUTPUT
```

Exact Gate ownership remains a synthesis question: universal primitive, workflow specialization or a pattern composed from requirement + evaluator + transition semantics. This artifact only preserves its role as a saga-stage boundary.

## Workflow node kinds remain semantically distinct

The assembly-line model must consume the deep-research result that not every workflow node is a capability operation.

A process line may contain:

```text
OperationInvocation → CapabilityOperation
HumanWork / Approval handoff
Branch / Join / Loop
Wait / Timer / Event wait
Error / Retry / Compensation boundary
Subworkflow
Transition Gate
```

Capabilities own reusable semantic operations. Workflow owns durable orchestration/composition of those operations and control/handoff constructs. Provider/runtime mechanics realize both without taking canonical semantic ownership.

## Cumulative execution context as the evolving workpiece record

As the process advances, it accumulates legitimate knowledge, decisions, references, effects and evidence. Conceptually:

```text
C(n+1) = C(n) ⊕ O(n)
```

where `C` is the logical execution context and `O` is the typed semantic output/result of a step.

In the assembly-line metaphor, this resembles the workpiece plus its build/inspection record becoming progressively richer. However, the runtime must not implement this as one unrestricted mutable JSON bag.

Candidate invariant:

> **Context is cumulative for the workflow; each capability receives only the minimum authorized projection it needs.**

```text
CumulativeExecutionContext
          ↓
Input Projection / Binding
          ↓
Authority + Data Policy
          ↓
CapabilityOperation
          ↓
Typed result / effect / evidence
          ↓
ExecutionContext lineage
```

Secrets/credentials should normally remain referenced/outside general context; large documents/media should normally use references; provenance and revision identity must remain reconstructable.

## Human work as a production station

A human approval, review, exception resolution or physical task is analogous to a manual workstation on the line. The process can pause there durably until legitimate work is completed.

Important distinction:

- Workflow/AGWS may own the task assignment, availability, handoff, wait, escalation and completion lifecycle.
- The relevant domain/capability owns the semantic meaning and authority of a business decision such as `Purchase.Approve`.

Completing a technical task token must not automatically create the semantic business decision if the actor lacks decision authority.

This also applies to AI agents: technical ability to perform the task does not confer semantic authority.

## Providers as machinery, not process semantics

The factory may change the manufacturer/model of a robotic arm without redefining the business meaning of `install door`.

Likewise:

```text
CapabilityRequirement / CapabilityOperation
                 ↓
          Provider Binding
                 ↓
   native SB / SAP / n8n / Keycloak /
   Temporal / Camunda / cloud service / etc.
```

Candidate rule:

> **Own the semantics, delegate the mechanics.**

A provider is valuable because it allows System Builder to assemble mature, ready-made mechanics. Provider abstraction is therefore a practical reuse mechanism, not an aesthetic abstraction goal.

Provider-specific DTOs, job IDs, ARNs, webhook URLs, BPMN engine keys, pod names or credentials must not become the canonical identity of the process/capability operation.

## Two distinct forms of assembly

The metaphor exposes two scales that must remain distinct.

### 1. System assembly — design/build time

A system is formed from the business operation and the software structure required to realize it:

```text
Processes
+ Rules / invariants
+ Users / roles / authority
+ Data / entities / documents
+ Capabilities / operations
+ Interfaces / work surfaces
+ Integrations / external systems
+ Environment / topology requirements
        ↓
SystemDefinition / portable semantic definition
        ↓
Capability + Provider Resolution
        ↓
AssemblyPlan / dependency closure
        ↓
Validation
        ↓
Build / Compilation
        ↓
Release
        ↓
Deploy
        ↓
Autonomous Runtime
```

This is the factory assembling the **software system**.

### 2. Process-result assembly — runtime

Once deployed, every process instance follows its own semantic assembly line:

```text
Input
  ↓
Saga stages
  ↔ capability operations
  ↔ human/agent work
  ↔ external systems/providers
  ↓ through gates
Output / business result
```

This is the autonomous runtime assembling the **business outcome**.

The two assemblies are related but must not be collapsed. System Assembly determines what capabilities, contracts, runtime mechanics and topology exist. Process execution consumes that resolved system to produce outcomes.

## A system is an aggregate of processes and shared semantics

Candidate formation:

> **A system is a governed composition of processes, rules, people/authority, data, interfaces and capabilities, resolved into a validated, buildable, deployable and autonomous realization.**

A client system can contain many process lines:

```text
ClientSystem
  ├─ Process A
  ├─ Process B
  ├─ Process C
  └─ Process N
```

Those processes may reuse the same capability operations:

```text
Authorization.Check
Documents.Store
Notification.Send
Workforce.Assign
Payment.Verify
Search.Query
```

The process is the user's longitudinal business journey; the capability catalog is the reusable transversal specialist vocabulary.

## User experience consequence — modules need not be the cognitive navigation model

A user should not necessarily need to think in terms of `Finance Module`, `Workforce Module`, `Documents Module` or provider boundaries when performing work.

The user-facing experience can be process/task oriented:

```text
My Work
  3 approvals
  2 reviews
  1 exception
  4 physical tasks
```

The underlying process may traverse many modules/capabilities/providers invisibly.

This reinforces Adaptive Governed Work Surfaces as a projection of the enterprise/process graph: AGWS can surface the human stations where a Person/Role/Station is legitimately required without exposing internal modularity as mandatory navigation.

## Architectural separations this model must preserve

The mental model is invalid if it causes any of the following collapses:

- Process identity = provider workflow/run ID;
- Module = deployment unit/container;
- Capability = workflow stage;
- every workflow node = CapabilityOperation;
- Gate = authorization only;
- human task completion = business authority;
- execution context = unrestricted mutable payload bag;
- provider DTO = canonical semantic contract;
- system assembly = process runtime execution;
- capability layer = mandatory physical network/service boundary.

## Relationship to the three-graph model

The assembly-line interpretation should remain compatible with three distinct graphs:

1. **Semantic capability graph** — Modules → Capabilities → Operations/contracts.
2. **Operational process graph** — saga stages, operation invocations, decisions, gates, handoffs, waits, branches and outcomes.
3. **Realization graph** — provider bindings, adapters, runtime/topology/deployment realization.

The graphical UI may overlay them for comprehension, but architecture must preserve their separate identities/revisions/evidence.

## Required research and proof obligations

Before target architecture freezes this mental model, prove or falsify at least:

1. one process traverses capabilities from several layers/families without module-internal coupling;
2. a saga-stage Gate blocks advancement until declared facts/authority/evidence are satisfied;
3. replacing one provider does not change the semantic process/workflow definition when compatibility is sufficient;
4. the same capability operation is reused by two different process lines;
5. a human task can be completed technically but fails to create an effective business decision when authority is missing;
6. the workflow reconstructs cumulative context while a capability is denied unrelated sensitive fields;
7. parallel branches merge typed outputs deterministically or explicitly surface conflict;
8. a simple system can collapse many modules/capabilities into one runtime while preserving semantic ownership;
9. the same system can later split/replicate realization without changing the process semantics;
10. a client system is built/deployed from processes + rules + authority + data + capabilities and then executes those processes with the Builder control plane unavailable;
11. a brownfield process can use an external SAP/legacy capability as one station and SB-native capabilities as others;
12. AGWS can derive a person's work surface from human stations across multiple process lines without granting broader authority.

## Synthesis questions

Capability Synthesis must decide:

1. Is `SagaStage` a useful first-class semantic concept, a Workflow grouping/projection, or merely explanatory language?
2. Is `Gate` universal, workflow-owned or compositional?
3. What does a capability `layer/sector` mean canonically, if anything, versus being only a UI organization mechanism?
4. Which process state belongs in Workflow execution context versus canonical domain state?
5. How are stage completion/evidence and process advancement versioned for long-running workflows?
6. How does the model handle loops, parallel branches, fan-out/fan-in and compensation without forcing a linear conveyor interpretation?
7. How are processes shared/subcomposed and how are cross-process dependencies represented?
8. How does the system compiler calculate the capability/provider/dependency closure from the set of processes, rules, users/authority and data definitions?
9. How do AGWS, APIs, agents and external events invoke the same operation vocabulary without bypassing process authority/invariants?
10. Which parts of this metaphor should remain documentation/UX concepts rather than universal IR primitives?

## Relationship to other Generation 2 artifacts

This model must be reconciled with:

- `SYSTEM_BUILDER_SUITE_COMPOSITION_FORMATION.md`;
- `EXECUTABLE_CAPABILITY_COMPOSITION_AND_CUMULATIVE_CONTEXT.md`;
- `DEEP_RESEARCH_EXECUTABLE_OPERATION_COMPOSITION_01.md`;
- Process & Application Modeling;
- Workflow & Durable Execution;
- Authorization / Policy / Organization / Multitenancy;
- Data / Schema / Migrations;
- Provider / Binding / Capability Negotiation;
- Topology / Build / Runtime Realization;
- Adaptive Governed Work Surfaces;
- Assembly / Build / Release / Deployment;
- autonomous runtime and brownfield integration.

## Gate consequence

Capability Synthesis and later target architecture must be able to explain, without contradiction, both:

> **How a set of processes, rules, users/authority, data and capabilities becomes a compiled/deployed autonomous system.**

and:

> **How each process in that system progresses longitudinally through saga stages/gates while consuming reusable transversal capabilities to assemble a business outcome.**

If the final architecture cannot express both scales coherently, this mental model remains unresolved and must not be silently discarded.
