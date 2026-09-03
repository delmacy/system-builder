# Deployment / Environment / Runtime — Revisit 6 (Cycle 7)

## Research question
What remains architecturally unsafe if Deployment / Environment / Runtime is modeled as a single `deployed/healthy` state after Generation-2 has already separated release qualification, deployment admission, runtime realization, routing, readiness and rollback? This cycle-7 pass uses research-by-exception to stress applicability-scoped claims, evidence horizons, mixed provider support, ambiguous rollout outcomes, residual cohort drainage, local/offline closure, delegated Station authority and AGWS/AI non-amplification.

## Representatives and evidence/source ledger
1. **Kubernetes Deployment + Pod readiness** — `DeploymentStatus.observedGeneration` identifies the generation observed by the controller; conditions are observations of current deployment state; availability, readiness and progression are separate dimensions. Deployment completion/progression does not make all later health observations current. Sources: https://kubernetes.io/docs/reference/kubernetes-api/apps/deployment-v1/ ; https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
2. **Argo Rollouts** — canary traffic weight can be intentionally decoupled from replica count; analysis can block, abort or roll back a rollout; rollback windows can fast-track retained revisions and skip ordinary steps. Sources: https://argo-rollouts.readthedocs.io/en/stable/features/hpa-support/ ; https://argo-rollouts.readthedocs.io/en/stable/features/analysis/ ; https://argo-rollouts.readthedocs.io/en/latest/features/rollback/
3. **Google Cloud Run** — a new revision may be deployed with zero traffic; traffic mutation is a separate operation; routing changes are not instantaneous and in-flight requests may complete on old or new revisions during migration. Source: https://cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration
4. **HashiCorp Nomad** — update strategy, canary count, health windows, promotion and auto-revert are policy dimensions. Canary allocations coexist with the old version until promotion; blue/green can intentionally retain both populations. Sources: https://developer.hashicorp.com/nomad/docs/job-specification/update ; https://developer.hashicorp.com/nomad/docs/job-declare/strategy/blue-green-canary
5. **Amazon ECS** — deployment failure detection is staged; circuit breaker and alarms are distinct failure detectors; rollback requires a previous `COMPLETED` deployment, and once rollback starts that deployment becomes `IN_PROGRESS` and is temporarily ineligible for another rollback. Sources: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html ; https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-failure-detection.html

## Universal primitive and source-of-truth model
Deployment truth remains a typed evidence graph, not a provider status flag:

`QualifiedReleaseRef -> DeploymentIntentRevision -> DeploymentAdmissionDecision -> DeploymentAttempt -> ProviderActuationDisposition -> RuntimeRealizationSet -> TrafficBindingRevision -> ReadinessEvidenceSet -> DomainPostconditionEvidence -> DeploymentQualificationClaim`

Cycle 7 adds a stronger qualification rule:

`DeploymentQualificationClaim = claim(subject, applicability_scope, revision_vector, evidence_set, evidence_horizon, decision)`

where applicability may vary by `Enterprise / Station / environment / provider / region / service / cohort / traffic slice / operation` and the revision vector may independently include release, intent, environment, runtime binding, config, secret, schema, policy, trust, routing, readiness-gate set, observation window and provider generation.

No single `current deployment` value is authoritative across all scopes.

## Identity
The following identities are non-interchangeable:
- `QualifiedReleaseRef`
- `DeploymentIntentId + revision`
- `DeploymentAdmissionDecisionId`
- `DeploymentAttemptId`
- `ProviderDeploymentId`
- `RuntimeRealizationId`
- `ReplicaRevisionId`
- `TrafficBindingId + revision`
- `ReadinessEvidenceId`
- `RollbackPointId`
- `RollbackEligibilityEvidenceId`
- `DeploymentQualificationClaimId`

Kubernetes ReplicaSets, Cloud Run revisions, Nomad allocations/deployments and ECS service deployments are provider/runtime realization identities, never canonical System or Station identity.

## Lifecycle and versioning
Lifecycle remains multi-dimensional:

`PLANNED -> ADMITTED -> ACTUATION_REQUESTED -> ACKNOWLEDGED|OUTCOME_UNKNOWN -> PARTIALLY_REALIZED -> REALIZED -> ROUTED -> READY -> DOMAIN_VALIDATED -> QUALIFIED`

with side states `PAUSED`, `BLOCKED`, `DEGRADED`, `ABORTED`, `ROLLBACK_REQUESTED`, `ROLLBACK_IN_PROGRESS`, `RECOVERY_REQUIRED`, `RECONCILIATION_REQUIRED`, `INCONCLUSIVE`.

A revision can be realized with 0% traffic; traffic can move without creating a revision; capacity can change independently of traffic; a release can remain qualified while a deployment admission becomes stale; a prior readiness observation can expire while the runtime remains unchanged.

## Failure semantics
- **Observed controller state is generation-qualified.** Kubernetes exposes `observedGeneration`; evidence about an older desired generation cannot qualify a newer one.
- **Provider success is not domain readiness.** Deployment completion, task steady-state or revision creation is only one evidence surface.
- **Traffic mutation is non-instantaneous.** Cloud Run explicitly allows in-flight requests to finish during traffic migration, so cutover is a convergence interval, not an atomic truth flip.
- **Analysis can be inconclusive.** Argo supports pauses when metrics cannot yield success/failure; `INCONCLUSIVE` is therefore a first-class operational result rather than hidden failure or success.
- **Rollback is not timeless.** ECS demonstrates that rollback eligibility changes with deployment state; retained history plus compatibility must be re-evaluated.
- **Ambiguous actuation requires reconcile-before-retry.** Lost acknowledgement after create/update/traffic mutation may leave effective state changed; blind retry can duplicate or overwrite a newer rollout.
- **Health evidence has a replay horizon.** Historical metrics/status/conditions may remain retained but no longer prove present readiness after observation-window, policy, config, trust, provider or routing changes.

## Extensibility and provider boundaries
Providerize orchestrator/scheduler, runtime, traffic manager, autoscaler, health-analysis backend, service discovery, environment/config/secret projection and persistent-state integration. Preserve semantic deployment intent, applicability, authority and evidence contracts above those mechanisms.

A provider can expose richer rollout behavior — Argo analysis, Nomad canaries, Cloud Run traffic migration, ECS circuit breakers — without becoming the owner of canonical deployment semantics.

## Governance and delegated authority
Authority remains facet-separated:

`ReleaseQualificationAuthority != DeploymentAdmissionAuthority != DeploymentActuationAuthority != TrafficMutationAuthority != PromotionAuthority != RuntimeProviderAdministrationAuthority != RollbackAuthority != PersistedStateRecoveryAuthority`.

`Enterprise -> Station -> Role -> Person` may delegate deployment actions only within explicit target/applicability scope. Station authority must be attenuating: delegation to operate an admitted runtime cannot mint release/signing authority, provider-admin rights, new environment scope or persisted-state recovery authority.

## Observability and composite proof
A deployment proof joins exact compatible evidence for:
- release qualification;
- deployment intent and admission revision;
- runtime/provider binding;
- provider actuation disposition;
- concrete realization set;
- traffic binding revision and ownership/fence;
- readiness gate set and observation window;
- domain postconditions;
- config/secret/schema dependency currentness;
- region/Station/tenant/cohort coverage;
- rollback eligibility where required;
- missing/stale/incompatible dimensions.

A positive provider status cannot compensate for stale or missing evidence on another required axis. Composite result is `QUALIFIED`, `FAILED`, `PARTIAL` or `INCONCLUSIVE` according to policy.

## Portability and mixed support vector
Deployment portability is not binary. A provider support vector may independently cover:

`{immutable_revision, declarative_reconcile, progressive_rollout, explicit_traffic_binding, traffic_replica_decoupling, health_gates, external_analysis, pause_resume, rollback, rollback_window, config_secret_projection, stateful_workload_support, topology_scope, offline_operation, evidence_export, fencing, residual_drainage}`.

Two providers supporting `deploy` are not substitutable if the required dimensions or failure/evidence semantics differ.

## Provider/environment substitution and drainage
Provider cutover requires shadow/dual realization plus explicit closure:
1. establish semantic representability and admitted destination binding;
2. realize destination without assuming traffic transfer;
3. compare revision-qualified readiness/domain evidence;
4. mutate traffic using expected-base/ownership fencing;
5. observe convergence rather than assuming instant cutover;
6. drain/disposition residual replicas, in-flight requests, sticky sessions, connections, caches, queues, discovery records, old config/secret projections and consumer cohorts;
7. only then revoke the source realization where policy permits.

Destination success alone does not prove source closure.

## Qualified local/offline runtime closure
A disconnected Station may continue only operations whose closure is already delegated and materially available: release material, runtime/provider bits, environment profile, config/secret projection, schema compatibility, trust roots, policy, routing state, readiness definitions, rollback closure and evidence validators.

Offline continuation does not create new release, signing, provider-admin, cross-Station traffic or recovery authority. On reconnect, materially newer superior release/config/schema/trust/policy/routing/provider state invalidates dependent local claims and forces requalification.

## Product-specific mechanism versus universal primitive
Product-specific: Kubernetes `observedGeneration`/conditions; Argo `AnalysisRun`, `setWeight`, rollback window; Cloud Run revision traffic percentages; Nomad `canary`, `auto_promote`, `auto_revert`, health deadlines; ECS circuit breaker and `COMPLETED` rollback target.

Universal: typed deployment lineage; applicability-scoped qualification; revision-qualified readiness; evidence horizon; mixed support vector; ambiguity reconciliation; traffic ownership/fencing; residual cohort drainage; qualified local closure; attenuating delegated authority.

## Convergent patterns
- desired release, deployment attempt, runtime realization and effective traffic are separate facts;
- provider statuses are scoped observations;
- rollout safety depends on health/evidence policy, not merely process completion;
- progressive delivery deliberately creates multiple coexisting realizations;
- rollback depends on current retained closure and eligibility;
- migration closure requires residual cohort drainage;
- local/offline operation is bounded by pre-existing authority and evidence.

## Divergent patterns
Kubernetes emphasizes reconciliation generations and workload conditions; Argo emphasizes progressive delivery and analysis; Cloud Run strongly separates immutable revisions from traffic routing; Nomad combines allocation health with update policy; ECS exposes staged failure detection and mutable rollback eligibility. These differences validate providerized realization mechanics and a mixed support vector rather than one universal provider status model.

## Subcapabilities
Deployment intent; admission; environment profile; runtime binding; actuation; realization set; traffic binding; rollout strategy; capacity/scaling; readiness/domain validation; evidence freshness; ambiguity reconciliation; rollback eligibility; residual cohort drainage; provider substitution; local/offline runtime closure; delegated Station deployment authority.

## SB comparison — bounded evidence only
No new repository-wide product archaeology was performed in this research pass. Existing bounded evidence from revisit 5 remains the only SB comparison and does not establish absence or maturity. Full current-state reconciliation remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **HARDEN** deployment qualification as applicability-scoped and revision/evidence-horizon qualified.
- **HARDEN** typed identity across admission, attempt, realization, replica revision, traffic binding, readiness, rollback point and evidence.
- **HARDEN** generation/observation freshness so historical positive conditions cannot qualify newer desired or effective state.
- **GENERALIZE** provider compatibility into a mixed support vector instead of binary `deploy` capability.
- **HARDEN** ambiguous actuation with reconcile-before-retry and expected-base traffic mutation.
- **HARDEN** provider/environment cutover with explicit residual replica/session/cache/consumer drainage.
- **PROVIDERIZE** orchestrator/runtime/traffic/analysis mechanics.
- **INTEGRATE** config/secret/schema currentness as dependencies without transferring semantic ownership.
- **INTEGRATE** qualified local closure and reconnect requalification.
- **DO_NOT_BUILD** provider-native replicas of every progressive-delivery algorithm when external providers satisfy the semantic contract.

## Repo-validation questions
1. Can deployment claims name exact applicability scope and revision/evidence horizon?
2. Are release qualification, admission, actuation, realization, traffic and readiness separate subjects?
3. Can controller/provider observations be rejected when they refer to an older generation or stale window?
4. Is `INCONCLUSIVE` representable when analysis cannot decide?
5. Are traffic changes fenced by expected base/owner and reconciled after ambiguous outcomes?
6. Can destination realization coexist with source realization without confusing canonical identity?
7. Does cutover track residual replicas, in-flight requests, sessions, connections, caches, discovery and consumer cohorts?
8. Are config/secret/schema dependencies revision-qualified without making Deployment their owner?
9. Can rollback eligibility expire independently of rollback authority?
10. Can a disconnected Station continue only within declared closure and requalify on reconnect?
11. Can Role/Person deployment authority remain bounded to Station/target/provider/action scope?
12. Can AGWS/AI request a deployment without gaining release/signing/provider-admin/canonical mutation authority?

## Adaptive Governed Work Surfaces boundary
Adaptive Governed Work Surfaces remains a promoted CORE capability and remains distinct from generic UI. AGWS may expose admitted deployment operations and evidence appropriate to `Enterprise -> Station -> Role -> Person`, but AI-only materialization does not grant deployment admission, release/signing, provider administration, unrestricted traffic mutation, rollback or recovery authority. Canonical domain/process changes still escalate to their semantic owners.

## Symbiotic Proof
Use one qualified release and one deployment intent across two providers with different support vectors. Realize provider B with zero production traffic while provider A remains active. Require revision-qualified readiness and domain evidence before any traffic mutation. Change traffic gradually and prove in-flight requests/sessions leave a residual cohort after the control-plane update. Lose the traffic-update acknowledgement and require reconciliation before retry. Make one readiness observation stale while the runtime remains unchanged and prove qualification becomes `INCONCLUSIVE` rather than implicitly healthy. Remove one rollback prerequisite and prove eligibility expires without changing rollback authority. Disconnect one Station and permit only previously delegated runtime operations; then reconnect with newer trust/config/routing state and require requalification. Finally have AGWS/AI propose the same rollout and prove it cannot self-grant release/signing/provider-admin or canonical domain authority.

## Stable findings
- **G2-FINDING-DER-46 — Effective deployment/runtime readiness is an applicability-scoped claim across release, intent/admission, environment/runtime binding, config/secret/schema, provider generation, realization, traffic, readiness/domain evidence, policy/trust and observation horizon; there is no globally current `deployed/healthy` fact.**
- **G2-FINDING-DER-47 — QualifiedRelease, DeploymentIntent, AdmissionDecision, RolloutAttempt, RuntimeRealization, ReplicaRevision, TrafficBinding, ReadinessEvidence, RollbackPoint and QualificationClaim are distinct typed identities; lifecycle facts at one boundary cannot stand in for another.**
- **G2-FINDING-DER-48 — Runtime readiness/conformance is revision- and observation-qualified; controller/provider state referring to an older desired generation, routing revision or observation window cannot qualify newer effective state even if the historical status remains positive.**
- **G2-FINDING-DER-49 — Deployment evidence has independent replay horizons: retained rollout/status/metric history can remain historically valid after it ceases to prove present readiness because policy, trust, config, schema, routing, provider or observation freshness changed.**
- **G2-FINDING-DER-50 — Deployment provider portability is a mixed support vector across reconciliation, progressive rollout, traffic/replica independence, health/analysis semantics, rollback, stateful support, fencing, offline behavior, evidence export and residual drainage; binary deploy compatibility is unsafe.**
- **G2-FINDING-DER-51 — Rollout/rollback/traffic outcomes may be ambiguous and require reconcile-before-retry; provider acknowledgement loss cannot be converted to failure because effective state may already have changed, and blind retries may duplicate actuation or overwrite newer ownership.**
- **G2-FINDING-DER-52 — Provider/environment cutover closes only after semantic comparison plus explicit drainage/disposition of residual replicas, in-flight requests, sticky sessions/connections, caches, discovery state, projections and consumer cohorts; destination success alone is insufficient.**
- **G2-FINDING-DER-53 — Qualified local/offline Station runtime operation and AGWS/AI deployment requests are non-amplifying: continuation is limited to predelegated closure, reconnect requalifies superior state, and deployment invocation cannot mint release/signing/provider-admin/recovery/canonical authority.**

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-DER-APPLICABILITY-SCOPED-DEPLOYMENT-RUNTIME-QUALIFICATION-CLAIM` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with UCA applicability graphs while Deployment retains release/admission/realization/traffic/readiness dimensions.
- `G2-CAPABILITY-CANDIDATE-DER-DEPLOYMENT-EVIDENCE-REPLAY-HORIZON` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Governance/UCA evidence-horizon primitives while retaining rollout/readiness/provider-specific freshness semantics.
- `G2-CAPABILITY-CANDIDATE-DER-MIXED-RUNTIME-ORCHESTRATOR-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Preserve independent rollout, traffic, readiness, rollback, stateful, offline, fencing and evidence dimensions.
- `G2-CAPABILITY-CANDIDATE-DER-RUNTIME-TRAFFIC-SESSION-CONSUMER-COHORT-DRAINAGE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**. Deployment owns residual runtime/traffic/session/cache/discovery/consumer closure during provider/environment substitution.

No candidate promoted. Adaptive Governed Work Surfaces remains promoted and distinct.

## Architecture proof-backfill obligations
1. **Applicability proof:** one runtime realization qualifies for one Station/cohort but not another because routing/policy/evidence differs.
2. **Generation-freshness proof:** retain a positive older provider condition while desired generation advances; qualification must reject it.
3. **Zero-traffic realization proof:** realize a revision with 0% traffic without treating it as production-effective.
4. **Ambiguous traffic mutation proof:** lose acknowledgement after a routing change and reconcile actual state before retry.
5. **Inconclusive-analysis proof:** make external analysis unable to decide and preserve `INCONCLUSIVE` rather than coercing success/failure.
6. **Mixed-support proof:** substitute providers with different rollout/rollback/evidence semantics and refuse false equivalence.
7. **Residual-drainage proof:** destination becomes healthy while source still serves in-flight/session cohorts; closure remains incomplete.
8. **Rollback-expiry proof:** historical stable revision loses one prerequisite and becomes ineligible without changing authority.
9. **Offline/reconnect proof:** disconnected Station continues bounded operation, then newer superior state forces requalification.
10. **AGWS/AI attenuation proof:** AI proposes and materializes a deployment request but cannot acquire release/signing/provider-admin/recovery/canonical authority.

## Saturation decision
**NOT SATURATED.** Eight material architectural findings were added; `consecutive_no_material_finding = 0`. Remaining external questions include deeper fleet topology/failure-domain evidence and interaction with observability/governance that must be revisited by their owning capabilities before any saturation claim.