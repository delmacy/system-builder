# P4-PACKAGE-01 — Durable Stateful Runtime and Capability Materialization

Status: ACTIVE / SPRINT_2_REVIEW
Base: `5f628b7c72f9e9fc0db799e0bd97b2d1997b1572` (package plan merged through PR #167)

## Package Goal

Evolve the bounded P3 in-memory state proof into a deterministic, PostgreSQL-backed generated Runtime slice with explicit migration ownership and capability-driven materialization, while preserving verified artifact delivery, external secret resolution, Builder/Runtime autonomy and Release/Environment/Deployment separation.

Target package proof:

`SystemDefinition capability -> Catalog -> AssemblyPlan -> ValidationEvidence -> Compiler-generated migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret refs -> SecretResolver -> Deploy migration preparation/application -> PostgreSQL-backed persistent Runtime -> generated state action -> clean restart/redeploy -> persisted state -> DeploymentRecord`

## Construction status

### 1. P4-MIGRATION-STATE-01 — Deterministic State and Migration Materialization

Status: MERGED through PR #168.

Integrated proof:

`AssemblyPlan bounded capability -> Compiler -> migration/runtime assets -> ReleaseArtifact -> verified ArtifactPayload -> Deploy migration preflight`

### 2. P4-POSTGRES-STATE-01 — PostgreSQL Durable Runtime State

Status: IMPLEMENTED / SPRINT REVIEW on PR #169.

Achieved branch proof:

`verified ArtifactPayload -> migration preflight -> SecretResolver -> PostgreSQL migration apply -> autonomous generated Runtime -> persisted state 1 -> 2 -> clean shutdown -> redeploy -> migration skip -> persisted state 3 -> 4`

TASK-076..078 are implemented with objective CI through #240 PASS; final closure-head CI remains the Sprint Review gate.

### 3. P4-CAPABILITY-RUNTIME-01 — Capability-Driven Durable Runtime Slice

Status: FORECAST / NOT AUTHORIZED.

Goal: replace the bounded hard-coded counter proof with one narrow action selected/materialized from actual SystemDefinition/Catalog/Assembly inputs and execute it against the durable Runtime state path.

Candidate TASKs TASK-079..081 must be re-derived from merged Sprint-2 outputs. They are not construction authority.

### 4. Integration & Technical Debt Review

Status: FORECAST.

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

Stop at P4-POSTGRES-STATE-01 Sprint Review. `P4-CAPABILITY-RUNTIME-01` remains forecast until Sprint-2 merges, repository authority is re-read and a new explicit instruction authorizes successor materialization/execution.
