# Workflow & Durable Execution — Revisit 5 / Cycle 6

## Research question
What additional portable semantics are required when durable workflows are replayed or recovered across changing workers, providers, runtime/configuration epochs and concurrent executors, so that checkpoint ownership, compatibility, effect guarantees, evidence joins, local/offline continuation and AGWS/AI initiation remain deterministic and authority-non-amplifying?

This pass is research-by-exception. Revisit 4 already established definition/run separation, typed control transitions, ambiguous-effect reconciliation, independent human-task authority, expected-generation controls, explicit in-flight provider migration, PARTIAL/INCONCLUSIVE propagation and qualified local closure. Revisit 5 therefore tests the still-open boundaries around worker compatibility, checkpoint fencing, scoped exactly-once claims, replay context, evidence retention and substitution.

## Representatives and evidence/source ledger
1. **Microsoft Azure Durable Functions / Durable Task** — event-sourced replay requires deterministic orchestrator code; direct external I/O is excluded from orchestrator functions; mutable environment values must be passed as input/activity results; orchestration versioning permanently associates an instance with a version and admits workers according to version compatibility. Official Microsoft documentation: Durable orchestrator code constraints, orchestration versioning and zero-downtime deployment.
2. **DBOS durable workflows** — recovery resumes from completed checkpoints; distributed recovery can temporarily produce competing/zombie executors; conflicting checkpoint/outcome commits are detected and the losing execution is parked. DBOS also distinguishes at-least-once step execution from exactly-once transactions when application writes and durability records share one atomic database transaction. Official DBOS documentation: Workflow Recovery, Concurrent Executions, Workflows, Transactions & Datasources.
3. **Restate durable execution** — execution journal persists actions/results, replay skips completed steps, retention is separately configurable for workflow state, idempotency keys and journals. This is useful adversarial evidence that durable replay semantics and post-hoc proof/evidence availability have distinct lifetimes. Official Restate documentation: Key Concepts, Workflows, Service Configuration.
4. **Prefect 3 transactions/deployments** — transaction lifecycle distinguishes BEGIN/STAGE/ROLLBACK/COMMIT and uses cache/result identity for idempotency; deployment versions record runnable configuration/code provenance while infrastructure work pools remain a separate execution realization. Official Prefect documentation: transactional workflows, deployment versioning and work pools.
5. **Temporal** — retained as a historical cross-check for durable event history, deterministic replay and worker versioning. This pass does not derive a new universal primitive solely from Temporal-specific machinery.

## Primitive and source-of-truth refinement
Portable workflow state needs typed identities, not one provider execution identifier:

`WorkflowDefinitionId + DefinitionRevision`
`WorkflowRunId + OriginDefinitionRevision`
`ExecutionGeneration / ControlRevision`
`CheckpointId + CheckpointRevision`
`ActivitySemanticId + AttemptId`
`WorkerCompatibilityProfileId + WorkerBuild/RealizationRef`
`ProviderBindingRevision`
`ExternalEffectCorrelationId + EffectGuaranteeProfile`
`Ownership/FencingEpoch`
`ObservedExecutionEvidence(revision-vector, position, freshness, provenance, retention-horizon)`

The semantic owner remains Workflow for durable orchestration state. Provider journals, DB rows, task hubs, worker build IDs and cloud execution identifiers are realization/evidence identities. The authoritative durable position is the accepted checkpoint/history lineage qualified by ownership/fencing and compatible execution revision, not merely the latest worker-local computation.

## Identity and lifecycle
A run may keep one semantic `WorkflowRunId` while its worker realization, provider binding or executor ownership changes. Conversely, a replayed process with the same definition is not automatically the same run. Identity continuity must therefore be explicit per identity kind.

Lifecycle remains typed: publish definition → admit run → schedule activity → attempt → checkpoint candidate → checkpoint accepted → effect reconciled → continue/replay/recover → migrate/forward-fix/compensate/quarantine → terminal qualification. Recovery additionally introduces executor ownership/fencing transitions. A recovered executor becoming runnable is not equivalent to becoming the unique durable checkpoint owner.

## Versioning and multi-axis effective revision
The effective execution revision is a vector, not one workflow version:

`DefinitionRevision × RunGeneration × WorkerCompatibilityProfile × WorkerBuild/Realization × ProviderBindingRevision × ActivityContract/SchemaRevision × PolicyRevision × TrustRevision × ConfigurationSnapshot × Ownership/FencingEpoch`.

Azure's orchestration versioning makes the compatibility relation visible: an instance remains associated with its creation version, newer workers can be configured to process older instances, while older workers must not process newer incompatible instances. This is stronger than storing a build label; the system needs an explicit compatibility/admission relation.

A conflict-free definition edit or successful deployment does not establish that an in-flight run can safely replay under that realization. In-flight semantic validity requires compatible history, activity contracts, configuration snapshot and worker/provider profile.

## Replay context: provenance, not ambient authority
Azure's deterministic replay constraints are direct evidence that time, randomness, environment variables and external I/O cannot be sampled as unconstrained ambient state inside replay-sensitive orchestration logic. Values that affect decisions must be captured through deterministic/history-backed inputs or activities.

Therefore cumulative workflow context must carry provenance and revision. It can explain why a prior decision occurred but cannot grant new policy, provider, secret, recovery or Station authority merely because it appears in history. On replay, current authorization/trust may have to be requalified for a new privileged actuation even when historical branch decisions remain reproducible.

## Checkpoint ownership and fencing
DBOS documents a distributed recovery race in which a prior executor can remain alive while another executor recovers the same workflow. Both may compute, but conflicting durable checkpoint/outcome commits are detected and one execution is parked. The portable primitive is not DBOS's exception type; it is **checkpoint ownership/fencing evidence**.

A checkpoint candidate is not durable truth until accepted against the expected run generation/fencing epoch. Recovery, worker replacement and failover must rotate or re-establish ownership. Stale executors must be unable to advance canonical durable position even if they still possess provider credentials or cached run state.

## Failure semantics and scoped effect guarantees
Durable systems legitimately expose different guarantees at different boundaries. DBOS steps may execute at least once, while a transaction can commit exactly once when the application's database write and DBOS durability record participate in the same atomic transaction. That guarantee cannot be generalized to arbitrary HTTP calls, payment APIs or other independently committed external systems.

The universal contract therefore needs an `EffectGuaranteeProfile` qualified by operation and boundary, for example:
- `CHECKPOINT_EXACTLY_ONCE` under a fenced canonical store;
- `AT_LEAST_ONCE_ATTEMPT` for an activity execution;
- `AT_MOST_ONCE_ACCEPTED` only when an explicit provider contract proves it;
- `ATOMIC_WITH_DURABILITY_RECORD` only where the business mutation and checkpoint share a transaction domain;
- `EXTERNAL_EFFECT_RECONCILIATION_REQUIRED` where outcome is ambiguous.

Unknown/expired idempotency or journal evidence propagates `PARTIAL/INCONCLUSIVE`; it never upgrades the guarantee.

## Composite-proof compatibility
A workflow proof is a join across definition/run identity, durable checkpoint position, worker compatibility, provider binding, activity/effect evidence, policy/trust and freshness. Required evidence must refer to compatible revisions/generations. A healthy worker executing revision N cannot prove a checkpoint from incompatible run generation N-1, and an effect receipt retained after the idempotency window has expired cannot prove a future retry is safe.

Restate's independently configurable workflow, idempotency and journal retention is useful evidence that replay capability and evidence/audit capability can have different horizons. Retention policy therefore participates in proof qualification without becoming workflow identity.

## Migration, rollback and forward-fix boundaries
Provider or worker substitution should be treated as admission plus realization migration. New runs may select a new compatible realization without migrating old histories. Existing runs require compatibility with their origin definition/history and any in-flight activity/effect obligations.

Rollback of deployment code does not roll back already committed external effects or canonical durable checkpoints. A forward-fix may be the only valid repair if historical code paths/evidence are no longer admissible. Compensation remains an explicit semantic transition; it is not a storage rewind.

## Governance and authority
Workflow exposes faceted operations: observe, initiate, signal, pause, resume, retry, reassign, migrate, compensate, quarantine, terminate, recover, alter compatibility policy and administer provider/worker bindings. None should imply the others.

`Enterprise → Station → Role → Person` remains AGWS-owned and monotonic. A Station/Role/Person may initiate or signal a workflow only within its effective authority. A task handle, replay context, worker credential, provider binding or checkpoint ownership token does not create domain, provider-admin, migration, compensation or recovery authority.

AI may propose/initiate an allowed transition through governed contracts, but deterministic validation and hard actuation enforcement remain outside the probabilistic model. AI/AGWS context is provenance/intent, not canonical workflow-edit or recovery authority.

## Observability
Operational evidence should expose semantic run ID, origin definition, run/control generation, worker compatibility/build, provider binding, checkpoint position, fencing/ownership epoch, replay/recovery lineage, effect guarantee profile, ambiguous effects, current authority qualification and evidence retention/freshness. Replay-safe logging must not be mistaken for semantic proof: duplicate or suppressed logs are observability behavior, not execution-state identity.

## Qualified local/offline closure
Safe local/offline continuation must close over more than executable bytes and history. It requires compatible worker code paths, definition/activity contracts, durable checkpoint/history, timers, configuration snapshot, provider bindings available locally, fencing/ownership state, trust/policy material, authority facts, effect-correlation/idempotency evidence and deterministic validators.

The closure has a trust/evidence horizon. If an idempotency key/journal, trust epoch, policy revision, assignment or provider lease expires while disconnected, privileged continuation becomes degraded/quarantined. Reconnection requires requalification before new privileged effects; historical deterministic replay does not imply current authority.

## Extensibility, provider boundaries, portability and lock-in
Universal primitives: typed semantic/run/checkpoint/activity/worker-realization identities; compatibility/admission relation; multi-axis effective revision; fencing/ownership; scoped effect-guarantee profile; deterministic context provenance; compatible composite proof; qualified local closure.

Provider-specific mechanisms: Azure task hubs/storage-provider internals and version matching implementation; DBOS executor IDs/conflict exceptions/Postgres transaction tables; Restate journal/idempotency retention implementation; Prefect cache keys/work pools/deployment records; Temporal event-history/build-ID machinery.

Portability remains layered: preserve/transport definition and evidence; interpret semantics; validate compatibility; realize on worker/provider; actuate only with authority. Being able to import history does not prove the destination can safely replay or actuate it.

## Convergent patterns
- Durable replay needs stable historical decision inputs and explicit handling of code/version evolution.
- A run and its worker/provider realization have different identity lifecycles.
- Recovery can create concurrent executors, so canonical checkpoint advancement needs ownership/conflict control.
- Effect guarantees are boundary-scoped; engine durability does not produce universal exactly-once external business effects.
- Evidence retention/freshness affects whether retry/recovery can be proven safe.
- New-run provider/worker substitution is easier than in-flight compatibility migration.

## Divergent patterns
- Azure uses explicit orchestration version matching; other engines express compatibility through worker/build deployment models or code discipline.
- DBOS can atomically couple application transaction and durability metadata inside one database domain; journal-based engines may use different boundaries.
- Providers differ on journal/history retention, replay mechanism, executor ownership and public recovery controls. These remain realization details unless multiple representatives establish a portable semantic need.

## Subcapabilities
Definition/run identity; worker compatibility/admission; durable history/checkpoints; fencing/ownership; deterministic replay context; activity/effect guarantee profiles; retries/recovery; external-effect reconciliation; human tasks; migration/forward-fix/compensation; provider/worker substitution; evidence retention; qualified local/offline execution; observability and proof qualification.

## Comparison with SB
A bounded default-branch GitHub code search for `workflow` returned no result during this pass. This is only evidence for that bounded indexed query; it is not a repository-wide absence claim. Full SB current-state archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`, so no implementation-level KEEP/REPLACE claim is made without repository evidence.

## Reconciliation hypotheses
- **KEEP:** Workflow as semantic owner of durable orchestration state, distinct from Process Modeling, Integration and provider runtimes.
- **HARDEN:** typed checkpoint identity, ownership/fencing epoch, worker compatibility profile, scoped effect guarantees and evidence-retention qualification.
- **GENERALIZE:** compatibility/admission and composite-proof joins across worker/provider/schema/policy/trust revisions.
- **PROVIDERIZE:** journal encoding, executor IDs, task hubs, build-ID routing, provider-specific conflict exceptions and transaction tables.
- **INTEGRATE:** Authorization, Provider Binding, Integration, Observability, Evidence/Provenance and AGWS through non-amplifying contracts.
- **DEFER:** any generic cross-provider in-flight history converter until representability is proven.
- **DO_NOT_BUILD:** a universal `exactly once` label for arbitrary external effects or a replay mechanism that reads mutable ambient authority/config as deterministic state.

## Repository-validation questions
1. Does SB distinguish semantic run/checkpoint identity from worker/provider realization identity?
2. Is there a compatibility/admission contract for executing an existing run on a new worker/build/provider revision?
3. Can a stale/zombie executor advance canonical checkpoint state, or is there expected-generation/fencing protection?
4. Are exactly-once/idempotency claims qualified by operation boundary and retention window?
5. Is mutable runtime/environment context captured deterministically rather than read ambiently during replay-sensitive decisions?
6. Can required evidence with incompatible generation/trust/provider revisions yield `INCONCLUSIVE`?
7. Is local/offline recovery closed over worker compatibility, fencing and effect evidence, followed by reconnection requalification?
8. Can AGWS/AI initiate work without gaining workflow-definition, migration, compensation or recovery authority?

## Symbiotic Proof
A Station-authorized user initiates workflow definition revision D7. The run records D7 and a compatible worker profile. Executor A loses connectivity after computing a step but before checkpoint confirmation; executor B recovers the run under a new fencing epoch. A later checkpoint from stale executor A is rejected. A database mutation coupled atomically with durability metadata may be proven once inside that transaction domain, while a timed-out external API remains ambiguous and is reconciled before retry. A newer worker can process the old run only if its compatibility profile admits D7/history; otherwise the run remains on an older compatible realization or is explicitly migrated/forward-fixed. If the Station operates offline, missing/expired trust or idempotency evidence forces quarantine. On reconnection, current authority and evidence are requalified. AI can propose a retry or signal but cannot alter D7, migration, compensation or recovery authority.

## Stable findings
- **G2-FINDING-WDE-37 — Workflow Identity Is Typed Across Definition, Run, Checkpoint, Activity, Worker Realization and Provider Binding.** Provider execution IDs or worker builds cannot define canonical run/checkpoint identity.
- **G2-FINDING-WDE-38 — Effective Durable Execution Is a Multi-Axis Compatibility Revision Vector.** Definition, run generation, worker compatibility/build, provider binding, activity/schema, configuration, policy, trust and ownership epochs may advance independently.
- **G2-FINDING-WDE-39 — Durable Checkpoint Acceptance Requires Ownership/Fencing, Not Merely Successful Computation.** Concurrent/zombie executors may compute the same run; stale ownership must not advance canonical durable position.
- **G2-FINDING-WDE-40 — Replay-Sensitive Context Must Be Deterministically Captured Provenance, Not Mutable Ambient State or Authority.** Time/config/external values affecting decisions require history-backed capture; replay context never self-authorizes new actuation.
- **G2-FINDING-WDE-41 — Exactly-Once and Idempotency Claims Are Operation- and Transaction-Domain-Qualified.** Atomic application-write + durability-record commits can justify a narrow exactly-once claim; arbitrary external effects remain separately reconciled.
- **G2-FINDING-WDE-42 — Worker/Provider Substitution Is a Compatibility Admission Relation, Not a Mere Deployment Change.** New realizations may process existing runs only when origin history/contracts are compatible or an explicit migration succeeds.
- **G2-FINDING-WDE-43 — Composite Workflow Proof Requires Revision-Compatible Checkpoint, Worker, Effect, Policy/Trust and Retention Evidence.** Incompatible, stale or expired required evidence propagates `INCONCLUSIVE`.
- **G2-FINDING-WDE-44 — Qualified Local Durable-Execution Closure Includes Compatibility, Fencing and Evidence Horizons.** Offline replay may reproduce history while privileged continuation remains blocked until authority/trust/effect evidence is fresh and reconnection is requalified.

## Capability candidates
| Candidate | Classification | Status | Rationale |
|---|---|---|---|
| `G2-CAPABILITY-CANDIDATE-WDE-TYPED-EXECUTION-CHECKPOINT-WORKER-IDENTITY-MAPPING` | CROSS_CUTTING | CONSOLIDATION_CANDIDATE | Specializes UCA typed-identity continuity for workflow definition/run/checkpoint/activity/worker/provider kinds. |
| `G2-CAPABILITY-CANDIDATE-WDE-MULTI-AXIS-EXECUTION-COMPATIBILITY-REVISION-VECTOR` | CROSS_CUTTING | CONSOLIDATION_CANDIDATE | Reconcile with Lifecycle/UCA revision vectors while retaining workflow-specific replay compatibility. |
| `G2-CAPABILITY-CANDIDATE-WDE-CHECKPOINT-OWNERSHIP-FENCING-EVIDENCE` | CORE_SUBCAPABILITY | PENDING_SYNTHESIS | Multiple executor/recovery evidence establishes a Workflow-owned need for canonical checkpoint fencing. |
| `G2-CAPABILITY-CANDIDATE-WDE-SCOPED-EFFECT-GUARANTEE-PROFILE` | CROSS_CUTTING | CONSOLIDATION_CANDIDATE | Reconcile Integration/Data transaction guarantees without creating a generic exactly-once fiction. |

No candidate is promoted in this pass. Adaptive Governed Work Surfaces remains promoted and distinct.

## Architecture proof-backfill obligations
1. Positive identity: semantic run survives compatible worker/provider realization change without changing run identity.
2. Adversarial fencing: zombie executor cannot checkpoint after ownership/fencing epoch changes.
3. Version: old run is rejected by incompatible worker even when deployment itself is healthy.
4. Determinism: mutable environment/time/random/external values cannot silently change replay decisions.
5. Effect boundary: narrow atomic transaction proof cannot be reused to claim exactly-once for an external API.
6. Composite evidence: mismatched checkpoint/worker/provider/trust generations yield `INCONCLUSIVE`.
7. Retention: expired idempotency/journal evidence blocks unsafe retry/recovery assumptions.
8. Provider: new runs can select a new realization while incompatible in-flight runs remain pinned or require explicit migration.
9. Authority: AGWS/AI workflow initiation does not confer definition-edit, migration, compensation, recovery or provider-admin authority.
10. Offline: local replay with expired trust/effect evidence remains quarantined until reconnection requalification.
11. Recovery: worker failover rotates ownership without erasing prior checkpoint/effect lineage.
12. Forward-fix: deployment rollback cannot erase already committed durable/external state; repair is explicit.

## Value / risk / priority / next question
**Value:** very high; durable workflow correctness is foundational for long-lived autonomous enterprise operations. **Risk:** replay under incompatible workers, unfenced recovery or unqualified exactly-once claims can duplicate or corrupt business effects while appearing durable. **Priority:** very high. **Next question:** Integration & Automation must be revisited next to determine how trigger/subscription/delivery ownership, transport-level deduplication and external-effect guarantees compose with Workflow checkpoint/effect profiles without duplicated semantic ownership.
