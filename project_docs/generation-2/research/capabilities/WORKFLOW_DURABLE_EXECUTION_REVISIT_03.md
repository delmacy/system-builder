# Generation 2 — Workflow & Durable Execution — Revisit 3 / Cycle 4

## Research question
How should System Builder distinguish workflow semantic revision, in-flight durable run revision, governed migration, recovery/redrive, human-task assignment and runtime replacement so long-running work remains auditable, portable and bounded by the authority that initiated it?

## Representatives and evidence ledger
1. **Camunda 8 process-instance migration — DEEP.** Migration requires an explicit plan and source→target element mappings. Active element types constrain valid mappings; jobs, expressions and input mappings are not automatically recreated or reevaluated. User-task migration can preserve candidate/due/form metadata while current assignee semantics may change. Source: https://docs.camunda.io/docs/components/concepts/process-instance-migration/
2. **Camunda 8 incidents — DEEP.** Incidents stop process advancement at a specific execution point after conditions such as exhausted retries and require explicit resolution before continuation. Source: https://docs.camunda.io/docs/components/concepts/incidents/
3. **AWS Step Functions versions/aliases/redrive — DEEP.** Versions are immutable snapshots; aliases route new executions. Execution-version association occurs at start. Redrive preserves prior successful history, execution identity/input and original definition/version/alias association even if an alias later changes. Sources: https://docs.aws.amazon.com/step-functions/latest/dg/concepts-cd-aliasing-versioning.html ; https://docs.aws.amazon.com/step-functions/latest/dg/execution-alias-version-associate.html ; https://docs.aws.amazon.com/step-functions/latest/dg/redrive-executions.html
4. **Azure Durable Functions external events — DEEP.** External events may be at-least-once depending on backend, so portable orchestration benefits from event IDs/deduplication. Human/external waits should normally be bounded by durable timers/deadlines. Source: https://learn.microsoft.com/en-us/Azure/Azure-functions/durable/durable-functions-external-events
5. **Temporal durable execution — PARTIAL/DEEPENED.** Temporal remains strong evidence for long-lived crash-resume semantics; engine-specific replay/code-evolution mechanics remain realization-specific and should not leak into portable workflow semantics. Source: https://docs.temporal.io/

## Core primitives
Minimum identities are `WorkflowSemanticRevision`, `WorkflowRun`, `ExecutionRealizationRevision`, `ActivityInvocation`, `Attempt`, `HumanTask`, `AssignmentRevision`, `MigrationPlan`, `MigrationAttempt`, `RecoveryDecision`, `ExternalEffectReceipt` and `PostconditionEvidence`.

A running workflow is not "the latest definition". New executions may route to new revisions while old executions remain bound to prior semantics. Migration, resume/redrive, retry and restart-as-new are distinct transitions.

## Governed migration
Reusable migration lifecycle:
`MigrationIntent → Plan → Validation → Approval/AuthorityDecision → Attempt → PostconditionEvidence → Commit/Abort/Recovery`.

Validation must cover active-state semantic compatibility, state/data mapping, human-task/assignment consequences, provider binding compatibility, Station/exposure freshness and recovery feasibility. API success alone does not prove semantic continuity.

## Human task / work queue identity
Human tasks are durable work state, not UI rows. Assignment, candidate set, Station/Role exposure, due dates, projection/form and required authority may evolve independently. Camunda migration evidence shows task continuity cannot be inferred from successful element mapping alone.

Portable task evidence should bind `TaskSemanticIdentity`, `RunRevision`, `AssignmentRevision`, `AuthorityRequirement`, `StationExposureRevision`, `ProjectionRevision`, `CompletionEvidence` and delegation/escalation lineage.

## Recovery and replay
Retry, incident resolution, resume, redrive, replay and restart-as-new are different. Recovery must state what identity/state/history is preserved, what is reattempted, and which authority/provider/dependency facts require revalidation. Recovery cannot silently upgrade a run to a new semantic revision; that requires migration or a new run with explicit lineage.

## Provider/runtime replacement
Portable definitions should express semantic activity requirements rather than engine history instructions. Replacing a runtime for in-flight work requires proof of definition interpretability, state/history transformation or bounded restart, idempotency/effect receipt compatibility, equivalent-or-narrower authority enforcement, human-task continuity, timer/event semantics and observable postconditions.

## Qualified local/offline execution closure
Offline durable execution needs an exact definition/interpreter/runtime revision, durable state/history store, required bindings, trust/policy material, timer/event semantics, authority-check strategy, recovery procedure and evidence-export path. A cached workflow definition alone does not prove safe autonomous execution.

## AGWS → Team Workflow handoff
AGWS may initiate personal/supervised automation, but durable Team Workflow begins through an explicit semantic handoff carrying an attenuated authority envelope and Station capability-exposure revision. Promotion from personal automation to Team Workflow is governed change, not inheritance of broader organizational privilege.

Suggested handoff lineage:
`InitiatingSurfaceRevision → StationExposureRevision → Actor/RoleContext → SemanticWorkflowRequirement → AuthorityEnvelope → BindingSelection → WorkflowRun`.

## Product-specific mechanism vs universal primitive
Product-specific: Camunda mapping instructions/incidents, Step Functions aliases/redrive, Durable Functions backend event semantics, Temporal replay/history mechanics.

Universal: semantic/run/realization revision coexistence; governed migration evidence; recovery preservation declaration; human-task assignment-authority lineage; qualified local durable-execution closure; explicit AGWS→Team Workflow bounded handoff; runtime replacement as migration for in-flight work.

## Convergent patterns
- Long-lived runs remain tied to historical context instead of silently following latest definitions.
- Migration is explicit and constrained by active state.
- Recovery is history-preserving and distinct from migration/new execution.
- Human/external waits are durable state requiring identity and deadlines.
- External effects require deduplication/idempotency beyond engine history.

## Divergent patterns
- Live migration support differs materially by engine.
- Replay/history formats and code-compatibility mechanisms differ.
- Human-task semantics range from first-class tasks to callbacks.
- Redrive/retry preserved state and counters differ.

## SB comparison — evidence bounded
No new fresh-main implementation claim is made. Detailed repository archaeology remains for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`. This revisit only defines what that phase must verify.

## Reconciliation hypotheses
- **GENERALIZE** workflow identity into semantic revision/run/realization/activity/attempt where repo evidence warrants.
- **HARDEN** migration, recovery and human-task authority evidence.
- **PROVIDERIZE** engine/runtime realization behind semantic activity requirements.
- **INTEGRATE** AGWS→Workflow through an explicit bounded authority handoff and Station exposure revision.
- **DO_NOT_BUILD** a universal engine-history format or implicit latest-version upgrade of active runs.
- **DEFER** provider-specific live-migration optimizations until provider selection.

## Repo-validation questions
1. Is workflow semantic identity distinct from execution realization and run history?
2. Can active runs be explicitly migrated with persisted evidence?
3. Are human-task assignment/candidate/authority revisions first-class?
4. Can recovery distinguish redrive/resume/retry from migration or restart-as-new?
5. Are Station capability-exposure revisions bound to initiation and privileged checkpoints?
6. Can provider/runtime replacement preserve or explicitly transform in-flight state?
7. Can an autonomous generated runtime prove local durable-execution closure without Builder availability?

## Symbiotic Proof
A Person-level AGWS supervised automation is promoted to Team Workflow only after explicit approval. The run binds semantic revision, Station exposure revision, bounded authority and provider binding. While a human task waits, a new workflow version deploys and the user's Role changes. New runs may use the new version, but the in-flight run remains revision-bound. A migration plan validates active state, assignment authority and provider compatibility, receives approval, attempts migration and records postconditions. If unsafe, the old run continues or is explicitly terminated/restarted with lineage. Provider failure recovery does not alter semantic revision or widen authority. Offline continuation is allowed only when the local closure profile is complete.

## Stable findings
- **G2-FINDING-WDE-23 — Workflow Semantic Revision, In-flight Run Revision and Execution Realization Revision Must Coexist Without Identity Collapse.** Latest definition, running instance and runtime/provider realization are independently versioned subjects.
- **G2-FINDING-WDE-24 — Workflow Migration Is a Governed Plan/Validation/Approval/Attempt/Postcondition Transition.** Successful migration invocation does not prove active-state semantics, authority, human tasks or provider obligations were preserved.
- **G2-FINDING-WDE-25 — Human-task Assignment and Authority Require Independent Revision Lineage Across Migration.** Element continuity can coexist with changed assignment/candidate/exposure semantics.
- **G2-FINDING-WDE-26 — Recovery/Redrive Must Declare Preserved Identity and Cannot Implicitly Upgrade Semantic Revision.** New semantics require migration or a new run with lineage.
- **G2-FINDING-WDE-27 — Qualified Local Durable-execution Closure Requires Interpreter, State, Bindings, Trust, Authority and Recovery Dependencies.** Cached definition alone is insufficient for safe offline execution.
- **G2-FINDING-WDE-28 — AGWS Personal/Supervised Automation to Team Workflow Requires an Explicit Attenuated Authority Handoff.** Promotion or durable continuation cannot inherit broader organizational authority implicitly.

## Candidate capabilities
- `G2-CAPABILITY-CANDIDATE-DURABLE-RUN-MIGRATION-PLAN-ATTEMPT-EVIDENCE` — **CROSS_CUTTING / CANDIDATE / MERGE_TARGET**; likely workflow specialization of the shared semantic migration contract.
- `G2-CAPABILITY-CANDIDATE-HUMAN-TASK-ASSIGNMENT-AUTHORITY-LINEAGE` — **CROSS_CUTTING / CANDIDATE**; promote only if Authorization/Governance/AGWS confirm ownership beyond Workflow.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-DURABLE-EXECUTION-CLOSURE` — **CROSS_CUTTING / CANDIDATE / MERGE_TARGET**; likely execution specialization of `QUALIFIED-LOCAL-CLOSURE-PROFILE`.

No candidate is promoted in this run.

## Value / risk / priority / next question
Value and priority are foundational; risk is critical if migration/recovery can alter semantics or authority silently. Next: **Integration & Automation** should test whether trigger subscriptions, connector revisions, delivery attempts and provider replacement reuse these revision-bound migration/evidence primitives without conflating workflow ownership with delivery mechanics.
