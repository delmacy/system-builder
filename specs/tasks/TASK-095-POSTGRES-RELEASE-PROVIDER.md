---
id: TASK-095
title: Implement PostgreSQL reference Release provider
status: completed
priority: 403
milestone: M7
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-094
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P6-PACKAGE-01.md
  - project_docs/execution_planning/P6-DURABLE-RELEASE-ARTIFACT-01.md
  - project_docs/09-release/WBS.md
  - packages/release/index.ts
  - packages/release/storage.ts
  - tests/product/release.test.ts
  - packages/catalog/postgres.ts
  - specs/tasks/TASK-092-POSTGRES-CATALOG-PROVIDER.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-094-RELEASE-PERSISTENCE-BOUNDARY.md
  - specs/tasks/TASK-095-POSTGRES-RELEASE-PROVIDER.md
allowed_paths:
  - packages/release/storage.ts
  - packages/release/postgres.ts
  - tests/product/release-postgres.test.ts
  - specs/tasks/TASK-095-POSTGRES-RELEASE-PROVIDER.md
forbidden_paths:
  - packages/release/index.ts
  - packages/artifact-store/**
  - packages/compiler/**
  - packages/deploy/**
  - packages/runtime-core/**
  - packages/catalog/**
  - packages/assembly/**
  - packages/contracts/**
  - apps/**
  - tooling/agent-harness/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 4
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Implement one replaceable PostgreSQL-backed reference provider for the Release persistence boundary created by TASK-094 and prove PublishedRelease metadata/lifecycle survives provider reconstruction without changing public Release semantics.

# Context

TASK-094 establishes the Release-owned persistence seam while preserving the current public `ReleaseRegistry` behavior. This TASK adds only a PostgreSQL reference provider behind that seam. WBS 09.3.1 and ADR-0007 control durable publication and Release/Environment separation; the existing Catalog PostgreSQL transport is implementation precedent only and does not become a shared public contract.

# Current behavior

After TASK-094, ReleaseRegistry is storage-backed but only the in-memory provider survives. Published releases and lifecycle state are lost when the provider/process is reconstructed.

# Required change

Add a Release-owned PostgreSQL provider that persists and reconstructs complete PublishedRelease records required by current publish/get/transition behavior. Schema/transport details remain internal. Reuse bounded repository PostgreSQL precedent as read-only implementation guidance without making Catalog transport a Release contract.

# Inputs / contracts

TASK-094 Release storage boundary; current PublishedRelease shape; duplicate identity semantics; lifecycle transitions; CI `SYSTEM_BUILDER_TEST_POSTGRES_URL`; WBS 09; ADR-0007.

# Outputs / contracts

Release-internal PostgreSQL persistence provider and focused PostgreSQL product evidence. No change to `packages/release/index.ts` or downstream Factory APIs.

# Acceptance criteria

- PostgreSQL provider implements TASK-094 storage semantics without public Release changes;
- releaseId/version/artifactRef/artifactHash/validationEvidenceRef/publishedAt/status persist and reload equivalently;
- provider reconstruction returns equivalent immutable release records;
- duplicate identity after reconstruction remains rejected through the unchanged registry behavior;
- persisted lifecycle state survives reconstruction and only existing transitions remain valid;
- schema initialization is idempotent for bounded test lifecycle;
- database failures expose sanitized diagnostics without connection credential leakage;
- tests use `SYSTEM_BUILDER_TEST_POSTGRES_URL` for objective proof;
- no secrets/environment values are persisted as Release metadata;
- no ArtifactStore/Compiler/Deploy/Runtime/canonical-contract change is introduced;
- declared validations pass.

# Non-goals

Production TLS/SCRAM/rotation/pooling, distributed concurrency policy, richer lifecycle/promotion semantics, artifact payload storage, Deploy/Runtime work or destructive migration framework.

# Evidence expected

Actual PostgreSQL 17.6 product tests proving publish -> flush -> provider reconstruction -> equivalent get/lifecycle plus duplicate/failure behavior and full repository verification.

# Escalation

Stop if implementation requires changing `packages/release/index.ts`, public Release semantics, ArtifactStore/Compiler/Deploy/Runtime, canonical contracts, CI workflow or makes PostgreSQL mandatory for ordinary Release consumers.
