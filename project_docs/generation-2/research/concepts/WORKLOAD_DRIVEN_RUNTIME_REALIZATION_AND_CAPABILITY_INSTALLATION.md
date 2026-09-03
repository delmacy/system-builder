# Generation 2 Research Input — Workload-Driven Runtime Realization & Capability Installation

Status: RESEARCH HYPOTHESIS / NOT ARCHITECTURE AUTHORITY

## User-origin concept

The System Builder may expose a very broad capability universe while each generated client system materializes only the capabilities actually required by that system and the operational realization required by its workload. A simple client with five capabilities and roughly fifty users should not inherit the same runtime weight, deployment topology, operational dependencies or administrative burden as a larger client with ten capabilities, hundreds of active workers/users, stronger concurrency, heavier workflow volume, tighter availability targets or richer integration requirements.

This concept applies to generated client systems and their autonomous runtime images. It is distinct from System Builder Station composition, which governs the administrative/development surface of the Builder itself.

## Core hypothesis

Research whether Generation 2 should formalize the following separation:

`System Builder capability universe != Station capability surface != client capability set != generated runtime realization`

A client runtime should be derived from at least two orthogonal inputs:

1. semantic/functional requirements — what the system must know or do;
2. operational/workload requirements — how much load, concurrency, durability, availability, recovery, regionality and runtime isolation those capabilities must support.

The same capability graph may therefore produce materially different runtime realizations under different workload profiles without changing business semantics.

## Operating-system analogy to test

Use the following analogy only as a research model, not as pre-decided architecture:

- System Builder Core / semantic substrate ~= kernel-like semantic foundation;
- capabilities/modules ~= installable subsystems that extend what a generated system can do;
- providers/adapters ~= driver-like implementations that realize stable capability contracts against concrete infrastructure/services;
- build/runtime realization ~= a system image assembled from the minimal coherent capability/dependency closure plus operational realization requirements.

The analogy is useful only if it preserves the existing constitutional rule: the System Builder owns stable semantics/contracts/evidence where necessary, but does not need to own every concrete implementation. Do not universalize OS mechanisms when provider delegation or application/runtime patterns are more appropriate.

## Minimal runtime closure hypothesis

Research whether client-system materialization should calculate a deterministic minimal closure:

`Requested Capability Requirements`
`→ Required transitive capabilities/primitives`
`→ compatible provider bindings`
`→ implementation/runtime dependencies`
`→ policy/security constraints`
`→ operational realization requirements`
`→ generated autonomous runtime image`

A capability or implementation not selected and not transitively required should, where technically feasible, be absent rather than merely hidden or disabled.

Research the distinction among:

- semantic capability known by the Builder;
- capability selected by the client SystemDefinition;
- capability required transitively;
- provider selected/bound;
- code/package included in the generated artifact;
- runtime process/service actually instantiated;
- administrative/observability surface exposed at runtime.

The target is real modularity, not a monolithic runtime with feature flags masking unused subsystems.

## Workload / Operational Profile hypothesis

Research a first-class but non-authoritative `OperationalProfile`, `WorkloadProfile`, `RuntimeRequirements` or equivalent concept separate from business capability selection.

Candidate dimensions to validate:

- registered population;
- peak concurrent users;
- request/event throughput;
- workflow execution rate;
- background job volume;
- burst factor;
- data volume and growth rate;
- document/media throughput;
- integration/API throughput;
- latency objectives;
- availability/SLO target;
- durability guarantees;
- retention;
- RPO/RTO;
- geographic/regional constraints;
- offline/edge/intermittent connectivity;
- security/trust-zone constraints;
- data residency;
- backup/recovery posture;
- observability depth;
- provider/runtime limits;
- cost/resource constraints.

User count alone must not be treated as sufficient sizing authority. For example, 300 registered users with 30 peak concurrent users and 300 users simultaneously executing critical workflows are materially different operational systems.

## Same semantics, different realization

Research and prove scenarios where the same semantic SystemDefinition can be realized differently as demand changes.

Example A — small office:

- 5 capabilities;
- ~50 users;
- low concurrency;
- modest workflow volume;
- single region;
- standard availability.

Potential realization may remain compact: one application runtime, ordinary relational database, small worker footprint and basic telemetry, subject to evidence.

Example B — larger enterprise operation:

- 10 capabilities;
- ~300 workers/users;
- high concurrency or sustained workflow activity;
- multiple integrations;
- stronger durability/audit/availability obligations.

Potential realization may require multiple app/worker instances, queues, dedicated background execution, pooling/cache, stronger observability, HA database/storage, integration isolation or other topology changes, but only where workload evidence justifies them.

Do not encode these examples as fixed product tiers.

## Runtime realization evolution

Research whether an existing client can change runtime realization without semantically redesigning the system:

`same SystemDefinition + revised OperationalProfile → new RuntimeRealization`

Possible transitions to validate:

- one runtime instance → horizontally scaled instances;
- inline/background work → dedicated worker pools;
- local/basic storage provider → object-storage provider;
- basic database topology → HA/replicated topology;
- direct integration execution → buffered/queued execution;
- basic telemetry → richer tracing/metrics/logging;
- single-region → multi-region or edge-aware realization.

Such transitions require explicit compatibility, migration, rollback, evidence and state-drainage semantics. Runtime scaling must not silently change canonical business meaning.

## Candidate realization model

Research whether build planning should distinguish:

`Capability Graph` — what semantic capabilities are required.

`Provider Binding Graph` — who realizes each capability.

`Operational Requirement Graph/Profile` — workload/quality constraints.

`Runtime Realization Plan` — concrete process/service/resource topology chosen to satisfy them.

`Build/Image Manifest` — exact reproducible artifacts and configuration emitted for the autonomous client system.

Potential conceptual relation:

`Runtime Image = capability closure + provider bindings + operational profile + quality attributes + infrastructure constraints + policy`

This equation is non-authoritative and must be falsified against mature build, orchestration, deployment, product-line, autoscaling, package-management and provider systems.

## Scaling is not capability inflation

Research must guard against a category error: scaling the realization of a capability must not automatically create new business capabilities.

For example:

- high-volume Workflow remains Workflow;
- horizontal replicas do not become a new business capability;
- queueing/caching/sharding/replication may be realization mechanics or provider/runtime subcapabilities;
- HA/DR/SLO concerns may belong to operational capabilities or quality attributes rather than the domain model.

The final architecture must identify semantic owners without leaking infrastructure mechanics into business definitions.

## Capability-installation / driver-style hypothesis

Research whether the generated runtime Core can support bounded capability installation in a driver-like sense:

- stable core contracts define how capabilities attach;
- each capability contributes explicit contracts, dependencies, actions/events/data interfaces and evidence requirements;
- provider implementations satisfy those contracts;
- the build planner resolves a closed dependency set;
- optional capability code is omitted if not required;
- installation/materialization is deterministic and reproducible;
- removal/evolution runs impact analysis before pruning dependencies;
- client runtime autonomy is preserved after build.

Do not assume dynamic runtime installation is desirable. Research must distinguish build-time composition, deploy-time composition and runtime hot-plugging. The simplest safe model may be build-time materialization with controlled upgrades rather than arbitrary live installation.

## Runtime classes / presets hypothesis

Research whether ergonomic workload presets can help users express intent without becoming rigid editions, for example:

- Small Office;
- Standard Business;
- High Throughput;
- 24x7 Critical;
- Distributed Enterprise;
- Edge / Intermittent.

Such presets, if retained, must expand into explicit auditable requirements and remain overrideable. They must not become hidden pricing tiers or opaque architecture decisions.

## Complexity and risk integration

Cross-check this concept with Relative Operational Complexity / Metering research and with system semantic conflict/risk analysis.

Candidate measurable factors:

- direct and transitive capability count;
- number/diversity of providers;
- distributed state domains;
- external dependency count;
- peak concurrency and throughput;
- temporal coupling;
- shared mutable data;
- retry/compensation complexity;
- failure-domain crossings;
- authority/trust-zone crossings;
- availability/recovery obligations;
- observability gaps;
- migration complexity.

Complexity/risk scoring must explain dimensions rather than produce a single opaque number, and must not confuse higher workload with necessarily higher semantic complexity.

## Required research cross-checks

Revisit this hypothesis during at least:

- Build / Dependency Graph / Reproducibility;
- Artifact / Release / SBOM / Provenance;
- Deployment / Environment / Runtime;
- Provider / Binding / Capability Negotiation;
- Developer / Operator Experience / Self-hosting;
- Security / Resilience / Failure Recovery;
- Observability / Operations / Incident;
- Lifecycle / Versioning / Evolution / Migration;
- Universal Capability Architecture;
- Architecture Reconciliation as a Capability;
- Enterprise Completeness / Negative-Space Review.

External representatives should include strong examples from package/dependency resolution, software product lines, container/image assembly, declarative orchestration, autoscaling, workload scheduling, serverless/runtime sizing, provider/plugin architectures and other systems where semantic intent and operational realization are explicitly separated.

## Proof obligations to investigate

1. A five-capability low-load client produces a materially smaller dependency/runtime closure than a broader client, without losing required semantics.
2. Unselected optional capabilities are absent from the generated artifact/runtime where technically feasible.
3. Two clients with the same capability graph but different workload profiles can produce different valid runtime realizations.
4. Scaling a runtime does not mutate canonical business semantics.
5. A workload-profile revision can trigger a new realization plan with explicit diff, migration, rollback and evidence.
6. Provider replacement does not force unrelated capabilities into the runtime image.
7. Minimal closure remains deterministic and reproducible from authoritative inputs.
8. Build/image manifests can explain why every included component exists.
9. Removing a capability/provider proves no residual consumer/binding/state dependency remains before pruning.
10. Resource/topology optimizations remain constrained by declared SLO, security, recovery and data-residency requirements.
11. Runtime autonomy remains intact after the System Builder has produced the image.
12. Small systems retain simple-system ergonomics even though the Builder understands enterprise-scale realizations.

## Candidate discovery entries

Register for later synthesis/disposition, without automatic promotion:

- `G2-CAPABILITY-CANDIDATE-WORKLOAD-DRIVEN-RUNTIME-REALIZATION` — CROSS_CUTTING. Determine whether workload-driven realization is a standalone capability, a Deployment/Runtime subcapability or a synthesis of Build + Provider + Deployment + Observability concerns.
- `G2-CAPABILITY-CANDIDATE-MINIMAL-CAPABILITY-RUNTIME-CLOSURE` — CROSS_CUTTING. Determine ownership of deterministic capability/dependency closure and omission of unused runtime components.
- `G2-CAPABILITY-CANDIDATE-OPERATIONAL-PROFILE-SEPARATION` — CROSS_CUTTING. Determine whether operational/workload requirements require a stable first-class model orthogonal to SystemDefinition semantics.
- `G2-CAPABILITY-CANDIDATE-RUNTIME-REALIZATION-EVOLUTION` — CROSS_CUTTING. Determine ownership of same-semantics/different-topology evolution, migration, drainage and rollback.

## Promotion discipline

Do not promote the OS/kernel/driver analogy itself. Promote only evidence-backed primitives and boundaries. Specifically test whether:

- capability installation is truly analogous to packages/drivers or merely build-graph composition;
- provider bindings belong in the runtime image or can remain external references;
- operational profile belongs in SystemDefinition, a separate Deployment/Runtime definition, or another artifact;
- workload realization can remain provider-agnostic;
- minimal runtime closure is achievable across supported stacks without harming portability or autonomous runtime guarantees.

The research target is a coherent rule: **semantic breadth belongs to the Builder; runtime weight is determined by the client capability closure and workload obligations.**
