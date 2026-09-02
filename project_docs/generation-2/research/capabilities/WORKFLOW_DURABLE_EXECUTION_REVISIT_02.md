# Generation 2 — Workflow & Durable Execution — Revisit 2 / Cycle 3

## Research question
What durable-execution primitives let System Builder preserve semantic operation identity, bounded authority, replay/version compatibility, human checkpoints, failure recovery and provider replaceability when work originates from an Adaptive Governed Work Surface, without moving team-workflow ownership into AGWS or allowing retry/resume/delegation/provider replacement to amplify authority?

## Representatives and evidence ledger
1. **Temporal durable execution** — principal reference for event-history/replay, workflow-vs-activity separation, durable timers/signals, retries and version-safe evolution. Source of truth: Temporal documentation and durable-execution semantics.
2. **Camunda 8 / Zeebe** — principal reference for process-definition version/instance identity, jobs/retries/incidents, user-task lifecycle, process-instance migration and compensation. Current docs show a process instance carries process ID, version and process-definition key; exhausted job retries create an incident; resolving an incident permits execution to continue. Migration is explicit and does not recreate every job/expression/input mapping automatically.
3. **AWS Step Functions Standard Workflows** — principal reference for Retry/Catch, callback task tokens and redrive. Redrive preserves successful history, resumes from the unsuccessful state, and remains associated with the same state-machine definition/version/alias; retry counters for rerun states reset on redrive.
4. **Azure Durable Functions / Durable Task** — principal reference for deterministic orchestration/replay, external events and backend-portable durability. External events are at-least-once on relevant backends and should carry IDs for deduplication; durable waits should use deadlines where appropriate; orchestrators must avoid direct nondeterministic I/O because replay can duplicate it.
5. **BPMN 2.x / Camunda compensation semantics** — reference for compensation as an explicit process mechanism distinct from state rollback.

## Source of truth and identity
The canonical workflow/process definition is not the execution. Minimum identities are: `SemanticOperation`, `WorkflowDefinitionRevision`, `WorkflowRun`, `Step/ActivityInvocation`, `Attempt`, `ExternalEffectReceipt`, `Checkpoint/Approval`, `Incident`, and `Recovery/RedriveDecision`. A durable history is execution evidence, not canonical domain truth.

## Lifecycle and versioning
A run starts against a revision-bound definition and effective semantic/authority context. Long-running runs may outlive definition, provider, Station, Role or policy revisions. Evolution therefore requires explicit compatibility/migration policy rather than silently switching an active run to latest definitions. Camunda process-instance migration and Step Functions redrive both demonstrate revision-sensitive continuation semantics. Replay-compatible code evolution is a separate concern from business-level process migration.

## Failure semantics
Retry, resume, redrive, incident resolution, compensation and rollback are different operations. A retry creates a new attempt of a semantic operation; it must not create a new authorization grant. At-least-once delivery/replay requires deduplication or idempotency around external effects. Timeout proves a deadline was exceeded, not that the external side effect did not occur. Compensation is a new governed semantic action and does not restore arbitrary external reality.

## Extensibility and provider boundaries
Workflow definitions should reference semantic action/activity requirements. Concrete provider selection belongs to Provider/Binding/Capability Negotiation. Replacement is allowed only if the replacement satisfies the action contract and the run's authority/compatibility constraints. Provider replacement cannot enlarge data scope, action scope, or delegated authority.

## Governance and authority
A surface-triggered automation captures an authority envelope derived from actor + Enterprise/Station/Role policy + capability exposure + binding/action policy. Long-running execution must either preserve a bounded snapshot where policy permits or revalidate at defined checkpoints. Any current context that is narrower than the captured envelope narrows or pauses future effects; it never expands them. Delegated/subworkflow execution receives an attenuated grant.

## Observability
Evidence must correlate semantic operation, workflow run, activity invocation, attempt, provider binding revision, authority snapshot/revalidation, external receipt, approval/checkpoint, incident and recovery decision. Operational success is not proof of domain acceptance.

## Portability and lock-in
Durable semantics should not encode a vendor history format into portable definitions. Portable IR should express semantic operations, waits/events, deadlines, retry intent, compensation intent, approval/review checkpoints and capability requirements; provider/runtime adapters realize engine-specific mechanics. Engine-specific replay/history remains realization evidence.

## Product-specific mechanism vs universal primitive
Temporal replay markers, Zeebe incidents, Step Functions task tokens/redrive and Durable Functions orchestration APIs are product mechanisms. Universal candidates are revision-bound run context, semantic-operation/attempt separation, external-effect receipt, authority checkpoint/revalidation, durable human checkpoint, provider-neutral activity requirement and governed recovery transition.

## Convergent patterns
- Durable execution separates definition from run and step/attempt evidence.
- External effects require retry-aware semantics and explicit receipts/idempotency.
- Human/external waits are durable checkpoints, not in-memory pauses.
- Recovery is explicit and history-bearing.
- Version/evolution semantics matter for active executions.

## Divergent patterns
- Replay model and history format differ materially by engine.
- Redrive/retry counters and migration mechanics differ.
- Human-task semantics range from generic callbacks to first-class workflow tasks.
- Compensation support and guarantees differ and cannot be normalized as universal rollback.

## Subcapabilities
Definition/run identity; durable history; semantic operation/activity/attempt lineage; retry/idempotency; timeout/cancellation/deadline; external event deduplication; approval/review checkpoints; compensation; incident/recovery/redrive; definition migration/replay compatibility; authority snapshot/revalidation; provider-neutral activity binding; execution observability.

## Adaptive Governed Work Surfaces composition
AGWS owns surface personalization and bounded personal/supervised automation initiation; Workflow owns durable/team execution. `Enterprise → Station → Role → Person` supplies effective authority/exposure at initiation. Resume, retry, redrive, delegation and provider replacement cannot mint broader authority. If Station/Role/exposure changes, the workflow must revalidate before a future privileged effect according to policy; stale authority produces pause/escalation/termination, not silent continuation with obsolete privilege.

## SB comparison — evidence bounded
A targeted fresh-main GitHub code search for `workflow` and for workflow-execution identity terms returned no positive matches. This is only absence of evidence in those searches, not repository-wide proof that the SB lacks workflow-related contracts. Detailed repository archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **GENERALIZE** definition/run/attempt/evidence identity if repository archaeology finds narrower execution records.
- **PROVIDERIZE** concrete durable engines behind semantic activity requirements.
- **HARDEN** authority capture/revalidation and external-effect receipt semantics.
- **INTEGRATE** AGWS initiation with Workflow through a bounded authority envelope, not shared ownership.
- **DO_NOT_BUILD** a false universal rollback abstraction over compensation/provider side effects.
- **DEFER** engine-specific replay optimization until target provider/runtime selection.

## Repo-validation questions
1. What current contracts distinguish workflow definition, run, step and attempt?
2. Are action references semantic/provider-neutral or provider-specific?
3. Is idempotency/external-effect receipt modeled explicitly?
4. Can long-running work retain stale authorization after role/policy/provider changes?
5. Is there an existing approval/checkpoint/resume lineage?
6. Are migration/replay/version constraints represented?
7. Can generated runtimes execute durable work independently of Builder availability?

## Symbiotic Proof
A work surface starts a supervised automation using an external provider. The run records definition revision, semantic operation, effective Station/Role authority and binding revision. The provider times out after possibly accepting the request; retry creates a new attempt but uses an idempotency/receipt contract. During the wait, the actor loses a Role capability. Resume revalidates authority and pauses/escalates before any now-forbidden effect. Rebinding to another provider preserves the semantic action and cannot widen authority. A human approval resumes from a durable checkpoint. Recovery/redrive preserves lineage and does not rerun already-proven successful effects unless their contract explicitly permits it.

## Stable findings
- **G2-FINDING-WDE-17 — Semantic Operation, Workflow Run, Activity Invocation and Attempt Require Distinct Identities.** Retry/resume/redrive cannot be modeled as a new semantic authorization merely because execution mechanics create another attempt.
- **G2-FINDING-WDE-18 — Durable Execution Must Bind Definition Revision, Effective Authority and Provider-Binding Context.** A history without the semantic/authority/binding revisions cannot prove what was valid when an effect was attempted.
- **G2-FINDING-WDE-19 — Retry, Resume, Redrive and Delegation Must Be Authority-Non-Amplifying.** Every continuation is bounded by the original grant and applicable current constraints; no mechanism may mint broader privilege.
- **G2-FINDING-WDE-20 — External-Effect Safety Requires Attempt/Receipt/Idempotency Lineage Beyond Workflow History.** Timeout/replay/at-least-once delivery make engine history alone insufficient to prove whether an external effect occurred once.
- **G2-FINDING-WDE-21 — Long-Running Runs Need Explicit Authority-Revalidation Checkpoints.** Station/Role/capability-exposure changes must have a defined effect on future privileged actions; stale authority cannot silently survive indefinitely.
- **G2-FINDING-WDE-22 — Compensation Is a Governed Forward Semantic Action, Not Universal Rollback.** Provider/domain side effects may be irreversible or only compensatable under separate authority and evidence.

## Candidate capabilities
- `G2-CAPABILITY-CANDIDATE-AUTHORITY-REVALIDATED-DURABLE-CONTINUATION` — **CROSS_CUTTING / CANDIDATE**; promote only if Authorization, AI and AGWS research converge on one reusable continuation proof.
- `G2-CAPABILITY-CANDIDATE-EXTERNAL-EFFECT-ATTEMPT-RECEIPT-IDEMPOTENCY-LINEAGE` — **CROSS_CUTTING / CANDIDATE**; promote only if Integration/Provider/Observability findings converge.
- `G2-CAPABILITY-CANDIDATE-REVISION-BOUND-DURABLE-RUN-CONTEXT` — **CROSS_CUTTING / CANDIDATE**; promote only if Lifecycle/Process/Workflow synthesis confirms one shared context snapshot primitive.

## Value / risk / priority / next question
Value: very high for autonomous enterprise work and provider symbiosis. Risk: very high if retries or long-lived runs can duplicate effects or preserve obsolete privilege. Priority: foundational before personal/team automation acceptance. Next question: Integration & Automation must test whether trigger/event/action delivery, connector retries and external automation preserve these semantic-operation, receipt, authority and provider-neutral boundaries.
