# Generation 2 — Research Hypothesis: Executable Capability Composition & Cumulative Execution Context

Status: USER-DIRECTED / MANDATORY CROSS-CAPABILITY RESEARCH HYPOTHESIS / NOT YET A PROMOTED CAPABILITY

## Why this exists

Current Generation 2 research already separates semantic capability requirements, provider/binding realization, workflow semantic revision/run, integration delivery, authority and evidence. A remaining architectural gap is that these pieces are not yet consolidated into one explicit executable composition grammar for generated systems.

The hypothesis to test is:

`Module → Capability → CapabilityOperation → WorkflowNode → CumulativeExecutionContext → Input/Output Binding → Provider/Adapter realization`

with external communication crossing explicit governed Integration Borders.

This document does **not** decide that every term above becomes a universal primitive or independent capability. Research and later synthesis must merge, rename, narrow or reject concepts where evidence warrants.

## User-directed design intent to falsify or validate

### 1. Modules aggregate domain; workflows compose executable operations

A business module should primarily aggregate coherent domain semantics, entities, rules, experiences and required/provided capabilities. Runtime workflows should not treat a whole module as the atomic executable block when a smaller semantic operation is the actual action needed.

Candidate rule:

> Modules aggregate domain. Capabilities expose reusable semantic operations. Workflows compose operations.

Example:

`Refund domain → Authorization.Check → Form.Collect → Validation.Check → Payment.Verify/Settle → Notification.Send`

The workflow should depend on semantic operation requirements rather than directly entering another module's internals.

### 2. CapabilityOperation as a possible executable semantic unit

Research whether an operation-like primitive should express at least:

- stable semantic identity/revision;
- semantic input requirements/slots;
- semantic output/result;
- preconditions;
- authority requirements;
- effects/postconditions;
- failure/result states;
- evidence obligations;
- idempotency/correlation requirements when relevant;
- required capability/provider profile without provider coupling.

Candidate shape, illustrative only:

```text
CapabilityOperation {
  semanticInput
  semanticOutput
  preconditions
  authorityRequirements
  effects
  failureSemantics
  evidenceProduced
}
```

Do not assume physical microservices. Architectural componentization must remain distinct from physical distribution.

### 3. WorkflowNode as configured use of a semantic operation

Test whether a workflow node should bind/configure a `CapabilityOperation` rather than embed provider mechanics or arbitrary module code.

Candidate shape:

```text
WorkflowNode {
  operationRef
  inputBindings
  outputBindings
  transitionRules
}
```

A node may represent authorization, form collection, validation, payment, approval, evidence, timing or another semantic operation. Determine whether `Gate` deserves a universal primitive, workflow specialization or only a pattern.

### 4. Cumulative Execution Context

The workflow should be tested as a sequence of operations over a cumulative semantic context rather than a chain of unrelated DTOs.

Conceptually:

```text
C(n+1) = C(n) ⊕ O(n)
```

where `C` is the execution context and `O` is the canonical output/result of the current operation.

Example:

```text
authentication.*
+ form.*
+ validation.*
+ payment.*
+ evidence.*
```

The context may expose a cumulative logical snapshot while storage can use deltas/event lineage rather than physically copying every prior payload at each step.

Research requirements:

- output append/enrichment versus overwrite semantics;
- namespaces/semantic identities and collisions;
- provenance of each value/result (`producer`, revision, time, evidence);
- immutable history versus mutable working state;
- branch/merge behavior in parallel workflows;
- compensation/retry/redrive semantics;
- large payload/reference handling;
- secret/credential exclusion;
- PII/sensitive-data visibility;
- retention/archival;
- schema evolution and long-lived workflow compatibility;
- deterministic reconstruction/snapshot behavior.

### 5. Minimal authorized projection for each operation

Although the logical workflow context is cumulative, an operation must not automatically receive the entire context.

Candidate rule:

> The workflow accumulates the context it legitimately knows; each operation receives only the authorized semantic projection it requires.

Test an explicit binding/projection layer:

```text
CumulativeExecutionContext
        ↓
InputBinding / Projection
        ↓
Authority + Data Policy
        ↓
CapabilityOperation input
```

The design should allow configurable source selection without allowing arbitrary JSON to erase semantic typing.

Candidate principle:

> Shape can be flexible while semantics remain typed.

### 6. DTOs are realization artifacts, not canonical authority

Test the distinction among:

- semantic contract/input-output slot;
- canonical entity/reference/result;
- projection/transformation;
- provider adapter;
- physical/wire DTO.

Provider-specific DTO shapes should be generated at the realization boundary. Replacing PicPay with another payment provider, for example, should not require changing the workflow's canonical `Payer`, `MonetaryAmount`, `BusinessReference` or `PaymentResult` semantics.

### 7. Operation vs Projection vs Adapter

Research must explicitly distinguish:

- **Operation** — performs a semantic/business/system effect or produces a new semantic result;
- **Projection** — selects/reformats already-known canonical information without pretending to create new domain meaning;
- **Adapter** — crosses a realization/system/protocol/schema boundary and normalizes external/provider representation to/from SB semantics.

Adapters must not silently become domain-semantic owners.

### 8. Integration Border / API Gateway boundary

External exposure/consumption should be explicit and declarative. Test a broader `IntegrationBorder` abstraction where API Gateway is one realization/profile, alongside event/webhook/file/queue/streaming/RPC boundaries.

Candidate principles:

> No external interface exists outside the declarative System Builder model.

> Every trust-boundary crossing is explicit, governed and observable.

Do **not** force all internal capability-to-capability calls through HTTP/API Gateway. Internal semantic composition and physical transport must remain separate decisions.

Research questions include:

- interface/exposure registry;
- declared inbound/outbound/bidirectional exposure;
- registration/materialization from `SystemDefinition` rather than uncontrolled self-registration;
- ingress normalization into canonical semantics;
- outbound provider binding/adapters;
- authentication/authorization/rate limits/versioning/observability at borders;
- egress destination/data-policy control;
- protocol-neutral semantic operation identity;
- Station/tenant/role exposure;
- provider replacement without contract contamination.

### 9. Authorization as composed semantic gate, not hard coupling

A domain/workflow should declare required authority and invoke an authorization capability/decision contract. It should not read another module's internal role tables or hard-code provider mechanics.

Example:

```text
Authorization.Check
  subject ← CurrentActor
  action ← FormA.Access
  resource ← FormA
  context ← ExecutionContext projection
```

The result should be a canonical authorization decision/evidence object. Authentication proves identity/context; authorization governs allowed action. Provider credentials cannot widen semantic authority.

### 10. Required proof scenario

Research and later synthesis must be able to explain this scenario without provider-specific leakage:

```text
[Authorization Gate: technicians only]
        ↓
[Form A]
        ↓
[Validation Gate]
        ↓
[Payment Gate]
        ↓
[Continue]
```

The logical cumulative context should evolve approximately as:

```text
After authorization:
  authentication / actor / authorization decision

After form:
  previous context + FormSubmission

After validation:
  previous context + ValidationResult

After payment:
  previous context + PaymentResult / PaymentEvidence
```

Each operation consumes only its permitted projection. If the payment provider requires a foreign schema/protocol, an adapter materializes the provider DTO at the border while canonical workflow semantics remain unchanged.

## Mandatory cross-capability research owners

The hypothesis must be stress-tested in at least these existing research areas before Capability Synthesis:

- Universal Capability Architecture — primitive ownership and whether operation/context/binding are universal or specializations;
- Process & Application Modeling — Module vs Capability vs Operation vs Process semantics;
- Workflow & Durable Execution — node/activity/run/context persistence, branching, retries, migration and long-lived revisions;
- Integration & Automation — trigger/delivery/adapters, external effects and Integration Border;
- Authorization / Policy / Organization / Multitenancy — per-operation authority, context visibility and Station exposure;
- Data / Schema / Migrations — canonical data identities, projection/binding, schema evolution and context compatibility;
- Provider / Binding / Capability Negotiation — operation requirements to provider realization without consumer/provider coupling;
- Standards / Interoperability / API Contracts — semantic contract versus wire DTO/protocol representation;
- Security / Resilience / Failure Recovery — context secrecy, replay, compensation, redrive, tamper evidence and recovery;
- Observability / Evidence / Provenance — per-output producer/revision/evidence lineage and reconstructable execution state;
- UI / Generated Experience and Adaptive Governed Work Surfaces — forms/actions as semantic operation consumers without direct domain/schema/provider mutation.

## Specific questions synthesis must answer

1. Is `CapabilityOperation` universal, workflow-owned, capability-owned, or unnecessary because an existing primitive already owns it?
2. Is `CumulativeExecutionContext` one first-class contract, a workflow specialization of shared state/evidence primitives, or an implementation concern?
3. How does context branch and merge deterministically?
4. How are conflicting outputs/namespaces handled?
5. How are secrets, credentials, PII and large documents excluded/referenced?
6. How does each node receive only minimum authorized data while debugging/audit can reconstruct the logical cumulative snapshot?
7. Which outputs are facts, decisions, evidence, references or domain mutations?
8. What distinguishes operation, projection, transformation and adapter strongly enough to prevent semantic drift?
9. Does `Gate` deserve first-class semantics or compose from operation + transition predicate/failure behavior?
10. How does a module declare required/provided capabilities without becoming the executable unit of every workflow?
11. How does provider replacement preserve workflow semantics and historical run evidence?
12. How do external interfaces register/materialize through Integration Borders without requiring all internal calls to traverse a gateway?
13. How is execution context versioned/migrated for long-lived workflows?
14. How do offline/edge runs preserve enough context, policy, adapter and evidence closure without central Builder dependency?
15. Can this composition grammar represent both native and external capabilities while preserving autonomous generated runtime?

## Candidate proof obligations

Before Generation 2 target architecture freezes this area, demonstrate conceptually and later executably:

1. same workflow definition with two different payment providers;
2. authorization provider replacement without changing business workflow semantics;
3. cumulative context reconstruction after multiple nodes without literal full-payload copying at every step;
4. node denied access to an unrelated sensitive context field;
5. schema evolution while an older workflow run remains active;
6. parallel branches add independent outputs and merge deterministically;
7. provider DTO change contained inside adapter/binding realization;
8. external inbound API/event normalized into the same semantic operation contract;
9. outbound egress blocked by data/authority policy even if technical credentials exist;
10. generated runtime continues to execute the resolved composition without Builder control-plane availability.

## Classification guidance

Do not automatically promote `Executable Capability Composition` into the active top-level taxonomy. During research, classify emerging pieces as one of:

- universal primitive;
- Workflow subcapability;
- Integration subcapability;
- Provider/Binding subcapability;
- Process/Application Modeling concept;
- cross-cutting capability candidate;
- duplicate/merge target;
- implementation detail;
- DO_NOT_BUILD.

Promotion requires the normal multi-representative evidence and structural-need rule.

## Relationship to current SB

Fresh `main` currently has `SystemDefinition` concepts for processes/transitions/actions/capabilities/views/permissions/policies/integrations and Assembly already resolves capabilities, adapters, components and dependencies. Generation 2 research separately has strong semantic-operation, provider-binding, workflow-run, integration-delivery, authority and evidence findings. The gap identified here is the absence of one explicit composition grammar connecting those areas. Full repository archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Gate consequence

`CAPABILITY_SYNTHESIS` must not finalize the executable composition model without explicitly disposing this hypothesis. The synthesis output must state what survives, what merges into existing primitives, what is domain/workflow-specific, and what is rejected/deferred, with evidence.
