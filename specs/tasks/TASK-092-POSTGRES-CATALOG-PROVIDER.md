---
id: TASK-092
title: Implement PostgreSQL reference Software Catalog provider
status: ready
priority: 400
milestone: M7
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-091
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P6-PACKAGE-01.md
  - project_docs/execution_planning/P6-DURABLE-CATALOG-01.md
  - project_docs/05-catalog/WBS.md
  - packages/catalog/index.ts
  - packages/catalog/storage.ts
  - tests/product/catalog-registry.test.ts
  - tests/product/catalog-resolution.test.ts
  - .github/workflows/ci.yml
  - packages/runtime-core/postgres-state.ts
  - specs/tasks/TASK-076-POSTGRES-RUNTIME-STATE-ADAPTER.md
  - specs/tasks/TASK-078-POSTGRES-RESTART-PERSISTENCE-E2E.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-091-CATALOG-PERSISTENCE-BOUNDARY.md
  - specs/tasks/TASK-092-POSTGRES-CATALOG-PROVIDER.md
allowed_paths:
  - packages/catalog/storage.ts
  - packages/catalog/postgres.ts
  - tests/product/catalog-postgres.test.ts
  - package.json
  - package-lock.json
  - specs/tasks/TASK-092-POSTGRES-CATALOG-PROVIDER.md
forbidden_paths:
  - packages/catalog/index.ts
  - packages/assembly/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/deploy/**
  - packages/runtime-core/**
  - apps/**
  - tooling/agent-harness/**
  - docs/adr/**
  - .github/**
max_files: 6
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Implement one replaceable PostgreSQL-backed reference provider for the Catalog-internal persistence boundary created by TASK-091 and prove durable record persistence/reload without changing the current public Software Catalog semantics.

# Context

TASK-091 makes storage replaceable while preserving the default in-memory path. P6 requires a real durable provider, and repository CI already provisions PostgreSQL 17.6 via `SYSTEM_BUILDER_TEST_POSTGRES_URL`. P4 contains bounded PostgreSQL transport precedent, but Runtime/Deploy implementation details are read-only context and are not a Catalog contract.

PostgreSQL is only the reference durable provider for this Sprint. Catalog consumers must continue to depend on Catalog semantics, not database-specific APIs.

# Current behavior

After TASK-091, the registry can operate through an internal storage boundary, but only the in-memory provider survives. Reconstructing the process/provider loses registered Catalog records.

# Required change

Add a Catalog-owned PostgreSQL provider that persists and reconstructs the complete normalized Software Catalog record needed by current registry/list/resolution behavior. Provider schema and transport details must remain internal and deterministic.

Use the existing CI PostgreSQL service for objective product evidence. If a Builder-side PostgreSQL driver dependency is necessary, only `package.json` and `package-lock.json` are authorized for that dependency; do not modify workflow configuration or expose the driver/provider through canonical contracts. Prefer bounded, conventional database access over duplicating Runtime-specific generated transport code.

# Inputs / contracts

TASK-091 internal Catalog storage boundary; current normalized `SoftwareCatalogRecord` semantics; `catalogIdentity`; structured dependency requirements; exact/minimum constraint data; compatibility data; CI `SYSTEM_BUILDER_TEST_POSTGRES_URL`; WBS 05 provider-neutral authority.

# Outputs / contracts

Catalog-internal PostgreSQL persistence provider and focused PostgreSQL product evidence. No change to `packages/catalog/index.ts`, Assembly, canonical contracts or downstream Factory APIs.

# Acceptance criteria

- PostgreSQL provider implements the TASK-091 internal persistence semantics without requiring changes to the public Catalog entrypoint;
- all normalized record data required by current list/resolution behavior persists and reloads equivalently, including dependencies, dependency requirements, version constraints and compatibility maps;
- provider reconstruction against the same database returns deterministic record ordering/equivalent values;
- duplicate exact identity across provider reconstruction is rejected with the same Catalog duplicate behavior expected by the registry/storage boundary;
- provider initialization/schema setup is idempotent for the bounded test lifecycle;
- database failures surface sanitized Catalog/provider diagnostics and do not echo the full connection URL or resolved credential material;
- tests use `SYSTEM_BUILDER_TEST_POSTGRES_URL` and do not silently claim durable proof when the database is absent from the objective CI environment;
- no richer Catalog policy, Assembly semantic, Runtime, Deploy, Release, ArtifactStore or canonical contract change is introduced;
- PostgreSQL remains replaceable implementation detail rather than a required Catalog consumer contract;
- declared validations pass.

# Non-goals

Production TLS/SCRAM/rotation/pooling completeness, distributed Catalog concurrency policy, multi-database support, richer provider selection, Release/Artifact persistence, production migrations framework or Runtime state work.

# Evidence expected

Actual PostgreSQL 17.6 product test proving persist -> provider reconstruction -> deterministic reload plus duplicate/failure behavior, predecessor Catalog tests and repository-wide Deterministic CI.

# Escalation

Stop if implementation requires changing `packages/catalog/index.ts`, public Catalog shapes/semantics, Assembly, canonical contracts, CI workflow configuration, Runtime/Deploy code, or an L4 architecture boundary. Escalate if the only viable database approach would make PostgreSQL mandatory for ordinary Catalog consumers.
