# Generation 2 — Deployment / Environment / Runtime — Revisit 02

Status: REVISIT CYCLE 3 PASS — MATERIAL NEW FINDINGS — NOT SATURATED

## Research question

What additional universal primitives are required to preserve a portable semantic deployment/environment model across rollout strategies, disconnected/self-hosted runtime modes, provider replacement and partial failures, while keeping release qualification, secrets, business acceptance and work-surface authority outside Deployment ownership?

## Representatives

| Representative | Coverage | Revisit contribution |
|---|---|---|
| Kubernetes Deployments / kubelet | DEEP | desired/observed reconciliation, revision-scoped rollback, partitioned-node behavior, standalone node runtime boundary |
| Nomad deployments | DEEP | canary health, explicit/automatic promotion, auto-revert, multi-region rollout coordination |
| Google Cloud Run | DEEP | immutable runtime revisions, zero-traffic realization, independent traffic assignment and rollback by traffic reassignment |
| Amazon ECS | DEEP | deployment circuit breaker, staged failure detection, rollback to last completed deployment, deployment state events |
| Argo CD / GitOps reconciliation model | DEEP | prior-cycle authority remains: desired/live drift, policy-scoped self-heal and reconciliation attempts |

## Evidence / source ledger

1. Kubernetes Deployment — https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
   - rollout revisions are created by Pod-template changes, while scaling does not create a new Deployment revision;
   - rollback changes the Deployment template back to an earlier revision, not a universal restoration of all environment/runtime state.
2. Kubernetes standalone kubelet — https://kubernetes.io/docs/tutorials/cluster-management/kubelet-standalone/
   - kubelet can run Pods from local manifests without API-server mode;
   - standalone mode loses control-plane sourced configuration capabilities, proving autonomy is capability/dependency scoped rather than binary.
3. Kubernetes taints/unreachable nodes — https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/
   - during API-server/node communication loss, Pods scheduled for deletion can continue to run on the partitioned node until communication returns.
4. Nomad canary/update — https://developer.hashicorp.com/nomad/docs/job-specification/update and https://developer.hashicorp.com/nomad/docs/job-declare/strategy/blue-green-canary
   - healthy canaries do not imply promotion when `auto_promote=false`;
   - `auto_revert`, health deadlines and multi-region rollout policy are explicit deployment semantics.
5. Cloud Run rollouts/traffic — https://cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration
   - a new revision can exist at 0% traffic;
   - traffic percentages can change without redeploying;
   - rollback can be performed by assigning 100% traffic to an older revision, and transition is not instantaneous.
6. Amazon ECS deployment circuit breaker — https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html
   - failure detection has runtime/health stages;
   - a failed deployment can automatically roll back to a prior deployment that reached `COMPLETED`;
   - deployment state changes are externally observable events.
7. System Builder fresh `main` — `packages/deploy/index.ts`
   - separates `DeployPublishedRelease`, `DeployReleaseArtifact`, `DeploymentRecord`, lineage admission and `DeploymentActivationDecision`;
   - validates artifact/environment binding compatibility and rejects secret values;
   - inspected `DeploymentRecord` has one `deploymentId`, succeeded/failed status and health checks, while activation is separately recorded.

## Source of truth

Portable Deployment truth must not be a provider object. Keep the semantic chain:

`QualifiedReleaseRef + EnvironmentDefinitionRevision + BindingRevisionRefs -> DeploymentIntent -> DeploymentAttempt -> ProviderRuntimeRealization -> Serving/TrafficDecision -> ObservedRuntimeEvidence`.

Provider control planes are authoritative only for their own physical realization/observations. Artifact/Release remains authority for qualified release identity; Secrets for secret material; higher product-proof capability for business conformance; Authorization/Governance for who may deploy/promote/recover.

## Identity

Distinct identities are required for:

- `environmentIdentity` and `environmentDefinitionRevision`;
- `deploymentIntentIdentity`;
- `deploymentAttemptIdentity`;
- `providerRuntimeRealizationIdentity` / provider revision;
- `servingAssignmentRevision` / activation decision;
- `runtimeInstanceIdentity` / replica or allocation when operational evidence requires it;
- `runtimeObservationIdentity` with observation time/freshness;
- `recoveryDecisionIdentity` and any resulting new attempt/serving revision.

A provider-native revision counter, task ID or Deployment UID is realization identity, not the semantic deployment identity.

## Lifecycle

`release qualified -> environment compatibility admitted -> intent authorized -> attempt starts -> realization converges or fails -> readiness/health observed -> optional validation -> serving/promotion authorized -> traffic transition -> continuous observation/reconciliation -> drift/recovery/supersession/retirement`.

Partial rollout is first-class: old and new realizations may coexist, traffic can be mixed, some regions can complete while others fail, and recovery evidence must preserve this intermediate topology.

## Versioning

Revision axes must remain independent: release qualification revision, environment definition, configuration/binding references, deployment policy, provider adapter/contract, physical realization, serving assignment, observation time and recovery decision. Changing a traffic split or scaling target must not falsely imply a new artifact/release.

## Failure semantics

Classify failures by boundary:

- release/environment admission rejection;
- binding/config reference resolution failure;
- provider API/admission/scheduling failure;
- runtime realization failure;
- readiness/health failure;
- stalled rollout / deadline exceeded;
- validation/business-conformance failure after infrastructure health;
- promotion/traffic decision rejection;
- mixed-version or partial-region rollout failure;
- drift/reconciliation failure;
- control-plane disconnection/degraded manageability;
- rollback/revert/redeploy failure.

`RUNNING`, `Ready`, `healthy`, `COMPLETED`, `synced`, `serving` and `business-conformant` are typed claims, not aliases.

## Extensibility

Portable deployment requirements may declare rollout strategy class, traffic steering, placement/region constraints, offline/disconnected operating mode, reconciliation policy, required health semantics, stateful dependencies and minimum recovery capabilities. Provider-native knobs stay namespaced and must declare portability impact.

## Provider boundaries

Deployment owns portable environment/deployment intent, attempt/realization/serving lineage, runtime dependency inventory, drift/reconciliation intent and typed operational evidence. Providers own concrete clusters/services/tasks/revisions/allocations, native rollout controllers, traffic routers and physical diagnostics. Provider replacement creates new realization/attempt evidence and must re-prove capability compatibility.

## Governance

Deploy, promote, alter traffic, enable automatic reconciliation, rollback/revert, emergency override and retire are distinct authority-bearing operations. `BuildAuthority`, `ReleaseAuthority`, `DeploymentAuthority`, `PromotionAuthority` and `RuntimeAdministrationAuthority` must not imply one another. A work surface operating under `Enterprise -> Station -> Role -> Person` may invoke an already authorized semantic operation; it never obtains deployment/provider credentials by composition.

## Observability

Evidence should include semantic intent, release/environment/binding revisions, attempt, provider realization, rollout stage, instance/allocation summaries, readiness/health, serving distribution, drift, reconciliation policy/revision, control-plane connectivity/dependency state, observation timestamp/freshness and recovery decisions. Business proof remains a separately typed evidence input/output.

## Portability

Provider replacement proof requires the same qualified release and semantic environment/deployment requirements to be realized through a materially different provider, with new provider realization IDs and without changing portable identity merely to fit provider syntax. Unsupported guarantees must fail capability negotiation explicitly rather than degrade silently.

## Lock-in

Lock-in appears when semantic deployment state depends on provider-only IDs/health meanings, rollback history cannot be exported, traffic topology cannot be represented portably, runtime requires an undeclared remote control plane, provider config references leak into portable definitions, or provider replacement cannot reconstruct evidence needed for safe recovery.

## Product-specific mechanism vs universal primitive

| Product-specific mechanism | Universal primitive |
|---|---|
| Kubernetes Deployment/ReplicaSet revision | desired realization + provider rollout revision/evidence |
| kubelet static/standalone Pods | disconnected runtime mode + declared lost control-plane capabilities |
| Nomad canary/auto_promote/auto_revert | candidate realization + promotion/recovery policy |
| Cloud Run revision + traffic percentages | immutable realization + independent serving assignment |
| ECS deployment/circuit breaker | deployment attempt + staged health evidence + recovery trigger |
| Argo CD desired/live/selfHeal | drift observation + reconciliation authority/policy |

## Convergent patterns

1. Desired semantic state and observed provider state are distinct.
2. Realization and serving activation are distinct.
3. Health/readiness is narrower than business conformance.
4. Recovery is an authority-bearing operation with lineage, not history erasure.
5. Runtime autonomy is dependency scoped: continuation, reconfiguration, recovery and observability can have different control-plane dependencies.
6. Provider replacement must preserve semantic intent while creating new realization evidence.

## Divergent patterns / contradictions

- Cloud Run rollback can be traffic reassignment; Kubernetes rollback is template revision restoration; Nomad/ECS may perform provider-native revert. A universal `rollback` implementation would be false abstraction.
- Some runtimes can continue serving while disconnected yet lose reconciliation/configuration capabilities; others depend heavily on remote provider control planes. `autonomous=true/false` is too coarse.
- Multi-region coordination semantics differ: a single semantic deployment may produce region-scoped attempts/realizations and partial outcomes.

## Subcapabilities

1. Environment Definition & Revision Identity
2. Deployment Intent / Attempt / Realization Lineage
3. Qualified Release Admission
4. Runtime Realization & Instance Evidence
5. Health / Readiness / Business-Conformance Separation
6. Serving / Traffic Assignment
7. Rollout Strategy & Progressive Delivery
8. Drift Detection & Reconciliation Authority
9. Partial / Multi-region Deployment Evidence
10. Recovery / Rollback / Revert / Redeploy Semantics
11. Runtime Autonomy & Control-plane Dependency Matrix
12. Provider Replacement & Operational-Conformance Proof
13. Deployment Audit / Provenance
14. Station / Hierarchical-SB Runtime Exposure Boundary

## System Builder fresh-main comparison

Evidence from fresh `main` is file-scoped, not repository-wide absence proof:

- `packages/deploy/index.ts` already separates published release/artifact inputs from deployment records and activation decisions: **KEEP**.
- Artifact hash, runtime compatibility and environment bindings are validated before the dry-run record is formed; secret values are rejected: **KEEP/HARDEN**.
- `DeploymentActivationDecision` preserves candidate, previous active and resulting active IDs: strong seed for activation lineage: **KEEP/HARDEN**.
- The inspected `DeploymentRecord` uses one `deploymentId` and one succeeded/failed status with health checks. It does not itself distinguish intent, attempt, provider realization, traffic-assignment revision, region/partial-rollout topology or runtime-control-plane dependency evidence: **repo-validation required**, not an assertion of repository-wide absence.
- `dryRunDeploy` maps supplied `acceptanceChecks` into `healthChecks`; later archaeology must determine whether higher product/business acceptance is typed elsewhere before disposition.

## Reconciliation hypotheses

- **KEEP** — Release/Environment/Deployment separation and immutable release lineage.
- **KEEP** — activation decision history and secret-reference-only environment bindings.
- **HARDEN** — split semantic intent, execution attempt, provider realization and serving assignment identities.
- **HARDEN** — typed observation/freshness and partial-rollout evidence.
- **GENERALIZE** — runtime autonomy into a capability/dependency matrix: continue-serving, local-observe, reconfigure, reconcile, recover, upgrade.
- **GENERALIZE** — recovery into capability-qualified semantics rather than one universal rollback mechanism.
- **PROVIDERIZE** — clusters/services/tasks/revisions, native health, rollout controllers, traffic APIs and region mechanics.
- **INTEGRATE** — qualified artifact evidence as admission input without transferring Artifact ownership.
- **INTEGRATE** — Authorization/Governance evidence for deploy/promote/recover decisions.
- **DEFER** — exhaustive topology DSL until negative-space and product proofs establish required scope.
- **DO_NOT_BUILD** — arbitrary provider-resource abstraction or a single boolean `healthy/autonomous` model.

## Repository-validation questions

1. Does another fresh-main contract split semantic deployment intent from retry/attempt identity?
2. Is provider realization/revision identity modeled outside `packages/deploy/index.ts`?
3. Can current activation evidence represent fractional/multi-revision traffic or only one active deployment?
4. Where are drift/reconciliation observations, freshness and self-heal authority represented?
5. Are `acceptanceChecks` infrastructure checks, product acceptance, or a mixed abstraction?
6. Which generated runtime capabilities continue when Builder/provider control-plane connectivity is lost?
7. Which configuration/binding operations remain possible offline without secret-value custody by SB?
8. How is multi-region partial success/failure preserved?
9. Can provider A be replaced by provider B without changing semantic release/environment identity?
10. Which exact operation authorizes deployment from Station/hierarchical SB contexts, and how is AGWS prevented from inheriting that authority?

## Symbiotic Proof

A future proof must use one qualified immutable release and portable environment definition; create distinct intent and attempt IDs; realize on provider A; keep the candidate at zero/limited serving until an explicit promotion decision; demonstrate provider health without conflating business acceptance; induce a partial rollout/drift and preserve observation freshness; recover through a provider-specific mechanism while preserving semantic recovery lineage; disconnect the Builder/control plane and prove the declared autonomy matrix; then replace provider A with materially different provider B and re-prove environment, health, recovery and serving semantics without modifying the qualified release. An AGWS action may observe or invoke a pre-authorized operation but must fail any attempt to acquire deployment authority/provider credentials.

## Stable findings

### G2-FINDING-DER-17 — Runtime Autonomy Is a Capability/Dependency Matrix, Not a Boolean
**Value:** distinguishes continued serving from local observation, reconfiguration, reconciliation, recovery and upgrade capabilities during control-plane loss.  
**Risk:** an `autonomous` label can hide critical remote dependencies.  
**Priority:** P0.  
**Next question:** which minimum autonomy matrix belongs in generated-runtime handoff evidence?

### G2-FINDING-DER-18 — Qualified Release Admission Must Be Bound to Environment and Binding Revisions Without Transferring Release or Secrets Authority
**Value:** makes deployment reproducible and auditable while preserving capability ownership.  
**Risk:** deployment can silently consume stale/unqualified artifacts or configuration state.  
**Priority:** P0.  
**Next question:** what immutable refs already exist in main for config/binding revision evidence?

### G2-FINDING-DER-19 — Partial Rollout Topology Is First-class Evidence, Not Merely Success/Failure
**Value:** represents mixed revisions, region-scoped progress and safe recovery decisions.  
**Risk:** one final boolean erases the state needed to reason about progressive delivery failures.  
**Priority:** P0.  
**Next question:** what portable minimum can describe region/traffic/realization distribution without provider leakage?

### G2-FINDING-DER-20 — Runtime Health, Serving Eligibility and Business Conformance Are Separate Typed Claims
**Value:** prevents infrastructure success from becoming false product proof.  
**Risk:** health checks may silently authorize serving despite failed semantic acceptance.  
**Priority:** P0.  
**Next question:** where should business-conformance evidence be consumed in promotion policy?

### G2-FINDING-DER-21 — Recovery Semantics Are Capability-qualified: Rollback, Traffic Reassignment, Revert and Redeploy Must Not Collapse
**Value:** supports provider replacement and honest failure semantics.  
**Risk:** a universal rollback verb implies reversibility that some providers or state changes cannot provide.  
**Priority:** P0.  
**Next question:** which recovery capability vocabulary is sufficient for provider negotiation?

### G2-FINDING-DER-22 — Deployment/Promotion Authority Must Remain Non-amplifying Through Station, Hierarchical SB and Work-surface Composition
**Value:** preserves `Enterprise -> Station -> Role -> Person` invariants through operational actions.  
**Risk:** a convenient surface/provider binding could become an undeclared deployment control plane.  
**Priority:** P0.  
**Next question:** what authority evidence must accompany deployment/promotion invocation and delegation?

## Candidate discoveries

- `G2-CAPABILITY-CANDIDATE-RUNTIME-AUTONOMY-CAPABILITY-DEPENDENCY-MATRIX` — CROSS_CUTTING — CANDIDATE; promote if Developer/Operator, Security and Provider research converge on reusable disconnect/handoff proof semantics.
- `G2-CAPABILITY-CANDIDATE-PARTIAL-ROLLOUT-TOPOLOGY-EVIDENCE` — CROSS_CUTTING — CANDIDATE; promote if Observability/Lifecycle research requires a reusable mixed-realization/region/traffic evidence primitive.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-DEPLOYMENT-ADMISSION-EVIDENCE` — CROSS_CUTTING — CANDIDATE; promote if Artifact, Secrets, Governance and Deployment synthesis converge on one typed admission evidence set.

## Saturation

Material architectural findings were produced. `consecutive_no_material_finding = 0`; Deployment / Environment / Runtime remains **NOT SATURATED**.
