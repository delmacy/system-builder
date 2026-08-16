# P4-PACKAGE-01 — Durable Stateful Runtime and Capability Materialization

Status: ACTIVE / INTEGRATION_REVIEW_READY_FOR_FINAL_CI
Base: `5f628b7c72f9e9fc0db799e0bd97b2d1997b1572` (package plan merged through PR #167)
Construction merged through: `0f0cc70511dbb1510bbc37c31ecb6f7b9998c8f9` (PR #171)

## Package Goal

Evolve the bounded P3 in-memory state proof into a deterministic, PostgreSQL-backed generated Runtime slice with explicit migration ownership and capability-driven materialization, while preserving verified artifact delivery, external secret resolution, Builder/Runtime autonomy and Release/Environment/Deployment separation.

Target package proof:

`SystemDefinition capability -> Catalog -> AssemblyPlan -> ValidationEvidence -> Compiler-generated migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret refs -> SecretResolver -> Deploy migration preparation/application -> PostgreSQL-backed persistent Runtime -> generated state action -> clean restart/redeploy -> persisted state -> DeploymentRecord`

## Construction status

### 1. P4-MIGRATION-STATE-01
Status: MERGED through PR #168.

### 2. P4-POSTGRES-STATE-01
Status: MERGED through PR #169.

### 3. P4-CAPABILITY-RUNTIME-01
Status: MERGED through PR #170 + completion/recovery PR #171.

Merged exit proof:
`SystemDefinition state.counter -> Catalog selected reference provider -> AssemblyPlan -> ValidationEvidence -> Compiler-derived state implementation -> ReleaseArtifact -> verified ArtifactPayload -> Deploy migration apply -> PostgreSQL Runtime -> durable action -> clean redeploy -> persisted result`

### 4. Integration & Technical Debt Review
Status: REVIEW_HEAD_CI_PASS / FINAL_CI_PENDING.

Branch: `review/P4-PACKAGE-01-integration-debt`.

PR: #172.

Review document: `project_docs/execution_planning/P4-PACKAGE-01.integration-debt-review.md`.

Review-head Deterministic CI #249: PASS.

Provisional disposition:
- construction: PASS;
- architecture/boundaries: PASS WITH DEBT;
- rollback blocker: none found;
- successor readiness: ready to plan only after review merge and fresh repository revalidation.

## Architecture constraints

- ADR-0002 Builder/Runtime separation remains mandatory;
- ADR-0007 Release/Environment/Deployment separation remains mandatory;
- resolved secret values remain outside immutable artifact/release/deployment evidence;
- migrations/runtime behavior are deterministic products of accepted inputs;
- PostgreSQL is an initial target provider, not shared-contract policy;
- canonical contract or L4 discoveries require explicit authority/ADR.

## Review debt priorities

High:
- Catalog/Assembly dependency graph/range/conflict solving;
- durable Catalog/Release/Artifact provider adapters;
- production PostgreSQL auth/TLS and migration coordination;
- production SecretResolver providers/lifecycle;
- production Runtime supervision/traffic/TLS/rollback.

Medium-High:
- scalable deterministic capability materializer registration before capability breadth grows.

Low-Medium:
- operational DeploymentRecord timing/executor/active-version semantics.

Governance:
- prevent Sprint PR merge before closure-head CI and final Sprint Report after the PR #170/#171 recovery.

## Package gate

Require final Deterministic CI PASS on PR #172, then stop at the human P4 package Review Gate.

No successor Sprint Package or construction Sprint may be created by this review. Successor planning requires the review to merge plus a new explicit instruction and repository revalidation.
