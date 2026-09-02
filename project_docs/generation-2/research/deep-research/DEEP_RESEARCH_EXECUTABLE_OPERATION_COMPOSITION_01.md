# Deep Research — Executable Operation Composition 01

Status: DEEP RESEARCH / RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

Should Generation 2 treat a capability-owned semantic operation as the reusable executable unit that workflows compose, while keeping workflow control constructs (human handoff, approval/wait, branch, retry, compensation) distinct from provider mechanics and from the operation itself?

This deep dive tests the mandatory `Executable Capability Composition & Cumulative Execution Context` hypothesis, especially the proposed chain:

`Module → Capability → CapabilityOperation → WorkflowNode → CumulativeExecutionContext → authorized projection → Provider/Adapter realization`.

## Why this is architecturally material

If the workflow node is allowed to own arbitrary provider calls or module internals, business process identity becomes coupled to runtime/provider mechanics. If every workflow control construct is forced to masquerade as a business capability operation, the semantic catalog becomes polluted by orchestration mechanics. If the whole module is the executable unit, reuse and minimum-authority projection become too coarse.

The question therefore controls several Generation 2 boundaries at once: Capability vs Workflow ownership, provider substitution, human work/AGWS, authorization, cumulative context, evidence, durable evolution and brownfield integration.

## SB corpus consumed

- `RESEARCH_PIPELINE_STATE.json`: RESEARCH_ELICITATION remains active; Executable Capability Composition is a mandatory unresolved cross-capability hypothesis.
- `RESEARCH_EVIDENCE_METHOD.md`: requires triangulation across production systems, standards/specifications, literature and engineering evidence.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md`: already names cumulative execution context, durable workflow evolution, provider replacement and Station/AGWS authority as cross-capability product proofs.
- `concepts/EXECUTABLE_CAPABILITY_COMPOSITION_AND_CUMULATIVE_CONTEXT.md`: proposes Modules aggregate domain, Capabilities expose semantic operations, Workflows compose operations, and each operation receives only an authorized projection of cumulative context.
- Current breadth findings are treated as hypotheses, not as independent factual evidence.

## External evidence ledger

### E1 — Open Workflow Specification (CNCF lineage), current specification
Source: https://github.com/open-workflow-specification/specification/blob/main/dsl.md

The specification calls tasks the fundamental computing units of a workflow and distinguishes control/execution forms including `call`, `do`, `emit`, `for`, `fork`, `listen`, `raise`, `run`, `set`, `switch`, `try`, and `wait`. Tasks can mutate input/output and workflow context. The specification also defines reusable components and task lifecycle events.

**Evidence value:** strong provider-neutral evidence that a workflow grammar benefits from distinguishing callable work from control/data/event constructs; not every workflow node is the same semantic kind.

### E2 — Open Workflow Specification history / v1 refactor
Source: https://github.com/serverlessworkflow/specification/releases

The v1 refactor merged earlier state/action concepts into a task abstraction, added nested/composite tasks, sequential/concurrent execution, retry/timeout/error behavior, portable calls, and conformance scenarios. Later evolution explicitly moved from task context toward workflow context.

**Evidence value:** useful design-evolution evidence: workflow DSLs tend to need a small orchestration grammar plus reusable callable units and shared execution context, but this does not prove that the callable unit should own business semantics.

### E3 — Camunda 8 service tasks
Source: https://docs.camunda.io/docs/components/modeler/bpmn/service-tasks/

A BPMN service task creates a job identified by a task type; a worker performs the job and completes it. Input/output variable mappings can restrict/transform variables, while default behavior otherwise merges job variables into process variables.

**Evidence value:** production evidence for separating process-node semantics from worker realization and for explicit input/output mappings. **Negative evidence:** Camunda task type is a worker/job routing identity, not necessarily a portable business-semantic identity; SB should not universalize it as canonical capability identity.

### E4 — Camunda 8 user tasks
Source: https://docs.camunda.io/docs/components/modeler/bpmn/user-tasks/

A user task creates durable human work and pauses the process until completion. It has assignment, scheduling, variable mapping, forms and lifecycle behavior.

**Evidence value:** strong production evidence that human handoff is first-class workflow behavior and cannot be reduced to an ordinary synchronous provider call. It also supports keeping human-work realization distinct from the business operation whose progress may require that work.

### E5 — Camunda 8 message/send/compensation semantics
Sources:
- https://docs.camunda.io/docs/components/modeler/bpmn/message-events/
- https://docs.camunda.io/docs/components/modeler/bpmn/send-tasks/
- https://docs.camunda.io/docs/components/modeler/bpmn/compensation-handler/

Camunda distinguishes message semantics, send tasks and compensation in the model even when some share the same underlying job-worker mechanics. Compensation has explicit input/output mapping and lifecycle behavior.

**Evidence value:** the same runtime mechanic can realize different semantic node kinds. Therefore SB must not infer semantic identity from transport/worker mechanics.

### E6 — AWS Step Functions state/task model
Sources:
- https://docs.aws.amazon.com/step-functions/latest/dg/concepts-statemachines.html
- https://docs.aws.amazon.com/step-functions/latest/dg/workflow-states.html

Step Functions distinguishes Task states from flow states such as Choice, Parallel, Map, Pass, Wait, Succeed and Fail. States receive/pass data and can filter/transform input/output.

**Evidence value:** mature production convergence on separating work from control-flow constructs and explicit data-flow shaping.

### E7 — AWS Step Functions integration patterns
Source: https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html

A Task can use request/response, synchronous job waiting, or callback-token waiting. Callback tasks can pause for a human approval, third-party system or legacy process; timeout/heartbeat behavior is explicit.

**Evidence value:** the same logical orchestration point may have materially different completion protocols. Completion protocol belongs to workflow/realization semantics and should not contaminate the portable business operation identity.

### E8 — Workflow Patterns literature lineage
Representative corpus: Workflow Patterns initiative (van der Aalst et al.), https://www.workflowpatterns.com/

The workflow-patterns body separates control-flow, data, resource and exception concerns and documents recurring patterns such as synchronization, multiple instances, cancellation and data visibility.

**Evidence value:** academic/industrial lineage supports avoiding a single undifferentiated “action” abstraction for all workflow concerns. Control, data, resource/human assignment and exception semantics are orthogonal enough to require explicit modeling.

## Competing models

### Model A — Every workflow node is a CapabilityOperation

`WorkflowNode.operationRef` is mandatory; approvals, waits, branches, merges, timers and human handoffs are all represented as operations.

**Strength:** one uniform execution abstraction.

**Failure:** pollutes the capability catalog with orchestration grammar (`Wait`, `Fork`, `Merge`, `Choice`) and obscures whether a node expresses business/system effect or merely controls execution. It also makes provider substitution ambiguous because a `Wait` is normally runtime semantics, not a business capability.

**Disposition:** REJECT as universal rule.

### Model B — Workflow owns arbitrary actions/provider calls

Workflow nodes embed code, HTTP calls, job types, webhooks or provider-native actions directly.

**Strength:** maximum local flexibility and easy initial implementation.

**Failure:** provider mechanics become process identity; replacement/migration requires semantic workflow rewrite; authorization/evidence contracts become ad hoc; external DTOs leak into cumulative context.

**Disposition:** DO_NOT_BUILD as canonical architecture; allow only explicitly bounded escape-hatch/provider-extension semantics if later justified.

### Model C — Capability-owned semantic operations + workflow-owned orchestration grammar

Capabilities expose reusable semantic operations. Workflow nodes either (a) invoke/bind an operation or (b) express orchestration semantics such as branch, join, wait, human handoff/approval, event wait, retry/error boundary or subworkflow composition. Provider bindings realize operations and, separately, the workflow runtime realizes orchestration mechanics.

**Strength:** preserves business semantic identity while acknowledging that not all nodes are business operations. Supports provider replacement, human work, durable waiting and explicit minimum-data projection.

**Risk:** requires disciplined boundary between “operation” and “workflow construct”; approval can be either a domain decision operation or merely a human task depending on semantics.

**Disposition:** strongest model; KEEP/GENERALIZE as synthesis recommendation.

### Model D — Workflow task is the universal primitive; capability operation is unnecessary

A generic Task has type/metadata and all meaning is supplied by configuration.

**Strength:** resembles portable workflow DSLs and minimizes primitive count.

**Failure:** workflow-task identity is optimized for orchestration, not stable cross-workflow business capability identity. It weakens the ability to reuse one semantic operation outside a workflow (API, UI action, agent tool, scheduled execution) and encourages realization-specific task types to become canonical.

**Disposition:** retain `Task/Node` as workflow primitive but do not merge away capability-owned operation semantics.

## Strongest conclusion

The evidence falsifies the strongest form of the initial hypothesis — **not every WorkflowNode should be a configured CapabilityOperation**.

It simultaneously strengthens the more important architectural rule:

> **Capabilities should own reusable semantic operations; workflows should compose operation invocations together with a small explicit orchestration grammar. Provider/runtime mechanics realize both layers but do not own their semantic identity.**

Recommended conceptual split:

```text
Module
  └─ Capability
       └─ CapabilityOperation  ← reusable semantic effect/decision/result contract

WorkflowDefinition
  └─ WorkflowNode
       ├─ OperationInvocation  → CapabilityOperation
       ├─ HumanWork / Approval / Decision handoff
       ├─ Branch / Join / Loop
       ├─ Wait / Timer / Event wait
       ├─ Error / Retry / Compensation boundary
       └─ Subworkflow / composition

OperationInvocation
  ├─ authorized InputProjection
  ├─ output/result binding
  ├─ completion protocol requirement
  └─ ProviderBinding → concrete realization
```

The exact node taxonomy is not frozen by this research; synthesis should compress it aggressively.

## Approval ambiguity — important unresolved boundary

“Approval” must not automatically be one primitive with one owner.

Two distinct cases exist:

1. **Human-work orchestration:** “wait for an authorized person to perform/review something.” Workflow/AGWS owns the durable handoff and assignment lifecycle.
2. **Semantic decision:** “approve purchase order” produces a canonical business decision/evidence object with authority and postconditions. The relevant capability/domain owns that decision operation; a human task may be its realization.

Therefore:

> Human task is not automatically the business operation. It can be the realization/handoff through which a semantic decision operation is completed.

This distinction is important for AI agents too: an agent may realize a bounded task, but cannot inherit the semantic authority of the operation merely because it can technically complete the task.

## Cumulative context consequence

Production systems strongly support explicit data shaping, but they do **not** justify handing every node the whole process state. The SB hypothesis should be narrowed to:

- workflow/run maintains reconstructable logical execution state and lineage;
- operation outputs become typed results/facts/evidence or references;
- each invocation receives a declared, authorized projection;
- orchestration constructs see only the data required for their control semantics;
- provider DTOs are created at realization boundaries;
- large payloads/secrets should be referenced or excluded rather than copied into a universal context bag.

This preserves the useful cumulative-context idea without turning it into a mutable global JSON object.

## Provider-specific vs portable semantics

### Portable candidates

- stable `CapabilityOperation` identity/revision;
- semantic input/output slots;
- preconditions/postconditions/failure-result vocabulary;
- authority requirement and evidence obligation;
- operation invocation with explicit projection/binding;
- durable workflow node identity/revision;
- control constructs for branch/join/wait/handoff/error/subworkflow at an appropriately small grammar;
- execution/result lineage;
- completion protocol requirement (immediate / durable wait / callback/event) as semantic requirement rather than provider URI.

### Provider/runtime realization

- Camunda job type/worker;
- Step Functions Resource ARN and `.sync` / task-token mechanics;
- HTTP/gRPC/OpenAPI call details;
- queue/topic identifiers;
- worker polling/lease implementation;
- concrete persistence/event-history strategy;
- provider DTO/wire schema.

### Do not universalize

- BPMN XML elements as SB canonical objects;
- AWS state types or ARNs as SB canonical identity;
- Camunda `taskDefinition.type` as business operation identity;
- one provider's retry/callback token model;
- “all process variables” as operation input.

## Consequences for existing hypothesis/findings

1. **KEEP / GENERALIZE:** `CapabilityOperation` remains a strong candidate for a reusable semantic executable unit, owned by Capability rather than Workflow.
2. **SPECIALIZE:** `WorkflowNode` should be broader than `operationRef + bindings + transitions`; it must permit explicit orchestration node kinds that do not pretend to be capability operations.
3. **KEEP:** cumulative logical context + minimum authorized projection is strengthened, but context must be lineage-aware and typed, not a shared mutable DTO bag.
4. **KEEP:** Operation vs Projection vs Adapter separation is strongly supported.
5. **KEEP:** Integration Border remains distinct; internal composition must not be forced through API Gateway/HTTP.
6. **GENERALIZE:** completion semantics should be explicit enough to represent immediate request/response, durable job wait, callback/event wait and human completion without binding the workflow to one provider protocol.
7. **SPECIALIZE:** Approval must distinguish human-work lifecycle from semantic business decision. AGWS/Workflow may own handoff; domain/capability owns the decision meaning.
8. **DO_NOT_BUILD:** provider-native job/resource identifiers as canonical workflow semantics.

No top-level capability promotion is recommended from this deep dive alone.

## Failure/adversarial analysis

- **Provider replacement:** if a workflow node stores `arn:aws:states...` or Camunda job type as its semantic identity, replacement requires workflow rewrite — fail portability.
- **Confused deputy:** if human/agent task completion implies business authorization, technical completion can amplify authority — fail non-amplification.
- **Context overexposure:** if every worker receives all process variables, unrelated PII/secrets can leak — fail minimum projection.
- **Retry ambiguity:** if operation semantic idempotency is not separate from runtime retry mechanics, duplicate effects can occur — fail correctness.
- **Long-lived evolution:** if a node points only to “latest operation”, in-flight work can silently change meaning — fail revision integrity.
- **Human timeout:** if durable handoff has no explicit timeout/escalation/cancellation semantics, process can remain indefinitely unresolved — fail bounded operations.
- **External DTO contamination:** if provider response becomes canonical workflow state, provider replacement changes downstream semantics — fail provider neutrality.
- **Branch merge:** if cumulative state is an untyped mutable bag, parallel outputs can overwrite/collide nondeterministically — fail deterministic reconstruction.

## Proof obligations created/refined

### DR-EOC-01 — Same semantic operation, two workflow runtimes/providers
Define one `Payment.Settle` semantic operation and one workflow definition; realize it through two materially different execution/provider paths. Workflow semantic identity and downstream result contract must remain unchanged.

### DR-EOC-02 — Control node is not capability pollution
Model branch, wait/timer and join without creating fake business capabilities named `Wait`, `Choice` or `Join`. Evidence must still show durable node identity and execution lineage.

### DR-EOC-03 — Human approval vs semantic decision
A purchase approval workflow creates a durable human task, but completing the task without the required decision authority must not create an effective `PurchaseApproved` result. An authorized completion produces decision evidence tied to exact subject, operation revision and resource.

### DR-EOC-04 — Minimum authorized projection
Populate workflow state with identity, HR, payment and confidential document data. Invoke a notification operation that requires only recipient/template/reference. Prove unrelated HR/payment/document fields are unavailable to the operation/provider.

### DR-EOC-05 — Provider DTO containment
Change a payment provider request/response schema while preserving canonical operation input/output and workflow definition. Only binding/adapter realization may change.

### DR-EOC-06 — Retry/idempotency separation
Inject worker timeout after external effect but before workflow acknowledgement. Runtime retry must not duplicate the business effect when operation semantics require idempotency; evidence distinguishes attempt from effective result.

### DR-EOC-07 — In-flight operation revision
Start a long-lived run bound to operation revision N; publish N+1. The in-flight node must remain on N unless an explicit compatible migration is authorized/evidenced.

### DR-EOC-08 — Deterministic parallel merge
Two branches produce typed outputs with distinct semantic identities; deterministic merge succeeds. A conflicting write to a single-owner semantic slot must be rejected/qualified rather than last-write-wins silently.

### DR-EOC-09 — Callback/handoff provider substitution
Realize the same durable external/human wait first via one callback mechanism and then another. Completion protocol requirement and semantic result remain stable; provider token/queue identifiers do not escape into canonical process definition.

### DR-EOC-10 — Non-workflow reuse
Invoke the same capability operation from a workflow, an authorized generated UI action and an agent/tool boundary. All three must use the same semantic contract/authority/evidence requirements, proving the operation is not workflow-owned.

## Unresolved questions

1. Whether `CapabilityOperation` is the final name or merges with an existing canonical action/operation primitive after repository reconciliation.
2. Minimum workflow control grammar: BPMN richness should not be copied wholesale, but branch/join/wait/event/error/handoff/subworkflow appear structurally unavoidable.
3. Whether semantic decisions deserve a universal `Decision` specialization or remain domain/capability operations with evidence.
4. Exact ownership of compensation: workflow control construct, operation-declared compensability, or both (declaration + orchestration).
5. Exact cumulative-context storage model and branch/merge algebra; this requires deeper distributed-data/transaction research.
6. How workflow/runtime conformance profiles express unsupported completion protocols without silently weakening semantics.

## Confidence

**HIGH** for the separation between semantic operation and provider mechanics, and for distinguishing work nodes from control-flow constructs.

**MEDIUM-HIGH** that a capability-owned operation should survive synthesis as a universal/cross-cutting primitive; final naming/ownership must still be reconciled with existing SB actions and repository architecture.

**MEDIUM** for the exact workflow-node taxonomy and cumulative-context merge semantics; these need further cross-checking with transaction/data/evolution research.

## Proposed dispositions for synthesis

- `CapabilityOperation`: **KEEP / GENERALIZE**, pending merge check against existing Action/Operation primitives.
- `WorkflowNode`: **KEEP / SPECIALIZE** as invocation-or-control node, not operation-only.
- `CumulativeExecutionContext`: **KEEP / GENERALIZE** as typed, lineage-aware logical execution state with minimum authorized projections; reject mutable global-bag interpretation.
- `InputProjection/Binding`: **KEEP**.
- provider DTO/job/resource identity in workflow semantics: **DO_NOT_BUILD**.
- human task = semantic approval: **DO_NOT_GENERALIZE**; separate handoff realization from decision meaning.
- Integration Border: **KEEP**, without forcing internal calls through gateway.

## Recommended next deep question

Deep-research the unresolved **transaction/consistency boundary across composed operations**: when an operation reports success, what evidence is sufficient to distinguish attempted, acknowledged, committed/effective and externally observed postconditions across local transactions, outbox/event delivery, sagas/compensation and provider APIs? This directly determines safe workflow transitions and the semantics of `CapabilityOperation` results.