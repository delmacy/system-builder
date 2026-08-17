---
id: TASK-102
title: Implement PostgreSQL deployment state provider
status: ready
priority: 408
milestone: M8
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-101
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P7-PACKAGE-01.md
  - project_docs/execution_planning/P7-DURABLE-DEPLOYMENT-STATE-01.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/index.ts
  - packages/deploy/storage.ts
  - packages/release/postgres.ts
  - tests/product/release-postgres.test.ts
  - specs/tasks/TASK-101-DEPLOYMENT-STATE-BOUNDARY.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-102-POSTGRES-DEPLOYMENT-STATE.md
allowed_paths:
  - packages/deploy/postgres-state.ts
  - tests/product/deploy-postgres.test.ts
  - specs/tasks/TASK-102-POSTGRES-DEPLOYMENT-STATE.md
forbidden_paths:
  - packages/contracts/**
  - packages/catalog/**
  - packages/assembly/**
  - packages/compiler/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/runtime-core/**
  - packages/deploy/index.ts
  - packages/deploy/storage.ts
  - packages/deploy/local-deployment.ts
  - packages/deploy/local-process.ts
  - apps/**
  - tooling/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Implement a bounded PostgreSQL reference provider for the Deploy-owned state boundary from TASK-101.

# Context

TASK-101 establishes the provider-neutral Deploy state seam. P7 requires one restart-safe reference provider to prove WBS 10.3 operational state across process/provider reconstruction.

# Current behavior

After TASK-101, deployment history and active pointers can be owned by an in-memory `DeploymentRecordStorage`, but state still disappears with the process.

# Required change

Persist and reconstruct DeploymentRecord history plus the active deployment pointer per environment using PostgreSQL 17.6 in CI. Keep provider details internal to Deploy and preserve the in-memory path.

# Inputs / contracts

TASK-101 `DeploymentRecordStorage`, existing immutable DeploymentRecord semantics, PostgreSQL 17.6 CI service, and the bounded reference-provider pattern already used by Release persistence.

# Outputs / contracts

A Deploy-owned PostgreSQL storage implementation conforming exactly to the TASK-101 boundary, plus focused provider tests. No cross-context or canonical contract is added.

# Acceptance criteria

- provider implements the TASK-101 storage contract without changing it;
- schema initialization is bounded and idempotent;
- DeploymentRecord snapshots reconstruct equivalently after reopening the provider;
- active environment pointer reconstructs equivalently;
- deterministic ordering and failed-record history are preserved;
- malformed stored state or invalid provider configuration fails closed with sanitized diagnostics;
- connection material never appears in DeploymentRecord or active-state evidence;
- no production TLS/auth/pooling claim is introduced;
- declared validations pass.

# Non-goals

Shared PostgreSQL transport extraction, TLS/SCRAM/pooling, fleet concurrency, traffic routing, rollback orchestration or cross-context contract changes.

# Evidence expected

PostgreSQL-backed product tests under the existing CI service plus repository verification.

# Escalation

Stop if implementation requires a canonical contract change, modifying another bounded context, new external dependency, CI workflow change or production transport policy.