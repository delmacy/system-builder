# Generation 2 — Planning B: Workflow & Durable Execution — SB Current State Reconciliation

Status: COMPLETE_FOR_CAPABILITY — CURRENT_STATE_RECONCILED / PASS_FOR_CAPABILITY
Capability: Workflow & Durable Execution
Fresh-main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`
Authority inputs: fresh `main`, `PLANNING_A_WORKFLOW_DURABLE_EXECUTION_BOUNDARIES.md`, accepted repository architecture/contracts.

This document is repository archaeology only. It does not alter product code, invent target architecture, materialize WBS/TASKs, execute Construction, or enter Planning C.

## 1. Current executable workflow-definition baseline

Current SB has an explicit, provider-neutral executable workflow projection. `packages/runtime-core/workflow-execution.ts` defines `RuntimeWorkflowProcess` with logical process identity, states, optional explicit `initialState`, and declared transitions identified by logical transition IDs, with optional `actionRef`. `planRuntimeWorkflowTransition` resolves only declared process/transition identity, derives the initial state only from the declared `initialState`, rejects unknown processes/transitions, and fails a transition whose declared `from` does not equal the effective current state.

The compiler projection and product tests preserve the same model into generated runtime artifacts. Current identifiers are logical SB references rather than workflow-engine namespaces or provider-native run IDs.

Disposition: **KEEP + HARDEN**.

This is a strong deterministic state-machine predecessor, but the inspected model has no executable workflow revision identity distinct from process identity, no admitted process/application source revision, no generator/transformation revision, no version compatibility predicate and no declared timer/wait/human-task semantics.

## 2. Durable state persistence

`packages/compiler/workflow-runtime.ts` adds a runtime state requirement for capability `runtime.workflows`, backed by SQL through a `DATABASE_URL` secret reference. It materializes a deterministic migration creating `sb_runtime_workflow_state(process_id, instance_id, state)` with `(process_id, instance_id)` as the primary key. The generated runtime reads this row before transition execution and upserts the resulting state afterward.

`tests/product/compiler-workflow-execution.test.ts` verifies that the compiler emits the workflow-state migration, includes it in the release artifact manifest, preserves the initial state in `runtime-model.json`, and keeps the generated runtime autonomous from `SYSTEM_BUILDER_URL`.

Disposition: **KEEP + HARDEN**.

The current implementation therefore evidences restart-survivable current-state persistence assuming the SQL dependency remains available, but it does **not** evidence the Planning-A durable-history contract. The table stores only current state; no transition/event history, attempt lineage, outstanding waits/timers/tasks, effect dispositions, admitted executable revision, correction/supersession lineage or migration status is represented in the inspected schema.

## 3. Workflow instance identity

The generated route is `/workflows/{processId}/{instanceId}/{transitionId}` and persistence is keyed by logical `process_id` plus caller-supplied `instance_id`. This is a useful provider-neutral instance-identity baseline and is not coupled to an external workflow engine ID.

Disposition: **KEEP + HARDEN**.

Gap: current main does not evidence an immutable workflow-instance record carrying creation lineage, executable/process revision, tenant/Station ownership, status/disposition, parent/correlation identity, or correction/migration lineage. `instanceId` currently functions primarily as a key supplied to the generated runtime route.

## 4. Transition execution and effect boundary

The generated runtime validates the process, initial state and transition, then invokes `runtimeWorkflowAction` when `actionRef` exists. The current bounded action effects are entity create/update/delete against the runtime entity model. Only after an action returns `{ ok: true }` does the runtime upsert the workflow state to the transition target.

Disposition: **KEEP the explicit transition/action reference; HARDEN effect semantics**.

The implementation keeps workflow structure reference-oriented, but the present success model collapses several Planning-A stages. A successful runtime entity mutation is treated as sufficient to advance the workflow state; there is no first-class workflow attempt identity or generic `attempted -> accepted -> applied/effective -> converged -> validated` lineage. The inspected implementation also does not represent `UNKNOWN`, `PARTIAL` or `INCONCLUSIVE` effect disposition.

For the current local SQL entity operations, the implementation is narrower than an external/provider effect model. Planning B must not infer that this already solves ambiguous remote effects.

## 5. Atomicity and ambiguous failure exposure

The current generated handler performs the optional entity mutation first and the workflow-state upsert second as separate database operations. The inspected code does not wrap the action mutation and workflow-state transition in one explicit transaction. If the effect succeeds and the later workflow-state write fails, the handler returns `RUNTIME_WORKFLOW_DATABASE_FAILED` while the domain effect may already have occurred.

Disposition: **HARDEN**.

This is the most important evidenced Generation-2 gap in the current path: the implementation has no first-class effect disposition or reconciliation record capable of distinguishing `APPLIED` from `UNKNOWN` after a split failure. A client retry could therefore repeat an already-applied entity mutation depending on action semantics. Generation 2 must preserve Planning A's `UNKNOWN -> reconcile-before-retry` requirement; this pass does not prescribe the target mechanism.

## 6. Retry, backoff and redrive

No inspected current-main workflow execution contract represents attempt identity, retry count, backoff schedule, retry eligibility, idempotency key, deduplication evidence, redrive lineage or reconciliation-before-retry state.

Disposition: **HARDEN + INTEGRATE later** with Integration/Automation and UCA effect/evidence primitives, without transferring workflow ownership.

Current invalid transitions fail deterministically before a mutation plan, which is a useful safety predecessor, but it is not durable retry semantics.

## 7. Timers, waits, signals and durable resumption

The inspected executable process model contains states, `initialState` and immediate explicit transitions only. No current-main evidence in the inspected workflow runtime represents durable timers, deadlines, delay/wakeup identity, signal/correlation waits, scheduler state or timer-firing evidence.

Disposition: **GENERALIZE later only if target architecture preserves provider-neutral workflow semantics; current support NOT EVIDENCED**.

Current SQL state can preserve a state label across process/runtime restart, but it does not by itself prove durable waiting semantics or qualified timer resumption.

## 8. Human-task runtime semantics

No inspected current workflow contract represents human-task instance identity, candidates/assignment, claim/delegate/complete/cancel lifecycle, deadlines/escalation hooks or linkage of a durable task to a workflow instance. Current generated UI authorization work is separate and does not establish human-task workflow semantics.

Disposition: **INTEGRATE later** with Authorization/Policy and UI/AGWS while keeping task runtime ownership here.

Planning A boundary remains controlling: presentation or notification must never become task authorization or task completion evidence.

## 9. Determinism and replay

`planRuntimeWorkflowTransition` is deterministic over the supplied process model, transition ID and current state. Compiler output is deterministic and the executable process model is embedded in the generated runtime artifact. These are useful predecessors.

Disposition: **KEEP + HARDEN**.

However, current runtime state is stored as a mutable row rather than a replayable history. There is no inspected event/history log, recorded nondeterministic input model, side-effect replay barrier, replay version gate, workflow-code version marker or historical reconstruction contract. Current main therefore evidences deterministic transition planning, **not durable deterministic replay**.

## 10. Workflow revision and in-flight coexistence

The runtime model preserves process definitions in a compiled release, but the durable workflow-state table does not record which executable/process/release revision produced or currently owns an instance. The inspected implementation has no explicit in-flight compatibility/migration contract, revision pinning, migration evidence, residual-cohort inventory or withdrawal predicate.

Disposition: **HARDEN + INTEGRATE later** with Lifecycle, Artifact/Release and Deployment while preserving workflow-specific compatibility ownership.

A new runtime release therefore cannot be assumed, from current workflow persistence alone, to safely interpret every existing `(process_id, instance_id, state)` row if process semantics changed.

## 11. Cancellation, compensation and recovery

No inspected current-main workflow execution contract represents cancellation state, compensation steps, saga/compensation lineage, termination reason, state repair, workflow-specific rollback eligibility or post-recovery validation.

Disposition: **DEFER target mechanism to Planning C; current support NOT EVIDENCED**.

Database persistence and ordinary transition failure diagnostics are not equivalent to workflow recovery semantics.

## 12. External/provider coupling and portability

The implemented workflow execution path is generated into the autonomous runtime and uses provider-neutral logical process/transition/action references plus SQL as the currently selected state realization. It does not encode Temporal/Camunda/Step Functions/etc. engine-native IDs in canonical workflow identity.

Disposition: **KEEP the neutral semantic baseline; PROVIDERIZE only realization boundaries later**.

Gap: no inspected `CapabilitySupportVector` or workflow-engine binding contract qualifies history/replay semantics, timers, retries, human tasks, maximum duration/state, export/migration or offline support. Current SQL realization proves one native path, not semantic equivalence across providers.

## 13. Authorization and organizational boundary

Current workflow execution artifacts inspected here do not themselves demonstrate first-class human-task authorization, long-running policy-currentness checks, Station-scoped workflow authority or `Enterprise -> Station -> Role -> Person` delegation semantics.

Disposition: **INTEGRATE later with the authoritative Authorization/Policy boundary; do not move policy ownership into Workflow**.

No current-main evidence in this pass is sufficient to claim that a long-running workflow revalidates authority at sensitive transitions. AGWS and AI remain non-amplifying: UI visibility, personal automation or an AI proposal cannot create workflow execution authority.

## 14. Data/schema dependencies

Workflow current-state persistence has an explicit migration and SQL connection requirement. Workflow actions also target runtime entity definitions. This makes persistence dependencies concrete and portable at a basic level.

Disposition: **KEEP explicit runtime state requirements; HARDEN revision qualification**.

No inspected workflow-instance record captures required schema/data revision or migration compatibility. Schema evolution therefore cannot currently be proven safe for residual in-flight workflow cohorts solely from workflow state.

## 15. Notifications/events/messaging boundary

The inspected current workflow runtime path is direct HTTP-triggered transition execution. No first-class workflow signal/event correlation identity, subscription, delivery acknowledgement, ordering, deduplication or message replay semantics are present in this path.

Disposition: **KEEP capabilities separate**.

This avoids incorrectly treating future message delivery success as workflow-state success; the current implementation simply has not yet materialized the richer boundary.

## 16. Planning-A validation answers

1. **Canonical process definitions, executable workflow definitions and histories:** executable runtime process declarations exist; durable current state exists; a revision-qualified durable history does not.
2. **Durability across restart:** current state is SQL-backed and generated as an explicit runtime state requirement; full history/replay durability is not evidenced.
3. **Timers/waits/signals/human tasks:** not evidenced in the inspected workflow model/runtime.
4. **Attempts/retries/redrive/ambiguous effects:** not first-class. Split action-then-state persistence creates an evidenced ambiguous-effect exposure if the second operation fails.
5. **Acknowledgement vs applied effect:** the current local action path advances state on action `{ ok: true }`, but there is no generic accepted/applied/converged/validated distinction.
6. **Provider IDs:** canonical workflow identity is not coupled to workflow-engine provider IDs in the inspected implementation.
7. **Workflow revisions/in-flight coexistence:** not evidenced as first-class contracts.
8. **Residual worker/revision drainage:** not evidenced for workflow instances.
9. **Schema/policy/config/trust/provider revision dependencies:** not captured in the inspected durable workflow state.
10. **Human-task authorization:** human-task runtime is not evidenced; therefore no claim of authoritative human-task enforcement is made.
11. **Replay determinism:** deterministic transition planning exists; replayable durable history/version-aware replay does not.
12. **AGWS/AI bypass:** no evidence inspected here creates AGWS/AI workflow authority; constitutional non-amplification remains a required later proof.

## 17. Maturity assessment

- Provider-neutral executable process/state/transition identity: **IMPLEMENTED BASELINE**.
- Explicit initial state and deterministic transition validation: **STRONG IMPLEMENTED PREDECESSOR**.
- SQL-backed durable current workflow state: **IMPLEMENTED BASELINE**.
- Autonomous generated runtime workflow execution: **IMPLEMENTED BASELINE**.
- Durable revision-qualified workflow history: **NOT EVIDENCED**.
- Attempt/effect lineage and `UNKNOWN` reconciliation: **NOT EVIDENCED; AMBIGUOUS SPLIT-FAILURE EXPOSURE PRESENT**.
- Timers/waits/signals: **NOT EVIDENCED**.
- Retry/backoff/redrive/idempotency semantics: **NOT EVIDENCED**.
- Human-task runtime: **NOT EVIDENCED**.
- Deterministic historical replay: **NOT EVIDENCED**.
- In-flight revision coexistence/migration/drainage: **NOT EVIDENCED**.
- Cancellation/compensation/workflow recovery: **NOT EVIDENCED**.
- Provider substitution qualification: **PARTIAL — NEUTRAL BASE, SUPPORT QUALIFICATION ABSENT**.

## 18. Reconciliation disposition

**KEEP** the logical provider-neutral process/instance/transition identifiers, explicit initial state, declared transition semantics, deterministic fail-before-plan validation, generated autonomous runtime and explicit SQL runtime-state requirement.

**HARDEN** durable instance/history identity, executable/source revision lineage, attempt/effect disposition, atomicity/reconciliation semantics, timer/wait/task persistence, retry/redrive eligibility, replay qualification, schema/policy/config dependency currentness and in-flight evolution safety.

**GENERALIZE** durable workflow semantics only where they remain reusable and provider-neutral; do not turn UCA into a workflow engine or canonical process modeling into runtime history.

**PROVIDERIZE** concrete workflow-engine/state-store/scheduler realizations only behind qualified support/binding boundaries.

**INTEGRATE** later with Process/Application Modeling, Integration/Automation, Notifications/Messaging, Authorization/Policy, Data/Schema, Provider/Binding, Lifecycle, Deployment, Artifact/Release and UCA according to Planning-A ownership.

No evidence supports `REPLACE` of the current minimal workflow execution baseline.

## 19. Result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Current SB has a useful provider-neutral minimal workflow runtime: deterministic declared state transitions, explicit initial state, logical workflow/instance identity, autonomous generated execution and SQL-backed current-state persistence. The principal Generation-2 gaps are revision-qualified durable history, attempt/effect lineage and ambiguous-outcome reconciliation, timers/waits/signals, retries/redrive/idempotency, human-task runtime, replay, in-flight coexistence/migration/drainage, compensation/recovery and provider-support qualification. The inspected action-then-state sequence specifically exposes a bounded case where an applied domain mutation could be followed by failed workflow-state persistence, so current main cannot claim generic exactly-once/effect-safe durable execution.

No product code, Work Package, executive TASK, Construction, PR or worker handoff was executed.
