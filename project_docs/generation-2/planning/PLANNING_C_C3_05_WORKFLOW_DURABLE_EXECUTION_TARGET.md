# Generation 2 — Planning C C3.5: Workflow & Durable Execution Target

Status: **DECIDED / PASS FOR CAPABILITY**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Capability: **Workflow & Durable Execution**  
Decision scope: canonical target architecture for capability 5/28 only.  
Entry branch head revalidated before persistence: `1a92d6b366653ef7055df5da17fc614ff4fbd0b6`.

This record decides only C3.5. It does not implement product code, choose package/storage topology, materialize WBS/TASKs, execute Construction, decide C3.6+, enter Planning D/E, perform Architecture Reconciliation, or alter any product/runtime code.

## 1. Authorities and inherited constraints

Authoritative inputs:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — C3.5 is the sole authorized next action;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- `PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`;
- `PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`;
- `PLANNING_C_C2_PHYSICAL_PERIPHERAL_INTEGRATION_BOUNDARY.md`;
- `PLANNING_C_C3_01_UNIVERSAL_CAPABILITY_ARCHITECTURE_TARGET.md`;
- `PLANNING_C_C3_02_PROCESS_APPLICATION_MODELING_TARGET.md`;
- `PLANNING_C_C3_03_UI_GENERATED_EXPERIENCE_LOW_CODE_TARGET.md`;
- `PLANNING_C_C3_04_ADAPTIVE_GOVERNED_WORK_SURFACES_TARGET.md`;
- `PLANNING_A_WORKFLOW_DURABLE_EXECUTION_BOUNDARIES.md`;
- `PLANNING_B_WORKFLOW_DURABLE_EXECUTION_SB_CURRENT_STATE.md`;
- inherited adversarial closure: 284 material edge scenarios + 124 reusable `ConflictPattern`s = 408 findings.

Constitutional invariants remain binding:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `workflow definition != workflow occurrence/execution`;
- `workflow completion != external/business postcondition proof`;
- `attempted != accepted != applied/effective != converged != validated`;
- `task visibility != task authority`;
- `retry != safe replay`;
- `parent completion != stronger child proof`;
- `provider acknowledgement != business effect`;
- `provider/runtime identity != canonical workflow identity`;
- `AI proposal = candidate`, never canonical mutation authority;
- `answered != understood != evidence sufficient != implementation-ready != production-ready`.

## 2. Decision summary

**C3.5-DEC-001 — Workflow & Durable Execution owns portable durable execution semantics for admitted executable workflow definitions; it does not own canonical business/process meaning, policy truth, external-provider semantics or generic runtime topology.**

Generation 2 adopts a provider-neutral, revision-qualified durable workflow model built around:

1. immutable/revisioned executable workflow definitions linked to canonical Process/Application semantics;
2. distinct definition, occurrence, execution, task, attempt, wait, effect and provider-realization identities;
3. portable typed control-flow IR;
4. C0 `ExecutionEnvelope + ExecutionState + ExecutionJournal` usage specialized by Workflow;
5. explicit external-effect disposition with `NOT_APPLIED | APPLIED | PARTIAL | UNKNOWN` and reconcile-before-retry;
6. in-flight revision coexistence, pinning and governed migration;
7. first-class human-task runtime semantics without absorbing authorization/UI ownership;
8. proof-domain separation for structural soundness, boundedness/termination, execution conformance, history integrity, external-effect evidence and business postconditions;
9. local/offline/Fleet currentness qualification rather than assumed global consistency;
10. capability-specific elicitation, readiness, migration and proof obligations.

The target keeps the current provider-neutral deterministic state-machine baseline as an implementation predecessor, but the target semantic contract is broader than the current mutable-state-row model and explicitly requires durable history/effect/revision semantics.

## 3. Canonical responsibilities and non-responsibilities

### 3.1 Canonical responsibilities

Workflow & Durable Execution owns:

- executable workflow definition identity and immutable revision identity;
- admission linkage from executable workflow revision to canonical Process/Application revision and transformation/generator revision;
- workflow occurrence/execution identity and lifecycle;
- portable control-flow semantics admitted for execution;
- durable current state plus append-oriented execution journal semantics;
- wait/timer/signal correlation state owned by workflow execution;
- human-task runtime instance/lifecycle state;
- execution attempts, retry/redrive eligibility and attempt lineage;
- cancellation, compensation and workflow-level recovery semantics where declared;
- child/subworkflow composition and parent-child execution lineage;
- in-flight version coexistence, workflow-specific compatibility and migration predicates;
- workflow-specific replay qualification and historical interpretation;
- workflow completion disposition and proof claims limited to the domains it can establish;
- workflow-specific residual-cohort inventory and drain predicates;
- workflow execution observability semantics sufficient to operate the capability without claiming broader business truth;
- capability-specific elicitation and readiness obligations.

### 3.2 Explicit non-responsibilities

Workflow does not own:

- canonical business/process/application meaning — Process & Application Modeling owns it;
- canonical data/schema truth or data migration semantics;
- authorization/policy/organizational permission truth;
- generic UI rendering or AGWS governed-surface composition;
- message transport/publication/delivery semantics;
- external-system adapter/provider interaction semantics;
- provider discovery/admission/binding lifecycle;
- generic deployment topology/readiness/scaling;
- generic cross-capability lifecycle orchestration;
- telemetry truth for other capabilities;
- physical/peripheral actuation authority;
- universal architecture primitives;
- AI authority to mutate executable/canonical workflow state.

## 4. Owned semantic types and foreign references

**C3.5-DEC-002 — Workflow owns durable execution-specific semantic types; neighboring truths remain typed foreign references.**

Target owned type families include:

### Definition/admission

- `ExecutableWorkflowDefinition`
- `ExecutableWorkflowRevision`
- `WorkflowAdmissionRecord`
- `WorkflowDefinitionCompatibilityProfile`
- `WorkflowRevisionDependencyProfile`

### Occurrence/execution

- `WorkflowOccurrence`
- `WorkflowExecutionRef`
- `WorkflowExecutionDisposition`
- `WorkflowExecutionCheckpoint`
- `WorkflowExecutionCohort`
- `WorkflowMigrationDecision`

### Control-flow

- `WorkflowNode`
- `WorkflowEdge`
- `WorkflowTransition`
- `ConditionRef`
- `SwitchBranch`
- `BoundedIterationSpec`
- `WaitSpec`
- `TimerSpec`
- `FanOutSpec`
- `FanInSpec`
- `CancellationSpec`
- `CompensationSpec`
- `ChildWorkflowInvocationSpec`

### Human tasks

- `HumanTaskDefinitionRef`
- `HumanTaskOccurrence`
- `HumanTaskRuntimeState`
- `HumanTaskAssignmentContextRef`
- `HumanTaskCompletionEvidenceRef`

### Attempts/effects/recovery

- `WorkflowAttempt`
- `WorkflowRetryPolicy`
- `WorkflowRedriveDecision`
- `WorkflowEffectRef`
- `WorkflowReconciliationRequirement`
- `WorkflowCancellationRecord`
- `WorkflowCompensationRecord`
- `WorkflowRecoveryRecord`

### Proof/operations

- `WorkflowProofProfile`
- `WorkflowProofClaim`
- `WorkflowOperationalReadinessProfile`
- `WorkflowQueuePressureState`
- `WorkflowSloRef`

Foreign references include Process/Application semantic definitions; Data/Schema refs; Decision/Rule/Calculation refs; units/vector/uncertainty types from owner capabilities/UCA analytical substrate; Identity and Authorization decisions; UI/AGWS task-surface refs; Integration operation/effect refs; Messaging event/delivery refs; Provider/Binding refs; Deployment/Runtime refs; Lifecycle refs; Observability evidence refs; Governance/Audit refs; C1 elicitation/coverage refs; and C2 bounded Physical/Peripheral integration refs.

Embedding a foreign reference never transfers semantic ownership.

## 5. Definition identity, occurrence identity and admission lineage

**C3.5-DEC-003 — Executable definition, admitted revision, workflow occurrence and realization identity are separate.**

A workflow execution must be interpretable from an immutable admission lineage containing at least, where applicable:

- canonical Process/Application definition and revision ref;
- executable workflow definition and immutable executable revision;
- transformation/compiler/generator revision that produced it when generated;
- provider/binding support profile and realization ref when providerized;
- schema/data compatibility dependencies;
- policy/authority dependency requirements;
- rule/decision/formula revisions used by the executable definition where pinned;
- deployment/artifact/runtime prerequisites where material;
- proof/readiness profile required for admission.

A workflow occurrence/execution is not the definition. It references the admitted definition revision through its `ExecutionEnvelope` and preserves producing revision lineage for history.

Provider run IDs, task queue names, worker IDs, container IDs, message IDs and scheduler IDs may be captured as `RealizationIdentityRef`s or evidence, but are never canonical workflow identity by equality or convenience.

## 6. Portable control-flow IR

**C3.5-DEC-004 — Workflow adopts a typed, analyzable portable control-flow IR with explicit extension boundaries.**

The portable IR supports, when admitted:

- start and terminal nodes;
- typed transitions;
- typed condition references;
- explicit switches/branches with declared default/no-match semantics;
- bounded or explicitly qualified iteration;
- durable wait and signal correlation;
- durable timer/deadline/delay semantics;
- fan-out and fan-in with declared join semantics;
- cancellation scopes;
- compensation scopes and ordering;
- child/subworkflow invocation with sync/async semantics;
- human tasks;
- integration/activity invocation through explicit foreign-owner operation refs.

Portable control-flow semantics must not be encoded as arbitrary code strings when those semantics need analysis, migration or proof. Arbitrary/provider-specific computation may occur behind an admitted operation boundary, but its hidden behavior is not treated as statically analyzable workflow structure.

Conditions, decisions and calculations preserve semantic kind and ownership. A numeric predicate derived from a calculation carries the relevant unit/dimension/vector/uncertainty qualification; workflow cannot scalarize a vector or erase uncertainty merely to make branching convenient.

## 7. Transition semantics and execution guards

**C3.5-DEC-005 — A durable transition is a governed state change under a pinned execution context, not merely a handler return.**

A transition evaluation must be able to qualify:

- current workflow execution state and revision;
- node/transition identity;
- applicable workflow definition revision;
- required authority decision/currentness refs;
- tenant/enterprise/site/Station context where material;
- referenced data/decision/calculation inputs and their currentness requirements;
- preconditions/guards;
- resulting state intent;
- external-effect plan, if any;
- evidence obligations;
- deadlines/budgets/resource constraints where declared.

Unknown or stale prerequisites yield explicit denial, block or `INCONCLUSIVE` according to owner contract; they are not defaulted to true.

A transition that becomes structurally eligible does not prove that every external/business effect has occurred. State advancement and effect disposition remain separately evidentiable.

## 8. ExecutionEnvelope, ExecutionState and ExecutionJournal

**C3.5-DEC-006 — Workflow specializes the C0 execution substrate instead of inventing a parallel history model.**

### `ExecutionEnvelope`

For Workflow, the envelope pins or references the minimal context required to interpret execution, including:

- workflow execution identity;
- admitted executable revision;
- producing Process/Application lineage;
- revision vector dependencies;
- tenant/site/Station and actor/subject context;
- authority envelope refs;
- provider binding refs;
- correlation/effect identities;
- relevant deadlines/budgets;
- proof/evidence profile requirements.

The envelope does not become an unbounded event log.

### `ExecutionState`

Workflow's current-state projection includes current node/state, outstanding waits/tasks/children, current terminal/nonterminal disposition, migration/reconciliation flags and owner-defined operational summary. It is mutable/projection-oriented and never replaces history.

### `ExecutionJournal`

Workflow requires append-oriented journal semantics sufficient to preserve:

- admitted start lineage;
- transitions/traversals;
- attempt identity and result;
- wait/timer registration/firing/cancellation;
- signal correlation decisions;
- human-task lifecycle events;
- child invocation/completion relations;
- effect dispositions/evidence refs;
- cancellation/compensation/recovery steps;
- migration decisions;
- terminal disposition and proof refs.

Compaction is permitted only when required semantic replay, audit, reconciliation, migration and proof obligations remain reconstructible through qualified archival/commitment mechanisms.

## 9. Effect identity and external mutation semantics

**C3.5-DEC-007 — Workflow completion cannot be based solely on provider/activity acknowledgement; external effects use explicit effect identity and disposition.**

For potentially mutating external operations, Workflow consumes Integration-owned operation semantics and establishes durable linkage among:

- workflow execution/step identity;
- attempt identity;
- stable effect identity/deduplication identity where supported;
- Integration invocation/effect ref;
- provider realization identity;
- acknowledgement evidence;
- reconciliation evidence;
- resulting `EffectDisposition`.

The minimum disposition remains:

- `NOT_APPLIED`;
- `APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

A timeout, transport failure, worker crash, lost acknowledgement or workflow-state persistence failure after a mutation does not imply `NOT_APPLIED`.

`UNKNOWN -> reconcile-before-retry` is mandatory when replay could duplicate or otherwise harmfully repeat the effect unless the target operation has an explicitly qualified idempotency/deduplication contract sufficient for safe replay.

The current SB action-then-workflow-state split-failure exposure is therefore treated as a Planning D migration constraint and Planning E proof obligation, not silently normalized away in this target decision.

## 10. Retry, backoff, redrive and idempotency

**C3.5-DEC-008 — Retry is a governed new attempt under explicit eligibility, not a generic failure response.**

`WorkflowRetryPolicy` must distinguish:

- retryable local execution failure;
- known `NOT_APPLIED` remote failure;
- `UNKNOWN` effect requiring reconciliation;
- provider throttling/backpressure;
- policy/authority denial;
- invalid/expired data or revision dependency;
- deterministic definition/configuration error;
- human intervention requirement.

Retry creates a new `WorkflowAttempt` linked to prior attempts. It never erases prior history.

Redrive is a governed operator/system decision that re-enters execution from an explicit eligible point and preserves lineage, evidence and authority. Redrive cannot assert that earlier effects did not occur.

Idempotency claims are operation/provider/revision/scope qualified; the presence of an `idempotency-key` field or same request body does not by itself prove safe replay.

## 11. Waits, timers, signals and temporal semantics

**C3.5-DEC-009 — Wait/timer semantics are durable, multi-clock and provider-qualified.**

Workflow owns the semantic intent of waits and timers, including:

- registration identity;
- intended wake/deadline semantics;
- occurrence/event-time expectations where relevant;
- scheduler/provider realization ref;
- fired/observed/processed times when material;
- cancellation/replacement lineage;
- missed/late/duplicate firing handling;
- timezone/calendar semantics where domain-required.

A timer firing observation is not proof that the intended downstream transition/effect completed. Clock skew, delayed/offline observation or duplicate scheduling remains explicit evidence/currentness context.

Signals/messages use a workflow correlation identity distinct from message/event transport identity. Duplicate, reordered or replayed deliveries must be resolved through declared correlation/deduplication semantics before causing durable business transitions.

## 12. Fan-out, fan-in, bounded iteration and completion

**C3.5-DEC-010 — Parallel and iterative execution declares join/termination semantics explicitly.**

Fan-out/fan-in definitions must state:

- branch set derivation;
- whether branch cardinality is static, bounded dynamic or externally supplied;
- join mode (`ALL`, bounded quorum, owner-defined predicate or equivalent typed policy);
- missing/failed/cancelled branch treatment;
- timeout/deadline semantics;
- compensation/cancellation consequences;
- proof implications.

Iteration must either have a statically bounded count or an explicit runtime boundedness/termination contract and operational safeguard. An unqualified `while true until external condition` cannot be advertised as having a termination proof.

Workflow terminal state proves only workflow-defined completion criteria under the declared control-flow semantics. It does not automatically prove external convergence, legal/compliance completion, payment settlement, physical state, data consistency or any stronger domain postcondition.

## 13. Cancellation and compensation

**C3.5-DEC-011 — Cancellation and compensation are distinct governed semantics; neither is time-reversal.**

Cancellation stops or prevents eligible future workflow work within an explicit scope; it does not erase already-applied effects.

Compensation expresses owner-defined counter-actions/recovery obligations for effects that already occurred. A compensation step:

- has its own attempt/effect identity;
- may fail or become `UNKNOWN`;
- does not rewrite historical truth;
- may itself require authorization and Integration semantics;
- may only restore a business-equivalent state if the relevant semantic owner can prove that postcondition.

`cancelled` therefore does not mean `never happened`, and `compensated` does not mean byte-for-byte rollback or universal restoration.

## 14. Child/subworkflow composition

**C3.5-DEC-012 — Parent/child workflow composition preserves independent identity, revision and proof domains.**

A child workflow invocation records:

- parent execution/step ref;
- child executable revision and execution identity;
- invocation mode (`SYNC`, `ASYNC` or other explicitly typed mode);
- authority/context propagation rules;
- input/output semantic contracts;
- cancellation/compensation propagation rules;
- effect/proof expectations.

Synchronous parent waiting does not merge parent and child histories. Asynchronous invocation does not permit the parent to claim child business completion merely because child creation was accepted.

Proof composition is non-strengthening: parent completion can include only the child proof claims actually established plus independently proven parent obligations.

## 15. Human-task runtime semantics

**C3.5-DEC-013 — Human task is a durable workflow occurrence whose authority remains owned by Authorization and whose presentation remains owned by UI/AGWS.**

A `HumanTaskOccurrence` preserves:

- task occurrence identity;
- parent workflow execution/step;
- task definition/ref and workflow revision;
- lifecycle state (`AVAILABLE`, `CLAIMED`, `COMPLETED`, `CANCELLED`, `EXPIRED`, etc. as owner-defined refinements);
- candidate/assignment context refs;
- deadlines/escalation hooks;
- submitted outcome/evidence refs;
- completion actor/authority decision refs;
- supersession/reassignment lineage.

Workflow may store assignment/candidate state as qualified foreign decisions/references, but Authorization owns who may see, claim, delegate, complete, override or administer a task.

AGWS/UI may surface the task; visibility never creates task authority. Notification delivery never proves task acceptance/completion.

Long-running tasks must support owner-defined authority revalidation at sensitive actions; authority captured at workflow start is not universally perpetual.

## 16. Determinism, replay and historical interpretation

**C3.5-DEC-014 — Replay is revision-qualified historical interpretation, not execution under whatever code/config is current.**

Replay-capable execution requires nondeterministic inputs and side effects to be either:

- recorded in the journal/evidence sufficiently for deterministic re-interpretation;
- isolated behind stable/version-gated abstractions; or
- explicitly declared non-replayable with bounded recovery semantics.

Historical replay is scoped to the producing executable/runtime revision and its dependency vector. Current wall clock, randomness, mutable external reads, current provider behavior or changed code cannot silently alter historical interpretation.

A deterministic transition planner is a useful predecessor but does not establish deterministic history replay without the required durable history and version qualification.

## 17. In-flight revision coexistence and migration

**C3.5-DEC-015 — New workflow revisions coexist with pinned in-flight cohorts unless explicit migration is qualified.**

Every in-flight execution belongs to an explicit revision cohort. Evolution may result in:

- continue pinned on producing revision;
- migrate to a compatible target revision;
- complete/terminate before withdrawal;
- require human/operator disposition;
- become blocked if required old dependencies cannot be retained.

A workflow migration decision must evaluate at least:

- source/target executable revisions;
- current node/state and history requirements;
- outstanding waits/timers/human tasks;
- child executions;
- applied/partial/unknown effects;
- data/schema dependencies;
- policy/authority dependencies;
- provider/runtime support;
- required transformation/mapping;
- post-migration validation/proof obligations.

Migration is journaled and does not rewrite historical producing truth. Old definitions/workers/providers cannot be withdrawn while authoritative residual cohorts still require them unless each cohort has an explicit safe disposition.

Generic lifecycle coordination belongs to Lifecycle; Workflow supplies workflow-specific compatibility, cohort and migration predicates.

## 18. Authority, tenant, Station and site context

**C3.5-DEC-016 — Workflow execution carries authority/context references but never manufactures permission.**

Protected transitions, human actions, privileged automation, cancellation, redrive, compensation and migration consume owner-issued Authorization decisions/currentness according to the relevant semantic contract.

`Enterprise -> Station -> Role -> Person` remains non-amplifying. Station exposure may constrain which workflow capabilities/actions are surfaced, but exposure does not grant permission.

Tenant/site/Station context is carried explicitly where it affects data, provider binding, external resource scope, locality or delegated administration. Cross-tenant/site invocation must use explicit federated/integration contracts; identical IDs across scopes do not imply shared identity or authority.

Offline/disconnected operation never broadens authority. Missing/expired authority dependencies follow the applicable deny/degrade/`INCONCLUSIVE` semantics.

## 19. Data, decision, calculation, units, vectors and uncertainty preservation

**C3.5-DEC-017 — Workflow routes semantic values without erasing their owner-specific type or epistemic qualification.**

Workflow may consume or route:

- stored facts/data owned by Data/Schema/domain capabilities;
- decisions/rules owned by Decision/Policy capabilities;
- deterministic calculations;
- statistical estimates;
- optimization results;
- AI inference candidates;
- human decisions.

These are not interchangeable merely because they serialize to the same primitive value.

Quantities preserve unit/dimension/currency/precision/rounding/timezone semantics when required. Vector/multidimensional results stay vectors unless an owner-defined scalarization is explicitly referenced. Typed uncertainty remains attached to branch-relevant values; `UNKNOWN` external effect is not collapsed into generic low confidence.

Workflow guards must declare which semantic/uncertainty kinds they accept.

## 20. Provider/Binding and Integration boundaries

**C3.5-DEC-018 — Workflow defines portable requirements; Provider/Binding qualifies realizations and Integration owns target-specific external interaction/effect semantics.**

A workflow provider support vector may include:

- durable history guarantees;
- replay/versioning behavior;
- timer/wait/signal guarantees;
- human-task support;
- maximum duration/state/history limits;
- retry/redrive facilities;
- export/import/migration facilities;
- consistency/availability/offline characteristics;
- observability/evidence support;
- capacity/queue/backpressure behavior;
- tenant/site isolation;
- cancellation/compensation support.

A provider feature named “workflow”, “retry”, “exactly once” or “timer” does not establish semantic equivalence by label.

Integration owns external API/protocol/provider-specific invocation, receipts, target idempotency/reconciliation and external resource semantics. Workflow orchestrates when such operations are invoked and persists execution/effect linkage without absorbing Integration ownership.

For C2 Physical/Peripheral Integration, generic Workflow may orchestrate bounded `READ/QUERY/PROVISION/BROKER/EVENT` operations only through admitted Integration contracts. No generic direct physical actuation authority is created by a workflow node, provider credential or UI action.

## 21. Local/offline/Fleet semantics

**C3.5-DEC-019 — Durable local workflow execution may continue only within a qualified local closure; Fleet remains qualified observation/control intent.**

A local workflow execution may proceed while disconnected only when C0 `QualifiedLocalClosure` covers the dependencies needed for the relevant transition horizon, including executable revision, data/schema, authority/policy, trust/secrets, provider bindings and required evidence contracts.

Offline continuation does not imply global currentness. On reconnect, stale assumptions, queued effects/messages, policy changes, revised schemas/providers and residual workflow cohorts must be reconciled.

Fleet/global workflow views declare coverage/currentness and revision populations. A Fleet “running/completed/failed” projection is not omniscient local truth when observation is delayed or partial. Fleet control intent such as cancel/redrive/migrate remains an instruction requiring local admission and evidence of adoption.

## 22. Provenance, evidence and audit

**C3.5-DEC-020 — Workflow evidence is claim-scoped and preserves lineage without becoming universal truth.**

Workflow must be able to produce/reference evidence for:

- definition admission and source lineage;
- execution start/context/revision;
- transition decisions;
- attempts/retries/redrives;
- waits/timers/signals;
- human-task lifecycle;
- external-effect dispositions and reconciliation;
- child composition;
- cancellation/compensation/recovery;
- migration;
- terminal disposition;
- proof-profile results.

The journal can prove that Workflow recorded a transition/evidence ref under its integrity contract; it cannot alone prove the external system actually converged or a business/legal/physical postcondition holds.

Observation time, event time, effective time and record time remain distinct when material. Correction/supersession creates lineage rather than rewriting past history.

## 23. Soundness, boundedness, termination and completion proof domains

**C3.5-DEC-021 — Workflow proof is profile-based and non-strengthening.**

Target proof domains are distinct:

1. **Definition structural validity** — references/types/control-flow structure are well-formed.
2. **Workflow soundness** — admitted model satisfies the selected soundness profile (for example, no unreachable/dead transitions or improper terminal behavior within the profile's formal scope).
3. **Termination/boundedness** — static or runtime-qualified evidence establishes the claimed boundedness/termination domain.
4. **Execution conformance** — journaled path conforms to the admitted executable revision.
5. **Journal integrity** — history/evidence commitments satisfy the declared integrity profile.
6. **External-effect evidence** — required target effects have the qualified dispositions/evidence demanded by the workflow completion contract.
7. **Business/domain postcondition** — separately owned semantic validation establishes the required postcondition.

A `ProcessProofBundle`/workflow proof bundle enumerates exactly which claims are established, unresolved or `INCONCLUSIVE`.

No structural soundness proof implies business success. No execution-conformance proof implies external effect. No provider ACK implies postcondition. No child completion implies stronger parent proof. No terminal node may be labeled “complete” in a stronger sense than its declared proof profile permits.

## 24. Failure, recovery and resilience semantics

**C3.5-DEC-022 — Failure/recovery is explicit, lineage-preserving and effect-aware.**

First-class workflow non-success conditions include:

- invalid/incompatible executable revision;
- missing/stale history;
- unavailable wait/timer/signal support;
- stale/unknown authority;
- schema/data incompatibility;
- replay incompatibility;
- ambiguous external effect;
- provider/runtime failure;
- child failure/unknown disposition;
- failed compensation;
- failed migration;
- unavailable retained old revision;
- residual cohort preventing withdrawal;
- insufficient evidence to establish completion.

Recovery can include retry, reconcile, redrive, compensation, migrate, resume pinned, operator intervention or explicit termination, each with authority and evidence requirements.

Recovery never erases the original failure/effect history and never silently converts `UNKNOWN` to `NOT_APPLIED`.

## 25. Observability, SLO, queues, backpressure and capacity

**C3.5-DEC-023 — Workflow operational semantics expose multidimensional workload/readiness evidence instead of a single health score.**

Relevant operational dimensions may include:

- active/in-flight execution population by revision;
- wait/timer populations and lateness;
- human-task backlog/age;
- runnable work queue depth/age;
- worker/provider capacity and concurrency;
- retry/redrive/reconciliation backlog;
- `UNKNOWN` effect population;
- compensation/recovery backlog;
- child/subworkflow fan-out pressure;
- journal persistence latency/failure;
- SLO deadline budget consumption;
- residual old-revision cohorts.

Queue pressure is semantic where it can invalidate deadlines, capacity assumptions or safe operation. Backpressure behavior must be explicit; unlimited enqueueing is not a valid default.

A healthy worker, queue ACK or low latency does not prove workflow/business completion. Observability signals remain evidence, not authority.

## 26. Capability-specific Elicitation Lens

**C3.5-DEC-024 — Workflow adopts a capability-specific Elicitation Lens from C1 rather than a static monolithic questionnaire.**

The Workflow lens must adaptively discover, where applicable:

- business/process purpose and canonical source model;
- actors, protected transitions and authority revalidation points;
- inputs/outputs and source-of-truth ownership;
- states/transitions and terminal semantics;
- decision/rule/calculation dependencies;
- units/vector/uncertainty semantics influencing branches;
- waits/timers/deadlines/calendars/timezones;
- human tasks, assignment/delegation/escalation;
- fan-out/fan-in and iteration bounds;
- child/subworkflow composition;
- external effects and effect identity;
- retry/idempotency/reconciliation semantics;
- cancellation/compensation/recovery;
- offline/local behavior and reconnect reconciliation;
- revision/migration/coexistence requirements;
- provider/runtime constraints;
- security/privacy/audit/evidence obligations;
- throughput/concurrency/queue/capacity/SLO expectations;
- observability and acceptance/proof obligations;
- rare/high-impact/negative-space paths.

Adaptive follow-up examples:

- “Can this step mutate an external system?” -> “What stable effect identity exists?” -> “What does timeout mean?” -> “Can the target reconcile state?” -> “Is retry idempotent for this operation/revision/scope?” -> “Who owns manual reconciliation?”
- “Who can complete this human task?” -> “Before/after claim?” -> “Can it be delegated?” -> “Can authority expire while waiting?” -> “Who can override?” -> “What audit evidence is required?”
- “Does the workflow finish here?” -> “Does terminal mean control-flow complete or business postcondition satisfied?” -> “Which external effects must converge?” -> “What proof/evidence establishes that?”

Answers are typed as `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope` or `Deferred` per C1. AI-generated workflow mappings remain `InferredCandidate` until authoritative validation/adoption.

A critical unresolved authority, source-of-truth, terminal semantic, external-effect reconciliation, retry safety, human-task permission, revision/coexistence or proof obligation blocks the corresponding readiness dimension rather than being hidden by a global score.

## 27. Derived artifacts and semantic traceability

**C3.5-DEC-025 — Workflow elicitation must derive and link stories/use cases/scenarios/requirements without treating any one artifact as sufficient specification.**

Target traceability is:

`Source/Elicitation Evidence -> Finding/Answer -> Requirement/Constraint -> User Story/Use Case/Scenario -> Process/Application + Executable Workflow Semantic Model -> Control-flow/Data/Decision/Integration/etc. refs -> Acceptance Criterion -> Test/Product Proof -> Runtime Evidence`.

For Workflow:

- **User Stories** capture intention/value/context;
- **Use Cases** include preconditions, trigger, main flow, alternate/failure/recovery flows and postconditions;
- **Scenarios** include happy, alternate, failure, boundary, abuse/misuse, recovery, offline, concurrency and historical/version-change cases;
- **Requirements/Constraints** distinguish functional/non-functional/operational/governance/compliance needs;
- **Acceptance Criteria** enumerate explicit proof obligations and never infer completion from a happy-path-only story.

Observed Brownfield execution, process mining traces, logs, tickets, spreadsheets or operator workarounds remain evidence of observed behavior. They do not automatically define intended or approved canonical workflow semantics.

## 28. Elicitation coverage/sufficiency for Workflow

**C3.5-DEC-026 — Workflow coverage is multidimensional and stage-specific; no single “complete” score is authoritative.**

Coverage dimensions include at minimum, when applicable:

- purpose;
- actors;
- authority;
- inputs/outputs;
- source-of-truth/data ownership;
- states/transitions;
- time/SLA;
- exceptions;
- failure/recovery;
- external effects;
- integrations;
- security/privacy;
- evidence/audit;
- lifecycle/versioning;
- scale/capacity;
- observability;
- UX/human tasks;
- acceptance/proof.

Dimension states are `UNTOUCHED | DISCOVERING | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NOT_APPLICABLE | DEFERRED`, qualified by evidence/currentness.

Sufficiency gates are separate:

- **sufficient for abstraction** — enough to identify workflow/control-flow semantics and ownership without false assumptions;
- **sufficient for candidate architecture** — enough to design an architecture candidate and expose unresolved risks;
- **sufficient for implementation** — required authority/data/failure/effect/version semantics resolved to the implementation gate's profile;
- **sufficient for publish/operation** — operational/readiness/evidence/recovery/currentness obligations satisfied for the declared production scope.

Automatic critical-gap detection must flag at least workflow without terminal semantics, external mutation without reconciliation/idempotency qualification, human task without authority/revoke rules, wait/timer without timing semantics, branch calculation without unit/currentness, historical behavior without revision semantics, integration without timeout/`UNKNOWN` behavior, and residual in-flight cohorts without migration/drain disposition.

## 29. Brownfield / Legacy Mirroring assimilation

**C3.5-DEC-027 — Brownfield workflow discovery is evidence-producing and preserves observed/intended/canonical separation.**

Mirroring/process-mining/legacy inspection may ingest:

- engine definitions and histories;
- logs/traces;
- forms/spreadsheets;
- emails/tickets;
- scheduler jobs;
- scripts/macros;
- manual handoffs;
- verbal approvals;
- exception paths;
- provider/API/database evidence.

The result is typed evidence and candidate mappings such as `ObservedWorkflowPattern`, `ObservedStateTransition`, `ObservedExternalEffect`, `InferredWorkflowCandidate`, contradiction/open-question entries and provenance/currentness records.

`observed behavior != intended process != approved canonical process` remains mandatory. Hidden workarounds, manual overrides and emergency procedures are specifically sought as negative-space evidence.

The migration path must allow free-form notes and structured evidence to coexist; no big-bang rewrite of legacy documentation is implied.

## 30. Planning D migration constraints

**C3.5-DEC-028 — Planning D must evolve the current minimal workflow runtime incrementally without discarding useful deterministic/provider-neutral predecessors.**

Planning D must preserve and plan around these constraints:

1. current provider-neutral logical process/transition/instance identity is a useful predecessor and should not be replaced merely to match a provider;
2. current deterministic fail-before-plan transition validation is a useful predecessor;
3. current SQL-backed mutable state is insufficient as the full target history model but may coexist during migration;
4. migration from mutable current-state rows to revision-qualified history must avoid big-bang data loss and establish producing revision lineage where recoverable;
5. the evidenced action-then-state persistence split requires an explicit migration path to effect-aware execution/reconciliation rather than assuming atomic success;
6. timers/waits/signals/human tasks/retry/redrive are additive semantic surfaces that require owner/binding qualification;
7. old generated runtimes and in-flight instances may form residual cohorts requiring coexistence;
8. workflow providerization must retain canonical identity and qualify support vectors rather than importing provider IDs as canonical truth;
9. free-form/legacy workflow knowledge and structured C1 evidence must coexist during brownfield assimilation;
10. no migration may broaden authority or convert AI inference into canonical process/workflow mutation.

Planning D will decide sequencing/topology/migration mechanics later; this C3 decision defines only the target constraints.

## 31. Planning E product-proof candidates

**C3.5-DEC-029 — Planning E must prove semantic behavior and non-strengthening boundaries, not merely API success.**

Candidate product proofs include:

1. definition vs occurrence vs provider realization identity remain distinct;
2. executable revision retains lineage to Process/Application and transformation revisions;
3. durable history survives worker/runtime replacement and reconstructs current execution state;
4. timers/waits/signals resume without silent duplicate/skip semantics inside the admitted support profile;
5. split-failure after an applied effect yields `UNKNOWN`/reconciliation requirement rather than blind retry;
6. unsafe retry is blocked until reconciliation or qualified idempotency proves replay safety;
7. retries/redrives preserve prior attempt/effect lineage;
8. human-task presentation does not grant completion authority and authority can be revalidated at sensitive actions;
9. fan-out/fan-in/iteration obey declared join/boundedness semantics;
10. cancellation does not erase applied effects and compensation has independent attempt/effect lineage;
11. parent/child proof composition does not strengthen child evidence;
12. current-version deployment does not reinterpret incompatible historical executions;
13. in-flight cohorts remain pinned or explicitly migrated with lineage and validation;
14. old revisions/providers cannot be withdrawn while authoritative residual cohorts depend on them;
15. provider substitution preserves canonical workflow identity and exposes support differences;
16. local/offline continuation respects qualified local closure and reconnect triggers reconciliation;
17. Fleet status is currentness/coverage-qualified and cannot masquerade as omniscient local truth;
18. data/decision/calculation units/vectors/uncertainty survive workflow transport/branching;
19. workflow terminal state cannot falsely prove external/business/physical postconditions;
20. capability-specific adaptive elicitation routes critical follow-ups and unresolved questions correctly;
21. contradiction/evidence provenance is retained instead of silently selecting one stakeholder answer;
22. critical-gap detection prevents false `complete` when terminal, authority, source-of-truth, failure/recovery, external effect, revoke, timeout/UNKNOWN, metric unit/currentness or revision semantics are unresolved;
23. AI/Wizard may propose workflow definitions/mappings/scenarios but cannot canonically mutate process/workflow truth without owner-governed adoption;
24. C2 Physical/Peripheral boundary cannot be bypassed by representing direct actuation as an ordinary workflow step.

## 32. Inherited adversarial obligations

**C3.5-DEC-030 — All 408 saturated research findings remain inherited constraints; this decision creates no new ConflictInstance or remediation.**

Workflow target architecture must remain robust under the already catalogued families including:

- stale/missing revision dependencies;
- cross-provider/profile semantic mismatch;
- partial/unknown external effects;
- retry/redrive duplication;
- delayed/duplicate/reordered messages;
- offline/local/federated currentness gaps;
- residual old-revision/provider cohorts;
- authority/revoke/deprovision changes during long-running work;
- data/schema/provider evolution;
- queue/capacity/backpressure overload;
- incomplete/biased elicitation and false readiness;
- Brownfield observed-vs-approved divergence;
- AI/low-code authority amplification;
- Physical/Peripheral provider-scope widening and boundary erosion.

These remain reusable `ConflictPattern`s/signals until a concrete occurrence satisfies the separate `ConflictInstance` confirmation criteria.

## 33. Architecture consequences

The decided target implies:

- Workflow remains a canonical capability, not a universal runtime utility;
- C0 execution primitives are specialized by Workflow rather than duplicated;
- Process/Application owns semantic process meaning; Workflow owns durable admitted execution;
- control-flow is portable and typed where analyzability/proof/migration matter;
- mutable current state is a projection over durable history, not the full source of truth;
- external effects are explicitly qualified and cannot be inferred from acknowledgements;
- long-running execution is revision/cohort aware;
- human-task state is durable but authority/UI stay externally owned;
- provider substitution is capability-vector qualified;
- proof claims are domain-scoped and non-strengthening;
- Elicitation Knowledge Base drives adaptive workflow discovery/readiness without becoming workflow authority;
- Brownfield mirroring feeds evidence/candidates, not canonical truth;
- physical/peripheral interaction remains constrained by C2's integration/governance plane.

## 34. Capability decision

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

Workflow & Durable Execution owns portable, revision-qualified durable execution over admitted executable workflow definitions, with explicit definition/occurrence/attempt/effect identity, typed control-flow primitives, `ExecutionEnvelope/ExecutionState/ExecutionJournal`, human-task runtime, waits/timers, retry/redrive/reconciliation, cancellation/compensation, child composition, in-flight coexistence/migration, proof-domain separation, local/offline/Fleet currentness and operational/readiness semantics.

The decision preserves all required boundaries:

- workflow completion is not external/business postcondition proof;
- task visibility is not authority;
- retry is not safe replay;
- parent completion cannot strengthen child proof;
- provider/runtime identity is not canonical workflow identity;
- `UNKNOWN` effect requires reconciliation before unsafe retry;
- AI/low-code/Wizard proposals remain candidates until owner-governed adoption;
- generic Workflow/Integration does not gain direct physical actuation authority.

No product code, Work Package, executive TASK, Construction, Planning D/E or C3.6+ work was executed in this decision.
