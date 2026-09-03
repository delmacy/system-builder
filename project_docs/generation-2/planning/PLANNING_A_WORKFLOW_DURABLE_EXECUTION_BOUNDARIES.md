# Generation 2 — Planning A: Workflow & Durable Execution Boundaries

Status: COMPLETE_FOR_CAPABILITY — PLANNING_A_TAXONOMY_BOUNDARIES
Capability: Workflow & Durable Execution
Authority inputs: `project_docs/generation-2/synthesis/CAPABILITY_SYNTHESIS.md`, authoritative Generation 2 research corpus, and prior Planning A capability-boundary decisions.

This document defines taxonomy ownership and boundaries only. It does not assert current System Builder implementation, choose a workflow engine/provider, define target modules, materialize WBS/TASKs, execute Construction, inspect product code, or enter Planning B.

## 1. Canonical ownership

Workflow & Durable Execution owns the durable execution semantics of admitted executable workflow definitions: workflow-instance identity and state, durable history, waiting/timer state, retries/backoff/redrive, compensation/runtime recovery semantics where declared, human-task runtime state, correlation between durable steps and accepted effects, deterministic/replay-qualified execution requirements, and coexistence of in-flight executions across executable workflow revisions.

It owns how an admitted executable workflow progresses durably over time. It does not own the canonical business/process model, external-system adapter semantics, message transport, authorization policy, domain data/schema truth, provider admission, generic lifecycle orchestration, deployment topology, or universal architecture primitives.

## 2. Source of truth

The source of truth for a workflow execution is a revision-qualified durable execution record/history governed by the admitted executable workflow revision and its declared execution semantics. In-memory worker state, provider dashboards, queue depth, logs, traces, deployment replica state, transport acknowledgements and external provider IDs are observations or realization details unless explicitly adopted by the workflow owner through a qualified transition.

Canonical process/application truth remains owned by Process & Application Modeling. Workflow history does not silently redefine process meaning merely because an engine executed a path.

## 3. Workflow identity and realization identity

Canonical workflow definition identity, executable revision identity, workflow-instance identity, human-task identity and execution-attempt identity are distinct from provider namespace IDs, task-queue names, worker IDs, container IDs, message IDs and engine-native run IDs.

Provider-native IDs may be retained as typed realization bindings or evidence references, but remain non-canonical unless explicitly adopted under the owning semantic contract. Provider substitution may therefore preserve workflow and instance identity while changing realization identity and support characteristics.

## 4. Canonical process semantics vs executable workflow realization

Process & Application Modeling owns canonical process/application semantics: business states, allowed transitions, domain concepts, declared obligations and semantic lineage. Workflow owns a qualified executable realization admitted against those semantics.

Compilation/materialization from a process model into executable workflow form must preserve explicit lineage to the source process/application revision and to any transformation/generator revision. A generated workflow is not evidence that the source process was changed. Any requested execution behavior that requires changing canonical process semantics crosses back to the Process/Application owner as an explicit proposal tied to a base revision and authority envelope.

Lossy or ambiguous mapping between process semantics and executable workflow semantics remains explicit as `PARTIAL` or `INCONCLUSIVE`; executable plausibility cannot substitute for semantic equivalence.

## 5. Durable instance state and history

Workflow owns durable instance state as a lineage-preserving progression, not merely a mutable current-state row. Required semantics include the identity of the instance, admitted executable revision, current durable position, relevant prior transitions/events, outstanding waits/timers/tasks, execution attempts, accepted/applied effect evidence where known, and terminal/nonterminal disposition.

History may be compacted or archived by implementation, but semantic replay/audit obligations cannot be destroyed merely for operational convenience. Compaction that removes information required for replay, effect reconciliation, migration, audit or recovery is unsupported unless a higher-level qualified retention/archival contract preserves the required evidence.

## 6. Attempted → accepted → applied/effective → converged → validated lineage

Workflow must preserve the difference between:

1. an execution step being attempted;
2. a local/remote worker or provider accepting the attempt;
3. the intended domain/external effect being applied or becoming effective;
4. downstream state converging;
5. the intended semantic postcondition being validated.

A successful activity return, queue acknowledgement or transport response does not by itself prove the business effect. When a mutation outcome is ambiguous, the effect disposition remains `UNKNOWN` and unsafe retry is blocked pending reconciliation or an explicitly safe idempotency contract.

## 7. Timers, waits and durable resumption

Workflow owns durable temporal/wait semantics such as scheduled wakeups, deadlines, delays, signal waits, human-task waits and correlation waits where they are part of execution semantics. Timer/wait identity and intended semantics must survive worker restarts and deployment replacement.

The runtime/provider may realize timers differently, but a realization must preserve declared timing semantics within its qualified support profile. Clock skew, stale scheduler state, unavailable provider support or uncertain timer firing must remain explicit operational/evidence conditions rather than silently producing duplicate or skipped semantic effects.

## 8. Retry, backoff, redrive and reconciliation

Workflow owns execution-level retry/redrive policy and its relation to attempt identity, idempotency expectations and effect disposition. Retry is not a universal response to failure.

`UNKNOWN` remote effect requires reconcile-before-retry unless the target operation has an explicitly qualified idempotency/deduplication contract. Redrive creates a new governed attempt lineage; it must not erase the failed/ambiguous attempt history or falsely imply that prior effects did not occur.

Integration/Automation and provider owners supply target-specific idempotency, reconciliation and support facts; Workflow consumes those facts when deciding whether a durable retry/redrive path is eligible.

## 9. Human-task runtime boundary

Workflow owns durable human-task runtime semantics when a process execution waits for human judgment/action: task instance identity, assignment/candidate state as supplied through policy/organization contracts, lifecycle state, deadlines/escalation hooks, claimed/completed/cancelled disposition and linkage back to workflow execution.

Authorization / Policy / Organization / Multitenancy owns who is allowed to see, claim, delegate, complete or administer the task. UI/AGWS owns how the task is presented within governed surfaces. Notifications owns delivery of reminders/alerts. Workflow must never treat UI visibility or notification delivery as authorization or task completion.

## 10. Determinism, replay and side-effect boundary

Workflow owns replay-qualified execution semantics for any execution model that reconstructs state from durable history. Logic whose replay outcome depends on uncontrolled wall-clock time, random values, mutable external reads or changed code semantics must be isolated behind deterministic abstractions, version gates or recorded inputs/effects sufficient to preserve historical execution meaning.

Replay qualification is scoped to the producing executable revision and runtime contract. A current version being deterministic does not prove that historical executions can be replayed safely under it.

External side effects must occur through explicit activity/integration boundaries whose effect identity, attempt lineage and ambiguous-outcome semantics can be reconciled.

## 11. In-flight version coexistence and evolution

Workflow owns workflow-specific compatibility for executions already in flight when executable definitions evolve. Lifecycle / Versioning / Evolution / Migration owns generic revision/coexistence/migration readiness and withdrawal semantics; Workflow supplies the domain-specific predicates needed to decide whether an in-flight instance can continue, migrate, pin to its original revision, or require intervention.

A new workflow revision does not retroactively rewrite historical execution. Migration of an in-flight instance is an explicit governed transition with source revision, target revision, transformation/compatibility evidence, outstanding effects/waits/tasks, and post-migration validation.

Old workers/executable revisions cannot be drained until no authoritative in-flight cohort still depends on them, or every residual instance has been explicitly migrated, completed, terminated or otherwise dispositioned.

## 12. Relationship to Integration & Automation

Integration & Automation owns triggers/subscriptions/adapters, external-system interaction, automation actuation, target-specific receipts/reconciliation and external provider interaction semantics. Workflow consumes these capabilities as durable activities/effects and orchestrates when they are invoked within execution.

Workflow does not canonize external API/provider identifiers, connector-specific retry semantics or adapter state as workflow truth. Integration does not own the durable business execution instance merely because external calls occur through its adapters.

A workflow step may invoke an integration, but the integration's acceptance receipt and the workflow's semantic step completion remain distinct qualified facts.

## 13. Relationship to Notifications / Events / Messaging

Notifications / Events / Messaging owns transport/delivery semantics such as publication/delivery attempts, ordering, deduplication, subscriptions, replay and provider migration. Workflow may wait for, emit or correlate messages/events, but message transport success is not workflow-state success.

Event/message identity and workflow signal/correlation identity must remain explicitly related rather than collapsed. Duplicate or reordered transport observations are handled according to qualified delivery semantics and workflow correlation rules; they must not silently create duplicate durable business transitions.

## 14. Relationship to Data / Schema / Migrations

Data / Schema / Migrations owns canonical schema/data identity, compatibility, migrations/backfills/cutovers and data-state evolution. Workflow may read/write domain data through explicit operations but does not own schema truth.

A workflow revision that depends on a schema revision must declare/retain that compatibility dependency. Schema migration cannot assume every in-flight workflow is compatible; workflow coexistence and data migration must be mutually qualified before cutover/withdrawal.

## 15. Relationship to Authorization / Policy / Organization / Multitenancy

Authorization/Policy owns permission evaluation, organizational/tenant boundaries, delegated/temporary authority and Station isolation. Workflow owns durable execution state but every protected transition, human-task action and privileged automation remains subject to the appropriate authoritative policy evaluation.

Authorization captured at workflow start does not automatically remain valid forever. Long-running workflows may require re-evaluation at sensitive steps according to policy currentness and the semantic owner’s contract. Stale/unknown authority evidence yields denial or `INCONCLUSIVE`, not inherited permission.

`Enterprise → Station → Role → Person` delegation remains monotonic: a Station/Role/Person context can narrow or specialize only authority actually delegated to it.

## 16. Relationship to Provider / Binding / Capability Negotiation

Provider/Binding owns workflow-engine/provider discovery, support qualification, admission, binding, coexistence, fallback, cutover and withdrawal. Workflow owns the provider-neutral durable execution contract the provider must satisfy.

Provider capability matching is multidimensional: history/replay semantics, timer guarantees, human-task support, retry/redrive behavior, maximum duration/state constraints, consistency, offline/local operation, export/migration facilities and observability may differ. Matching a feature name such as “workflow” or “retry” does not establish semantic equivalence.

Provider substitution requires qualified compatibility and residual-cohort handling. Provider IDs remain non-canonical unless explicitly adopted.

## 17. Relationship to Deployment / Environment / Runtime

Deployment / Environment / Runtime owns desired/effective/observed runtime topology, placement, scaling, rollout/readiness, rollback and runtime autonomy. Workflow owns durable execution semantics across those runtime changes.

A deployment becoming healthy does not prove workflow execution convergence, and a workflow instance being durable does not dictate deployment topology. Worker replacement, scaling or runtime migration must preserve access to the qualified durable state and dependencies required by the instance.

Deployment rollback is distinct from workflow/state rollback. Reverting worker code without qualifying in-flight histories, schema dependencies and side effects can be unsafe.

## 18. Relationship to Lifecycle / Versioning / Evolution / Migration

Lifecycle owns reusable revision vectors, coexistence, migration currentness/readiness, withdrawal and rollback eligibility. Workflow supplies workflow-specific compatibility rules, residual cohort inventory and postconditions for in-flight evolution.

Historical availability of an older executable revision does not by itself make rollback eligible. Required artifacts, schema/data compatibility, provider support, trust/configuration and durable history interpretation must remain qualified.

## 19. Relationship to Universal Capability Architecture

UCA supplies reusable typed identity, revision vectors, effect dispositions, qualified evidence/currentness, provider support vectors, authority envelopes, residual-cohort drainage and correction/supersession primitives. It must not become a universal workflow DSL, global state machine, timer engine, retry policy or workflow-history schema.

Workflow remains the semantic owner of durable execution behavior while consuming UCA primitives.

## 20. AGWS and AI non-amplification

AGWS remains a distinct CORE capability. It may present human tasks, approvals, exception queues and supervised automation through effective surfaces resolved over `Enterprise → Station → Role → Person`, while Station remains a capability-exposure/delegated-administration boundary.

AGWS/UI presence does not create workflow authority. A personal or role surface cannot expose/execute workflow actions beyond delegated Station/Role authority, bypass mandatory inherited controls or convert a personal automation into canonical team/process execution without the appropriate escalation/promotion path.

AI may propose workflow definitions, retry policies, task assignments, migration plans or remediation steps. AI is not execution authority. It cannot silently alter canonical process semantics, grant task/automation authority, adopt provider identities, force ambiguous effects to `APPLIED`, or migrate in-flight state without explicit qualified authority and validation.

## 21. Failure semantics

First-class non-success conditions include incompatible executable/process revisions, missing/stale workflow history, unsupported provider semantics, unavailable required timers/signals, stale policy evidence, ambiguous external effect, incompatible schema state, replay incompatibility, failed in-flight migration, unavailable retained executable revision, residual old-worker cohorts and insufficient evidence to establish convergence.

Use explicit outcomes:

- `UNKNOWN` when a potentially mutating effect may or may not have occurred and reconciliation is required;
- `PARTIAL` when only a bounded subset of required execution/evidence semantics is satisfied;
- `INCONCLUSIVE` when evidence/currentness is insufficient to assert safety, compatibility or completion;
- explicit rejection/denial when a known contract or authority requirement is violated.

Silently treating timeout, transport failure, worker restart or provider acceptance as `NOT_APPLIED` is forbidden unless the relevant contract proves that disposition.

## 22. Non-goals

Workflow & Durable Execution does not own:

1. canonical business/process/application semantics;
2. generic UI or AGWS effective-surface composition;
3. authorization/policy truth;
4. domain schema/data ownership;
5. external adapter/provider interaction semantics;
6. message transport/delivery semantics;
7. provider admission/binding lifecycle;
8. deployment topology/scaling/readiness;
9. generic cross-capability lifecycle orchestration;
10. universal architecture primitives;
11. provider-native workflow IDs or engine history formats as canonical truth;
12. AI-controlled canonical mutation or authority expansion.

## 23. Preserved proof obligations

Later phases must prove at minimum:

1. workflow/process identity survives workflow-engine/provider substitution;
2. executable workflow lineage remains tied to canonical process/application and transformation revisions;
3. worker/provider acceptance cannot be collapsed into applied/effective/converged/validated business effect;
4. `UNKNOWN` remote mutation outcomes require reconciliation before unsafe retry;
5. timers/waits and durable resumption survive worker/runtime replacement within qualified guarantees;
6. human-task presentation never substitutes for authoritative assignment/authorization;
7. replay qualification remains scoped to producing executable/runtime revisions;
8. in-flight executions can coexist across versions without silently rewriting history;
9. schema/provider/deployment changes cannot withdraw dependencies while residual authoritative workflow cohorts remain;
10. provider substitution keeps realization identity distinct and preserves explicit support differences;
11. `Enterprise → Station → Role → Person` authority remains non-amplifying for workflow actions and automation;
12. AI cannot turn a proposal, retry suggestion or migration plan into authoritative execution without explicit admission/authority.

## 24. Planning B repository-validation questions

Record only for later `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`:

1. Where are current SB canonical process definitions, executable workflow definitions and workflow-instance histories represented, and are their identities distinct?
2. Does the current runtime preserve durable instance/history across worker/process restarts?
3. Are timers, waits, signals and human-task states durable and revision-qualified?
4. How are attempts, retries/redrives and ambiguous external effects represented? Is reconcile-before-retry possible?
5. Can any transport/worker/provider acknowledgement be mistaken for applied business effect?
6. Are workflow engine/provider IDs coupled into canonical process or domain identity?
7. Are workflow revisions and in-flight instance compatibility/coexistence explicit, or is latest-version replacement assumed?
8. Can old workers/revisions be drained safely based on residual in-flight cohorts?
9. Are schema, policy, configuration, trust and provider dependencies revision/currentness-qualified for long-running executions?
10. Are human-task assignment/authorization semantics enforced by the authoritative policy boundary rather than UI visibility?
11. Is replay deterministic/version-aware enough to reproduce historical state without uncontrolled current external reads?
12. Can AGWS/AI/personal automation paths bypass Station/Role authority or canonical process-change boundaries?

These questions must not be answered during Planning A.

## 25. Planning A capability decision

**PASS_FOR_CAPABILITY.** Workflow & Durable Execution has explicit ownership of durable workflow-instance/history semantics, timers/waits, retries/redrive, human-task runtime, replay-qualified execution behavior and in-flight version coexistence, with clear boundaries from canonical Process/Application semantics, Integration/Automation, Notifications/Messaging, Data/Schema, Authorization/Policy, Provider/Binding, Deployment/Runtime, Lifecycle and UCA.

No new capability, finding or synthesis contradiction is created by this boundary pass. Attempted → accepted → applied/effective → converged → validated lineage, explicit `UNKNOWN`/reconcile-before-retry semantics, provider IDs as non-canonical-by-default, AGWS `Enterprise → Station → Role → Person` boundaries, Station delegated capability exposure/administration and AI/AGWS non-amplification remain preserved.
