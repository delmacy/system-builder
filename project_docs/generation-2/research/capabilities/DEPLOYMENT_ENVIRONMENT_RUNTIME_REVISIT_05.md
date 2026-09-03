# Deployment / Environment / Runtime — Revisit 5 (Cycle 6)

## Research question
Which late-cycle architectural assumptions still fail when Deployment / Environment / Runtime is tested against progressive delivery, independently mutable traffic, state-scoped rollout clocks, multi-region barriers, external readiness gates, rollback-history erosion, provider substitution and disconnected Station operation? This pass intentionally consumes Artifact / Release qualification as an input without collapsing release promotion into deployment ownership.

## Representatives and evidence/source ledger
1. **Kubernetes Deployment + Pod readiness gates** — Deployment `Progressing`, `Available`, rollout completion and `ProgressDeadlineExceeded` are distinct status facts. A completed Deployment retains `Progressing=True` until a new rollout even if availability later changes. Paused Deployments suspend progress-deadline evaluation. Pod readiness can additionally depend on custom readiness gates, and missing custom gate evidence defaults readiness to false. Sources: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/ ; https://kubernetes.io/docs/concepts/workloads/pods/pod-condition/
2. **Argo Rollouts** — canary traffic can be decoupled from replica scale; analysis may abort a rollout; rollback windows may fast-track retained revisions and skip normal steps. Sources: https://argo-rollouts.readthedocs.io/en/stable/features/canary/ ; https://argo-rollouts.readthedocs.io/en/stable/features/hpa-support/ ; https://argo-rollouts.readthedocs.io/en/latest/features/rollback/
3. **Google Cloud Run** — a new revision can be deployed with zero traffic; traffic is a separate routing table that may target explicit revisions, tags or a floating `latestRevision`; revisions with no traffic may scale to zero. Sources: https://docs.cloud.google.com/run/docs/deploying ; https://docs.cloud.google.com/run/docs/reference/rest/v1/TrafficTarget ; https://docs.cloud.google.com/run/docs/about-instance-autoscaling ; https://docs.cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration
4. **HashiCorp Nomad** — canaries are promoted only after health policy, while multi-region deployments have independent regional state and a global barrier: a locally complete region can remain `blocked` until the remaining regions complete. Sources: https://developer.hashicorp.com/nomad/docs/job-specification/update ; https://developer.hashicorp.com/nomad/docs/job-declare/multiregion
5. **Amazon ECS** — deployment circuit breaker distinguishes task start/health stages, can fail a deployment, and can roll back to the most recent `COMPLETED` deployment. Once rollback starts, that previous deployment re-enters `IN_PROGRESS`, so rollback eligibility itself changes over time. Sources: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html ; https://docs.aws.amazon.com/AmazonECS/latest/developerguide/stop-service-deployment.html

## Source of truth and universal primitives
The late-cycle model remains a typed transition graph rather than a `deployed=true` flag:

`QualifiedReleaseRef -> DeploymentIntentRevision -> EnvironmentProfileRevision -> RuntimeBindingRevision -> DeploymentPlan -> DeploymentAttempt -> ProviderActuationDisposition -> RuntimeRealizationSet -> RoutingAssignment -> ReadinessEvidenceSet -> DomainPostconditionEvidence -> DeploymentQualificationDecision`

Cycle 6 adds two primitives that should remain explicit:

- **TransitionClock** — a policy-scoped clock attached to one transition state, with pause/resume/reset semantics. A wall-clock timeout is not universal failure evidence.
- **RollbackEligibilityEvidence** — evidence that a prior realization is presently restorable/routable under retained history, policy, artifact, config/schema/trust and state closure. It is neither the same as historical success nor a permanent property of a revision.

## Identity
Identity is typed and non-interchangeable:

- `QualifiedReleaseRef` — Artifact/Release-owned release subject admitted as deployment input.
- `DeploymentIntentId + revision` — semantic desired deployment behavior.
- `EnvironmentProfileId + revision` — environment constraints and semantic configuration profile.
- `RuntimeBindingId + revision` — selected runtime/orchestrator/network/config/secret/state providers.
- `DeploymentAttemptId` — one requested transition.
- `ProviderDeploymentId` — provider-native actuation identity.
- `RuntimeRealizationId` — concrete workload/allocation/revision identity.
- `RoutingAssignmentId + revision` — effective routing ownership and percentages/targets.
- `ReadinessEvidenceId` — observation over exact subjects and window.
- `RollbackEligibilityEvidenceId` — evidence that a rollback target is presently actionable.

Kubernetes ReplicaSet revisions, Cloud Run revision names, Nomad deployment IDs and ECS service-deployment IDs are realization identities. None should become canonical System or Station identity.

## Lifecycle and versioning
A deployment qualification vector is at least:

`{release, deployment_intent, environment_profile, runtime_binding, config, schema/migration, policy, trust, topology, provider, routing, readiness_gate_set, rollout_policy, rollback_policy, observation_window}`.

The lifecycle is multi-dimensional:

`PLANNED -> ADMITTED -> ACTUATION_REQUESTED -> ACKNOWLEDGED|OUTCOME_UNKNOWN -> PARTIALLY_REALIZED -> REALIZED -> ROUTED -> READY -> DOMAIN_VALIDATED -> QUALIFIED`

with side states `PAUSED`, `BLOCKED`, `DEGRADED`, `STALLED`, `ABORTED`, `ROLLBACK_REQUESTED`, `ROLLBACK_IN_PROGRESS`, `RECOVERY_REQUIRED`, `RECONCILIATION_REQUIRED`, `INCONCLUSIVE`.

A transition may be locally complete but globally blocked; may be realized but intentionally receive zero traffic; may have containers ready but fail custom readiness; may have a historically successful rollback target that is no longer eligible.

## Failure semantics
- A stale positive rollout condition must not be interpreted as current health. Kubernetes documents that `Progressing=True` can persist after rollout completion even when availability later changes.
- A rollout timeout is state/policy relative. Pausing a Kubernetes Deployment suspends deadline evaluation; Nomad uses distinct health/progress deadlines. Therefore timeout evidence must name the transition clock and pause state.
- A revision can exist and be directly testable while receiving zero production traffic. Realization and routing are independent.
- Traffic percentage can be independent from replica percentage. Argo explicitly supports pinned canary scale while the traffic manager sends a different percentage.
- A missing required readiness signal is evidence incompleteness, not success. Kubernetes readiness gates default missing custom conditions to false.
- A region can be locally complete while aggregate rollout remains blocked. Global qualification requires explicit coverage/barrier semantics.
- Rollback can become temporarily unavailable after rollback begins or when retained history/closure disappears. ECS exposes dynamic eligibility through deployment-state transitions.
- Provider acknowledgement loss remains `OUTCOME_UNKNOWN`; reconcile-before-retry continues to apply.

## Extensibility and provider boundaries
Providerize orchestrator/scheduler, runtime, traffic manager, service discovery, autoscaling, environment/config/secret projection, persistent-state integration and health/analysis backends. Preserve semantic deployment intent and evidence contracts above them.

A provider can expose richer strategy — Kubernetes rollout strategy, Argo analysis, Cloud Run revision routing, Nomad multi-region coordination, ECS circuit breaker — without turning those provider-native mechanisms into canonical SB identity or universal semantics.

## Governance and authority
Authority remains facet-separated:

`ReleaseQualificationAuthority != DeploymentAdmissionAuthority != DeploymentActuationAuthority != RoutingMutationAuthority != RolloutPauseResumeAuthority != PromotionAuthority != RuntimeProviderAdministrationAuthority != RollbackAuthority != PersistedStateRecoveryAuthority`.

Cycle 6 hardens an additional rule: **rollback eligibility is evidence, not authority**. Discovering an eligible target does not authorize rollback. Conversely, possessing rollback authority does not make a target safe or realizable.

Routing mutation requires expected-base/ownership semantics. A stale operator that still has routing permission must not silently overwrite a newer traffic allocation created by another authorized rollout or emergency action.

## Observability and composite proof
A deployment proof must join compatible evidence rather than aggregate booleans:

- exact release qualification;
- deployment/environment/runtime-binding revisions;
- provider actuation disposition;
- concrete realization identities;
- routing assignment revision and owner/fence;
- rollout/pause/transition-clock state;
- readiness gate set and observation window;
- domain postcondition evidence;
- regional/Station/tenant coverage;
- rollback eligibility and closure horizon;
- missing/stale dimensions.

If one required dimension is stale, missing or incompatible, aggregate qualification is `INCONCLUSIVE` or failed as policy dictates. A historical `Progressing=True`, `COMPLETED`, `healthy` or `Ready` label alone is not composite proof.

## Portability, local/offline closure and lock-in
A **Qualified Local Runtime Closure** for an authorized operation may require release material, runtime/provider binaries/images, environment profile, config/secret materialization method, schema/migration compatibility, trust roots, policy, routing state, readiness-gate definitions, rollback history/closure, state/checkpoints and evidence validators.

Offline/local operation is qualified by operation. A Station may continue a previously admitted runtime within retained closure but cannot invent fresh provider-admin, routing, rollback or recovery authority because the superior control plane is unreachable. On reconnection, materially newer release/config/schema/trust/policy/routing/provider state invalidates dependent local qualification and requires requalification.

Lock-in appears when rollback requires opaque provider-retained history, when routing ownership cannot be exported, when readiness is represented only by provider-native condition names without semantic mapping, or when effective runtime identity equals provider IDs.

## Product-specific mechanism versus universal primitive
Product-specific: Kubernetes `Progressing`/`Available`, `progressDeadlineSeconds`, readiness gates; Argo `setWeight`, `setCanaryScale`, AnalysisRun and rollback window; Cloud Run `TrafficTarget`/revision tags/`latestRevision`; Nomad `blocked` multi-region state and canary promotion; ECS circuit-breaker failure counters and `COMPLETED` rollback target.

Universal: typed deployment identity; multi-axis qualification vector; desired/attempted/effective/observed lineage; state-scoped transition clocks; independent realization/routing/capacity; readiness evidence composition; rollback eligibility evidence; aggregate coverage barriers; expected-base routing ownership; qualified local runtime closure.

## Convergent patterns
- release admission and deployment realization are separate;
- realization, traffic assignment and capacity can evolve independently;
- readiness is composite and policy-bound;
- progressive rollout is coexistence plus routing and promotion state;
- rollback requires retained compatible closure and present eligibility;
- local and global rollout completion are separate facts;
- provider status is evidence, not canonical semantic truth;
- authority never derives from provider capability discovery.

## Divergent patterns
Kubernetes exposes reconciliation status and readiness gates; Argo exposes progressive-delivery traffic/analysis; Cloud Run strongly separates immutable revision creation from traffic assignment; Nomad exposes explicit global multi-region barriers; ECS exposes staged failure detection and dynamic rollback state. These divergences validate providerized realization mechanics while preserving shared semantic deployment/evidence primitives.

## Subcapabilities
Deployment intent; environment profile; runtime binding; admission; actuation/reconciliation; realization set; routing ownership; progressive rollout; capacity/scaling; readiness gates; domain validation; state-scoped transition clocks; regional/fleet coverage barriers; rollback eligibility; workload/routing rollback; persisted-state recovery boundary; provider dual-run/cutover; local runtime closure; deployment evidence.

## SB comparison — bounded fresh-main evidence only
A bounded fresh-main GitHub code search for `DeploymentIntent deployment runtime realization rollout traffic readiness` returned no matches. This is **not** repository-wide absence evidence and is not used to infer implementation maturity. Full archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **GENERALIZE** deployment identity away from provider/runtime IDs.
- **HARDEN** typed release/deployment/environment/binding/realization/routing/readiness identities and revision vector.
- **HARDEN** status interpretation so positive historical provider conditions cannot masquerade as current composite health.
- **HARDEN** transition clocks with explicit pause/resume/policy lineage.
- **HARDEN** rollback eligibility as present evidence over retained closure, separate from authority and historical success.
- **HARDEN** routing mutation with expected-base/ownership fencing.
- **PROVIDERIZE** rollout, scheduler, traffic, autoscaling, readiness mechanics and multi-region coordination.
- **INTEGRATE** aggregate `INCONCLUSIVE` propagation with universal evidence composition.
- **INTEGRATE** qualified local runtime closure and reconnection requalification.
- **DO_NOT_BUILD** provider-native replicas of every rollout algorithm when equivalent external providers can satisfy the semantic contracts.

## Repo-validation questions
1. Does main model release, deployment intent, environment, runtime binding, attempt, realization, routing and readiness as distinct subjects?
2. Can a rollout status be qualified by observed generation/revision and observation window rather than treated as timeless truth?
3. Are pause/resume and deadline semantics explicit enough to prevent wall-clock timeout from becoming false failure evidence?
4. Can one revision be realized with zero traffic, and can traffic allocation differ from replica/capacity allocation without semantic identity confusion?
5. Does routing mutation have expected-base or ownership fencing against stale concurrent writers?
6. Are custom/domain readiness gates composable, with missing required evidence failing closed or becoming `INCONCLUSIVE`?
7. Can local region/Station completion remain distinct from aggregate fleet/global qualification?
8. Is rollback eligibility recalculated from retained artifact/config/schema/trust/state/provider closure rather than inferred from historical success?
9. Is workload/routing rollback still separate from persisted-state restore/forward-fix?
10. Can disconnected Stations operate only within explicit closure and requalify after reconnection?

## Adaptive Governed Work Surfaces boundary
Adaptive Governed Work Surfaces remains a separate promoted CORE capability. `Enterprise -> Station -> Role -> Person` may expose status, constrained operational actions and admitted deployment-backed capabilities, but surface composition and AI materialization do not grant deployment admission, runtime provider administration, routing mutation, rollout promotion, rollback or persisted-state recovery authority. A Station switch, Role change, provider/routing revision, or superior policy/trust change invalidates dependent exposure evidence and forces revalidation before privileged actuation.

## Symbiotic Proof
Use one qualified release and semantic deployment intent across Kubernetes-like provider A and serverless/provider B. Deploy revision B with zero production traffic, validate it directly, then route 10% while keeping capacity intentionally different from traffic percentage; prove realization, routing and scale remain distinct. Pause rollout long enough to exceed wall-clock duration but not the state-scoped progress clock; prove no false timeout. Make containers ready while one custom domain readiness gate is absent; qualification must fail/`INCONCLUSIVE`. Complete region 1 while region 2 remains pending and prove global deployment stays blocked. Remove one retained rollback prerequisite and prove the historical stable revision becomes `NOT_ELIGIBLE` rather than falsely safe. Race two authorized routing writers from the same base and require expected-base fencing. Finally disconnect a Station with a declared closure; allowed local runtime operation continues, privileged provider/routing/recovery actions remain bounded, and reconnection with newer superior trust/routing state forces requalification.

## Stable findings
- **G2-FINDING-DER-38 — Deployment identity is typed across QualifiedRelease, DeploymentIntent, EnvironmentProfile, RuntimeBinding, Attempt, ProviderRealization, RoutingAssignment, ReadinessEvidence and RollbackEligibility; provider revision IDs are realization identities, not canonical System/Station identity.**
- **G2-FINDING-DER-39 — Effective deployment qualification is a multi-axis revision vector; release, config, schema, trust, topology, provider, routing, readiness-gate and rollout-policy changes can independently stale prior evidence.**
- **G2-FINDING-DER-40 — Positive rollout/provider conditions are observation artifacts, not timeless health facts; condition reason, observed subject/revision and current availability/readiness must participate in composite qualification.** Kubernetes `Progressing=True` persistence after completion is direct adversarial evidence.
- **G2-FINDING-DER-41 — Rollout deadlines are state-scoped TransitionClocks with pause/resume and policy semantics; raw wall-clock elapsed time cannot universally prove rollout failure.**
- **G2-FINDING-DER-42 — Runtime realization, traffic assignment and capacity/scale are independent effective-state dimensions.** A revision may exist with zero traffic, and traffic weight may intentionally diverge from replica percentage.
- **G2-FINDING-DER-43 — Local realization success does not imply aggregate fleet/region/Station qualification; explicit coverage/barrier semantics can leave locally complete units globally BLOCKED or PARTIAL.**
- **G2-FINDING-DER-44 — Rollback eligibility is dynamic revision-bound evidence over retained compatible closure, distinct from historical success and from rollback authority.** Provider history erosion or an in-progress rollback can change present eligibility.
- **G2-FINDING-DER-45 — Routing mutation is a canonical effective-state transition requiring expected-base/ownership fencing; authorized stale writers must not overwrite newer traffic ownership silently.**

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-DER-TYPED-DEPLOYMENT-REALIZATION-ROUTING-READINESS-IDENTITY-MAPPING` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Specialize UCA typed identity while retaining Deployment ownership of runtime/routing/readiness semantics.
- `G2-CAPABILITY-CANDIDATE-DER-STATE-SCOPED-TRANSITION-CLOCK` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Workflow/Lifecycle timeout semantics; Deployment contributes pause-aware rollout evidence.
- `G2-CAPABILITY-CANDIDATE-DER-DYNAMIC-ROLLBACK-ELIGIBILITY-EVIDENCE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**. Keep present eligibility and retained closure distinct from historical successful revision and authority.
- `G2-CAPABILITY-CANDIDATE-DER-ROUTING-OWNERSHIP-EXPECTED-BASE-FENCING` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with shared ownership/fencing primitive while Deployment retains effective traffic-assignment semantics.

No candidate promoted. Adaptive Governed Work Surfaces remains promoted and distinct.

## Architecture proof-backfill obligations
1. **Stale positive-condition proof:** preserve a historical successful rollout condition while current availability degrades; aggregate qualification must not claim current health from the stale positive fact.
2. **Pause-aware clock proof:** pause a rollout across its nominal wall-clock deadline and prove the state-scoped transition clock does not falsely fail it; then resume and exceed the active deadline to produce failure.
3. **Realization-without-routing proof:** create/validate a new revision with 0% production traffic and prove `REALIZED != EFFECTIVE_ROUTED`.
4. **Traffic-vs-capacity proof:** route a high canary percentage to intentionally small pinned canary capacity and preserve both dimensions independently.
5. **Readiness-gate negative proof:** containers are ready but a required domain readiness gate is missing/false; effective qualification must deny or become `INCONCLUSIVE`.
6. **Aggregate barrier proof:** one region/Station completes while another remains pending/failed; local evidence stays valid but global deployment cannot become QUALIFIED.
7. **Dynamic rollback-eligibility proof:** begin from a historical successful revision, remove one required retained artifact/config/schema/trust/state prerequisite, and prove rollback becomes unavailable/`INCONCLUSIVE` without rewriting historical success.
8. **Routing stale-writer proof:** two authorized actors derive traffic changes from the same routing base; after one wins, the stale second mutation must conflict/reconcile instead of silently overwrite.
9. **Rollback-vs-recovery proof:** route/workload rollback succeeds while persisted state remains forward-migrated; evidence must retain `RECOVERY_REQUIRED` where applicable.
10. **Provider substitution proof:** dual-run two providers under one semantic deployment identity; qualify each independently and cut traffic only with explicit residual-realization and rollback disposition.
11. **Qualified local closure proof:** continue an admitted runtime offline; remove one trust/readiness/routing/rollback prerequisite and require bounded degradation/`INCONCLUSIVE`, never authority amplification.
12. **AGWS/AI non-amplification proof:** surface or AI discovers that a provider supports routing/rollback/provider-admin operation, but actuation remains denied absent separately delegated authority.

## Value / risk / priority / next question
**Value:** high — deployment is the junction where qualified artifacts become externally effective enterprise behavior.
**Risk if underspecified:** very high — stale success, unsafe routing overwrite, false rollback safety, provider lock-in and mistaken global health.
**Priority:** constitutional/cross-cutting before target-architecture closure.
**Next research question:** how Observability / Operations / Incident should bind evidence freshness, coverage, causality and incident/remediation lineage to these runtime/deployment subjects without turning telemetry into authority or treating missing telemetry as healthy state.
