# P4-PACKAGE-01 — Durable Stateful Runtime and Capability Materialization

Status: ACTIVE / SPRINT_1_REVIEW
Base: `5f628b7c72f9e9fc0db799e0bd97b2d1997b1572` (package plan merged through PR #167)

## Package Goal

Evolve the bounded P3 in-memory state proof into a deterministic, PostgreSQL-backed generated Runtime slice with explicit migration ownership and capability-driven materialization, while preserving verified artifact delivery, external secret resolution, Builder/Runtime autonomy and Release/Environment/Deployment separation.

Target package proof:

`SystemDefinition capability -> Catalog -> AssemblyPlan -> ValidationEvidence -> Compiler-generated migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret refs -> SecretResolver -> Deploy migration preparation/application -> PostgreSQL-backed persistent Runtime -> generated state action -> clean restart/redeploy -> persisted state -> DeploymentRecord`

## Construction status

### 1. P4-MIGRATION-STATE-01 — Deterministic State and Migration Materialization

Status: IMPLEMENTED / SPRINT REVIEW.

Achieved proof:

`AssemblyPlan bounded capability -> Compiler -> migration/runtime assets -> ReleaseArtifact -> verified ArtifactPayload -> Deploy migration preflight`

TASK-073..075 are implemented on `sprint/P4-MIGRATION-STATE-01`; implementation-head Deterministic CI #235 PASS. SQL application/PostgreSQL connectivity remain deliberately outside this Sprint.

### 2. P4-POSTGRES-STATE-01 — PostgreSQL Durable Runtime State

Status: FORECAST / NOT AUTHORIZED.

Goal: implement the first replaceable PostgreSQL-backed Runtime state adapter, apply generated migration before activation and prove state survives a controlled Runtime restart/redeploy.

Candidate TASKs remain TASK-076..078 and must be re-derived from merged Sprint-1 outputs before commitment.

### 3. P4-CAPABILITY-RUNTIME-01 — Capability-Driven Durable Runtime Slice

Status: FORECAST / NOT AUTHORIZED.

Goal: replace the hard-coded counter proof with one narrow action selected/materialized from actual SystemDefinition/Catalog/Assembly inputs and execute it against the durable Runtime state path.

Candidate TASKs remain TASK-079..081 and must be re-derived from real predecessor outputs.

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

- durable Catalog/Release/Artifact provider adapters;
- general Catalog/Assembly dependency graph/range/conflict solving;
- production SecretResolver providers/lifecycle;
- production Runtime supervision/traffic/TLS/rollback;
- broad generated entities/workflows/auth/UI.

## Package gate

Stop at P4-MIGRATION-STATE-01 Sprint Review. `P4-POSTGRES-STATE-01` remains forecast until Sprint-1 merges, repository authority is re-read and a new explicit instruction authorizes successor materialization/execution.
