# P4-PACKAGE-01 — Durable Stateful Runtime and Capability Materialization

Status: ACTIVE / SPRINT_3_COMMITTED
Base: `5f628b7c72f9e9fc0db799e0bd97b2d1997b1572` (package plan merged through PR #167)

## Package Goal

Evolve the bounded P3 in-memory state proof into a deterministic, PostgreSQL-backed generated Runtime slice with explicit migration ownership and capability-driven materialization, while preserving verified artifact delivery, external secret resolution, Builder/Runtime autonomy and Release/Environment/Deployment separation.

Target package proof:

`SystemDefinition capability -> Catalog -> AssemblyPlan -> ValidationEvidence -> Compiler-generated migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret refs -> SecretResolver -> Deploy migration preparation/application -> PostgreSQL-backed persistent Runtime -> generated state action -> clean restart/redeploy -> persisted state -> DeploymentRecord`

## Construction status

### 1. P4-MIGRATION-STATE-01
Status: MERGED through PR #168.

### 2. P4-POSTGRES-STATE-01
Status: MERGED through PR #169 at `349231aa982048f2ce4507432032e3d32c160339`.

Integrated proof:
`verified ArtifactPayload -> migration preflight -> SecretResolver -> PostgreSQL migration apply -> autonomous generated Runtime -> persisted state 1 -> 2 -> clean shutdown -> redeploy -> migration skip -> persisted state 3 -> 4`

### 3. P4-CAPABILITY-RUNTIME-01 — Capability-Driven Durable Runtime Slice
Status: COMMITTED / ACTIVE.

Goal: replace the bounded hard-coded/caller-driven counter proof with one narrow action selected/materialized from actual SystemDefinition/Catalog/Assembly inputs and execute it against the durable Runtime state path.

Committed TASKs: TASK-079 -> TASK-080 -> TASK-081.

Exit proof:
`SystemDefinition state.counter -> Catalog selected reference provider -> AssemblyPlan -> ValidationEvidence -> Compiler-derived state implementation -> ReleaseArtifact -> verified ArtifactPayload -> Deploy migration apply -> PostgreSQL Runtime -> durable action -> clean redeploy -> persisted result`

### 4. Integration & Technical Debt Review
Status: FORECAST / NOT AUTHORIZED IN THIS SPRINT.

## Architecture constraints

- ADR-0002 Builder/Runtime separation remains mandatory;
- ADR-0007 Release/Environment/Deployment separation remains mandatory;
- resolved secret values remain outside immutable artifact/release/deployment evidence;
- migrations/runtime behavior are deterministic products of accepted inputs;
- PostgreSQL is an initial target provider, not shared-contract policy;
- canonical contract or L4 discoveries require explicit authority/ADR.

## Deferred package debt

- production PostgreSQL auth/TLS/provisioning/HA/backup and concurrent migration coordination;
- durable Catalog/Release/Artifact provider adapters;
- general Catalog/Assembly dependency graph/range/conflict solving;
- production SecretResolver providers/lifecycle;
- production Runtime supervision/traffic/TLS/rollback;
- broad generated entities/workflows/auth/UI.

## Package gate

Execute only P4-CAPABILITY-RUNTIME-01. After its Sprint Review/merge, the mandatory Integration & Technical Debt Review requires a new explicit instruction and repository revalidation.
