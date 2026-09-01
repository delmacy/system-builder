# Generation 2 — Deployment / Environment / Runtime

Status: FIRST DEEP PASS — NOT SATURATED

## Research question

What universal primitives let System Builder bind an immutable release to a concrete environment, promote and reconcile it through provider-specific runtimes, observe health and failure, roll forward or back safely, and preserve generated-runtime autonomy without making Kubernetes, GitOps, IaC, Nomad, Cloud Run, Vercel, or any other deployment product the semantic authority?

## Representatives

| Representative | Coverage | Architectural contribution |
|---|---|---|
| Kubernetes Deployments | DEEP | desired/observed workload state, rollout revisions, availability/progress conditions and rollback scope |
| Argo CD | DEEP | declarative desired-state reconciliation, drift/out-of-sync, self-heal, retry and sync history |
| OpenTofu | DEEP | provider-qualified infrastructure bindings, plan/apply, durable observed state and backend/provider separation |
| HashiCorp Nomad | DEEP | deployment identity/status, health-gated rolling/canary strategies, promotion and auto-revert |
| Google Cloud Run | DEEP | immutable revisions, mutable service traffic assignment, gradual rollout and rollback without rebuilding |
| Vercel Deployments | PARTIAL | immutable deployments, promotion/traffic rollback and version-skew handling; revisit provider/runtime retention and environment binding semantics |

## Evidence / source ledger

1. Kubernetes — Deployments: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
   - a Deployment manages desired workload state and observes rollout status;
   - rollout revision is created when the Pod template changes; scaling alone does not create a revision;
   - rollback targets prior Deployment revisions and only rolls back the Pod-template portion represented by that revision.
2. Argo CD — Automated Sync Policy: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
   - sync occurs when desired and live state are out of sync;
   - self-heal is an explicit policy, not implicit in declarative configuration;
   - sync attempts have identity scoped by source revision + parameters and retry semantics are explicit;
   - rollback and automated reconciliation can conflict, so recovery semantics depend on reconciliation policy.
3. OpenTofu — Provider Requirements / Configuration / Backend Configuration:
   - https://opentofu.org/docs/v1.9/language/providers/requirements/
   - https://opentofu.org/docs/language/providers/configuration/
   - https://opentofu.org/docs/language/settings/backends/configuration/
   - provider source identity/version are separate from provider configuration;
   - configuration can remain credential-free by resolving values externally;
   - durable state/backend configuration is distinct from source configuration and can itself require migration.
4. Nomad — Rolling Updates / Deployment API:
   - https://developer.hashicorp.com/nomad/docs/job-declare/strategy/rolling
   - https://developer.hashicorp.com/nomad/docs/job-specification/update
   - https://developer.hashicorp.com/nomad/api-docs/deployments
   - deployment is a queryable lifecycle object tied to job version;
   - health thresholds gate progression; canary promotion and auto-revert are explicit policy;
   - desired, placed, healthy and unhealthy allocation counts are observed deployment evidence.
5. Google Cloud Run — rollouts/rollbacks/traffic migration:
   - https://cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration
   - revisions can exist at 0% traffic;
   - traffic allocation changes independently from revision creation, enabling gradual rollout and rollback without rebuilding.
6. Vercel — Deployments: https://vercel.com/academy/vercel-foundations/deployments
   - deployments are preserved as immutable deployment outputs;
   - rollback can reroute traffic to a previous deployment, and promotion changes which deployment serves production;
   - skew protection exposes compatibility concerns during mixed-version traffic windows.

## Source of truth

No single source is sufficient. Mature systems separate at least:

1. **Release authority** — immutable statement of what is deployable.
2. **Environment definition/contract** — provider-neutral requirements and named bindings required by that release/runtime.
3. **Deployment intent** — desired binding of release revision to environment plus rollout/reconciliation policy.
4. **Provider/runtime desired projection** — Kubernetes objects, Nomad jobs, Cloud Run service/revision configuration, IaC resources, etc.
5. **Observed deployment/runtime state** — provider-reported actual state, health, traffic, allocations, conditions and failures.
6. **Deployment evidence** — immutable history of attempts, decisions, promotions, rollback/revert and health outcomes.

A Git repository may be authoritative desired input in a GitOps implementation; it is not therefore the universal semantic authority of deployment. A provider control plane is authoritative about its observed state, not about the portable system definition.

## Identity

Universal identities should remain distinct:

- `releaseIdentityRef` — immutable deployable release/revision;
- `environmentRef` — logical environment identity independent of provider location/account;
- `deploymentIntentId` — desired release-to-environment binding plus policy version;
- `deploymentAttemptId` — one reconciliation/apply/rollout attempt;
- `runtimeRevisionId` — provider/runtime revision produced by the attempt;
- `activation/promotion decision id` — decision that changes serving/active state;
- provider resource IDs/URLs — physical locators, never logical deployment identity.

Cloud Run most clearly demonstrates why runtime revision identity and traffic activation are separate: a new immutable revision may receive zero traffic. Nomad similarly separates a job version from a deployment object and from allocation instances.

## Lifecycle

Canonical lifecycle candidate:

`release eligible → environment compatibility/preflight → resolve provider bindings → create deployment intent → project provider desired state → reconcile/apply → observe health/readiness → activate/promote → continuously observe/reconcile → supersede / rollback / roll-forward / retire`

Important lifecycle distinctions:

- creation of a runtime revision does not imply activation;
- successful apply does not imply application health;
- health does not necessarily imply full traffic promotion;
- rollback of traffic, rollback of runtime template and rollback of data/state are different operations;
- deployment retirement must not erase historical evidence.

## Versioning

At least these dimensions are independent:

- release version/revision;
- environment-definition revision;
- deployment-intent/policy revision;
- provider/plugin version;
- runtime/orchestrator version;
- provider-native runtime revision;
- configuration/binding revision;
- observed-state/evidence revision or timestamp.

Kubernetes demonstrates that deployment revision does not change for all operational mutations (for example scaling), so provider-native revision counters cannot be treated as complete semantic deployment versions.

## Failure semantics

Failure is multidimensional and must be qualified:

- preflight incompatibility or unresolved binding;
- provider authentication/configuration failure;
- plan/reconciliation failure;
- resource scheduling/capacity failure;
- runtime start/crash failure;
- readiness/health failure;
- rollout progress timeout;
- partial rollout or mixed-version window;
- promotion/traffic-routing failure;
- drift detected while serving;
- rollback/revert failure;
- destructive/stateful incompatibility that makes rollback unsafe.

`rollback` cannot be a universal boolean capability. Providers differ on what can be reverted and whether prior state remains recoverable. Data/schema/state changes may make code/runtime rollback semantically unsafe even when the orchestrator can restore an old template.

## Extensibility

Portable deployment semantics should expose typed extension points rather than flatten provider-specific features:

- rollout strategy capabilities;
- traffic-splitting capability;
- health/readiness probe capability;
- autoscaling/resource requirements;
- network/ingress requirements;
- stateful volume/storage attachment requirements;
- multi-region/placement requirements;
- provider-specific extension envelope with namespace/version and explicit non-portability.

Do not model every Kubernetes/Nomad/CloudRun/Vercel field in the universal IR.

## Provider boundaries

Provider-neutral plane owns:

- release/environment/deployment identities and lineage;
- required runtime/environment capabilities;
- binding references, never secret values;
- rollout/recovery intent where portable;
- activation/promotion decisions and evidence contract;
- portability and autonomy obligations.

Provider adapter owns:

- translation to physical runtime resources;
- provider-native revision/resource identity;
- credentials/endpoints/regions/accounts;
- provider health/state acquisition;
- implementation of rollout, traffic, scaling and recovery features;
- provider-specific diagnostics.

Provider capability negotiation must occur before mutation when required behavior is not universally available.

## Governance

Governed decisions include:

- who may deploy/promote/rollback/retire;
- which release can target which environment;
- acceptable provider/runtime versions;
- minimum health/readiness evidence;
- manual versus automatic promotion/self-heal;
- acceptable drift and remediation policy;
- destructive changes and stateful rollback constraints;
- emergency override/break-glass with audit evidence.

Automated reconciliation is authority-bearing behavior and therefore must be explicit policy. Argo CD's separate self-heal flag is direct evidence that declarative desired state does not itself authorize automatic mutation of drift.

## Observability

Deployment/runtime evidence should include, without provider leakage into semantic identity:

- desired release/environment refs;
- attempt and provider projection refs;
- start/completion/progress timestamps;
- rollout phase and traffic/replica/allocation progression;
- readiness and health observations;
- drift status and last reconciliation;
- promotion/rollback decisions and actor/policy revision;
- provider diagnostics in an extension/evidence envelope;
- current active/serving revision(s).

Observed state is evidence, not portable desired authority.

## Portability

Portability has levels:

1. **definition portability** — deployment intent/capability requirements are provider-neutral;
2. **binding portability** — environment can be rebound to a replacement provider;
3. **artifact portability** — same release can be consumed by another supported provider;
4. **operational-semantics portability** — required rollout/health/recovery guarantees can be reproduced;
5. **state portability** — durable application state can move or remain externally owned;
6. **evidence portability** — deployment history and provenance remain inspectable after provider replacement.

A container image alone does not prove operational portability. Kubernetes manifests, Terraform/OpenTofu state, provider-native traffic rules or serverless revision models can still create provider coupling.

## Lock-in

Primary lock-in surfaces:

- provider-specific resource schema and extensions;
- control-plane-owned runtime state/history;
- proprietary traffic, scaling or edge semantics;
- identity tied to account/project/region URLs;
- provider-specific secret/config references;
- managed stateful services coupled to runtime;
- non-exportable deployment evidence;
- recovery guarantees that cannot be reproduced elsewhere.

The architectural response is not to erase differences. It is to make non-portable requirements explicit and negotiable.

## Product-specific mechanism vs universal primitive

| Product mechanism | Universal primitive |
|---|---|
| Kubernetes Deployment/ReplicaSet revision | runtime desired projection + provider revision |
| Argo CD Application sync/self-heal | reconciliation policy + drift remediation |
| OpenTofu provider/backend/state | provider binding + observed infrastructure state + reconciliation evidence |
| Nomad job/deployment/allocation | workload intent + deployment attempt + runtime instance evidence |
| Cloud Run revision + traffic split | runtime revision + activation/traffic policy |
| Vercel immutable deployment + Promote/Rollback | deployment revision + serving activation decision |

## Convergent patterns

1. Immutable release/runtime revision and mutable serving state are distinct.
2. Desired and observed state are distinct and joined by reconciliation.
3. Health/readiness gates progression but is not equivalent to successful provisioning.
4. Promotion is a separate authority-bearing decision from producing a deployment revision.
5. Provider/runtime state has independent lifecycle and evidence.
6. Recovery semantics depend on what changed, not merely on availability of an older artifact.
7. Provider configuration/credentials belong outside portable release semantics.
8. Deployment history is operational/provenance evidence, not the release itself.

## Divergent patterns / contradictions

- GitOps makes source control desired-state authority for a provider implementation; OpenTofu also relies on durable state to track real infrastructure. Universal architecture therefore needs both desired intent and observed/provider state rather than choosing one globally.
- Kubernetes rollback is template-history based; Cloud Run/Vercel rollback can be traffic reassignment; Nomad auto-revert resubmits the last stable job. `rollback` must remain a strategy/capability family.
- Some systems continuously reconcile drift; others are apply-oriented. Continuous reconciliation must be negotiated/policy-driven rather than assumed.
- Managed platforms can hide infrastructure topology; self-hosted orchestrators expose more placement/runtime controls. Portability therefore cannot require a single physical topology model.

## Subcapabilities

1. Deployment Identity & Release/Environment Lineage
2. Environment Contract & Compatibility
3. Provider Runtime Binding
4. Deployment Preflight / Plan
5. Desired-to-Observed Reconciliation
6. Runtime Revision Management
7. Health / Readiness / Progress Evidence
8. Promotion / Traffic Activation
9. Drift Detection & Remediation
10. Rollout / Canary / Blue-Green Strategy
11. Rollback / Revert / Roll-forward Recovery
12. Stateful Deployment Constraints
13. Multi-environment / Multi-region Placement
14. Deployment Governance & Authorization
15. Deployment Evidence / Audit
16. Runtime Handoff & Autonomy

## System Builder fresh-main comparison

Evidence inspected from `main` only:

### Accepted architecture

`docs/adr/ADR-0007-release-environment-deployment.md` states:

- Release describes what the system is;
- Environment provides infrastructure/runtime configuration and secrets;
- Deployment binds a specific release to a specific environment;
- `Release + Environment = Deployment`;
- build once/deploy many;
- secrets do not belong in release artifacts/manifests;
- capabilities may declare environment contracts;
- missing required environment values are blocked without leaking secret values.

This aligns strongly with the representative convergence and is **KEEP**.

### Implemented deployment boundary

`packages/deploy/index.ts` currently provides evidence of:

- `DeployPublishedRelease`, `DeployReleaseArtifact`, `DeploymentRecord` and `DeploymentActivationDecision` as separate types;
- deterministic `deploymentId` derived from release/environment/timestamps/checks/bindings;
- explicit `publishedReleaseRef`, `environmentRef`, `releaseHash`, health checks and succeeded/failed status;
- environment runtime compatibility and required binding validation;
- explicit rejection of embedded secret values;
- release-to-deployment lineage admission;
- active deployment tracking per environment;
- candidate activation outcomes including activated, retained-active, rejected-no-active and stale-active;
- atomic activation support where storage provides it.

These are material **KEEP/HARDEN** foundations.

### Not proven by this pass

This pass did **not** prove a canonical provider-neutral contract for:

- continuous desired/observed reconciliation;
- provider runtime revision identity;
- traffic-split/canary promotion;
- drift remediation policy;
- a generalized rollout/recovery capability negotiation model;
- stateful rollback safety;
- multi-provider replacement of a live deployment;
- exported autonomous runtime handoff semantics beyond existing local/runtime proof paths.

Absence of proof is recorded as repository-validation work, not as evidence that the feature is absent.

## Reconciliation hypotheses

- **KEEP** — ADR-0007 separation of Release, Environment and Deployment.
- **KEEP** — provider-neutral environment binding references and secret-value exclusion.
- **KEEP** — explicit deployment records, release-to-deployment lineage and activation decisions.
- **HARDEN** — distinguish semantic deployment intent, execution attempt and provider runtime revision where repository archaeology confirms need.
- **HARDEN** — qualify health/readiness/progress and recovery evidence rather than a single success flag.
- **GENERALIZE** — model rollout/promotion/reconciliation requirements as capabilities/policies, not one provider's fields.
- **PROVIDERIZE** — physical resource projection, provider control-plane state, region/account/endpoints and native rollout mechanisms.
- **INTEGRATE** — release verification/provenance, environment compatibility, provider negotiation and deployment evidence during later planning.
- **DEFER** — provider-specific advanced topology until universal requirements and product proofs demand it.
- **DO_NOT_BUILD** — a universal Kubernetes/Terraform-like resource language that copies provider schemas into SystemDefinition.

## Repository-validation questions

1. Is there already a durable distinction between deployment intent and deployment attempt beyond `DeploymentRecord`?
2. Which storage contracts preserve active deployment identity and atomic stale-write handling across process restarts?
3. Is rollback currently traffic/activation reassignment, new deployment creation, or provider-native mutation?
4. Do runtime handoff artifacts preserve all bindings needed after the Builder disappears?
5. Which health checks are release acceptance evidence versus ongoing runtime health?
6. Is drift represented anywhere beyond deployment state and runtime reconciliation packages?
7. What provider abstraction exists for local-process deploy versus future external runtimes?
8. Which generated runtime assets are sufficient to recreate deployment outside the SB control plane?
9. Are configuration/binding revisions captured strongly enough to reproduce a deployment decision without preserving secret values?
10. What stateful migration/recovery boundaries already exist between Deploy and Data/Storage capabilities?

## Symbiotic Proof

A future integrated proof should demonstrate the same portable release and environment contract through at least two materially different deployment providers or provider modes:

1. create one immutable release with provider-neutral environment requirements;
2. preflight against environment A and resolve external binding references without embedding secret values;
3. deploy and record an immutable deployment attempt plus provider runtime revision evidence;
4. observe health/readiness before activation;
5. promote/activate the candidate and preserve the prior deployment as historical evidence;
6. introduce a failed candidate and prove prior active deployment is retained or recovery occurs according to explicit policy;
7. induce or simulate drift and prove detection is separate from authorization to self-heal;
8. rebind the same release to environment/provider B without changing portable business semantics;
9. prove the generated runtime can continue operating and expose required evidence without dependence on the SB authoring control plane;
10. verify all release→environment→deployment→runtime lineage remains inspectable after provider replacement.

## Stable findings

- **G2-FINDING-DEPLOY-01 — Release Identity, Deployment Intent, Deployment Attempt and Runtime Revision Are Distinct Identities.** Value: prevents provider/resource identity from contaminating portable semantics. Risk if ignored: non-reproducible deploy history and provider lock-in. Priority: foundational.
- **G2-FINDING-DEPLOY-02 — Environment Is a Logical Contract and Binding Context, Not a Provider Account or Location.** Value: enables build-once/deploy-many and replacement. Risk: environment identity becomes cloud-specific. Priority: foundational.
- **G2-FINDING-DEPLOY-03 — Desired Deployment State and Observed Runtime State Require Explicit Reconciliation.** Value: makes drift and convergence governable. Risk: silent divergence between declared and serving system. Priority: high.
- **G2-FINDING-DEPLOY-04 — Runtime Revision Creation and Serving Activation Are Separate Lifecycle Transitions.** Value: supports canary/zero-traffic/preflight promotion. Risk: unsafe assumption that created equals live. Priority: high.
- **G2-FINDING-DEPLOY-05 — Health, Readiness and Rollout Progress Are Qualified Evidence, Not a Single Success Boolean.** Value: portable acceptance and diagnosis. Risk: false positive activation. Priority: high.
- **G2-FINDING-DEPLOY-06 — Automatic Reconciliation and Self-Healing Are Authority-Bearing Policies.** Value: preserves governance over automatic mutation. Risk: control plane repairs state without explicit authorization. Priority: high.
- **G2-FINDING-DEPLOY-07 — Rollback Is a Family of Recovery Semantics, Not a Universal Provider Operation.** Value: avoids unsafe reversal assumptions. Risk: code rollback against incompatible data/state. Priority: high.
- **G2-FINDING-DEPLOY-08 — Provider Runtime Projection Must Be Replaceable Without Rewriting Portable Release Semantics.** Value: anti-lock-in and provider choice. Risk: generated system defined by orchestration vendor. Priority: foundational.
- **G2-FINDING-DEPLOY-09 — Deployment Evidence Must Preserve Promotion, Drift and Recovery Decisions Independently of Provider History.** Value: auditability after provider migration. Risk: evidence disappears with control-plane retention. Priority: high.
- **G2-FINDING-DEPLOY-10 — Generated Runtime Autonomy Includes Reconstructable Bindings and Operations Beyond Builder Availability.** Value: makes anti-lock-in operational rather than artifact-only. Risk: runtime is autonomous only until redeploy/recovery. Priority: foundational.

## Candidate capability discoveries

- `G2-CAPABILITY-CANDIDATE-DEPLOYMENT-RECONCILIATION-EVIDENCE` — **CROSS_CUTTING**. Multi-representative evidence from Kubernetes, Argo CD, OpenTofu and Nomad. Candidate until Observability/Governance/Reconciliation passes determine whether it is a subcapability of deployment/reconciliation or a promoted cross-cutting capability.
- `G2-CAPABILITY-CANDIDATE-RUNTIME-ACTIVATION-PROMOTION` — **CROSS_CUTTING**. Cloud Run, Nomad, Vercel and current SB activation decision all show revision creation distinct from serving promotion. Candidate until Lifecycle/Provider Negotiation confirm ownership.
- `G2-CAPABILITY-CANDIDATE-DEPLOYMENT-RECOVERY-CONTRACT` — **CROSS_CUTTING**. Kubernetes/Nomad/Cloud Run expose incompatible rollback primitives, requiring a qualified recovery contract rather than a boolean. Candidate pending Security/Failure Recovery and Lifecycle research.

Existing `G2-CAPABILITY-CANDIDATE-RELEASE-COMPOSITION-PROMOTION`, `G2-CAPABILITY-CANDIDATE-RECONCILIATION-CONTROL`, `G2-CAPABILITY-CANDIDATE-BINDING-PROVENANCE` and recovery-related candidates gain supporting evidence; no candidate is promoted in this pass.

## Value / risk / priority

**Value:** Deployment is the boundary where portable definitions, artifacts, environment/provider bindings and real runtime state meet. Getting its identities and evidence right is central to provider replacement and autonomous generated systems.

**Primary risk:** copying one orchestrator's resource model into the canonical IR would turn a provider implementation into product semantics. The opposite error—over-generalizing until rollout/recovery guarantees disappear—would create false portability.

**Priority:** foundational/high. Preserve the already-strong Release/Environment/Deployment split, then harden identity, observed-state, promotion and recovery contracts only after systematic repository archaeology.

## Next question

How should Generation 2 represent **Observability / Operations / Incident** so telemetry identity, signal/evidence lineage, service/runtime health, SLOs, alerts, incidents, operator actions and provider backends remain separable from deployment authority while preserving autonomous operation and cross-provider evidence?
