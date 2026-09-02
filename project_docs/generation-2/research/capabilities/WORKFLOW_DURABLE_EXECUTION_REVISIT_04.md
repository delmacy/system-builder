# Workflow & Durable Execution — Revisit 4 / Cycle 5

## Research question
What portable semantics must the System Builder own for long-lived execution so that definition evolution, retry/redrive/replay, human work, external side effects, provider replacement, recovery and Station-scoped automation remain deterministic, evidence-qualified and authority-non-amplifying without turning Workflow into the owner of domain models, providers or authorization?

## Representatives and evidence ledger
1. **AWS Step Functions Standard Workflows** — redrive preserves successful history/results, resumes unsuccessful states, remains pinned to the original state-machine definition/version/alias, appends redrive history and has explicit eligibility windows/history limits. Official AWS documentation.
2. **Camunda 8 / Zeebe** — process instances carry process-definition identity/version; incidents stop advancement after retries; instance migration requires explicit source→target mapping and does not automatically recreate jobs/input mappings. Official Camunda documentation.
3. **Temporal** — prior-cycle evidence remains authoritative for deterministic replay, durable event history and Worker Versioning; this revisit uses it as the principal contrast for code evolution and in-flight execution compatibility.
4. **Restate durable execution** — prior evidence remains useful for journaled execution/idempotency boundaries; retained as supporting representative pending a later dedicated exception-driven revisit.

Primary evidence used this pass: AWS Step Functions redrive/error handling; Camunda 8 incidents/process-instance migration. Scientific literature remains required where it materially challenges exactly-once/idempotency assumptions; no product mechanism is promoted to a universal primitive merely because a representative implements it.

## Source of truth and identity
Portable identity must distinguish at least:

`WorkflowDefinitionId + DefinitionRevision`
`WorkflowRunId + OriginDefinitionRevision`
`ExecutionGeneration / ControlRevision`
`Step/TaskSemanticId`
`AttemptId / RedriveId / ReplayId`
`ExternalEffectCorrelationId`
`HumanTaskId + Assignment/AuthorityRevision`
`ObservedExecutionEvidence(generation, position, freshness, provenance)`

A workflow run is not identical to its latest code revision. AWS redrive demonstrates that a failed execution can remain attached to the original definition/version even after an alias changes. Camunda migration demonstrates that moving an active instance to a new definition is an explicit transition rather than an implicit semantic upgrade.

## Lifecycle and versioning
Definition publication, run creation, step attempt, retry, redrive, replay, resume, instance migration, termination, compensation, quarantine and recovery are distinct transitions. A provider may expose only a subset. Provider support does not authorize the transition.

`retry` repeats an operation under the same semantic step policy; `redrive` resumes/re-enters an unsuccessful execution region while preserving prior successful history where supported; `replay` reconstructs execution from durable history and must remain deterministic relative to the compatible code/profile; `migrate` changes the definition/profile governing an in-flight run and therefore requires explicit mapping and postconditions; `compensate` executes modeled semantic repair and is not rollback-by-erasure; `quarantine` intentionally prevents further actuation when outcome or authority is ambiguous.

## Failure semantics
### Ambiguous external side effects
A timeout/lost acknowledgement cannot be interpreted as `not executed`. Durable execution therefore needs an explicit ambiguous-outcome disposition: reconcile by external correlation/idempotency evidence, quarantine for review, or perform a separately authorized compensating transition. Blind retry is unsafe when the external effect is not proven idempotent.

### PARTIAL / INCONCLUSIVE
Missing provider state, missing event-history segment, stale assignment authority, unavailable external-effect evidence or incompatible migration mapping must propagate `PARTIAL`/`INCONCLUSIVE`; the engine must not manufacture success by dropping the missing dependency.

### Incident versus recovery
Camunda incidents demonstrate a useful separation: an execution can be durable yet intentionally stuck pending remediation. Recovery evidence must prove that the relevant generation/incident was resolved and that resumed actuation is still authorized.

## Human task and approval authority
Human-task assignment, delegation and approval evidence are independently revisioned from workflow code. Migrating a process definition must not silently rewrite who may approve already-issued work. Reassignment/delegation is a governed transition with actor, scope, expiry/freshness and lineage.

For AGWS, `Enterprise → Station → Role → Person` remains monotonic. A personal surface can expose a task or personal automation only inside the effective Station/Role authority envelope. Workflow possession of a task token or provider credential never expands that authority.

## Concurrency and mutable execution controls
Commands such as migrate, terminate, retry, redrive, reassign, compensate and resume should carry expected-base/generation preconditions. Two operators or agents acting on stale execution state must produce a conflict or requalification requirement rather than last-write-wins control mutation.

## Provider boundaries and portability
The universal contract should own semantic workflow/run/task/transition/evidence identities, not Temporal histories, Zeebe keys or Step Functions ARNs. Provider bindings realize those semantics.

Provider replacement for new runs is easier than in-flight migration. In-flight replacement requires an explicit migration plan that accounts for definition revision, durable position, timers, outstanding human tasks, external-effect correlations, retry counters/policies, compensation state, provider-specific opaque state and postcondition evidence. If any required state cannot be represented, the migration is `INCONCLUSIVE`/unsupported rather than lossy.

## Governance and observability
Every execution-control transition needs actor/authority, expected generation, reason, attempt, result and postcondition evidence. Observability must expose definition revision, run generation, durable position/checkpoint, incident state, retry/redrive/replay lineage, outstanding human work and ambiguous external effects without equating telemetry presence with semantic conformance.

## Qualified local/offline closure
A locally recoverable durable workflow profile must close over the workflow definition/revision, executable code/artifacts, durable history/checkpoint, timers/deadlines, provider bindings required locally, trust/config material, human-task/authority facts required for safe continuation, external-effect correlation evidence and deterministic validators. If an external dependency cannot be proven available/fresh, continuation is degraded/read-only/quarantined rather than authority-amplifying.

## Extensibility, portability and lock-in
Provider-specific retry syntax, event-history encoding, task tokens, migration APIs and execution IDs are realization details. Portable definitions may declare required semantics (durability, timer behavior, human task, compensation, idempotency/reconciliation profile, migration support) and negotiate a provider that can satisfy them. Unsupported semantics must fail admission or require explicit degraded-profile approval; they must not be silently weakened.

## Product-specific mechanism vs universal primitive
**Universal:** semantic definition/run/task identity; revision/generation; transition taxonomy; expected-base preconditions; attempt/effective/postcondition evidence; human authority lineage; ambiguous-effect disposition; provider-neutral durability requirements; qualified closure.

**Product-specific:** Step Functions ARN/redrive window/history limit; Camunda processInstanceKey/incident/job semantics; Temporal event-history/Worker Versioning implementation; Restate journal implementation.

## Convergent patterns
- Long-lived runs remain tied to explicit definition identity/revision unless deliberately migrated.
- Recovery/retry/redrive append lineage rather than erasing prior attempts.
- Durable execution can stop in a recoverable incident state instead of pretending progress.
- In-flight migration is constrained and cannot assume all runtime artifacts are recreated.
- External effects require idempotency/correlation/reconciliation semantics beyond engine durability.

## Divergences
- Providers differ substantially on redrive/replay semantics, migration support, retention windows and provider-visible execution state.
- Some providers preserve one logical execution identity across redrive; others model retries/restarts differently. SB should therefore own semantic transition identity rather than normalize provider IDs.

## Subcapabilities
Definition/version binding; durable run history; execution-control transitions; retry/redrive/replay; human tasks/approvals; timers; external-effect idempotency/reconciliation; compensation; incidents/quarantine; in-flight migration; provider substitution; local/offline recovery; evidence qualification.

## Comparison with fresh main
A bounded default-branch code search for `workflow durable execution` returned no result in this run. This is evidence only for that bounded query and is **not** a repository-wide absence claim. Full SB archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **KEEP:** durable execution as a distinct capability from Process Modeling and Integration.
- **HARDEN:** explicit run generation, control-transition lineage, human authority lineage and ambiguous external-effect disposition.
- **GENERALIZE:** retry/redrive/replay/migrate/compensate/quarantine as typed governed transitions, not one generic retry primitive.
- **PROVIDERIZE:** engine-specific history/task/migration mechanics.
- **INTEGRATE:** provider negotiation, evidence/provenance, authorization, incident/recovery and AGWS task surfaces through contracts.
- **DO_NOT_BUILD:** a universal exactly-once claim across arbitrary external side effects.

## Repository-validation questions
1. Does main distinguish workflow definition revision from in-flight run revision/generation?
2. Are retries and external side effects correlated/idempotency-qualified?
3. Can human-task authority be revised independently of workflow code?
4. Are mutable execution controls protected by expected-base/generation semantics?
5. Is provider replacement modeled for new runs only, or can in-flight state be migrated losslessly?
6. Can missing durable/external evidence yield `INCONCLUSIVE` rather than false success?
7. Does any current workflow primitive accidentally imply authorization from possession of an execution/task handle?

## Symbiotic Proof
A portable workflow starts on provider A, pauses on a human approval exposed through a Station surface, performs an external provider-bound action with correlation evidence, then encounters a failure. A redrive/retry does not rerun proven-successful effects; an ambiguous effect is quarantined until reconciled. The workflow definition is upgraded, but the existing run remains on its origin revision until an authorized migration with mapping/postconditions succeeds. Provider B can be selected for new runs; in-flight transfer is allowed only if all required state is representable. A Person-level automation cannot migrate, reassign or compensate beyond Station/Role authority. Offline continuation is admitted only when the qualified local closure is complete.

## Stable findings
- **G2-FINDING-WDE-29 — Durable Run Identity Must Remain Independent of Latest Workflow Definition Revision.** Long-lived executions cannot silently inherit newly published code/definitions.
- **G2-FINDING-WDE-30 — Retry, Redrive, Replay, Resume, Migration, Compensation and Quarantine Are Distinct Governed Transitions.** They have different preconditions, authority and postconditions.
- **G2-FINDING-WDE-31 — External-Side-Effect Ambiguity Requires Correlation/Reconciliation or Quarantine, Not Blind Retry.** Engine durability is not exactly-once business effect.
- **G2-FINDING-WDE-32 — Human-Task Assignment and Approval Authority Have Independent Revision Lineage.** Workflow evolution cannot silently rewrite already-issued authority.
- **G2-FINDING-WDE-33 — Mutable Execution Controls Require Expected-Generation/Ownership Preconditions.** Stale concurrent control actions must conflict/requalify.
- **G2-FINDING-WDE-34 — In-Flight Provider Replacement Is a State Migration With Explicit Representability and Postcondition Proof.** New-run provider substitution does not prove in-flight portability.
- **G2-FINDING-WDE-35 — Missing Durable/External Dependency Evidence Propagates PARTIAL/INCONCLUSIVE.** Missing history, assignment, provider or effect evidence cannot be normalized into success.
- **G2-FINDING-WDE-36 — Qualified Local Durable-Execution Closure Must Include Authority and External-Effect Evidence.** Local bytes/history alone are insufficient for safe continuation.

## Architecture proof-backfill obligations
1. Positive: run remains pinned to origin definition until explicit migration.
2. Adversarial: ambiguous external effect followed by retry does not duplicate the domain effect.
3. Version: migration to incompatible definition is rejected or `INCONCLUSIVE` without complete mapping.
4. Authority: stale/revoked human assignment cannot approve after workflow revision or Station/Role change.
5. Concurrency: two conflicting execution-control commands against the same generation cannot both silently apply.
6. Provider: provider B can take new runs without changing semantic workflow identity; in-flight migration requires representability proof.
7. Failure/recovery: incident/redrive/replay lineage remains observable and prior successful effects are not erased.
8. Offline: incomplete local closure prevents unsafe actuation and yields degraded/quarantined behavior.
9. AGWS: Person automation cannot migrate/compensate/reassign outside effective Station/Role authority.
10. Evidence: stale or missing history/provider/effect evidence yields `PARTIAL`/`INCONCLUSIVE`.

## Value / risk / priority / next question
**Value:** foundational for autonomous enterprise processes and provider-neutral runtime autonomy. **Risk:** false exactly-once assumptions and lossy in-flight migration can corrupt external business state. **Priority:** very high. **Next question:** how Integration & Automation should own trigger/subscription/external-delivery semantics while Workflow owns durable orchestration state, without duplicate retry/idempotency ownership.
