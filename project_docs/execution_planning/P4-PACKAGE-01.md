# P4-PACKAGE-01 — Durable Stateful Runtime and Capability Materialization

Status: READY_FOR_PACKAGE_REVIEW
Base: `18b9617f15c5a0329977c5470ba0c8bd054ef5e1` (P3 Integration & Technical Debt Review merged through PR #166)

## Package Goal

Evolve the bounded P3 in-memory state proof into a deterministic, PostgreSQL-backed generated Runtime slice with explicit migration ownership and capability-driven materialization, while preserving verified artifact delivery, external secret resolution, Builder/Runtime autonomy and Release/Environment/Deployment separation.

Target package proof:

`SystemDefinition capability -> Catalog -> AssemblyPlan -> ValidationEvidence -> Compiler-generated migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret refs -> SecretResolver -> Deploy migration preparation/application -> PostgreSQL-backed persistent Runtime -> generated state action -> clean restart/redeploy -> persisted state -> DeploymentRecord`

## Derivation authority

This package is derived from the merged `P3-PACKAGE-01` Integration & Technical Debt Review and the current WBS/DAG.

Highest-priority inputs:

- TD-P3-03 durable Runtime state/database + migrations — HIGH and the strongest successor direction;
- TD-P3-06 Runtime behavior generation remains a narrow hard-coded reference renderer — MEDIUM, coupled to the first real generated capability slice;
- WBS 8.1.1/8.1.2 deterministic schema/migration/code materialization;
- WBS 10.2.1/10.2.2 migration/dependency preparation and configured deployment;
- WBS 13.1.1/13.1.3 materialized actions/API with external configuration;
- Master Blueprint initial execution target: Node + Docker + PostgreSQL.

TD-P3-01 durable Artifact/Release/Catalog provider adapters, TD-P3-05 Catalog/Assembly dependency graph solving, TD-P3-02 production SecretResolver providers and TD-P3-04 production supervision remain high-priority debts but are not pulled into this package unless a committed Sprint proves one is necessary for the bounded durable-runtime proof.

## Forecast construction Sprints

### 1. P4-MIGRATION-STATE-01 — Deterministic State and Migration Materialization

Goal: establish a bounded provider-neutral durable-state/migration convention and make actual Compiler output carry deterministic migration assets for one narrow stateful capability without changing canonical Release/Environment/Deployment architecture.

Candidate TASKs:

- TASK-073 — define the bounded Runtime state-store/migration descriptor contract and explicit persistence/secret boundaries;
- TASK-074 — make Compiler materialize deterministic migration assets and runtime state requirements for the bounded capability;
- TASK-075 — extend verified artifact retrieval/Deploy preflight evidence through migration discovery, integrity and deterministic ordering without applying production infrastructure yet.

Expected exit proof:

`AssemblyPlan bounded capability -> Compiler -> migration/runtime assets -> ReleaseArtifact -> verified ArtifactPayload -> Deploy migration preflight`

Authority notes: provider-neutral internal/module contracts may be L2/L3 and must be explicitly bounded by the committed Sprint. Any canonical public schema or Builder/Runtime architecture change is L4 and requires ADR.

### 2. P4-POSTGRES-STATE-01 — PostgreSQL Durable Runtime State

Goal: implement the first replaceable PostgreSQL-backed Runtime state adapter, apply the generated migration before activation and prove state survives a controlled Runtime restart/redeploy.

Candidate TASKs:

- TASK-076 — implement a bounded PostgreSQL state adapter behind the Runtime state boundary using externally supplied connection configuration;
- TASK-077 — integrate Deploy migration application before Runtime activation with idempotent/failure behavior and no resolved-secret leakage;
- TASK-078 — prove persistent state across clean stop/start or equivalent bounded redeploy using actual PostgreSQL in deterministic CI.

Expected exit proof:

`verified ArtifactPayload + EnvironmentProfile database secret ref -> SecretResolver -> migration apply -> PostgreSQL -> persistent Runtime -> state action -> stop -> restart -> prior state retained`

Authority notes: PostgreSQL is the canonical initial target topology, but production secret-manager providers, broad database provisioning and production supervisor ownership remain non-goals.

### 3. P4-CAPABILITY-RUNTIME-01 — Capability-Driven Durable Runtime Slice

Goal: replace the P3 hard-coded counter proof with one narrow action selected/materialized from actual SystemDefinition/Catalog/Assembly inputs and execute it against the durable Runtime state path.

Candidate TASKs:

- TASK-079 — define/revalidate the minimum capability metadata needed for one deterministic durable Runtime action without introducing a general dependency solver;
- TASK-080 — propagate the selected capability through Assembly/Compiler into generated migration/runtime behavior instead of a fixed proof route;
- TASK-081 — extend the full autonomous E2E from SystemDefinition capability through verified artifact, migration, PostgreSQL-backed Runtime action and persisted post-restart state, including negative migration/capability/secret evidence.

Expected exit proof:

`SystemDefinition capability -> Catalog -> AssemblyPlan -> Compiler-generated durable action + migration -> verified ArtifactPayload -> Deploy -> PostgreSQL-backed autonomous Runtime -> action -> restart -> persisted state -> DeploymentRecord`

Authority notes: shared capability metadata is potentially L3 and must be explicitly authorized/reviewed by the committed Sprint. Recursive dependency solving, semantic-version ranges, conflicts and alternatives remain outside this package unless required by the bounded capability.

## Growing E2E proof

The package must preserve the existing integrated chain and extend it incrementally using actual executable producers where they exist.

Required package-level evidence by the end of the third construction Sprint:

1. deterministic migration assets are produced by actual Compiler output and covered by ReleaseArtifact integrity;
2. migration payload is verified before application and failure does not produce false deployment success;
3. database connection secrets remain symbolic in durable contracts and resolved values remain runtime/deploy-only;
4. migration application is deterministic/idempotent for the bounded schema;
5. Runtime state is backed by PostgreSQL rather than process memory;
6. state survives a controlled Runtime restart/redeploy;
7. one Runtime action is materially derived from actual SystemDefinition/Catalog/Assembly capability inputs rather than an unconditional hard-coded route;
8. Builder/Observe unavailability does not block ordinary Runtime database/action operation;
9. deterministic identities remain stable where contract semantics require determinism.

## Explicit non-goals

- durable production adapters for Catalog, ReleaseRegistry or ArtifactPayloadRepository;
- general Catalog/Assembly dependency graph/range/conflict solving;
- production Vault/cloud/on-prem SecretResolver adapters and rotation;
- Docker/Vercel/on-prem production supervisor/traffic/TLS/rollback implementation;
- broad generated CRUD/entities/workflows/auth/session/permissions/UI;
- database fleet provisioning, HA, backup/restore or production operations;
- Observe/Support implementation;
- changing accepted Builder/Runtime or Release/Environment/Deployment architecture.

## Dependency order

`P3 package review merged -> P4-MIGRATION-STATE-01 -> P4-POSTGRES-STATE-01 -> P4-CAPABILITY-RUNTIME-01 -> Integration & Technical Debt Review`

Candidate TASK order:

`TASK-073 -> TASK-074 -> TASK-075 -> TASK-076 -> TASK-077 -> TASK-078 -> TASK-079 -> TASK-080 -> TASK-081`

## Package rules

- this document is rolling-wave forecast, not construction authorization;
- no TASK spec is materialized by this package plan; candidate TASKs must be revalidated/materialized when their Sprint becomes committed;
- only the first construction Sprint may become committed after this package is reviewed/merged and repository state is re-read;
- every implementation TASK must declare positive, negative/failure and predecessor-integration evidence where applicable;
- one distinct implementation commit per committed TASK inside its Sprint branch;
- every construction Sprint must extend the real integrated/E2E proof;
- L3 shared-contract work requires explicit Sprint authority/review;
- L4 discoveries stop for ADR;
- `npm run verify` remains the default package-plan/final repository validation unless a committed Sprint declares stricter validation;
- AgentFactory remains frozen/non-blocking unless repository authority reactivates it.

## Review gate

Stop after this package plan is committed, CI-validated and opened for review. Do not create or execute `P4-MIGRATION-STATE-01` until this package plan is merged and a new explicit execution instruction is received.
