# Deployment / Environment / Runtime — Revisit 3 (Cycle 4)

## Research question
How should Generation 2 distinguish desired deployment/environment semantics, release/profile selection, provider/runtime realization, rollout attempts and observed runtime evidence while preserving provider replacement, recovery, local/offline autonomy and authority attenuation?

## Representatives and evidence/source ledger
1. **Kubernetes Deployment** — Deployment revisions are triggered by Pod-template changes; rollout history/undo operate over those revisions. Rollout progress and Ready/Available conditions are separately observable; a stalled rollout can be detected by progress deadline. Source: Kubernetes Deployment and rolling-update documentation.
2. **Kubernetes RuntimeClass** — semantic runtime-class selection is resolved to a CRI-dependent handler; scheduling constraints are merged at admission and incompatible placement can be rejected. RuntimeClass writes are recommended to remain administrator-controlled. Source: Kubernetes RuntimeClass docs/API.
3. **Kubernetes StatefulSet** — phased/partitioned updates exist, but rollback can require explicit intervention after a bad revision; reverting desired template alone does not guarantee realized recovery. Source: Kubernetes StatefulSet docs.
4. **HashiCorp Nomad** — job revisions produce deployment identities; canary/manual promotion, health deadlines, auto-revert and deployment status distinguish specification, rollout, health and promotion. Multi-region deployments have independent regional progress/state. Source: Nomad deployment strategy/update/multiregion docs.
5. **Nomad failure recovery** — restart/reschedule are recovery mechanisms distinct from deployment success and can respond to runtime/provider/node failure. Source: Nomad failure-recovery docs.

## Source of truth / identity
Universal primitive proposed for synthesis testing:

`DeploymentIntentRevision -> EnvironmentBindingRevision -> ReleaseProfileRef -> DeploymentAttempt -> ProviderRealizationSet -> ObservedRuntimeEvidenceSet`

A Kubernetes Deployment revision, Nomad job version/deployment ID, allocation/Pod UID, node/runtime handler and provider-native rollout identifier are realization identities, not the semantic identity of a portable SB deployment intent.

Environment identity is likewise not a cluster/project/namespace ID. A portable environment should identify intended capability/policy/configuration/trust constraints and bind them to one or more concrete provider realizations.

## Lifecycle and versioning
A rollout is an attempt against exact desired/release/environment revisions. Canary/promotion, rolling replacement, pause, abort, regional progression and stateful migration are attempt/checkpoint states. Rollback is a new governed deployment transition referencing an earlier qualified revision; it is not history erasure.

Provider/runtime replacement converges on the shared transition:

`Plan -> Validation -> Approval -> Attempt -> Checkpoint -> PostconditionEvidence`

## Failure semantics
- Scheduler/placement acceptance != runtime start.
- Runtime start != readiness.
- Readiness != domain/business correctness.
- Deployment-controller success != semantic postcondition proof.
- Desired-spec rollback != realized recovery for stateful workloads.
- A missing/incompatible RuntimeClass can terminate realization before application execution.
- Multi-region success must be profile-qualified; one region's success cannot silently qualify all regions.

Unknown/stale/uncovered runtime evidence yields `INCONCLUSIVE`, never implicit conformance.

## Extensibility and provider boundaries
Runtime selection, scheduler, orchestrator, service mesh, ingress, secret/config realization, persistent state and health probes are provider realizations behind semantic capability/binding contracts. Provider-specific knobs may exist as qualified extensions but cannot become portable semantic authority by accident.

## Governance / authority
`ReleasePromotionAuthority != DeploymentAuthority != RuntimeProviderAdministrationAuthority != RecoveryAuthority`.

A release being approved does not authorize deployment. A deployment controller being able to auto-revert does not grant it authority to mutate canonical domain/process definitions. RuntimeClass/provider administration remains privileged infrastructure authority.

## Observability
Evidence must be revision-bound and profile-qualified: deployment attempt ID, desired revision, release/profile revision, environment binding revision, provider realization IDs, placement/runtime selection, checkpoint, readiness/health observations, region/platform coverage, freshness and postconditions.

## Portability / qualified local closure
A qualified local/offline runtime execution/recovery closure may require: exact artifacts and platform manifests; runtime/orchestrator definitions; configuration and secret references/materialization method; trust roots; policies; required provider binaries/images; migration/recovery procedures; health/readiness definitions; state/backup references; dependency endpoints or local substitutes; conformance checks and evidence schemas. Closure is profile-scoped, not a claim that every external dependency is bundled.

## Lock-in
Lock-in increases when semantic environment identity equals provider account/cluster IDs, health equals one orchestrator's condition vocabulary, release channels encode provider deployment IDs, or rollback depends on inaccessible provider history. Provider-neutral deployment intent plus explicit binding/evidence reduces this without pretending providers are identical.

## Product-specific mechanism vs universal primitive
Kubernetes ReplicaSet revision annotations, RuntimeClass handlers and Nomad deployment/allocation IDs are product-specific. Universal candidates are revision-bound desired/effective/observed lineage, qualified evidence, governed migration/rollback transition and qualified local closure.

## Convergent patterns
- desired specification is distinct from rollout/deployment attempt;
- rollout has checkpoints and health gates;
- canary/promotion is authority-bearing transition, not mere scheduling;
- rollback/revert creates a new operational transition;
- runtime/provider selection can be constrained independently from application semantics;
- stateful recovery needs stronger evidence than stateless controller success;
- regional/platform coverage matters to qualification.

## Divergent patterns
Kubernetes primarily reconciles desired workload state through controllers; Nomad exposes deployment objects and promotion/revert semantics more directly. RuntimeClass makes runtime selection explicit while other platforms may hide it. These are realization differences, not reasons to make the portable model provider-specific.

## Subcapabilities
Deployment intent/revision; environment binding; release-to-deployment admission; rollout strategy; checkpoint/promotion; placement/runtime selection; readiness/health qualification; stateful transition/recovery; multi-region/platform qualification; provider migration; local/offline execution/recovery closure; deployment evidence/provenance.

## SB comparison — bounded evidence only
A bounded fresh-main GitHub code search for `deployment runtime environment release health readiness rollback` returned no matching excerpt. This is evidence only that this directed search did not locate a precise implementation; it is **not** repository-wide evidence of absence. Repository archaeology remains for PLANNING_B.

## Reconciliation hypotheses
- **GENERALIZE** semantic deployment/environment identity away from provider realization IDs.
- **HARDEN** release -> deployment authority separation and revision-bound evidence.
- **PROVIDERIZE** scheduler/orchestrator/runtime/health realization details.
- **INTEGRATE** deployment migration/rollback with shared governed transition.
- **INTEGRATE** runtime evidence with unified evidence qualification.
- **INTEGRATE** self-hosted/air-gapped execution with qualified local closure.
- **DEFER** commercial rating/billing ownership; expose measurable complexity evidence only.

## Repo-validation questions
1. Where does main currently encode deployment/environment identity and release binding?
2. Are rollout attempts/checkpoints/postconditions first-class or inferred from CI/provider status?
3. Are readiness/health observations revision-bound and freshness-qualified?
4. Can runtime/provider realization be replaced without changing portable definition semantics?
5. What stateful migration/rollback evidence exists?
6. Which artifacts/config/secrets/trust inputs are required for autonomous generated-runtime recovery?
7. Can Station-scoped changes trigger deployment without explicit deployment authority?

## Adaptive Governed Work Surfaces boundary
AGWS remains distinct from generic UI. `Enterprise -> Station -> Role -> Person` can request/materialize only surface revisions inside admitted capabilities. A Person/Role request that implies new artifact deployment, runtime class, environment binding, secret/config exposure, provider installation or rollout strategy must escalate. AI may prepare a deployment candidate/evidence request but cannot acquire DeploymentAuthority or RuntimeProviderAdministrationAuthority. Revalidation after Station/Role change includes deployment/binding freshness where a component/action depends on a deployed external capability.

## Symbiotic Proof
A portable generated system can bind the same semantic deployment revision to two conforming runtime providers, qualify each realization independently, canary/promote one under explicit authority, detect readiness separately from domain acceptance, recover/rollback as a new lineaged transition, and execute/recover under a declared local/offline closure profile without requiring the central Builder. AGWS continues to consume only admitted deployed capabilities and cannot amplify deployment authority.

## Stable findings
- **G2-FINDING-DER-23 — Desired Deployment Revision, Environment Binding, Release Profile, Deployment Attempt and Provider Runtime Realization Are Distinct Identities.** Portable semantics must not collapse into cluster/job/allocation/provider IDs.
- **G2-FINDING-DER-24 — Deployment Success, Runtime Readiness and Domain Postcondition Qualification Are Distinct Evidence Layers.** Controller success or health alone cannot prove business correctness.
- **G2-FINDING-DER-25 — Rollback/Revert Is a New Governed Deployment Transition, Not Erasure of the Failed Revision.** Stateful recovery may require additional explicit acts and evidence.
- **G2-FINDING-DER-26 — Runtime/Scheduling Selection Is a Provider Realization Constrained by Semantic Profiles and Authority.** RuntimeClass-style handlers/placement are replaceable realizations and privileged administration surfaces.
- **G2-FINDING-DER-27 — Deployment Qualification Must Carry Platform/Region/Attempt Coverage and Freshness.** Partial regional/platform success cannot qualify an entire semantic deployment.
- **G2-FINDING-DER-28 — Qualified Local/Offline Runtime Execution and Recovery Require a Profile-scoped Closure of Artifact, Runtime, Config/Secret, Trust, State/Recovery and Verification Inputs.** Central control-plane availability is not a valid hidden prerequisite for autonomy.
- **G2-FINDING-DER-29 — Release Approval, Deployment Authority, Runtime Administration and Recovery Authority Must Remain Separated Across AI/AGWS Automation.** Materialization capability cannot self-grant operational authority.

## Candidate disposition
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-DEPLOYMENT-RUNTIME-EVIDENCE-SET` — CROSS_CUTTING / CANDIDATE / MERGE_TARGET into unified realization/evidence qualification.
- `G2-CAPABILITY-CANDIDATE-GOVERNED-DEPLOYMENT-RUNTIME-PROVIDER-MIGRATION-TRANSITION` — CROSS_CUTTING / CANDIDATE / MERGE_TARGET into shared governed migration transition.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-RUNTIME-EXECUTION-RECOVERY-CLOSURE` — CROSS_CUTTING / CANDIDATE / MERGE_TARGET into qualified local closure profile.

No candidate promoted.

## Value / risk / priority / next question
**Value:** very high; this boundary determines autonomous generated-runtime portability. **Risk:** very high if release, deployment and provider administration collapse into one authority or one provider identity. **Priority:** high. **Next question:** Observability / Operations / Incident should test whether evidence qualification can represent desired/effective/observed runtime state, incident/recovery lineage and freshness without making observability an actuator or authority owner.