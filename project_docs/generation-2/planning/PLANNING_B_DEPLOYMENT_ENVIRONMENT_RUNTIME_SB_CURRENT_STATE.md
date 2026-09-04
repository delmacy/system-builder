# Planning B — Deployment / Environment / Runtime — SB Current State Reconciliation

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Canonical capability: Deployment / Environment / Runtime
Fresh-main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`

This artifact is repository archaeology only. It records current System Builder truth against the Planning A semantic boundary. It does not design Generation 2 target architecture, execute product code, create Work Packages/TASKs, enter Construction, open a PR, or touch worker handoff state.

## 1. Current-state verdict

Fresh main contains a materially implemented single-host deployment/runtime baseline rather than only planning intent. The strongest current primitives are canonical deployment records derived from release/environment/health evidence, explicit environment profiles, deterministic compatibility/binding preflight, verified artifact and migration admission, local process runtime realization, health validation, durable deployment state, atomic active-runtime promotion with stale-active protection, manager restart reconciliation, and tests that run generated runtimes while Builder/Observe control-plane URLs are deliberately unavailable.

This is a strong KEEP foundation for deployment identity, bounded environment realization, active-runtime authority and runtime autonomy. It is not evidence of a complete Generation 2 deployment owner: desired deployment generations, generalized Operational Profiles, replica/placement/traffic/scaling models, distributed rollout/cutover, provider acknowledgement versus effective convergence, remote mutation effect disposition, residual-workload drainage and qualified runtime/provider substitution are not implemented by the evidence inspected here.

## 2. Evidence from fresh main

### 2.1 Canonical deployment and environment identity

`packages/deploy/index.ts` defines `DeploymentRecord` with SB-owned `deploymentId`, `publishedReleaseRef`, `environmentRef`, `releaseHash`, bounded timestamps, status and health checks. `dryRunDeploy(...)` computes `deploymentId` deterministically with `sha256Canonical(...)` over the release reference, environment reference, release hash, time window, normalized health checks and environment bindings.

`packages/contracts/environment-profile/index.ts` defines `EnvironmentProfile` as an SB-owned `environmentRef`, supported runtime versions and symbolic bindings. Bindings currently distinguish `config` and `secret-reference`; requirement kinds also name `external-service`, `storage` and `database`. No provider deployment ID is used as canonical deployment/environment identity.

Current evidence therefore supports KEEP of provider-neutral logical deployment/environment identity. The current environment model remains intentionally narrow and is not a full Operational Profile or placement topology.

### 2.2 Release-to-deployment admission

Deploy explicitly consumes a `PublishedRelease` and a matching `ReleaseArtifact`. It rejects artifact hash/ref mismatch and runtime-version incompatibility before activation. Required environment bindings must be present, and embedded secret values are rejected in favor of symbolic secret references.

`DeploymentRegistry.admitReleaseLineage(...)` requires a normalized `release-to-deployment` lineage hop whose release predecessor and deployment successor match the concrete records. This preserves the distinction `released artifact != deployment identity` rather than deriving runtime truth directly from compiler/build completion.

### 2.3 Runtime realization and autonomy

`packages/deploy/local-process.ts` retrieves a verified artifact payload, rejects invalid generated paths, verifies migration preflight, resolves secret references, applies verified migrations, writes generated files into an isolated working directory and starts the generated `runtime-entry.mjs` as a child Node process.

Startup and health responses are parsed and validated against runtime/environment semantics. Failure diagnostics distinguish artifact mismatch, invalid payload, runtime incompatibility, invalid generated path, migration preflight/application failure, secret resolution failure, runtime process/startup/health/state failure and timeout.

Product tests explicitly assert that generated runtime code does not depend on `SYSTEM_BUILDER_URL`. The durable runtime/reconciliation tests additionally run with Builder/Observe URLs pointed at an unavailable local endpoint, yet the runtime remains operable. This is direct evidence for the SB's retained-runtime-autonomy principle in the current bounded runtime path.

### 2.4 Active runtime authority and stale-writer protection

`DeploymentRecordStorage.activateAtomically(...)` carries `expectedActiveDeploymentId` and returns one of `activated`, `retained-active`, `rejected-no-active` or `stale-active`. A successful candidate only becomes active when the current active deployment still matches the expected predecessor; otherwise the candidate record can be preserved while active authority remains unchanged.

Failed candidates do not displace a working active deployment. This is strong bounded current evidence for compare-and-swap-style active-runtime authority and failure retention rather than blind last-writer-wins promotion.

### 2.5 Durable manager restart reconciliation

`tests/product/p9-runtime-reconciliation-e2e.test.ts` proves a durable chain in which release A is promoted, B supersedes A, a stale promotion of C is rejected with `stale-active`, and a failed D candidate yields `retained-active`. The authoritative active deployment remains B.

The test then stops the old manager, closes durable deployment/release/artifact stores, reconstructs them, confirms B is still the canonical active deployment, and uses `SingleHostRuntimeReconciler` to recreate the missing runtime process for B without changing the authoritative deployment identity. The reconciled runtime reports healthy while control-plane URLs remain unavailable.

This is important current evidence that canonical active-deployment truth and ephemeral runtime-process existence are distinct concepts. It also proves a bounded reconcile-after-manager-restart path.

## 3. Planning A validation questions — current answers

1. **Canonical deployment/environment identity distinct from release, process ID and provider IDs?** YES for `deploymentId`/`environmentRef`; generic external-provider realization IDs are not modeled.
2. **Build result, release, deployment and runtime-effective state distinct?** YES/PARTIAL. Release-to-deployment identity and active runtime are separate, but a generalized desired/observed/effective workload model is absent.
3. **Desired deployment generation revisioned independently from observed runtime state?** NO first-class desired-generation model evidenced.
4. **Environment/Operational Profile captures portable requirements instead of provider-native topology?** PARTIAL. `EnvironmentProfile` is provider-neutral and symbolic, but currently narrow.
5. **Placement, replicas, routes, traffic, scaling and readiness represented canonically?** NO generalized model evidenced; current realization is single-host/local-process.
6. **Activation protects against stale concurrent promoters?** YES. Atomic activation has explicit `stale-active` semantics.
7. **Failed candidate can retain prior active runtime?** YES. `retained-active` is explicit and tested.
8. **Manager restart can reconcile canonical active truth to a missing runtime process?** YES for the single-host path.
9. **Runtime can operate without Builder/Observe control plane?** YES for the generated runtime paths covered by product tests.
10. **Provider acknowledgement separated from effective runtime convergence?** NO generic external deployment-provider path is evidenced.
11. **Ambiguous remote actuation has APPLIED/PARTIAL/UNKNOWN and reconcile-before-retry?** NO generic remote effect model evidenced.
12. **Rollback actuation is distinct from current release rollback eligibility?** PARTIAL/NO. Active predecessor retention exists; generalized rollback actuation/eligibility semantics are not first-class.
13. **Residual replicas/routes/sessions/caches/workers are drained during replacement?** NO generalized residual-cohort drainage evidenced.
14. **Enterprise -> Station -> Role -> Person and AI/AGWS non-amplification govern deployment authority?** NO deployment-specific hierarchical authority implementation evidenced.

## 4. Maturity assessment

### Implemented / strong bounded baseline

- deterministic SB-owned deployment identity;
- provider-neutral `environmentRef` and symbolic environment bindings;
- release/artifact/runtime compatibility checks;
- required-binding and secret-reference enforcement;
- verified artifact payload admission;
- verified migration preflight/application before runtime start;
- local generated-process runtime realization;
- startup/health validation and bounded failure diagnostics;
- durable deployment records and active-deployment authority;
- atomic active promotion with expected-predecessor / stale-active semantics;
- retention of prior active deployment on failed candidate;
- durable reconstruction and single-host runtime reconciliation after manager restart;
- generated-runtime autonomy from Builder/Observe control-plane URLs in covered product proofs.

### Partial

- environment semantics are portable but narrow;
- active deployment is distinct from runtime process, but desired/observed/effective state is not generalized;
- restart reconciliation exists for single-host local runtime, not arbitrary providers/topologies;
- health checks exist, but readiness/convergence evidence is not generalized or applicability-qualified;
- active predecessor retention provides a rollback-like safety property, but explicit rollback plan/actuation/current eligibility is absent.

### Not evidenced as current implementation

- canonical desired deployment generation/revision;
- generalized Operational Profile;
- placement/site/zone/host constraints;
- replica sets, scaling policy and workload topology;
- route/traffic split/canary/blue-green semantics;
- rollout/cutover state machine;
- distributed convergence evidence and currentness;
- provider acknowledgement vs consumer-effective runtime distinction;
- generic remote effect disposition `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`;
- reconcile-before-retry for ambiguous remote deployment mutations;
- generalized disconnected/degraded operation contracts beyond control-plane autonomy;
- qualified deployment/runtime provider support vectors and substitution;
- residual replica/route/session/cache/worker drainage;
- deployment-domain Enterprise -> Station -> Role -> Person authority;
- deployment-specific AI/AGWS authority non-amplification.

## 5. Portability and providerability

The current canonical identities are promisingly provider-neutral: `deploymentId` is derived from SB semantic inputs and `environmentRef` is an SB-owned reference. `EnvironmentProfile` contains symbolic bindings instead of embedded provider credentials or provider deployment IDs.

The local process adapter is a concrete realization, not the canonical deployment model. Its existence supports future providerization without replacing the semantic deployment record, but Planning B does not infer a generic deployment-provider contract that is not present.

Disposition: KEEP current logical identity/environment contracts and single-host realization; GENERALIZE the semantic model only in later authorized architecture; PROVIDERIZE external realization mechanics only when support/effect/currentness semantics are explicitly defined.

## 6. Failure, ambiguity and recovery semantics

Current local failure semantics are comparatively strong and fail-closed: artifact mismatch, incompatible runtime, missing binding, forbidden secret value, invalid payload/path, migration failure, secret resolution failure, startup/health/state failure and timeout are explicit outcomes.

Atomic promotion also distinguishes stale concurrent authority from failed candidates. The runtime reconciliation proof demonstrates recovery from manager-process loss by reconstructing canonical state and recreating the missing runtime process.

However, no generic remote deployment actuation path was found. Therefore Planning B must not claim `UNKNOWN -> reconcile-before-retry` as currently implemented for external providers. Likewise, stale or partial observations cannot safely be promoted to runtime-effective PASS merely because a deployment record exists.

## 7. Boundary preservation

- **Artifact / Release / SBOM / Provenance** owns released artifact identity/publication/provenance. Deployment consumes an admitted release; it does not redefine release truth.
- **Build / Dependency Graph / Reproducibility** owns build closure/reproducibility. A deployable artifact does not prove generalized reproducible-build truth.
- **Secrets / Configuration / Environment Portability** owns secret/config semantics and effective configuration qualification. Deploy consumes symbolic environment bindings.
- **Provider / Binding / Capability Negotiation** owns generic provider support/admission/binding; Deployment owns deployment-domain requirements and effective workload semantics.
- **Lifecycle / Versioning / Evolution / Migration** owns generic coexistence/revision/migration primitives; Deployment owns deployment-domain application.
- **Security / Resilience / Failure Recovery** owns cross-cutting recovery/security qualification. Restart reconciliation is deployment evidence, not the entire DR owner.
- **Observability / Operations / Incident** owns operational evidence/incident semantics. Deployment health is an input, not universal observability truth.
- **UCA** supplies cross-cutting identity/revision/evidence/effect/support primitives without becoming deployment's semantic owner.
- **AGWS/AI** remain non-amplifying; current repository evidence grants neither deployment-admin nor provider-admin authority to user surfaces or AI.

## 8. Evidenced dispositions

### KEEP

- SB-owned deterministic deployment identity;
- provider-neutral environment references and symbolic bindings;
- release/artifact/runtime compatibility admission;
- secret-reference-only deployment inputs;
- verified artifact/migration admission;
- local generated-process runtime adapter;
- explicit health/startup validation;
- durable deployment registry and active-deployment pointer;
- atomic active promotion and `stale-active` protection;
- retained-active behavior on failed candidates;
- manager-restart runtime reconciliation;
- control-plane-independent generated runtime behavior in tested paths.

### HARDEN

- preserve distinction between canonical active deployment and ephemeral runtime process;
- preserve fail-closed treatment of stale/partial evidence;
- preserve compare-and-swap active authority under future realization expansion;
- avoid interpreting process start/provider acknowledgement as runtime-effective convergence.

### GENERALIZE

- environment semantics toward workload/Operational Profile requirements;
- active-runtime reconciliation toward explicit desired/observed/effective deployment semantics;
- health/currentness evidence toward applicability-qualified deployment convergence.

### PROVIDERIZE

- the current local-process runtime is already a bounded realization adapter;
- future external deployment/runtime realizations may be providerized only behind qualified semantic contracts. No generic external provider is inferred here.

### INTEGRATE

- later integrate Deployment with Release admission, Config/Secrets effective state, Provider support qualification, Lifecycle migration/coexistence, Security recovery and Observability evidence while preserving ownership boundaries.

### REPLACE

No evidence supports replacing the existing deployment registry, environment-reference, local runtime or atomic active-promotion foundations.

### DEFER

- generalized desired deployment generation;
- Operational Profile expansion;
- replicas/placement/traffic/scaling topology;
- rollout/cutover model;
- remote deployment-effect ambiguity/reconciliation;
- current rollback eligibility/actuation model;
- provider substitution qualification;
- residual-workload drainage;
- hierarchical deployment authority.

These require later authorized target-architecture decisions.

### DO_NOT_BUILD

- do not canonize provider deployment IDs, process IDs or platform-native route/replica IDs as portable deployment identity;
- do not equate provider/process acknowledgement with runtime-effective state;
- do not make the generated runtime depend on Builder availability merely to centralize control.

## 9. Reconciliation conclusion

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Fresh main contains a substantial bounded Deployment/Environment/Runtime implementation with provider-neutral deployment/environment identity, verified release admission, local generated runtime realization, durable active-deployment authority, stale-writer protection, failure retention, manager-restart reconciliation and strong runtime-autonomy evidence.

The principal unevidenced areas are generalized desired/observed/effective workload semantics, portable Operational Profiles beyond current bindings/runtime compatibility, topology/traffic/scaling, distributed rollout/convergence, remote ambiguity reconciliation, rollback qualification, provider substitution and residual-workload drainage. The evidenced path is predominantly **KEEP + HARDEN + GENERALIZE + INTEGRATE**, with bounded realization providerization and no evidence for replacement.