# Generation 2 — System Builder Suite Composition Formation

Status: USER-DIRECTED / ARCHITECTURAL FORMATION HYPOTHESIS / RESEARCH AUTHORITY ONLY / NOT YET TARGET-ARCHITECTURE AUTHORITY

## Why this clarification exists

Current System Builder architecture already defines the product as an open modular suite and software factory. `ADR-0003` and the Master Blueprint primarily describe that suite along the **factory/lifecycle axis**: Mirror, Recipe, Analysis, Design, Catalog, Assembly, Validation, Compiler, Release, Deploy, Observe and Support/Evolution.

Generation 2 research independently developed a **capability/composition axis**: domain modules aggregate business semantics; capabilities expose reusable semantic operations; workflows compose operation invocations together with durable control/human-work constructs; provider bindings realize mechanics without owning portable semantics.

These two views are compatible but must not be conflated. This document makes the intended relationship explicit for research and later synthesis.

## Candidate constitutional formation

> **The complete System Builder is the reference suite of specialist capabilities and factory functions; a client system is a governed composition/projection of the subset required for its work.**

> **Capabilities define what reusable work the platform knows how to perform; workflows define how operations, decisions, handoffs, approvals, waits and control constructs cooperate to realize business processes.**

> **Providers realize mechanics; they do not redefine the semantic identity of the capability, operation or business process.**

This is a formation hypothesis to test and compress during Capability Synthesis, not a frozen class model.

## Two orthogonal suite axes

### Axis A — Factory / lifecycle suite

This is already represented by current architecture:

```text
Real operation
  → Mirror
  → Recipe
  → Analysis
  → Design / SystemDefinition
  → Catalog / Resolution
  → Assembly
  → Validation
  → Build / Compiler
  → Release
  → Deploy
  → Observe
  → Support / Evolution
```

These are specialist product/bounded-context functions used to understand, define, materialize and evolve systems. They are independently replaceable behind contracts where compatibility permits.

### Axis B — Capability / runtime suite

Generation 2 must also represent the reusable abilities from which systems are composed, for example:

```text
Identity / Authentication
Authorization / Policy
Workflow / Durable Execution
Data / Schema / Migration
Storage / Documents / Media
Integration / Automation
Notifications / Events / Messaging
Observability / Operations
Secrets / Configuration
Provider / Binding
UI / Generated Experience
Adaptive Governed Work Surfaces
AI / Agents / Approvals
and domain/business capabilities provided by modules
```

The exact taxonomy remains research-controlled. The key invariant is that the complete SB may know about/provide a broad capability suite while an individual generated/integrated client system consumes only the subset required by its definition and environment.

## Domain modules and capabilities

A domain module is not merely a deployment unit or a workflow node. Candidate rule:

> **Modules own coherent business/domain semantics; capabilities own reusable semantic abilities/mechanics.**

Illustrative example:

```text
Workforce Module
  entities / policies / domain rules
  provided capabilities
    Workforce.CheckAvailability
    Workforce.Assign
    Workforce.Release
  required capabilities
    Authorization.Check
    Notification.Send
```

Another module may reuse `Authorization.Check` and `Notification.Send` without entering Workforce internals.

A module may itself provide domain-specific capabilities. Therefore `Module → Capability` is a semantic ownership/composition relation, not a claim that every capability is globally horizontal.

## Client system as governed composition

A client system should not be understood as a clone of the complete System Builder suite.

Candidate formation:

```text
ClientSystem
  = selected domain modules
  + required/provided capabilities
  + workflow/process compositions
  + authority/policies
  + data/entity contracts
  + work surfaces / interfaces
  + integration borders
  + provider bindings
  + topology/environment realization
  + evidence/version lineage
```

For a simple maintenance system, the selected composition might contain Identity, Authorization, Workforce, Assets, Workflow, Documents and Notifications. A financial system might select a different subset. The complete SB remains the broader factory/catalog/suite that can understand and materialize both.

## Workflow as operational composition fabric

The workflow is a composition layer, not the owner of every domain rule.

The deep-research recommendation remains:

```text
Capability
  └─ CapabilityOperation

WorkflowDefinition
  └─ WorkflowNode
       ├─ OperationInvocation → CapabilityOperation
       ├─ HumanWork / Approval handoff
       ├─ Branch / Join / Loop
       ├─ Wait / Timer / Event wait
       ├─ Error / Retry / Compensation boundary
       └─ Subworkflow
```

Exact names/taxonomy are not frozen.

Important ownership rules to test:

- workflow composes operations; it does not absorb capability/domain internals;
- technical human-task completion is not automatically a semantic business decision;
- domain/capability owns the meaning and authority of a decision such as `Purchase.Approve`;
- Workflow/AGWS may own durable assignment, handoff, wait and completion lifecycle;
- an operation can be invoked from workflow, UI/AGWS, API, agent or scheduled execution without redefining its semantic identity;
- each invocation receives only the minimum authorized projection of execution context.

## Three graphs that must remain distinct

### 1. Semantic capability graph — what the system can do

```text
Modules → Capabilities → Operations → semantic contracts
```

### 2. Operational/process graph — how work happens

```text
OperationInvocation
 → decision/gate
 → human handoff/approval
 → wait/event
 → OperationInvocation
 → branch/join
 → outcome
```

### 3. Realization graph — who/how executes it

```text
Semantic requirement / operation
  → binding/admission
  → native implementation or external provider
  → adapter/runtime/topology realization
```

Examples of realizations may include Keycloak, n8n, SAP, Postgres, MinIO, Temporal/Camunda, managed cloud or native SB implementations. These examples are provider evidence, not canonical identities.

The three graphs may be projected together in tooling, but must not collapse into one object model.

## Physical topology remains independent

The capability/module composition does not determine microservice/container boundaries.

```text
semantic modules/capabilities
        ≠
deployment units/containers/processes
```

Several modules/capabilities may be colocated in one simple runtime. A high-load or trust-sensitive capability may later be split/replicated independently without changing its semantic identity. This must reconcile with the mandatory Topology / Build / Runtime Realization hypothesis.

## Full-suite and partial-suite behavior

The complete SB reference product may expose the broadest supported suite, but partial consumption must remain valid at two levels:

1. **Factory-stage partial use** — an organization may use selected SB factory applications and replace compatible stages with external tooling, as already established by ADR-0003.
2. **Client capability partial use** — a generated/integrated client system receives only capabilities/modules/interfaces/providers required by its SystemDefinition and topology, rather than shipping the complete Builder suite.

A third dimension, `Station`, may expose an authorized subset of capabilities from a parent System Builder/system while preserving higher-level invariants and delegated administration boundaries.

## Provider leverage

Provider abstraction is not aesthetic neutrality. Its product purpose is to let the SB assemble mature ready-made mechanics while owning portable intent, requirements, authority, lineage and evidence.

Candidate rule:

> **Own the semantics, delegate the mechanics.**

Therefore:

- workflow should not canonically embed an n8n webhook as business-process identity;
- authentication should not canonically become a Keycloak realm;
- topology should not canonically become a Kubernetes Pod;
- persistence should not canonically become a Postgres table shape;
- a provider-specific DTO must be confined to adapter/realization boundaries.

Provider-specific features may be exposed only through explicit compatibility/profile extensions and cannot silently weaken mandatory semantics.

## Relationship to current `SystemDefinition`

Current main already has separate collections for entities, processes/transitions, actions, capabilities, views, permissions, policies, integrations and environment requirements, while Assembly resolves capabilities/adapters/components/dependencies into a reproducible plan. This provides a compatible starting direction but does **not** yet prove the Generation 2 suite/composition grammar.

Generation 2 synthesis must decide how current `actions`, `processes`, `capabilities`, modules/domain packages and provider bindings evolve or merge into the final semantic model. Do not predeclare a schema migration from this research artifact.

## Synthesis questions

Capability Synthesis must answer at least:

1. What precisely distinguishes factory-suite modules from runtime/business capabilities and domain modules?
2. Does the term `Module` need multiple qualified meanings or one canonical semantic meaning?
3. What is the minimal portable contract for a capability and a capability-owned operation?
4. How does a client `SystemDefinition` declare required/provided/selected capabilities without importing the full SB suite?
5. How are optional capabilities and degraded profiles represented?
6. How are workflows bound to semantic operations without coupling to providers or module internals?
7. How do human tasks/approvals relate to domain decision operations and AGWS?
8. How do Stations expose authorized capability subsets without cloning ownership?
9. How does brownfield capability realization by SAP/ERP/legacy systems fit the same composition grammar as native implementations?
10. How do build/release/topology calculations materialize only the selected dependency closure?
11. How does the same operation remain invocable from workflow, UI, API, agent and automation surfaces?
12. Which exact concepts belong in the universal IR versus capability/domain/provider specializations?

## Required proof scenarios

1. **Subset-system proof:** define a complete SB capability catalog but materialize a simple client system with only its required capability/module closure; unrelated Builder/factory functions are absent from the autonomous runtime.
2. **Cross-module reuse proof:** two domain modules invoke the same semantic authorization/notification capability without direct dependency on each other's internals.
3. **Workflow composition proof:** one process combines capability operations, a human handoff/approval, wait/event and branch/join without turning orchestration constructs into fake business capabilities.
4. **Multi-surface operation proof:** the same capability operation can be invoked by workflow and an authorized AGWS/API surface while preserving semantic identity, authority requirement and evidence contract.
5. **Provider substitution proof:** one operation/process survives replacement of its provider realization without semantic workflow rewrite when mandatory profiles are compatible.
6. **Brownfield realization proof:** a required capability is realized by an existing SAP/legacy system through a governed binding while another capability is SB-native; workflow composition sees stable semantic contracts.
7. **Simple topology proof:** multiple semantic modules/capabilities run in one process/container without losing ownership/boundaries.
8. **Split topology proof:** one capability is later separated/replicated due to load/security without redefining the module/process semantics.
9. **Station subset proof:** a Station receives/exposes only an authorized subset of capabilities and cannot gain administration/canonical authority not delegated by its parent.
10. **Autonomy proof:** client runtime continues operating its selected suite composition with Builder control plane unavailable according to qualified local closure.

## Relationship to accepted architecture

This hypothesis **does not revoke ADR-0003**. It generalizes a second orthogonal meaning of suite that ADR-0003 does not currently specify:

- ADR-0003: replaceable specialist applications across the System Builder production/factory pipeline;
- Generation 2 formation hypothesis: reusable specialist capabilities/modules from which client systems and Stations are composed.

If Capability Synthesis confirms both axes as constitutional, an ADR update/new ADR should be proposed during the appropriate architecture-reconciliation/change-control phase rather than silently rewriting the accepted decision during research.

## Gate consequence

Capability Synthesis must explicitly reconcile this formation with:

- Universal Capability Architecture;
- Process & Application Modeling;
- Executable Capability Composition & Cumulative Context;
- Workflow & Durable Execution;
- Provider / Binding / Capability Negotiation;
- Assembly / Build / Release;
- Topology / Build / Runtime Realization;
- Tenant Fleet / Edge / Ingress;
- Station / AGWS authority;
- autonomous runtime and brownfield integration.

The final target architecture should be able to state in one coherent model both **what the complete System Builder suite is** and **how a much smaller client system is composed from it** without forcing the full Builder into every runtime.
