# Generation 2 — Planning C — C3.20 Deployment / Environment / Runtime Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Deployment / Environment / Runtime**
Decision: `C3.20`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction or remediation is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by `RESEARCH_PIPELINE_STATE.json`, the Planning C entry framework, C0 Universal Capability Architecture / Semantic Substrate, C1 Elicitation & System Understanding, C2 Physical / Peripheral Integration Boundary, Planning A/B for Deployment / Environment / Runtime, C3.13 Data / Schema / Migrations, C3.16 Observability / Operations / Incident, C3.17 Secrets / Configuration / Environment Portability, C3.18 Build / Dependency Graph / Reproducibility, C3.19 Artifact / Release / SBOM / Provenance, and the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

Constitutional distinctions remain mandatory:

- `build output != canonical artifact != release != deployment != effective runtime`;
- `release published/admitted != deployed != ready != serving/effective`;
- `desired state != provider-accepted state != observed state != effective state`;
- `provider acknowledgement != runtime convergence`;
- `process/container running != ready != reachable != consumer-effective`;
- `health signal != readiness decision != deployment authority`;
- `replica count != capacity != headroom != stability`;
- `average utilization != bounded queue age or sustainable peak load`;
- `rollback artifact available != rollback currently eligible != rollback converged`;
- `Fleet aggregate != Station/local runtime truth`;
- `AI deployment proposal != deployment authority`;
- `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`.

## 2. Current-state anchor and disposition

Generation 1 already contains a strong bounded deployment baseline: SB-owned deterministic `deploymentId`, provider-neutral `environmentRef`, release/artifact/runtime compatibility checks, symbolic environment bindings and secret references, verified artifact and migration preflight, local generated-process realization, startup/health checks, durable deployment state, compare-and-swap-style active promotion with `stale-active`, retention of the prior active deployment after failed candidates, manager-restart reconciliation and generated-runtime autonomy from Builder/Observe URLs in covered tests.

C3.20 therefore adopts **KEEP + HARDEN + GENERALIZE + INTEGRATE + PROVIDERIZE REALIZATION MECHANICS**. It does not replace the durable deployment registry, active-runtime authority or local runtime adapter. It generalizes those foundations into a provider-neutral deployment plane while preserving the working single-host path as one realization.

## 3. Target decision

**DECISION C3.20-D1 — establish a provider-neutral, revision-qualified Deployment & Runtime Realization Plane that owns deployment intent, environment/target identity, rollout/cohort transitions, desired-observed-effective runtime convergence, placement/scaling/traffic intent, deployment rollback/roll-forward actuation, retained local runtime closure and provider substitution, while build, release, configuration, schema, trust, security, observability and provider qualification remain separate semantic owners.**

The capability owns eight linked truth planes:

1. **Deployment Intent Plane** — canonical deployment identity, deployment revision and desired generation.
2. **Environment & Target Plane** — revisioned operational environment/site/target context and placement constraints.
3. **Plan & Admission Plane** — release-to-runtime plan binding release, config/secret, schema/data, trust, provider and policy prerequisites.
4. **Rollout & Cohort Plane** — staged generation replacement, progressive delivery, pause/resume/abort and residual cohorts.
5. **Observed Realization Plane** — provider/runtime observations, observed generation and realization identities.
6. **Readiness & Effective Service Plane** — applicability-qualified readiness, routing reachability and consumer/service effectiveness.
7. **Recovery & Transition Plane** — rollback/roll-forward actuation, cutover, drainage and reconciliation.
8. **Operability Plane** — capacity, queue/backlog, overload, currentness, ownership, degraded/offline behavior and Fleet/local evidence.

## 4. Canonical identities and revision vectors

The target introduces or qualifies identities such as:

- `DeploymentId` and immutable `DeploymentRevisionId`;
- `DesiredDeploymentGenerationId`;
- `EnvironmentId` and `EnvironmentProfileRevisionId`;
- `RuntimeTargetId` / `SiteRef` / `StationRef`;
- `DeploymentPlanId` and `DeploymentPlanRevisionId`;
- `RolloutId`, `RolloutRevisionId`, `RolloutStageId` and `CohortId`;
- `RuntimeRealizationId` plus provider realization references;
- `ObservedRuntimeGenerationId`;
- `ReadinessAssessmentId`;
- `TrafficEffectivenessAssessmentId`;
- `ConsumerEffectivenessAssessmentId`;
- `DeploymentTransitionId` / `RollbackActuationId`;
- `ResidualRuntimeCohortId`;
- `DeploymentReconciliationId`;
- `QualifiedLocalRuntimeClosureId`.

Canonical deployment identity survives provider/runtime substitution when semantic intent remains the same. Provider resource UIDs, task/container/process IDs, namespaces, accounts, regions, service IDs, function IDs or load-balancer IDs are realization identities or aliases, not canonical deployment identity.

A deployment qualification revision vector may include release revision, deployment plan revision, environment/profile revision, config/secret revisions, schema/data migration revision, trust/security/policy revisions, provider binding/support revision, placement/topology revision, traffic policy revision, rollout strategy revision and evidence/currentness horizon.

## 5. Environment, site and target semantics

**DECISION C3.20-D2 — an environment is a revisioned operational context, not a free-form label such as `prod`, and a runtime target is a qualified realization scope, not merely a provider resource locator.**

Environment semantics may include applicable policy/profile references, tenant/Enterprise/Station/site scope, allowed providers, placement/residency constraints, connectivity assumptions, dependency requirements, configuration/trust/schema prerequisites, capacity expectations, offline/degraded horizons and required evidence.

Target identity distinguishes semantic target scope from provider location. `site A`, `cluster X`, `namespace Y`, `cloud region Z`, `host N` and `edge gateway G` may all participate in realization, but only through explicit mapping to canonical environment/target semantics.

Lower-scope overlays cannot weaken superior authorization, governance, privacy, trust, security or residency constraints.

## 6. Release-to-runtime plan and admission handoff

**DECISION C3.20-D3 — deployment begins from a specific currently admissible release revision and a revision-pinned deployment plan; release admission is necessary but not sufficient for runtime admission.**

The minimum lineage is:

`release revision admitted -> deployment plan proposed -> runtime prerequisites qualified -> authority/policy evaluated -> desired generation committed -> provider actuation requested -> provider outcome observed -> runtime realization observed -> readiness qualified -> traffic effective -> consumer/service effectiveness validated`.

The plan pins, where applicable:

- release/artifact revision from C3.19;
- environment/target revision;
- configuration and secret reference revisions from C3.17;
- schema/data migration compatibility from C3.13;
- trust/security/governance qualifications;
- provider bindings/support-vector revisions;
- topology, replica, scaling and traffic intent;
- rollout strategy and stop/promotion conditions;
- dependency expectations and currentness horizons;
- recovery/rollback prerequisites;
- observability/proof obligations.

A release becoming inadmissible after deployment does not rewrite historical deployment truth; it triggers a new current qualification/transition decision.

## 7. Desired, accepted, observed and effective runtime

**DECISION C3.20-D4 — desired, provider-accepted, observed and effective runtime states are separate truth planes and must not collapse into one deployment status.**

At minimum the model distinguishes:

- desired deployment generation;
- provider mutation attempt/outcome;
- provider-reported resource generation;
- observed running generation by cohort;
- ready generation by cohort;
- traffic-serving generation by path/population;
- consumer-effective generation where business/service proof is required;
- residual prior generations still capable of serving or producing effects.

Observation carries evidence source, observation time, currentness and coverage. Stale observation can support historical reconstruction but cannot prove present convergence after a desired generation, binding, route, trust, configuration or schema change.

Current Kubernetes controllers illustrate why this separation is useful: rollout status separately tracks desired/updated/available state, progress can stall, and readiness can depend on additional readiness gates rather than merely containers running. These are provider realizations, not canonical SB semantics.

## 8. Rollout, replicas and progressive delivery

**DECISION C3.20-D5 — rollout is a revisioned, cohort-aware state transition with explicit stage criteria and residual-generation accounting; progressive delivery is portable intent, not an Argo/Kubernetes-specific primitive.**

A rollout may use rolling replacement, blue/green, canary, partitioned cohorts, shadowing or another qualified strategy. The portable model preserves:

- rollout revision and targeted cohorts;
- minimum availability / maximum unavailable intent;
- surge/burst allowance;
- sequencing and dependency ordering;
- traffic exposure by cohort;
- observation window and promotion criteria;
- pause/resume/abort authority;
- failure/UNKNOWN disposition;
- residual old-generation population and drainage state.

Provider-native mechanisms such as Kubernetes `maxSurge`, `maxUnavailable`, progress deadlines or Argo Rollouts traffic-shaping/analysis are valid realizations. They do not become canonical ownership and cannot strengthen semantics not proven by the provider support vector.

`all desired replicas created != rollout converged` and `rollout converged != consumer-effective service proven`.

## 9. Placement, topology, scaling and traffic

Placement intent is semantic and constrained by provider support, tenancy, residency, failure domains, trust/security posture, capacity and dependency locality. Provider scheduling acceptance is not proof of qualified placement.

Scaling distinguishes:

`desired workload capacity -> provider target -> observed running instances -> ready instances -> effective serving capacity -> measured headroom`.

A replica is not a fixed capacity unit unless workload/provider assumptions explicitly qualify it. Autoscaler/provider policies are realizations whose decisions and evidence remain attributable.

Traffic distinguishes desired route/weight/endpoint policy, provider acceptance, observed route state, path reachability and effective consumer distribution. Route-object existence does not prove intended traffic behavior.

## 10. Readiness, health and service effectiveness

**DECISION C3.20-D6 — readiness is an applicability-scoped `QualifiedClaim`; health signals are evidence inputs, not synonymous with readiness or deployment authority.**

Readiness may depend on:

- runtime/process liveness;
- startup completion;
- required dependency readiness;
- schema/data migration compatibility;
- configuration/secret adoption/currentness;
- trust/security currentness;
- provider realization state;
- route/path reachability;
- consumer/service probes;
- required SLO or post-deploy validation.

Results support at least `READY`, `NOT_READY`, `PARTIAL`, `INCONCLUSIVE` and `STALE` or equivalent qualified states. Missing, contradictory or stale evidence cannot silently become READY.

Observability owns telemetry, SLI/SLO and operational evidence semantics. Deployment owns the deployment-specific readiness/convergence decision that consumes that evidence.

## 11. Rollback, roll-forward and current eligibility

**DECISION C3.20-D7 — Artifact/Release owns whether a prior release is currently eligible as a rollback candidate; Deployment owns actuation and proof of the resulting runtime transition.**

Rollback eligibility may change with schema/data state, configuration/secret generations, trust/security posture, provider support, dependency compatibility, residency policy or artifact availability. Retaining an old image or deployment record is therefore insufficient.

Deployment transition semantics distinguish:

`target eligible -> transition authorized -> desired generation committed -> actuation -> observed replacement -> old cohort fenced/drained -> readiness -> traffic/consumer validation`.

Where rollback is no longer safe, a roll-forward or recovery workflow may be required. Runtime rollback remains distinct from data restore or disaster-recovery qualification.

## 12. Configuration, secret and schema pinning

Deployment plans pin the semantic revisions they require. A process that starts with one secret/config generation may remain in-flight while a new generation becomes current; that coexistence must be explicit and bounded.

A deployment is not converged merely because provider manifests reference the intended configuration. Consumer-effective adoption requires evidence appropriate to the materialization mode: restart, reload, dynamic fetch, mounted-file refresh or another qualified mechanism.

Schema/data migration compatibility must cover both forward and rollback directions where relevant. A runtime transition that would consume incompatible state is denied or `INCONCLUSIVE`, not assumed safe.

## 13. Runtime dependencies and provider currentness

Runtime dependency closure includes provider/runtime support, network/service dependencies, storage/database/messaging dependencies, trust/config resolution prerequisites and local resources required by the environment profile.

Provider capability discovery and admission belong to Provider/Binding. C3.20 declares deployment-domain required support semantics such as:

- placement/topology expressiveness;
- update/cohort semantics;
- readiness/health observation;
- traffic control and effective observation;
- scaling behavior;
- stateful workload support;
- config/secret delivery;
- identity/trust integration;
- disruption/failure semantics;
- quotas/rate limits;
- audit/currentness evidence;
- offline/local control behavior;
- rollback/cutover/drainage support.

Matching API names or container support does not establish equivalent runtime semantics.

## 14. Remote mutation, UNKNOWN and reconciliation

Remote deployment mutations use explicit effect disposition:

- `APPLIED`;
- `NOT_APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

Timeout or connection loss after create/update/scale/route/delete cannot be interpreted as either success or failure without evidence. `UNKNOWN -> reconcile-before-retry` unless exact operation-level idempotency is independently qualified.

Reconciliation compares canonical desired generation with provider observations and runtime evidence under a currentness horizon. It may discover partial cohorts, duplicate resources, stale routes or already-applied effects. Reconciliation itself does not acquire authority to change desired intent.

## 15. Provider substitution, coexistence and drainage

**DECISION C3.20-D8 — deployment-provider substitution is a staged compatibility and convergence process, not a rebinding of one provider identifier.**

The lifecycle is:

`discover -> qualify -> bind -> stage target -> shadow/coexist -> validate -> shift traffic/work -> cut over -> fence old authority -> drain residual cohorts -> withdraw old realization`.

Residual cohorts include old replicas/processes, workers, sessions, caches, routes, load-balancer targets, queues/subscriptions, scheduled jobs, sidecars/agents and offline runtimes that can still serve traffic or produce authoritative effects.

Cutover is incomplete while any non-dispositioned residual cohort remains capable of current effects contrary to desired intent.

## 16. Local/offline Station autonomy and Fleet boundaries

A Station/site may operate within a `QualifiedLocalRuntimeClosure` that pins the artifact/release, runtime/profile, configuration/secret, trust/policy, schema/data compatibility, provider bindings, local dependencies, authority snapshot and evidence horizon required for its permitted disconnected operation.

`offline availability != indefinite authority`.

When a currentness horizon expires, behavior follows explicit degrade/fail-closed policy; the Station does not invent renewed trust, permission or provider support. Reconnection requires reconciliation before stale local state becomes current enterprise truth.

Fleet may aggregate deployment generation, readiness, backlog, capacity and closure status, but a Fleet summary cannot prove a specific Station's local state. Central control requests also cannot erase locally unknown or partitioned outcomes.

Physical/Peripheral gateway or edge-agent deployment stays within C2's bounded integration/governance plane. Deploying software to a gateway does not create generic direct physical actuation authority.

## 17. Queueing, capacity, headroom and overload

Deployment operations form finite-capacity queue networks: admission, artifact/config distribution, migration, scheduling, image/startup work, readiness validation, traffic switching, reconciliation, rollback and offline resynchronization.

Operational evidence should preserve units, populations, windows and distribution tails and may include:

- arrival rate `λ` by rollout/transition class;
- service rate `μ` under declared assumptions;
- queue depth **and age**;
- oldest unreconciled `UNKNOWN`;
- rollout stage dwell time;
- replica/worker startup latency distributions;
- ready/effective capacity by cohort;
- quota/rate-limit pressure;
- retry amplification;
- network/artifact/config distribution lag;
- placement scarcity;
- headroom by failure domain;
- reconnect/offline surge;
- residual-cohort count and age.

`replicas = N` is not a capacity proof. `average utilization low` does not establish adequate peak headroom, bounded latency, queue stability or failure-domain survivability.

## 18. Brownfield / Legacy Mirroring assimilation

Brownfield discovery may observe deployment scripts, service-manager definitions, shell commands, Kubernetes/Compose manifests, VM images, cloud consoles, manual promotion procedures, spreadsheets, environment files, health URLs, load-balancer rules and undocumented operator sequences.

These become evidence/candidates with source/currentness/provenance, not desired canonical deployment truth.

Assimilation sequence:

`discover -> identify deployment/environment/runtime objects -> map provider IDs to candidate semantic identities -> capture observed topology/config/release/currentness -> detect contradictions/manual steps -> classify Fact/Claim/Assumption/InferredCandidate -> explicit adopt/defer/out-of-scope decision -> establish canonical lineage`.

`observed running system != intended deployment architecture` remains mandatory.

## 19. Elicitation Lens

C3.20 consumes the C1 Elicitation Knowledge Base through a capability-specific adaptive lens. Questions include:

- What exactly is being deployed, and which release revision is authoritative?
- What defines the environment beyond its name?
- Which tenant/Station/site/target scopes apply?
- Which configuration, secret, trust and schema revisions must be pinned?
- What proves a deployment is running, ready, reachable and consumer-effective?
- Which health signals are evidence only, and who owns the readiness decision?
- Which rollout/cohort strategy is required and what can pause, abort or promote it?
- What old cohorts can remain and for how long?
- What failure modes can become `UNKNOWN`, and how are they reconciled?
- What does rollback require today, and what could make it unsafe tomorrow?
- What load, peak, startup surge, queue/backlog and provider quota must be supported?
- What is the local/offline autonomy horizon and retained closure?
- Who owns deployment authority, escalation and emergency transitions?
- What manual/Brownfield deployment paths can bypass current evidence?
- Which provider-specific semantics would be lost on substitution?

Question provenance records which coverage gap triggered the question, expected evidence, ambiguity/contradiction rules and downstream artifacts blocked by the unresolved answer. AI suggestions remain `InferredCandidate` until governed adoption.

## 20. Production Readiness Coverage

Feature completeness does not imply runtime readiness. Deployment Production Readiness Coverage is multidimensional and may include:

- release/admission pinning;
- environment/target identity;
- authority and policy;
- config/secret currentness;
- schema/data compatibility;
- provider/runtime support;
- placement/topology;
- rollout/cohort safety;
- readiness/effectiveness evidence;
- rollback/recovery eligibility;
- dependency health/currentness;
- capacity/headroom/backpressure;
- offline/degraded behavior;
- reconciliation/UNKNOWN backlog;
- observability/alertability;
- owner/on-call/escalation;
- audit/provenance;
- local/Fleet currentness.

Each dimension uses evidence-qualified states such as `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED`, `NOT_APPLICABLE`, `DEFERRED`. No average score may hide a HIGH/CRITICAL unresolved gap or contradiction.

Separate gates remain: `sufficient for abstraction`, `sufficient for candidate architecture`, `sufficient for implementation`, `sufficient for publish/operation`. None means absolute completeness.

## 21. Authority, AI and governed work surfaces

Authorization/Organization owns who may propose, approve, deploy, scale, route, pause, abort, roll back, bind providers or widen offline horizons. AGWS may expose deployment actions only within delegated capability/action scope.

AI/low-code may suggest deployment plans, rollout stages, mappings, diagnosis or rollback candidates. It cannot:

- commit desired generation without authority;
- turn provider ACK into convergence;
- manufacture readiness/currentness evidence;
- weaken security/privacy/trust/residency constraints;
- silently switch provider or environment identity;
- convert stale Fleet summaries into local truth;
- extend disconnected authority/currentness horizons;
- infer generic physical actuation from gateway deployment.

## 22. Planning D migration constraints

Future Planning D must preserve:

- current `DeploymentRecord`, `environmentRef`, active-deployment authority and local-process realization during incremental migration;
- coexistence of current single-host records with richer desired/observed/effective semantics;
- explicit adoption/backfill rather than inventing historical desired generations or provider observations;
- free-form/manual deployment evidence alongside structured target records while provenance is incomplete;
- compatibility bridges from current health checks to qualified readiness evidence without claiming historical completeness;
- symbolic secret/config bindings and runtime autonomy;
- no forced provider migration merely to introduce canonical semantics;
- provenance limits for Brownfield state whose exact release/config/runtime lineage is unknowable.

No migration work is authorized in C3.20.

## 23. Planning E proof candidates

Future Planning E should include product-proof obligations for at least:

1. release admitted does not imply deployed/effective;
2. desired generation differs from stale observed generation;
3. provider ACK does not prove runtime convergence;
4. running process does not prove readiness;
5. readiness does not prove intended traffic/consumer effectiveness;
6. partial cohort rollout remains PARTIAL;
7. old cohort remains visible until fenced/drained;
8. timeout yields `UNKNOWN` and reconciliation before unsafe retry;
9. duplicate/replayed provider mutation cannot silently create false convergence;
10. rollout pause/resume/abort preserves revision and authority;
11. configuration/secret revision mismatch blocks or qualifies readiness;
12. schema/data incompatibility blocks unsafe rollback;
13. rollback artifact availability alone does not establish rollback eligibility;
14. provider substitution exposes unsupported semantics rather than pretending equivalence;
15. Fleet aggregate cannot prove local Station state;
16. offline Station respects currentness/authority horizon;
17. average utilization cannot mask queue/backlog/headroom failure;
18. replica count cannot masquerade as service capacity;
19. Brownfield observed deployment is not auto-promoted to canonical intent;
20. AI proposal cannot commit deployment authority;
21. cross-tenant/site targeting cannot silently escape scope;
22. readiness evidence with stale/missing coverage becomes INCONCLUSIVE/PARTIAL;
23. post-deploy validation is required when declared by the profile;
24. Physical/Peripheral gateway deployment does not create generic actuation authority.

No tests are executed or implemented by this decision.

## 24. Standards and realization strategy

Kubernetes, Nomad, systemd/process managers, container runtimes, serverless platforms, VM/cloud APIs, service meshes, ingress/load balancers and progressive-delivery controllers remain provider/realization choices.

Current Kubernetes documentation reinforces useful separations: rolling updates distinguish desired, updated and available replicas; stalled progress is separately signaled; readiness can include custom gates; `maxSurge` and `maxUnavailable` constrain rollout populations. Argo Rollouts demonstrates that canary/blue-green and metric-gated traffic transitions can be layered as a controller realization. C3.20 adopts these as evidence that portable semantics should model rollout/cohorts/readiness/traffic explicitly, not as a mandate to use those products.

## 25. Final disposition

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

Deployment / Environment / Runtime is a distinct canonical semantic owner. Generation 2 will preserve the current SB deployment registry, environment-reference, active-runtime authority, local-process runtime and autonomy foundations, while generalizing them into revisioned desired/observed/effective deployment semantics, environment/target identity, rollout/cohort transitions, readiness/effectiveness qualification, rollback/roll-forward actuation, remote ambiguity/reconciliation, provider substitution, capacity/headroom evidence and local/Fleet boundaries.

No new material finding, ConflictPattern, ConflictInstance, canonical capability or remediation is created. The inherited adversarial inventory remains **408 material findings**, and research remains closed/saturated.
