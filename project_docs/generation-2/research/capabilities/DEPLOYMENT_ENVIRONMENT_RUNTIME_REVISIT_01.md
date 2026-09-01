# Generation 2 — Deployment / Environment / Runtime — Revisit 01

Status: REVISIT CYCLE 2 PASS 1 — MATERIAL NEW FINDINGS — NOT SATURATED

## Research question

Which additional universal primitives are required to distinguish release identity, deployment intent, deployment attempt, provider realization, activation/traffic state and observed runtime state while preserving runtime autonomy, provider replacement and evidence-backed recovery without making Deployment the authority for Build, Artifact, Secrets or application-level acceptance?

## Representatives

| Representative | Coverage | Revisit contribution |
|---|---|---|
| Kubernetes Deployments | DEEP | rollout revision/status, progress deadline, readiness/availability and higher-level recovery boundary |
| Argo CD | DEEP | desired/live drift, reconciliation freshness, self-heal authority and sync-attempt identity |
| HashiCorp Nomad | DEEP | deployment object, canary health, promotion authority, auto-revert and fail-forward/backward distinction |
| Google Cloud Run | DEEP | immutable runtime revisions separated from traffic activation and gradual promotion |
| Vercel Deployments | DEEP | immutable deployment realization, instant traffic rollback/promotion and skew-retention dependency |

## Evidence / source ledger

1. Kubernetes Deployments — https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
   - rollout progress, completion and availability are distinct status dimensions;
   - `ProgressDeadlineExceeded` is observation only: Kubernetes reports stalled progress but does not automatically roll back;
   - rollout revision history is provider-native recovery evidence, not semantic application acceptance.
2. Argo CD Automated Sync — https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
   - automatic reconciliation occurs only under explicit sync policy;
   - live drift does not trigger self-healing unless `selfHeal` is authorized;
   - one automated sync attempt is scoped to commit SHA + parameters, while reconciliation has its own polling/freshness interval;
   - rollback conflicts with enabled automated sync, showing recovery semantics depend on reconciliation policy.
3. Nomad update/deployment — https://developer.hashicorp.com/nomad/docs/job-specification/update and https://developer.hashicorp.com/nomad/api-docs/deployments
   - deployment is a first-class lifecycle object tied to job version;
   - healthy canaries do not themselves authorize promotion when `auto_promote=false`;
   - promotion requires explicit authority and unblocks the remaining rollout;
   - unhealthy canaries can be failed, failed-forward with a new job version, or failed-backward by revert.
4. Cloud Run rollouts/rollbacks/traffic migration — https://cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration
   - a new immutable revision can be deployed with 0% traffic;
   - traffic assignment changes independently from revision creation;
   - traffic migration is not instantaneous and in-flight requests may span old/new revisions during transition.
5. Vercel Deployments — https://vercel.com/academy/vercel-foundations/deployments
   - deployments are immutable and retained;
   - rollback reroutes traffic to a prior deployment without rebuilding;
   - later promotion changes serving state again;
   - skew protection depends on retaining older realizations for a configured compatibility window.

## Source of truth

No single deployment source is authoritative for all dimensions. The revisit strengthens a six-part model:

1. **Release authority** — immutable deployable subject owned by Artifact/Release.
2. **Deployment intent authority** — desired release-to-environment binding plus rollout/reconciliation policy.
3. **Deployment-attempt evidence** — one bounded execution/reconciliation attempt.
4. **Provider realization state** — provider-native runtime revision/resources actually created.
5. **Activation/traffic state** — which realization(s) are currently allowed to serve, potentially fractionally.
6. **Observed runtime/reconciliation evidence** — time-qualified health, progress, drift and serving observations.

Provider-native control planes are authoritative for their own observed resources; they are not the authority for the portable release, business acceptance or external secret values.

## Identity

Keep distinct identities:

- `releaseIdentityRef`;
- `environmentRef` plus environment-definition revision;
- `deploymentIntentId`;
- `deploymentAttemptId`;
- `providerRealizationId` / runtime revision;
- `activationDecisionId` and traffic-assignment revision;
- observation/reconciliation evidence identity with `observedAt`/freshness;
- provider resource IDs as physical locators only.

A Cloud Run revision at 0% traffic proves realization without activation. Nomad promotion proves that healthy realization and authority to continue rollout are separate. Kubernetes rollout status can move while the semantic deployment intent remains unchanged.

## Lifecycle

Candidate universal lifecycle:

`release eligible → environment preflight → deployment intent accepted → attempt started → provider realization created/reconciled → observed readiness/health → activation/promotion decision → serving transition → continuously observe/reconcile according to policy → supersede / fail-forward / fail-backward / retire`

Important separations:

- provider realization creation does not imply activation;
- readiness does not imply application/business acceptance;
- rollout completion does not prove absence of later drift;
- traffic rollback can reuse an existing realization instead of creating another build or runtime revision;
- recovery is a new authority-bearing decision with its own lineage, not deletion of failed history.

## Versioning

Independent revision axes include release revision, environment definition, deployment intent/policy, provider adapter, provider realization, activation/traffic assignment, configuration/binding revision and observed-state timestamp/revision. Provider-native rollout revision counters are insufficient as the semantic deployment version because some state changes (for example traffic reassignment or scaling) can occur independently.

## Failure semantics

Qualify failures by stage and boundary:

- intent/preflight rejected;
- binding resolution failure;
- attempt/provider API failure;
- realization/scheduling failure;
- readiness/health failure;
- stalled rollout/progress timeout;
- activation/promotion denied or failed;
- mixed-version traffic transition failure;
- drift detected after activation;
- reconciliation/self-heal failure;
- rollback/revert/roll-forward failure;
- runtime control-plane dependency unavailable;
- application/business acceptance failure despite infrastructure health.

A provider reporting successful rollout or healthy allocations proves provider-level conditions only. It cannot universally prove domain correctness.

## Extensibility

Provider-neutral contracts should expose capability-qualified extension points for rollout strategy, traffic splitting, health/readiness observation, reconciliation mode, autoscaling, placement, stateful dependencies and control-plane dependency. Provider-specific fields remain namespaced/versioned extensions and must declare portability impact.

## Provider boundaries

Deployment owns semantic deployment intent, attempt/realization/activation lineage, portable environment requirements, reconciliation policy intent and deployment evidence contracts. Provider adapters own physical resources, native revisions, region/account/project details, native health acquisition, rollout mechanisms and provider diagnostics. Build owns build realization; Artifact owns release/provenance; Secrets owns secret material and secret-lifecycle authority.

## Governance

Authority-bearing decisions include deploy, promote/activate, change traffic, enable self-heal/prune, rollback/revert, retire and emergency override. Argo CD demonstrates that drift detection and authority to mutate drift are separate policies. Nomad demonstrates that healthy canaries may still require explicit promotion capability.

## Observability

Deployment evidence must be observation-time qualified and include desired release/environment refs, attempt/realization refs, provider-native status, readiness/health, active traffic allocation, drift status, reconciliation policy/revision, last observation/reconciliation timestamps and promotion/recovery decisions. `healthy`, `synced`, `available` and `serving` are different claims and must not collapse into one boolean.

## Portability

Portability requires preserving semantic deployment intent while allowing a new provider realization, new attempt lineage and potentially different operational guarantees. A provider replacement must re-prove environment compatibility, required rollout/recovery capabilities, runtime autonomy/control-plane dependencies and health/activation behavior. Reusing the same immutable release is necessary but insufficient evidence of operational equivalence.

## Lock-in

Lock-in surfaces sharpened in this revisit:

- provider-native serving/traffic semantics;
- provider-only rollout history and drift state;
- hidden external control-plane dependencies required after handoff;
- retained-old-version requirements such as skew protection;
- provider-specific environment/config references;
- health semantics that cannot be translated into portable evidence;
- recovery actions available only through the original provider control plane.

## Product-specific mechanism vs universal primitive

| Product mechanism | Universal primitive |
|---|---|
| Kubernetes Deployment/ReplicaSet + conditions | provider realization + rollout/progress observation |
| Argo CD OutOfSync/selfHeal/sync history | drift observation + reconciliation policy + attempt evidence |
| Nomad deployment/canary/promote/revert | deployment attempt + health evidence + promotion/recovery decision |
| Cloud Run immutable revision + traffic split | provider realization + activation/traffic assignment |
| Vercel immutable deployment + rollback/promote + skew protection | provider realization + serving decision + compatibility-retention dependency |

## Convergent patterns

1. Deployment intent, provider realization and serving activation are distinct.
2. Provider health/readiness is narrower than business acceptance.
3. Drift detection is observation; remediation requires explicit authority/policy.
4. Rollback/revert is a new decision and may mean traffic reassignment, template/job revert or new execution.
5. Observed state has freshness and cannot be treated as timeless truth.
6. Runtime autonomy depends on knowing which external control-plane services remain required after generation/handoff.

## Divergent patterns / contradictions

- Kubernetes reports stalled rollout but delegates rollback action upward; Nomad can auto-revert; Cloud Run/Vercel rollback can be traffic reassignment. Recovery must remain capability-qualified.
- Argo CD continuously reconciles only when configured; apply-oriented systems may not. Reconciliation mode cannot be assumed universal.
- Cloud Run/Vercel hide much of the runtime control plane while Kubernetes/Nomad expose it. Runtime autonomy must therefore be stated as dependency evidence, not inferred from deployment form.
- Provider definitions of `healthy`, `available`, `synced` and `serving` differ materially.

## Subcapabilities

1. Deployment Intent & Attempt Identity
2. Environment Definition & Realized Environment State
3. Provider Realization Lineage
4. Runtime Revision & Activation Separation
5. Traffic / Serving Assignment
6. Health / Readiness / Progress Evidence
7. Business Acceptance Boundary
8. Drift Observation & Freshness
9. Reconciliation / Self-heal Authority
10. Promotion / Activation Governance
11. Rollback / Revert / Roll-forward Lineage
12. Runtime Autonomy & External Control-plane Dependency Inventory
13. Provider Replacement / Operational Equivalence Proof
14. Deployment Evidence & Audit

## System Builder fresh-main comparison

Evidence from fresh `main` only:

- `docs/adr/ADR-0007-release-environment-deployment.md` explicitly separates Release, Environment and Deployment, requires build-once/deploy-many, keeps secrets out of release artifacts/manifests and permits capability-declared environment contracts. This remains strong **KEEP** evidence.
- `packages/deploy/index.ts` defines `DeployPublishedRelease`, `DeployReleaseArtifact`, `DeploymentRecord` and `DeploymentActivationDecision` separately; validates artifact/environment compatibility and binding references; records release/environment lineage; and has explicit activation outcomes including `activated`, `retained-active`, `rejected-no-active` and `stale-active`. These remain **KEEP/HARDEN** foundations.
- `DeploymentRecord` currently represents one `deploymentId`, succeeded/failed status and health checks but the inspected contract does not itself prove distinct semantic `deploymentIntentId`, `deploymentAttemptId`, provider realization identity, traffic-assignment revision, drift/reconciliation observation or external control-plane dependency inventory.
- `dryRunDeploy` maps acceptance checks into deployment health and a succeeded/failed status. This revisit therefore requires later repository archaeology to decide whether business acceptance and provider health are separated elsewhere; absence in this file is not treated as product absence.

## Reconciliation hypotheses

- **KEEP** — ADR-0007 Release/Environment/Deployment separation.
- **KEEP** — release/environment lineage, external binding references and activation decision evidence.
- **HARDEN** — distinguish deployment intent, attempt and provider realization identities.
- **HARDEN** — make observed health/drift/reconciliation evidence revision/freshness scoped.
- **GENERALIZE** — activation/traffic assignment and recovery as portable intent with capability-qualified provider realization.
- **GENERALIZE** — runtime autonomy as explicit external-dependency inventory plus handoff proof.
- **PROVIDERIZE** — native rollout, traffic, scaling, control-plane APIs and physical resource identifiers.
- **INTEGRATE** — release provenance/trust evidence and build-environment realization evidence as deployment admission inputs without transferring their ownership.
- **DEFER** — advanced topology and multi-region strategies until product proofs demand them.
- **DO_NOT_BUILD** — a universal provider-resource DSL or universal `healthy=true` semantic that pretends provider health equals business correctness.

## Repository-validation questions

1. Is `DeploymentRecord.deploymentId` intended to identify semantic intent, one attempt, or both?
2. Does another main contract already model provider runtime realization/revision identity?
3. Are activation/traffic assignment revisions represented outside `DeploymentActivationDecision`?
4. Which runtime package records drift/reconciliation observations and their freshness?
5. Are health/readiness checks distinguished from higher-level product acceptance elsewhere?
6. Which generated runtime assets can continue operating when the System Builder control plane is unavailable?
7. Which external provider/control-plane dependencies remain mandatory after generated-system handoff?
8. Can a live deployment be rebound to another provider without changing release identity, and what new evidence is produced?
9. How are failed rollback/revert and fail-forward attempts preserved rather than overwritten?
10. Which config/secret binding revision is recoverable without retaining secret values?

## Symbiotic Proof

A future integrated proof should:

1. use one immutable verified release and one portable environment contract;
2. create a semantic deployment intent and a separately identified execution attempt;
3. realize the release on provider mode A and record provider realization identity;
4. observe provider readiness without yet claiming business acceptance;
5. create an explicit activation/traffic decision and record serving state;
6. induce drift, prove observation freshness and show that remediation occurs only under authorized reconciliation policy;
7. create a failed candidate and prove recovery as a new decision/lineage while preserving failed history;
8. rebind the same release/environment intent to materially different provider mode B, producing new realization lineage and re-proving required operational semantics;
9. disconnect or make unavailable the Builder control plane and prove the generated runtime either remains autonomous or explicitly reports its declared external control-plane dependency;
10. preserve release/build/provenance inputs by reference without making Deployment their authority.

## Stable findings

### G2-FINDING-DER-11 — Deployment Intent, Attempt and Provider Realization Are Distinct Identities
**Value:** prevents retries/reconciliation from rewriting semantic intent and permits provider replacement lineage.  
**Risk:** one `deploymentId` can collapse desired state, execution and physical realization.  
**Priority:** P0.  
**Next question:** where does fresh main already distinguish these identities beyond `DeploymentRecord`?

### G2-FINDING-DER-12 — Provider Readiness/Rollout Completion Is Not Business Acceptance
**Value:** prevents infrastructure-level health from becoming false product correctness evidence.  
**Risk:** green rollout/health status can mask semantic application failure.  
**Priority:** P0.  
**Next question:** which existing acceptance contracts are domain/product proof rather than deployment health?

### G2-FINDING-DER-13 — Runtime Realization and Serving Activation/Traffic Assignment Are Separate Authority Boundaries
**Value:** enables canary, zero-traffic validation, promotion and instant rollback without rebuilding.  
**Risk:** creation may implicitly activate a candidate or obscure mixed-version serving state.  
**Priority:** P0.  
**Next question:** can SB represent fractional/multi-revision serving without provider leakage?

### G2-FINDING-DER-14 — Drift/Reconciliation Evidence Must Be Observation-time and Policy Scoped
**Value:** makes `synced`/`drifted` claims meaningful and auditable.  
**Risk:** stale observations or implicit self-heal can masquerade as current state or unauthorized remediation.  
**Priority:** P0.  
**Next question:** what freshness/reconciliation revision can SB preserve portably?

### G2-FINDING-DER-15 — Rollback/Revert Is a New Recovery Decision and Lineage, Not Erasure
**Value:** preserves failed history and distinguishes traffic reassignment, provider revert and fail-forward.  
**Risk:** rollback can hide the failed attempt or imply a universal mechanism that does not exist.  
**Priority:** P0.  
**Next question:** which recovery strategy family belongs in provider negotiation versus lifecycle governance?

### G2-FINDING-DER-16 — Runtime Autonomy Requires Explicit External Control-plane Dependency Evidence
**Value:** converts autonomy from an assumption into a testable handoff property.  
**Risk:** an immutable artifact may still depend on Builder/provider control planes for serving, configuration, recovery or identity.  
**Priority:** P0.  
**Next question:** what minimum dependency inventory and disconnect test should define generated-runtime autonomy?

## Candidate discoveries

- `G2-CAPABILITY-CANDIDATE-DEPLOYMENT-ATTEMPT-REALIZATION-LINEAGE` — CROSS_CUTTING — candidate; promote only if lifecycle/provider/reconciliation synthesis confirms reusable intent-attempt-realization semantics.
- `G2-CAPABILITY-CANDIDATE-ACTIVATION-TRAFFIC-DECISION-EVIDENCE` — CROSS_CUTTING — candidate; promote only if release/lifecycle/governance synthesis needs a shared activation/promotion evidence primitive.
- `G2-CAPABILITY-CANDIDATE-RUNTIME-AUTONOMY-CONTROL-PLANE-DEPENDENCY-PROOF` — CORE — candidate; promote if Deployment, Developer/Operator and Provider research converge on a common generated-runtime handoff proof.

## Saturation assessment

Material findings were produced in this revisit. `consecutive_no_material_finding = 0`; Deployment / Environment / Runtime is **NOT SATURATED**. Principal representatives are deeply covered, but the saturation rule requires later revisits with no material architectural findings or repository-only residual questions.