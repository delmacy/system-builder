# Deployment / Environment / Runtime — Revisit 4 (Cycle 5)

## Research question
How should Generation 2 model deployment as a revision-bound, authority-bearing transition from qualified release and semantic environment intent into an effective runtime realization, while distinguishing actuation acknowledgement, rollout/traffic progression, readiness, domain postconditions, dependency freshness, rollback routing, persisted-state recovery, provider migration and autonomous local closure?

## Representatives and evidence/source ledger
1. **Kubernetes Deployment** — Pod-template changes create rollout revisions; scaling does not. `Progressing`, `Available`, ReplicaSet state and rollout completion are distinct observations. A provider/controller can accept a spec mutation before the desired revision is effectively realized. Source: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
2. **Kubernetes StatefulSet** — ordered stateful rollout can stall on a bad revision; reverting the template alone may not recover effective state and manual deletion of broken Pods can be required. This is direct negative evidence against equating desired rollback with realized recovery. Source: https://v1-35.docs.kubernetes.io/docs/concepts/workloads/controllers/statefulset/
3. **Kubernetes ConfigMap / Secret realization** — a ConfigMap change mounted as a volume may become visible after kubelet sync, while the same change consumed as an environment variable requires Pod replacement; immutable ConfigMaps/Secrets impose different lifecycle semantics. Effective configuration therefore depends on realization mode and running-workload revision, not merely canonical config revision. Sources: https://kubernetes.io/docs/tutorials/configuration/updating-configuration-via-a-configmap/ and https://kubernetes.io/docs/concepts/configuration/secret/
4. **Argo Rollouts** — canary/blue-green progression separates traffic weight, pause, analysis, promotion, abort and stable revision. Analysis can fail after partial traffic exposure; rollback windows can deliberately skip normal rollout steps for retained revisions. Sources: https://argo-rollouts.readthedocs.io/en/stable/features/canary/ , https://argo-rollouts.readthedocs.io/en/stable/features/analysis/ and https://argo-rollouts.readthedocs.io/en/stable/features/rollback/
5. **HashiCorp Nomad deployments** — job submission creates deployment state with canary, health deadlines, promotion and optional auto-revert. Multi-region deployments expose independent regional progression and aggregate success/failure policy. Sources: https://developer.hashicorp.com/nomad/docs/job-declare/strategy/rolling , https://developer.hashicorp.com/nomad/docs/job-declare/strategy/blue-green-canary and https://developer.hashicorp.com/nomad/docs/job-declare/multiregion

## Core primitives and source of truth
Cycle-5 evidence strengthens the universal decomposition:

`DeploymentIntentRevision -> QualifiedReleaseRef -> EnvironmentProfileRevision -> EnvironmentBindingRevision -> DeploymentPlan -> DeploymentAttempt -> ProviderActuationReceipt -> EffectiveRuntimeRealizationSet -> TrafficPlacementState -> RuntimeReadinessEvidence -> DomainPostconditionEvidence -> DeploymentQualificationDecision`

`ProviderActuationReceipt` is evidence that a provider accepted or reported an actuation request. It is not proof that the requested effective realization exists. `TrafficPlacementState` is likewise distinct from replica/process existence: progressive delivery can route 20%, 50% or 100% traffic independently of raw replica count.

Canonical **System**, **Station**, capability and deployment-intent identity must remain stable across scaling, placement, provider, cluster, region and traffic-routing changes. Provider-native rollout/deployment/allocation/ReplicaSet IDs are realization identities only.

## Identity, lifecycle and versioning
A deployment attempt is bound to exact revisions of at least release, semantic deployment intent, environment profile/binding and applicable config/schema/trust dependencies. Lifecycle is not a single `deployed` boolean:

`PLANNED -> ADMITTED -> ACTUATION_REQUESTED -> ACKNOWLEDGED|OUTCOME_UNKNOWN -> PARTIALLY_REALIZED -> REALIZED -> ROUTED -> READY -> POSTCONDITION_VALIDATED -> QUALIFIED`

Failure and compensating branches include `REJECTED`, `STALLED`, `DEGRADED`, `ABORTED`, `ROLLBACK_ROUTED`, `RECOVERY_REQUIRED`, `RECONCILIATION_REQUIRED` and `INCONCLUSIVE`.

A deployment can be partially realized while the previous revision remains partially effective. Canary and blue-green systems make coexistence explicit; Generation 2 should preserve this lineage instead of prematurely choosing one synthetic `current_version`.

## Failure semantics
- API/provider acknowledgement can be lost after an actuation took effect; retrying blindly can create duplicate or conflicting realization.
- Controller completion is not equivalent to readiness; readiness is not domain acceptance.
- Traffic switch/promotion may succeed while downstream schema/config/trust dependencies are stale or incompatible.
- Stateful rollback of routing/workload template is not persisted-state recovery.
- Config changes can be effective for one consumption mode and stale for another.
- Multi-region or multi-Station rollout can be `PARTIAL`; aggregate success requires explicit coverage semantics.
- If dependency revision/freshness evidence cannot be established, deployment qualification is `INCONCLUSIVE`, not implicitly healthy.

## Dependency-qualified readiness and freshness
`READY` must be qualified by a dependency vector rather than treated as timeless provider status. At minimum the evidence subject should identify:

`{deployment_intent_revision, release_revision/digest, environment_profile_revision, binding_revision, config_revision_set, schema/migration_revision_set, trust/policy_revision_set, topology/provider_revision, traffic_routing_revision, observation_window, evidence_freshness}`.

A material change to any dependency that can invalidate behavior makes prior readiness/postcondition evidence stale or inapplicable until requalification. This follows directly from Kubernetes configuration realization differences and from progressive-delivery analysis being bound to a rollout phase/revision rather than eternal application truth.

## Extensibility and provider boundaries
Orchestrator, scheduler, runtime handler, traffic manager/ingress, service discovery, autoscaler, secret/config projection, persistent-state provider and health/analysis backend are replaceable realization providers behind semantic contracts. Provider-specific strategies remain qualified extensions.

Scaling, placement and routing are provider-owned mechanics constrained by semantic policy. They must not mutate System/Station identity. Traffic-manager choice is especially non-canonical: Argo Rollouts can approximate weight by replica ratio without a traffic manager or control traffic independently when one exists.

## Provider replacement, coexistence and cutover
Provider replacement is not `copy deployment spec and switch endpoint`. A governed cutover must preserve or re-establish:
- release/artifact identity and verification;
- environment/config/schema/trust compatibility;
- runtime state and persisted-state migration disposition;
- traffic/routing ownership and observation;
- readiness/domain postconditions per realization;
- rollback/recovery eligibility;
- authority and audit lineage.

During dual-running, two provider realizations may both be healthy but only an explicitly qualified routing/selection state determines which is effective for a Station/tenant/profile. Coexistence is therefore a first-class transition state.

## Build-once / replicate-many
Deployment must consume immutable qualified release identity wherever possible and vary environment/provider bindings separately. Rebuilding per environment couples Build/Release identity to deployment realization and weakens reproducibility. Environment-specific configuration, placement and routing should be bound after release qualification unless they are explicitly declared build inputs.

## Governance and authority
`ReleaseQualificationAuthority != DeploymentAdmissionAuthority != DeploymentActuationAuthority != TrafficPromotionAuthority != RuntimeProviderAdministrationAuthority != PersistedStateRecoveryAuthority`.

A release being verified/approved does not authorize deployment. A rollout controller capable of auto-promote/auto-revert owns only the authority explicitly delegated to that rollout policy. Health analysis cannot self-grant provider-admin or persisted-state recovery authority. AGWS and AI may prepare a candidate, plan, evidence request or promotion recommendation, but cannot amplify their authority by discovering that a provider supports the operation.

## Observability and evidence
A deployment evidence set should retain:
- semantic deployment and release subjects;
- exact dependency revision vector;
- attempt and provider request correlation IDs;
- provider receipt plus reconciliation disposition when acknowledgement is ambiguous;
- concrete realization identities and placement;
- coexistence/canary/stable membership;
- traffic-routing state and coverage;
- readiness/health observation window and source;
- domain postconditions;
- region/platform/Station/tenant coverage;
- freshness and missing-evidence dimensions;
- rollback and recovery eligibility at decision time.

Observability supplies evidence; it does not become deployment authority.

## Portability, lock-in and autonomous/offline runtime closure
A **Qualified Local Runtime Closure** is operation/profile scoped. For autonomous deploy/start/operate/recover, it may require immutable release artifacts, runtime/orchestrator/provider binaries/images, environment/config schemas and values or references, trust roots, policy, secret materialization method, migration assets, state/checkpoints, routing/service discovery rules, health/postcondition definitions, provider capability profile and evidence validators.

Absence of a central Builder is acceptable only when the local closure contains every dependency required for the authorized operation. Missing authority/trust/schema/state evidence yields bounded degradation or `INCONCLUSIVE`, never silent online fallback or broader authority.

Lock-in is introduced when semantic deployment identity equals cluster/job/service IDs, when health semantics equal one provider condition vocabulary, when routing state is inaccessible outside a provider, or when rollback depends on provider-retained history unavailable to an autonomous runtime.

## Product-specific mechanism versus universal primitive
Kubernetes ReplicaSet revision annotations, StatefulSet `partition`, ConfigMap propagation modes, Argo `setWeight`/`AnalysisRun`/rollback window and Nomad deployment IDs are product-specific. Universal primitives are revision-bound intent, provider actuation receipt/disposition, effective realization set, traffic-placement state, dependency-qualified readiness/postconditions, governed cutover/rollback/recovery and qualified local closure.

## Convergent patterns
- accepted desired state and effective runtime state are separate;
- progressive delivery is explicit coexistence plus routing/promotion state;
- readiness is evidence over a revision and observation window;
- rollback eligibility depends on retained realization/dependency closure;
- stateful recovery is stronger than workload/routing rollback;
- provider identity is realization identity;
- multi-region/profile coverage must be explicit;
- authority for release, deployment, traffic and recovery is separable.

## Divergent patterns
Kubernetes Deployment emphasizes controller reconciliation; StatefulSet exposes stronger ordering/stateful hazards; Argo elevates traffic progression and analysis; Nomad elevates deployment/canary/promotion objects and multi-region coordination. These are realization differences that argue for providerized mechanics, not divergent semantic ownership.

## Subcapabilities
Deployment intent/revision; release admission; environment profile/binding; deployment planning; actuation request/receipt/reconciliation; progressive rollout; coexistence/canary; traffic placement/promotion; scaling/placement; readiness/postcondition qualification; dependency freshness; stateful rollback/recovery; multi-region/Station coverage; provider dual-run/cutover; local runtime closure; deployment evidence.

## SB comparison — bounded evidence only
No fresh repository-wide implementation claim is made in this research pass. The cycle-4 directed search found no precise implementation excerpt and remains only bounded negative search evidence. Repository archaeology is reserved for PLANNING_B. Therefore all KEEP/HARDEN/GENERALIZE decisions below are architecture hypotheses, not assertions about current SB code.

## Reconciliation hypotheses
- **GENERALIZE** deployment identity away from orchestrator/provider IDs and single `current version` state.
- **HARDEN** attempted/acknowledged/effective/routed/ready/validated/qualified separation.
- **HARDEN** readiness with dependency revision/freshness vectors and explicit `INCONCLUSIVE`.
- **HARDEN** release qualification versus deployment/traffic/recovery authority separation.
- **PROVIDERIZE** scheduler, orchestrator, runtime, traffic manager, autoscaler, config/secret realization and provider health mechanics.
- **INTEGRATE** ambiguous deployment actuation with universal external-effect reconciliation/disposition.
- **INTEGRATE** provider cutover/rollback/recovery with shared governed transition semantics.
- **INTEGRATE** local runtime autonomy with qualified local closure.
- **DEFER** commercial charging/rating ownership; expose measurable runtime/placement complexity evidence only.

## Repo-validation questions
1. Does main distinguish deployment intent, attempt, provider acknowledgement, effective realization, routing state, readiness and domain validation?
2. Are readiness/health facts bound to release/config/schema/trust/topology revisions and invalidated when those dependencies change?
3. Can a partially successful provider action enter `OUTCOME_UNKNOWN`/reconciliation rather than blind retry?
4. Is scaling/placement/routing represented without mutating semantic System/Station identity?
5. Can two runtime providers coexist during migration with explicit routing and independent qualification evidence?
6. Is rollback routing/workload history distinct from persisted-state restore/recovery authority and evidence?
7. Are build artifacts immutable and reusable across environments, with environment-specific binding separated from Build identity?
8. What exact artifact/config/secret/trust/state/provider closure is required for local autonomous deployment and recovery?
9. Can Station/Role/Person or AI initiate provider-admin, traffic promotion or recovery acts without separately delegated authority?

## Adaptive Governed Work Surfaces boundary
Adaptive Governed Work Surfaces remains a promoted **CORE** capability and stays distinct from generic UI. `Enterprise -> Station -> Role -> Person` may expose only admitted deployment-backed actions. Station identity is not cluster/namespace identity. A Station/Role/Person request that implies new release admission, environment binding, provider installation, traffic promotion, secret exposure, persisted-state recovery or topology mutation must be separately authorized/escalated. A deployment/provider/config/trust revision change invalidates dependent AGWS exposure evidence where its capability assumptions are no longer proven.

## Symbiotic Proof
Deploy the same qualified release and semantic deployment intent to provider A and provider B without changing System/Station identity. Force provider A acknowledgement loss after partial realization; the system must reconcile instead of blind retry. Run a canary with explicit traffic placement, prove controller availability but fail domain postcondition, and deny promotion. Change a config/trust dependency and prove prior readiness becomes stale. Roll traffic back while persisted state remains forward-migrated and prove `RECOVERY_REQUIRED` rather than false recovery. Then operate provider B from a declared local closure while the central Builder is unavailable; remove one required trust/schema/state validator and prove bounded failure/`INCONCLUSIVE`. Throughout, AGWS/AI may propose actions but cannot acquire deployment/provider-admin/recovery authority.

## Stable findings
- **G2-FINDING-DER-30 — Deployment Admission, Actuation Receipt, Effective Runtime Realization, Traffic Placement, Readiness, Domain Validation and Qualification Are Distinct Revision-bound States.** Provider acceptance or controller completion cannot collapse these phases into `deployed`.
- **G2-FINDING-DER-31 — Deployment Actuation Can Be PARTIAL or OUTCOME_UNKNOWN and Requires Reconciliation Before Blind Retry, Promotion or Rollback.** Lost acknowledgement after external effect is an ambiguity state, not proof of failure.
- **G2-FINDING-DER-32 — Runtime Readiness Is Dependency-qualified and Becomes Stale After Material Release, Config, Schema, Trust, Topology, Binding or Routing Revision Change.** Provider health status without dependency lineage is insufficient qualification evidence.
- **G2-FINDING-DER-33 — Progressive Delivery Requires First-class Coexistence and Traffic-placement State Separate from Replica/Process Count.** Canary percentage, stable membership and effective routing can diverge from raw scaling.
- **G2-FINDING-DER-34 — Routing/Workload Rollback and Persisted-state Recovery Are Different Governed Transitions With Different Authority and Postconditions.** Stateful rollback evidence demonstrates that reverting desired workload state may not restore effective system state.
- **G2-FINDING-DER-35 — Provider Replacement Requires Dual-run/Cutover Evidence Across Runtime, Routing, Dependency Compatibility, State and Recovery Closure; Healthy Providers Alone Do Not Select the Effective Realization.** Selection/routing is explicit, lineaged state.
- **G2-FINDING-DER-36 — Build-once/Replicate-many Requires Immutable Qualified Release Identity to Remain Separate From Environment and Provider Bindings.** Environment-specific rebinding should not silently manufacture a new Build identity.
- **G2-FINDING-DER-37 — Release, Deployment Admission/Actuation, Traffic Promotion, Runtime Administration, Persisted-state Recovery and AGWS/AI Authorities Are Non-amplifying Facets.** Capability to analyze or realize does not confer authority to promote, administer or recover.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-DER-QUALIFIED-EFFECTIVE-RUNTIME-POSTCONDITION-EVIDENCE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge with unified effective-realization/evidence qualification while retaining Deployment ownership of runtime/traffic/dependency coverage semantics.
- `G2-CAPABILITY-CANDIDATE-DER-PARTIAL-AMBIGUOUS-ACTUATION-RECONCILIATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge with universal ambiguous external-effect disposition; provider actuation correlation remains Deployment-owned evidence.
- `G2-CAPABILITY-CANDIDATE-DER-DEPENDENCY-QUALIFIED-READINESS-FRESHNESS-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Lifecycle/Observability readiness freshness while retaining Deployment dependency-vector semantics.
- `G2-CAPABILITY-CANDIDATE-DER-GOVERNED-DUAL-RUN-TRAFFIC-CUTOVER-RECOVERY-TRANSITION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with shared provider migration/recovery transition; do not promote independently without synthesis evidence.

No candidate promoted. Adaptive Governed Work Surfaces remains promoted, explicit and distinct.

## Architecture proof-backfill obligations
1. **Attempt/receipt/effective proof:** provider accepts revision B but realization remains partially A; evidence must not claim B effective or qualified.
2. **Ambiguous acknowledgement proof:** lose provider response after successful create/update; reconciliation must discover/disposition the effect before retry.
3. **Readiness invalidation proof:** qualify runtime READY, then change config/schema/trust/topology dependency; prior readiness becomes stale/inapplicable.
4. **Traffic-vs-scale proof:** realize a canary where traffic percentage differs from replica percentage; evidence must preserve both states.
5. **Domain-postcondition negative proof:** controller rollout and readiness succeed while an application invariant fails; deployment qualification must fail or remain unqualified.
6. **Stateful rollback proof:** route/workload rollback succeeds while persisted state is incompatible; system must require recovery/forward-fix evidence rather than claim restored state.
7. **Provider dual-run/cutover proof:** providers A and B coexist healthy; only explicit qualified routing/selection state determines effective realization, with rollback path retained.
8. **Build-once proof:** deploy one immutable release digest across two environment/provider profiles without rebuilding; semantic release identity remains stable while bindings/evidence differ.
9. **AGWS/AI authority proof:** request traffic promotion/provider administration/recovery from a Personal/Role surface or AI without authority; proposal/escalation is allowed, actuation denied.
10. **Qualified-local-closure proof:** deploy/operate offline from declared closure; remove required trust/schema/state/provider validator and require bounded degradation/`INCONCLUSIVE`, never authority expansion or hidden online dependency.

These obligations move Deployment / Environment / Runtime proof coverage from `BACKFILL_REQUIRED` conceptually toward `PARTIAL`; the central proof matrix remains authoritative and should absorb them during its next safe reconciliation.

## Value / risk / priority / next question
**Value:** very high; this capability is the boundary where generated semantics become a live autonomous system. **Risk:** critical if provider acknowledgement, rollout state, readiness, routing, state recovery and authority collapse into a single deployment flag. **Priority:** very high. **Saturation:** **NOT SATURATED** because eight material findings were added; consecutive-no-material resets to 0. **Next question:** Observability / Operations / Incident should stress-test whether it can independently qualify these dependency/freshness/coexistence/recovery states without becoming actuator or semantic owner.