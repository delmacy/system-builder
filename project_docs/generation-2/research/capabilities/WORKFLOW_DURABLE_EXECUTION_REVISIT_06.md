# Workflow & Durable Execution — Revisit 6 / Cycle 7

## Research question
What additional universal semantics are required when durable-workflow claims must remain applicability-scoped, replayable and authority-safe across evolving definitions, workers, checkpoints, providers, evidence-retention windows, mixed runtime stability, local/offline continuation and AGWS-triggered automation?

This is research-by-exception. Revisit 5 already established typed definition/run/checkpoint/activity/worker/provider identities, multi-axis compatibility, checkpoint fencing, deterministic replay context, transaction-domain-scoped exactly-once claims, substitution admission, compatible composite proof and qualified local closure. Revisit 6 stress-tests the cycle-7 UCA findings: applicability-scoped claims, evidence replay horizons, revision-qualified conformance, mixed stability/support vectors and dual-representation drainage.

## Representatives and evidence/source ledger
1. **Azure Durable Functions / Durable Task orchestration versioning** — each orchestration instance is permanently associated with a version; newer workers may process older instances while older workers are prevented from processing newer incompatible instances; breaking code changes can cause nondeterminism or stuck/failing in-flight instances. Source of truth: Microsoft Learn, `durable-orchestration-versioning` and zero-downtime deployment guidance, updated 2026-08-05. https://learn.microsoft.com/en-us/azure/durable-task/common/durable-orchestration-versioning ; https://learn.microsoft.com/en-us/azure/azure-functions/durable-functions/durable-functions-versioning
2. **DBOS workflows / recovery / concurrent executions / datasources** — recovery can create concurrent zombie executors; checkpoint/outcome conflicts park the loser; steps are at-least-once while database transactions are exactly-once only when application mutation and durability record share one atomic database transaction. Sources: https://docs.dbos.dev/explanations/concurrent-executions ; https://docs.dbos.dev/production/workflow-recovery ; https://docs.dbos.dev/typescript/reference/datasource
3. **Restate workflows / service configuration / invocation state** — durable execution replays from journals, while workflow retention, idempotency retention and journal retention are independently configurable and can expire at different times. Sources: https://docs.restate.dev/tour/workflows ; https://docs.restate.dev/services/configuration ; https://docs.restate.dev/services/introspection
4. **Prefect 3 deployment versioning / work pools** — deployment versions preserve a history of versioned runnable configuration while some operational properties intentionally remain unversioned across rollback/promotion; work pools remain a separate infrastructure realization. Sources: https://docs.prefect.io/v3/how-to-guides/deployments/versioning ; https://docs.prefect.io/v3/concepts/work-pools
5. **Prior Workflow, UCA, Lifecycle, Provider, Security and AGWS Generation-2 research** — historical authority for typed identities, claim applicability, authority attenuation, evidence horizons and migration closure. No new claim is derived solely from prior SB hypotheses.

## Source of truth and universal primitives
Workflow remains semantic owner of durable orchestration state; provider journals, task hubs, scheduler rows and worker build IDs are realizations/evidence, not canonical business identity.

Portable primitives now require:

`WorkflowDefinitionId + DefinitionRevision`
`WorkflowRunId + OriginDefinitionRevision`
`ExecutionGeneration / ControlRevision`
`CheckpointId + CheckpointRevision`
`ActivitySemanticId + AttemptId`
`WorkerCompatibilityProfileId + WorkerRealizationRef`
`ProviderBindingRevision`
`Ownership/FencingEpoch`
`EffectCorrelationId + EffectGuaranteeProfile`
`ApplicabilityScope(run-class, definition/profile, Station/authority scope, provider/runtime support scope)`
`ConformanceClaim(subject, profile, evaluator, revision-vector, evidence-ref)`
`EvidenceReplayHorizon`
`RuntimeSupportVector(worker, SDK/protocol, provider, storage/journal, activity-contract, policy/trust)`
`DrainageClosure(old-realization cohorts, in-flight runs, residual timers/effects, retained history)`

## Identity, lifecycle and applicability
A workflow claim such as `replayable`, `recoverable`, `exactly-once`, `compatible`, `offline-capable` or `migration-safe` is not a global property of a definition or engine. It applies to a typed subject and scope: run generation, origin definition, worker compatibility profile, provider binding, activity/effect boundary, policy/trust epoch, Station/authority scope and retained evidence.

Lifecycle remains: definition admitted → run created → activity scheduled → attempt → checkpoint candidate → checkpoint accepted → effect reconciled → continue/replay/recover → migrate/forward-fix/compensate/quarantine → terminal qualification → retention/drainage closure. Historical completion does not keep every evidence artifact replayable forever.

## Revision-qualified replay and checkpoint compatibility
Azure orchestration versioning directly proves that instance version and worker version evolve separately and require an explicit compatibility rule. A code deployment can be healthy for new runs while incompatible with an in-flight history. Therefore `worker healthy` or `deployment current` cannot prove replay conformance.

Replay conformance is a relation:

`Conforms(run/history revision vector, worker/profile revision, activity-contract revision, provider/runtime support revision, evaluator/profile revision, retained evidence)`.

If one required axis is unsupported or unverifiable, the result is `INCONCLUSIVE/NOT_ADMITTED`, not optimistic compatibility.

## Checkpoint ownership, fencing and stale-worker rejection
DBOS remains strong adversarial evidence that two executors can temporarily execute the same semantic run after recovery. Successful computation is not durable truth. A checkpoint/outcome is canonical only after acceptance under the current ownership/fencing epoch. A zombie worker retaining credentials or local state cannot inherit authority from the old epoch.

The cycle-7 refinement is applicability: fencing claims themselves are scoped to the checkpoint store/provider generation and expected run generation. Rebinding a workflow provider or importing history requires re-establishing fencing semantics rather than assuming an old token/lease is portable.

## Applicability-scoped effect guarantees
DBOS demonstrates a narrow exactly-once domain when the application database mutation and durability record share one transaction. Its ordinary steps remain at-least-once around crash windows. Therefore:

`EffectGuaranteeClaim = operation + transaction/provider boundary + idempotency/correlation contract + retention horizon + evidence`.

A provider-local exactly-once or idempotency guarantee cannot be inherited by an AGWS action, downstream API, email, payment or device actuation unless that exact external boundary is covered by compatible proof.

## Ambiguous actuation and reconcile-before-retry
When an external activity times out after dispatch, workflow durability does not determine whether the external effect happened. `UNKNOWN` remains first-class. Retry is admissible only when idempotency evidence remains valid or external state is reconciled. Expired idempotency/journal evidence cannot be silently reconstructed from workflow history.

## Evidence retention and replay horizon
Restate independently configures workflow retention, idempotency retention and journal retention. A workflow result can remain historically attributed while some journal or idempotency evidence is no longer available. Therefore:

`historical claim lineage != evidence replay availability`.

Loss of replay material does not retroactively falsify an old accepted checkpoint; it constrains what can be newly proven, retried, migrated or audited. High-assurance recovery/migration must surface `EVIDENCE_EXPIRED`, `PARTIAL` or `INCONCLUSIVE` rather than fabricating continuity.

## Mixed runtime/provider stability and support vector
Prefect deployment versioning makes another useful separation visible: some runnable properties are versioned while schedules/paused state and other operational properties may persist across rollback/promotion. Azure likewise separates orchestration instance version from worker/backend realization. Hence workflow support is a vector rather than one runtime release scalar:

`DefinitionSemantics × WorkerCode/SDK × DurableProtocol × Provider/Journal × ActivityContracts × OperationalControlState × Policy/Trust`.

A rollback of one surface does not rewind the others. Support claims must identify which dimensions are guaranteed together.

## Provider/worker substitution, dual-run and drainage
New-run substitution is easier than in-flight migration. Existing runs retain origin history, timers, pending external effects, activity schemas, worker compatibility and checkpoint/evidence obligations. A provider or worker migration therefore needs staged admission:

1. destination capability/profile qualified;
2. new runs optionally routed to destination;
3. in-flight cohorts explicitly classified as stay, migrate, forward-fix or drain;
4. ambiguous effects reconciled;
5. old worker/provider writes fenced;
6. residual timers/signals/effects drained or dispositioned;
7. old evidence retained according to audit/recovery policy;
8. cutover closed only when consumer/run cohorts are proven drained.

Running two realizations is not itself migration success.

## Governance and AGWS boundary
`Enterprise → Station → Role → Person` remains AGWS-owned, monotonic and non-amplifying. A work surface may invoke a workflow through an admitted capability binding, but presentation context is provenance/intent only.

Boundaries remain explicit:
- `view personalization` cannot execute workflow actions;
- `personal action` may initiate/signal only operations already granted to the effective Person/Role/Station scope;
- `supervised automation` may execute only within the delegated workflow/action envelope and approval conditions;
- `team workflow` requires team/workflow authority, not accumulated personal UI history;
- `canonical domain/process change` requires escalation to the semantic owner and cannot be materialized silently by AGWS AI.

A workflow history may record who initiated an action but does not make that historical authority current during replay. Current privileged actuation may require requalification.

## Local/offline closure and reconnect requalification
Offline continuation requires a qualified local closure over compatible worker/runtime material, history/checkpoints, timers, local provider bindings, trust/policy, authority facts, activity contracts, fencing state and idempotency/effect evidence. The closure has an evidence/trust horizon.

If authority, trust, provider lease, idempotency evidence or required runtime support expires while disconnected, deterministic replay may remain possible while new privileged actuation becomes blocked/quarantined. Reconnection requires requalification and stale-writer fencing before convergence.

## Failure semantics
Required failure states include `NOT_ADMITTED`, `VERSION_INCOMPATIBLE`, `STALE_FENCE`, `AMBIGUOUS_EFFECT`, `EVIDENCE_EXPIRED`, `PARTIAL`, `INCONCLUSIVE`, `DRAINAGE_INCOMPLETE`, `OFFLINE_DEGRADED` and `AUTHORITY_REQUALIFICATION_REQUIRED`. These must not collapse into generic retryable failure.

## Extensibility, provider boundaries, observability, portability and lock-in
Universal primitives: semantic identities, applicability-scoped claims, revision-qualified conformance, support vectors, checkpoint fencing, scoped effect profiles, evidence horizons, drainage closure and authority requalification.

Provider-specific mechanisms: Azure Task Hub/storage implementation and version-match strategy; DBOS conflict exception/table layout; Restate journal/idempotency store and retention knobs; Prefect deployment/work-pool schemas.

Observability should expose semantic run identity, origin definition, current control generation, compatibility profile, provider binding, checkpoint/fencing epoch, activity/effect guarantee scope, ambiguous effects, evidence horizons, runtime support vector, current authority qualification, migration cohort and drainage state.

Portability requires semantic export + compatible evidence + destination admission + realization + authority-safe actuation. Copying a history/journal alone does not prove portable replay.

## Product-specific mechanisms vs universal primitives
- Azure permanent instance version and backend-specific task-hub isolation: product mechanisms; universal primitive = origin-version identity plus compatibility admission.
- DBOS database-coupled durability tables: product mechanism; universal primitive = transaction-domain-qualified effect guarantee and fenced checkpoint ownership.
- Restate configurable journal/idempotency/workflow retention: product mechanism; universal primitive = independent evidence/replay horizons.
- Prefect deployment-version property split: product mechanism; universal primitive = mixed stability/support vector and non-atomic rollback semantics.

## Convergent patterns
- Durable identity, worker realization and provider realization evolve independently.
- Replay depends on historical compatibility, not simply current deployment health.
- External effects require boundary-scoped guarantees and explicit ambiguity handling.
- Recovery creates ownership races that require fencing.
- Evidence needed for retry/audit/migration may expire before historical lineage does.
- Migration closes only after old run/worker/provider cohorts and residual effects are dispositioned.
- UI/AGWS context can invoke workflow but must not become workflow or domain authority.

## Divergent patterns
- Version routing/isolation differs among engines.
- Exactly-once transaction scope differs according to provider/store topology.
- Retention and journal introspection differ materially by product.
- Rollback/versioned-property semantics differ and should remain provider/runtime-specific until normalized as typed support vectors.

## Subcapabilities
Definition/run identity; execution-generation control; worker compatibility/admission; durable history/checkpoints; checkpoint fencing; deterministic replay context; activity/effect profiles; ambiguity reconciliation; retention/evidence horizons; human tasks; provider/worker migration; cohort drainage; compensation/forward-fix; qualified local/offline execution; authority requalification; observability/proof qualification.

## Comparison with SB — evidence only
A bounded GitHub code search against the default branch for `workflow durable execution checkpoint replay orchestration` returned no indexed matches during this run. This is only evidence about that bounded query; it is not a repository-wide absence claim. Full repository archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **KEEP:** Workflow as semantic owner of durable orchestration state, distinct from Process Modeling, Integration and provider runtimes.
- **HARDEN:** applicability-scoped workflow claims, replay conformance, checkpoint fencing, evidence-horizon states and drainage closure.
- **GENERALIZE:** UCA relational conformance/support-vector primitives while preserving workflow-specific semantics.
- **PROVIDERIZE:** journal encoding, provider retention knobs, worker routing mechanics, conflict exception types and task-hub/storage details.
- **INTEGRATE:** Authorization, Provider Binding, Integration, Observability, Evidence/Provenance, Lifecycle and AGWS through explicit non-amplifying contracts.
- **DEFER:** universal cross-provider in-flight history conversion until representability is proven.
- **DO_NOT_BUILD:** global exactly-once labels; retry that assumes timeout means no effect; replay that treats historical actor context as current authority; migration declared complete at first successful destination run.

## Repository-validation questions
1. Does SB represent workflow/replay claims with explicit applicability scope rather than booleans on a definition/provider?
2. Can replay compatibility be evaluated against definition, run generation, worker/runtime, activity-contract and provider revisions?
3. Is checkpoint advancement fenced against stale/recovered workers?
4. Are external effect guarantees typed by transaction/provider boundary and evidence-retention window?
5. Can expired journal/idempotency evidence produce `INCONCLUSIVE` instead of unsafe retry?
6. Are runtime/provider support dimensions versioned independently rather than represented by one workflow-engine version?
7. Can in-flight provider/worker migration prove cohort drainage and residual-effect disposition?
8. Can offline runs replay history while privileged actuation remains blocked pending reconnect requalification?
9. Can AGWS invoke admitted workflow capabilities without converting page/session/personalization context into workflow-definition or canonical-change authority?

## Symbiotic Proof
A Person operating inside Station S invokes an admitted `ApproveInvoice` workflow action from an AGWS component. The surface records intent and current authority provenance but does not author the workflow. Run R is created against definition D7 and worker profile W3. Executor A later loses connectivity; executor B recovers R under fencing epoch F12. A stale checkpoint from A under F11 is rejected. A database mutation atomically coupled with the durability record receives a narrow transaction-domain exactly-once claim; a timed-out payment-provider call remains `AMBIGUOUS_EFFECT` until reconciled. During an upgrade, W4 may run R only if the D7/history/activity profile admits it. The destination provider receives new runs first; R remains on the old realization until classified and drained or explicitly migrated. If journal/idempotency evidence expires, historical checkpoints remain attributable but unsafe retries/migrations become `INCONCLUSIVE`. If Station S goes offline, deterministic replay may continue inside the qualified closure, but expired authority/trust/idempotency evidence blocks new privileged actuation. Reconnection requalifies authority and fences stale writers. No AGWS history grants workflow-edit, provider-admin, compensation, recovery or canonical-domain-change authority.

## Stable findings
- **G2-FINDING-WDE-45 — Durable-Workflow Guarantees Are Applicability-Scoped Claims, Not Global Engine or Definition Properties.** Replayability, recoverability, compatibility and effect guarantees must name run/profile/provider/authority/evidence scope.
- **G2-FINDING-WDE-46 — Workflow Replay Conformance Is a Revision-Qualified Relation.** A run/history conforms to a worker/runtime only against explicit definition, history, activity-contract, provider and evaluator revisions; deployment health is insufficient.
- **G2-FINDING-WDE-47 — Checkpoint Fencing Claims Are Provider- and Generation-Scoped and Must Be Re-established Across Rebinding.** Old ownership tokens cannot be assumed portable after recovery or provider migration.
- **G2-FINDING-WDE-48 — Durable Evidence Replayability Has an Independent Retention Horizon.** Historical checkpoint lineage can remain valid after journal/idempotency material becomes unavailable; new retry/migration/audit claims must then degrade to `PARTIAL/INCONCLUSIVE`.
- **G2-FINDING-WDE-49 — Workflow Runtime Stability and Support Are Multi-Surface Vectors.** Definition semantics, worker SDK/protocol, provider/journal, activity contracts, operational controls and policy/trust may evolve independently; one engine-version scalar is unsound.
- **G2-FINDING-WDE-50 — In-flight Provider/Worker Migration Requires Cohort Drainage and Residual-Effect Disposition.** Destination success does not close migration while old runs, timers, signals, workers or ambiguous effects remain effective.
- **G2-FINDING-WDE-51 — Historical Workflow Context Is Provenance, Never Current Execution Authority.** Replay may reproduce prior decisions, but new privileged actuation requires current authority qualification; AGWS/UI context cannot self-amplify into workflow/domain authority.
- **G2-FINDING-WDE-52 — Qualified Offline Durable Execution Separates Replay Continuity from Privileged Actuation Continuity.** Local history may remain replayable while expired trust, authority, leases or effect evidence require quarantine and reconnect requalification.

## Capability candidates
| Candidate | Classification | Status | Rationale |
|---|---|---|---|
| `G2-CAPABILITY-CANDIDATE-WDE-APPLICABILITY-SCOPED-DURABLE-GUARANTEE-CLAIM` | CROSS_CUTTING | CONSOLIDATION_CANDIDATE | Reconcile with UCA applicability graph while preserving run/provider/effect-guarantee semantics. |
| `G2-CAPABILITY-CANDIDATE-WDE-EVIDENCE-REPLAY-HORIZON` | CROSS_CUTTING | CONSOLIDATION_CANDIDATE | Reconcile UCA/Governance/Observability retention horizons; Workflow needs explicit journal/idempotency/retry qualification. |
| `G2-CAPABILITY-CANDIDATE-WDE-MIXED-RUNTIME-STABILITY-SUPPORT-VECTOR` | CROSS_CUTTING | CONSOLIDATION_CANDIDATE | Reconcile UCA mixed stability while retaining worker/protocol/provider/activity dimensions. |
| `G2-CAPABILITY-CANDIDATE-WDE-INFLIGHT-COHORT-DRAINAGE-CLOSURE` | CORE_SUBCAPABILITY | PENDING_SYNTHESIS | Workflow specifically owns in-flight run/timer/signal/effect drainage semantics during worker/provider substitution. |

No candidate is promoted in this pass. Adaptive Governed Work Surfaces remains the already-promoted distinct CORE capability.

## Architecture proof-backfill obligations
1. Applicability proof: the same definition receives different admissibility/guarantee outcomes across incompatible run/provider/evidence scopes.
2. Replay-conformance proof: healthy worker W4 is rejected for an incompatible D7 history/profile.
3. Fencing proof: stale executor checkpoint under old epoch cannot advance canonical state after recovery/rebinding.
4. Effect-scope proof: transaction-domain exactly-once evidence cannot be reused to prove an unrelated external API call exactly once.
5. Evidence-horizon proof: expired idempotency/journal material forces `INCONCLUSIVE` retry/migration without falsifying accepted historical checkpoint lineage.
6. Mixed-support proof: rollback of deployment code does not imply rollback of schedules/provider/runtime/policy dimensions.
7. Drainage proof: provider cutover remains incomplete while an old run/timer/signal/effect cohort remains effective.
8. Offline proof: deterministic replay continues locally but expired authority/trust evidence blocks new privileged actuation until reconnect requalification.
9. AGWS non-amplification proof: Personal surface invocation carries intent/provenance yet cannot edit definition, migrate provider or perform canonical domain change.

## Value / risk / priority / next question
**Value:** very high — durable execution underpins workflows, automation, AI agents and recovery.
**Risk:** very high — unsound exactly-once, replay or migration assumptions can duplicate irreversible external effects or execute under stale authority.
**Priority:** constitutional cross-cutting input for synthesis, Lifecycle, Provider Binding, Security and AGWS.
**Next question:** whether Integration & Automation reveals additional cross-system actuation semantics beyond Workflow-owned durability, especially applicability-scoped delivery/effect claims, provider substitution, evidence horizons and authority-safe AGWS automation.