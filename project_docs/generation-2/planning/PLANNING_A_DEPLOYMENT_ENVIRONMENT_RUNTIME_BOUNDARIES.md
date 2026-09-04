# Planning A — Deployment / Environment / Runtime Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Canonical capability: Deployment / Environment / Runtime

This artifact defines semantic ownership and boundaries only. It makes no claim about current System Builder implementation and performs no Planning B archaeology, product code, Work Package, TASK, Construction, PR, or worker handoff.

## 1. Semantic ownership

Deployment / Environment / Runtime owns the portable semantics by which an admissible release is intentionally realized as running service/workload state in an environment, observed against desired generation, qualified for readiness/effective service, evolved through rollout/placement/scaling/traffic transitions, operated with declared retained runtime closure, rolled back when currently eligible, and migrated across runtime/provider realizations without confusing provider acknowledgement with consumer-effective truth.

Its source of truth includes:

- canonical `DeploymentIdentity` and deployment revision, distinct from provider deployment/resource IDs;
- canonical `EnvironmentIdentity` and operational-profile revision, distinct from cluster/project/account/namespace/region IDs;
- release-to-runtime plan identity binding immutable release revision to runtime profile, bindings, configuration/trust/schema prerequisites and placement constraints;
- desired deployment generation and desired replica/worker/topology/traffic intent;
- observed realization generation and provider-reported state as evidence rather than canonical desired truth;
- effective runtime generation qualified by readiness, health, traffic reachability and required consumer/service evidence;
- rollout identity, strategy revision, stage/cohort state and convergence evidence;
- placement, scaling and traffic-policy intent plus realized/effective evidence;
- runtime-autonomy/retained-closure declaration for disconnected or degraded operation;
- deployment rollback actuation and post-rollback convergence evidence, distinct from release rollback eligibility;
- provider/runtime substitution qualification, coexistence, cutover and residual runtime/traffic/session/cache/worker cohort drainage.

The constitutional truth separation is preserved:

`build result ≠ released artifact ≠ deployed state ≠ consumer/runtime-effective state`.

## 2. Canonical identity and environment realization

Canonical deployment/environment identity remains stable across provider-specific realizations unless an explicit governed adoption transition says otherwise. Kubernetes UIDs, cloud deployment IDs, namespace/project names, container/task IDs, host IDs, region IDs, serverless function IDs and similar values are realization identities or aliases by default.

An environment is not merely a provider account or a string such as `prod`. It is a revisioned operational context containing applicable policy/profile references, capability/provider bindings, configuration/trust dependencies, placement/residency constraints, connectivity assumptions and runtime-support requirements. Environment/profile overlays may specialize only within superior constraints.

A deployment revision identifies desired runtime realization intent. Provider resources are evidence/actuation targets for that intent, not the semantic source of truth for what SB intended to run.

## 3. Release-to-runtime plan and generation semantics

The release-to-runtime lineage distinguishes:

`release admissible → deployment plan proposed → authority/policy evaluated → desired generation committed → provider actuation attempted → provider accepted → resources observed → rollout converged → readiness qualified → traffic effective → consumer/service effectiveness validated`.

Each step is separate. A successful provider write does not prove resources exist in the intended form. Observed resources do not prove they correspond to the latest desired generation. Ready replicas do not necessarily prove traffic or consumer-effective service.

Desired, observed and effective generations must therefore remain distinguishable. Stale observation can qualify historical state but cannot silently prove current convergence after desired revision, binding, trust, configuration, schema, traffic or provider changes.

## 4. Rollout, placement, scaling and traffic

Deployment/Runtime owns runtime rollout semantics including staged/cohort progression, surge/replacement constraints, convergence, pause/resume/abort and current rollout evidence. A rollout strategy is revisioned and applicability-scoped; no particular orchestrator primitive is canonical.

Placement expresses intended eligible runtime locations/topologies subject to provider support, policy, trust, privacy/residency, capacity and failure-domain constraints. Provider scheduling acceptance does not prove the workload is effectively running in the intended qualified placement.

Scaling distinguishes desired capacity, provider-accepted target, observed running capacity, ready capacity and effective service capacity. Autoscaling/provider-native policies are realizations; portable semantics preserve the target/evidence relation without canonizing one controller.

Traffic transitions distinguish desired route/weight/endpoint intent, provider acceptance, observed routing configuration and effective traffic behavior. A route object existing is not proof that intended consumers are reaching the intended generation.

## 5. Readiness and consumer-effective service

Readiness is an applicability-scoped qualified claim, not a universal boolean. It may depend on workload process health, dependency availability, schema/configuration compatibility, trust currentness, startup/migration completion, routing reachability and consumer-specific checks.

The portable model distinguishes at minimum:

- process/container/task running;
- provider/orchestrator readiness accepted;
- required dependency readiness qualified;
- traffic path effective;
- consumer/service probe effective;
- declared SLO/operational validation satisfied where required.

Missing, stale, partial or contradictory evidence yields `INCONCLUSIVE` rather than implicit readiness. Observability owns telemetry/evidence semantics; Deployment/Runtime owns the runtime-specific convergence/readiness decision that consumes qualified evidence.

## 6. Runtime autonomy and retained closure

Runtime autonomy means a generated/deployed system can continue within a declared retained closure without live dependency on the System Builder control plane where the operational profile permits it. Autonomy is qualified, not absolute.

The retained closure declares required artifact, configuration, secret reference/value materialization, trust material/evidence, schema/data compatibility, local policy/authority, runtime dependencies, provider bindings and operational evidence needed for the allowed disconnected horizon.

Disconnected/degraded operation cannot invent missing authority, trust, configuration, schema compatibility or provider support. When closure prerequisites expire or disappear, behavior must degrade or fail closed according to superior policy. Reconnection requires reconciliation before stale local state is treated as current enterprise truth.

## 7. Rollback actuation and recovery distinction

Artifact/Release owns whether a prior release is currently eligible as a rollback target. Deployment/Runtime owns actuation of an eligible target into desired runtime state and proof that the rollback converged/effectively serves its intended consumers.

Rollback is not guaranteed by retaining a previous image or deployment spec. Current eligibility can depend on schema/data compatibility, configuration, trust, provider support, external integrations, traffic state and security/recovery constraints.

Deployment rollback also remains distinct from state recovery/restore. Security/Resilience owns recovery qualification and failure-recovery safety; Data/Schema and Storage own their domain state. A runtime rollback that would strand incompatible state must be denied or remain `INCONCLUSIVE` until qualified.

## 8. Provider/runtime substitution and residual cohorts

Runtime/provider substitution follows `discover → qualify/admit → bind → stage/coexist → actuate → observe → validate → cut over → drain/withdraw`.

Equivalent container/serverless/VM APIs do not prove equivalent semantics for readiness, placement, autoscaling, networking, storage, secrets, identity, trust, disruption, offline behavior or failure recovery. Differences surface through capability/support vectors and explicit plan constraints.

Cutover is incomplete while obsolete replicas, workers, routes, load-balancer targets, sessions, caches, queues/subscriptions or provider-specific background jobs can still produce authoritative effects or serve traffic contrary to current intent. Residual cohorts must be drained, fenced, requalified or explicitly dispositioned.

Canonical deployment identity may survive provider substitution while realization IDs change. No provider ID becomes canonical merely because it is long-lived.

## 9. Ambiguous actuation and failure semantics

Required distinguishable outcomes include:

- deployment plan denied before desired generation commit;
- desired generation committed but provider actuation not attempted;
- provider mutation accepted but observed realization absent or stale;
- partial rollout across cohorts;
- observed generation differs from desired generation;
- resources running but readiness evidence insufficient;
- readiness accepted but traffic/consumer effectiveness unproven;
- placement/scaling/traffic mutation outcome ambiguous;
- rollback target eligible but actuation/convergence fails;
- disconnected runtime exceeds retained-closure/currentness horizon;
- provider substitution exposes unsupported semantics;
- old replicas/routes/sessions/workers remain authoritative after cutover.

Mutating rollout/traffic/placement/scaling outcomes use `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`. `UNKNOWN` requires reconciliation before unsafe retry unless operation-specific idempotency is explicitly qualified. Provider acknowledgement is never silently promoted to effective generation.

## 10. Capability boundaries

### Artifact / Release / SBOM / Provenance
Artifact/Release owns immutable release identity, provenance/SBOM/signature evidence, promotion/distribution and current release rollback eligibility. Deployment/Runtime owns realization of an admissible release into desired/observed/effective runtime state and actual rollback actuation.

### Build / Dependency Graph / Reproducibility
Build owns dependency/material closure, build execution, reproducibility and workload-driven minimal runtime-closure declaration inputs. Deployment/Runtime consumes the declared closure and realizes it; build success does not prove deployment or runtime effectiveness.

### Provider / Binding / Capability Negotiation
Provider/Binding owns provider discovery, support qualification, admission, binding, fallback/coexistence and withdrawal. Deployment/Runtime owns the runtime semantics that bindings must satisfy: placement, rollout, scaling, traffic, readiness, autonomy and ambiguous-effect reconciliation.

### Secrets / Configuration / Environment Portability
Secrets/Configuration owns reference/value separation, configuration revisions, overlays, rotation/revocation and portable environment binding inputs. Deployment/Runtime consumes qualified materialization/currentness and observes consumer-effective adoption without redefining secret/config truth.

### Enterprise Trust / PKI / Certificate Lifecycle
Enterprise Trust owns trust domains, anchors, issuance, path/revocation/currentness and credential rotation/substitution. Deployment/Runtime consumes qualified trust evidence/material and proves workload/runtime adoption where applicable.

### Security / Resilience / Failure Recovery
Security/Resilience owns posture, containment, degraded-mode eligibility and recovery qualification. Deployment/Runtime performs bounded runtime actuation and exposes convergence/effectiveness evidence; it cannot declare unsafe recovery qualified.

### Observability / Operations / Incident
Observability owns telemetry/evidence freshness, coverage, SLI/SLO and incident/remediation evidence. Deployment/Runtime consumes qualified evidence for rollout/readiness/effectiveness decisions and exposes desired/observed generation lineage.

### Lifecycle / Versioning / Evolution / Migration
Lifecycle supplies revision/coexistence/migration/withdrawal primitives. Deployment/Runtime owns deployment generations, runtime coexistence/cutover and current runtime transition semantics.

### Standards / Interoperability / API Contracts
Standards/API Contracts owns protocol/contract conformance. Deployment/Runtime owns whether the realized service is effectively reachable/compatible for its intended runtime profile; protocol conformance alone is insufficient.

### Developer / Operator Experience / Self-hosting
Developer/Operator Experience owns bootstrap, diagnostics, operational ergonomics and self-hosted maintenance workflows. Deployment/Runtime owns the underlying portable runtime state/transition semantics those tools operate.

### Universal Capability Architecture
UCA supplies typed identity, revision vectors, qualified claims/evidence, effect disposition, support vectors, provider bindings, currentness and residual-cohort primitives. It does not absorb deployment/runtime ownership.

## 11. Enterprise → Station → Role → Person and AGWS

Authority remains monotonic. Enterprise may constrain allowed runtime profiles, providers, placements, regions, rollout strategies, traffic transitions, disconnected horizons and rollback behavior. Station may expose or administer only the runtime capabilities delegated to it; Role/Person may propose or actuate only within explicit authority.

Adaptive Governed Work Surfaces and AI may surface deployment evidence, propose bounded rollout/scale actions, explain drift or request an authorized transition. They cannot:

- turn provider acknowledgement into effective runtime truth;
- manufacture readiness, traffic, placement or convergence evidence;
- expand Station/runtime/provider administration authority;
- extend offline/currentness horizons;
- select a rollback target that is not currently qualified;
- silently adopt provider runtime IDs as canonical identity;
- bypass superior placement/residency/security/trust policy;
- ignore residual replica/route/session/cache/worker cohorts.

## 12. Non-goals

This capability does not own artifact creation/release promotion, build dependency resolution, provider discovery/admission, secret/configuration canonical truth, trust-root lifecycle, security/recovery qualification, telemetry/incident truth, generic lifecycle primitives, protocol standards, or operator UX. It does not mandate Kubernetes, containers, VMs, serverless, one cloud, one cluster topology, one ingress/load balancer, or permanent connectivity to the SB control plane.

## 13. Planning B repository-validation questions

Defer all answers to fresh-main archaeology in Planning B:

1. Does SB represent canonical deployment/environment identity separately from provider runtime IDs and environment labels?
2. Is there an explicit release-to-runtime plan bound to release revision, runtime profile, configuration/trust/schema prerequisites and provider bindings?
3. Are desired, observed and effective generations represented separately?
4. Are provider acceptance, rollout convergence, readiness, traffic effectiveness and consumer validation distinguishable?
5. Are placement, scaling and traffic transitions revisioned and evidence-qualified rather than inferred from provider objects?
6. Does readiness carry applicability/freshness/coverage semantics and permit `INCONCLUSIVE`?
7. Is generated-runtime autonomy expressed as a declared retained closure with bounded disconnected/degraded horizons?
8. Is deployment rollback actuation separated from release rollback eligibility and data/state recovery qualification?
9. Are ambiguous rollout/placement/scaling/traffic mutations reconciled before unsafe retry?
10. Can runtime/provider substitution preserve canonical deployment identity while exposing support gaps and draining obsolete replicas/routes/sessions/caches/workers?
11. Can Station expose only delegated runtime capabilities without amplifying Enterprise authority?
12. Can AI/AGWS propose runtime actions without manufacturing evidence or gaining provider/runtime administration authority?

No answer is inferred in Planning A.

## 14. Planning A disposition

**PASS_FOR_CAPABILITY.** Deployment / Environment / Runtime has a distinct semantic owner and bounded relations to adjacent capabilities. Research and synthesis inputs are sufficient for Planning A; no new finding or capability candidate is required. Planning B remains blocked until every canonical capability completes Planning A reconciliation.
