# Generation 2 — Research Hypothesis: Topology, Build & Runtime Realization

Status: USER-DIRECTED / MANDATORY CROSS-CAPABILITY RESEARCH HYPOTHESIS / NOT YET A PROMOTED CAPABILITY

## Why this exists

Generation 2 already separates semantic system definition, capabilities, providers, build/release/deployment, runtime observation and evidence. A remaining architectural question is how System Builder should represent a customer's executable topology so the same semantic system can be materialized efficiently as one simple runtime, several grouped deployment units, or a more distributed/scaled topology without changing business semantics.

The user intent is explicitly **mature-system semantics with simple-system ergonomics**: learn from mature orchestrators/build/deployment systems, but do not force Kubernetes-scale complexity on ordinary business applications. A simple system should be able to collapse many low-load modules into one runtime/deployment unit. A heavy workload should be separable and replicated independently. Complexity should be introduced by requirements, not by the existence of the abstraction.

A second explicit principle is **provider leverage**: System Builder should own the portable topology/requirement semantics while delegating mature build, packaging, runtime and orchestration mechanics to existing providers whenever advantageous. The value of providerization is precisely the ability to assemble proven systems quickly instead of rebuilding their mechanics.

## Candidate constitutional ideas to falsify or validate

> Modules define what the system is; topology defines how its realization is partitioned.

> Architectural componentization does not imply physical distribution.

> Mature orchestration semantics should degrade gracefully to a one-runtime/simple deployment profile.

> Own the topology requirements and evidence; delegate build/orchestration mechanics to providers.

## Required separation of concerns

Research must preserve explicit distinction among at least:

1. **Semantic Architecture** — modules, capabilities, operations, domain contracts, workflows and authority.
2. **Runtime Topology** — executable units, communication boundaries, placement/isolation, scaling and failure domains.
3. **Build Topology** — which source/dependency closures are compiled/packaged into which build targets/artifacts and which targets can be reused.
4. **Deployment Topology** — desired realization of artifacts into environments/providers/regions/instances/replicas.
5. **Observed Topology** — what is actually running, where, at which revisions and health/readiness state.

The model must not collapse these into a single `container` concept.

## Candidate primitives to stress-test

Names are hypotheses only. Research/synthesis may merge, rename or reject them.

- `TopologyDefinition`
- `TopologyRevision`
- `DeploymentUnit`
- `RuntimeUnit`
- `BuildTarget`
- `ArtifactBinding`
- `PlacementConstraint`
- `CoLocationPolicy`
- `IsolationConstraint`
- `FailureDomainRequirement`
- `ScalingProfile`
- `ResourceProfile`
- `AvailabilityProfile`
- `CommunicationProfile`
- `ProviderTopologyBinding`
- `BuildIntent`
- `BuildPlan`
- `TopologyValidationEvidence`
- `TopologyRealizationEvidence`
- `ObservedTopology`
- `TopologyMigrationPlan`

## Minimum simple-to-mature spectrum

Research must prove that one semantic system can be materialized across a spectrum without semantic redesign.

### Profile A — simple business system

```text
SystemDefinition
  modules: 7–10 low-load modules

Topology:
  DeploymentUnit: business-core
    contains: all low-load modules
    replicas: 1
```

Expected property: one build target / one deployable runtime is valid when isolation, scaling, security and failure-domain constraints permit it. No microservice tax merely because modules are semantically distinct.

### Profile B — mixed workload

```text
business-core
  7–10 low-load modules
  replicas: 1

heavy-worker
  one CPU/memory intensive capability/workjob
  replicas: 3
```

Expected property: build the heavy-worker artifact once and instantiate/replicate it N times. `replicas=3` must not imply three independent builds.

### Profile C — larger/mature deployment

The same semantic system may later separate search, workflow workers, public gateway, reporting, document processing or other workloads when independent scaling, availability, security or failure isolation justifies it.

Expected property: changing topology does not redefine module/capability identity.

## Grouping / splitting decision research

Study how a topology planner or human operator should decide whether components may be colocated or must be separated. At minimum include:

- measured/declared CPU and memory profile;
- expected throughput and burst characteristics;
- scaling independence;
- startup/runtime characteristics;
- latency/data-locality affinity;
- security/trust boundaries;
- internet-facing vs internal-sensitive exposure;
- regulatory/compliance isolation requirements where generic governance applies;
- failure-domain/blast-radius requirements;
- availability/SLO profile;
- stateful/stateless characteristics;
- provider/runtime compatibility;
- architecture/runtime dependency affinity;
- operational complexity/cost evidence;
- edge/offline constraints;
- secrets/configuration scope;
- upgrade/release cadence.

Research whether the planner should optimize something like `cost/operational simplicity` subject to hard semantic/security/availability constraints, rather than optimize only container count or infrastructure cost.

## Provider tradeoff — mandatory design test

Provider abstraction must not exist merely for aesthetic neutrality. Research must explicitly test the economic/engineering reason for providers:

- reuse mature mechanics already implemented by Docker/BuildKit, Kubernetes, Nomad, ECS, Cloud Run, Coolify, Nix/Bazel or equivalent representatives;
- allow a simple local/self-hosted provider to materialize one or a few runtime units without orchestrator overhead;
- permit a more capable provider to satisfy the same topology requirements with autoscaling, scheduling, health management and HA;
- preserve the same semantic `DeploymentUnit`/topology intent across materially different providers where their capability profiles are compatible;
- expose provider-specific optional features only through explicit profiles/extensions, never by contaminating portable semantics;
- make provider replacement a governed transition with compatibility, state, trust, traffic/cutover and postcondition evidence;
- prefer composition of ready-made providers over rebuilding generic orchestrator/build/deploy machinery inside SB.

A provider may reject or only partially satisfy a requested topology profile. The SB must not silently weaken mandatory isolation, availability, scaling or security constraints merely to fit a simpler provider.

## Topology Workbench / customer view hypothesis

Research a user-facing topology representation for each customer/system/environment that can show at minimum:

- semantic system revision;
- topology revision;
- deployment units and which modules/capabilities they contain;
- build targets/artifacts;
- desired vs effective vs observed realization;
- replica counts/scaling profile;
- providers/environments;
- dependency/build impact;
- health/readiness and evidence freshness;
- compatibility/validation status;
- version drift/update availability.

Candidate actions are semantically distinct even when the UI later offers convenience combinations:

```text
VALIDATE != BUILD != RELEASE != DEPLOY
```

A per-unit `[BUILD]` action and a `[BUILD ALL]` action are valid UI hypotheses. `BUILD` should mean materialize an exact declared build/topology revision, not run an opaque provider command without provenance.

## Partial/incremental build research

The topology/build model must connect to the existing dependency-graph/reproducibility research. Test whether a change to one module/capability can deterministically compute affected build targets:

```text
changed module -> affected dependency closure -> affected BuildTarget(s)
```

Unchanged compatible targets/artifacts should be reusable rather than rebuilt. Build cache evidence must not be mistaken for semantic equivalence without qualified closure/provenance.

## Version/revision model to stress-test

Do not collapse:

- `SystemSemanticRevision`
- `TopologyRevision`
- `BuildPlanRevision`
- `ArtifactRevision/Digest`
- `ReleaseRevision`
- `DeploymentRevision`
- `ObservedRuntimeRevision`

The same `SystemSemanticRevision` may have multiple valid topology revisions for different customers/environments, or a topology may evolve without semantic system change.

## Required representative families

Research should examine 3–8 strong representatives per pass and expand when evidence requires. Candidate families include:

- Kubernetes Deployments/Pods/ReplicaSets, scheduling, affinity/anti-affinity, resource requests/limits, topology spread and rollout semantics;
- HashiCorp Nomad jobs/task groups/scaling/constraints;
- AWS ECS tasks/services and service autoscaling;
- Docker Compose / Docker runtime as simple-system baseline;
- Coolify or equivalent higher-level self-host deployment provider for operational simplicity;
- Google Cloud Run / serverless container realization as a contrasting autoscaled provider;
- BuildKit, Bazel and/or Nix for build-target/dependency-closure/reproducible partial-build semantics;
- systemd/process-supervisor style local realization as negative/contrast evidence for minimal deployments;
- mature service-mesh/gateway mechanisms only where needed to test boundary/communication consequences, not as mandatory SB architecture.

Do not universalize provider objects such as Kubernetes Pod, Nomad TaskGroup, ECS TaskDefinition or Docker Compose service. Extract the portable requirement/realization primitives behind them.

## Required proofs / adversarial scenarios

1. **Simple collapse proof** — 10 semantically distinct low-load modules run safely in one deployment unit and one container/process without losing module/capability boundaries.
2. **Independent heavy workload proof** — one heavy workjob is a separate build/runtime unit with one artifact and three replicas.
3. **Split-without-semantic-change proof** — a module moves from shared core to isolated runtime due to load while its semantic identity/contracts remain unchanged.
4. **Security anti-colocation proof** — two low-load modules cannot be colocated because their trust/exposure constraints conflict.
5. **Provider substitution proof** — same topology intent is materialized by a simple provider and a mature orchestrator where both satisfy the mandatory profile.
6. **Provider insufficiency proof** — a simple provider is rejected/declared partial when HA/isolation/scaling requirements exceed its profile; requirements are not silently weakened.
7. **Partial build proof** — change in one module rebuilds only affected build targets; unaffected artifacts are reused with provenance.
8. **Build once / replicate many proof** — three replicas consume the same verified artifact rather than triggering three builds.
9. **Topology-version proof** — same SystemDefinition revision supports two customer/environment topologies with separate lineage.
10. **Desired/effective/observed proof** — workbench distinguishes desired topology, effective deployment and observed health/revision.
11. **Topology migration proof** — regrouping/splitting deployment units has plan/validation/cutover/rollback/postcondition evidence.
12. **Runtime autonomy proof** — generated deployment remains operational without Builder control-plane availability according to its qualified local closure profile.
13. **UI build authority proof** — `[BUILD]` is authority-governed, revision-bound and produces reproducible artifact/provenance evidence; it cannot silently deploy or widen provider authority.
14. **Operational simplicity proof** — the simplest valid system does not need to understand or operate Kubernetes merely because the canonical model supports Kubernetes-scale deployments.

## Cross-capability ownership questions

This hypothesis must be stress-tested against:

- Universal Capability Architecture — universal realization/evidence primitives;
- Build / Dependency Graph / Reproducibility — build targets, closures and incremental impact;
- Artifact / Release / SBOM / Provenance — artifact identity and release promotion;
- Deployment / Environment / Runtime — desired deployment and runtime realization;
- Provider / Binding / Capability Negotiation — provider profiles and replacement;
- Security / Resilience / Failure Recovery — isolation, failure domains and recovery;
- Observability / Operations / Incident — observed topology/health;
- Secrets / Configuration / Environment Portability — runtime/config placement boundaries;
- Standards / Interoperability / API Contracts — communication boundaries;
- Lifecycle / Versioning / Evolution / Migration — topology revision/migration;
- Transaction / Consistency / Concurrency — consequences of moving a formerly in-process boundary across runtimes;
- Executable Capability Composition / Cumulative Context — semantic operation graph independent from physical placement;
- AGWS/UI — governed Topology Workbench and build/release/deploy actions.

## Negative-space / synthesis gate

The Enterprise Completeness / Negative-Space Review must explicitly challenge whether the taxonomy can represent:

- one-process/simple deployments;
- modular monoliths;
- grouped container deployments;
- independently scaled workers;
- multi-service topologies;
- edge/offline runtime units;
- provider-specific orchestration without provider semantics leaking upward;
- topology evolution/migration;
- customer-specific topology projections of the same semantic system.

Capability Synthesis must explicitly dispose this hypothesis by evidence: `KEEP`, `MERGE`, `GENERALIZE`, `SPECIALIZE`, `DEFER` or `DO_NOT_BUILD`. It must not disappear by being split invisibly across Build and Deployment.

## Core anti-overengineering rule

Research should treat the following as a product requirement, not a convenience:

> The canonical model may be mature enough to describe complex systems, but the common path must remain simple enough to build and operate ordinary systems without distributed-systems ceremony.

The SB should make the sophisticated path available, not mandatory.
