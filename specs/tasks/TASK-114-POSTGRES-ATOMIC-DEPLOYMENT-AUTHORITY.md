---
id: TASK-114
title: Implement PostgreSQL atomic activation CAS
status: completed
priority: 396
milestone: M9
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-113
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P8-PACKAGE-01.md
  - project_docs/execution_planning/P8-ATOMIC-DEPLOYMENT-AUTHORITY-01.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/index.ts
  - packages/deploy/storage.ts
  - packages/deploy/postgres-state.ts
  - tests/product/deploy-postgres.test.ts
  - specs/tasks/TASK-113-ATOMIC-DEPLOYMENT-ACTIVATION-BOUNDARY.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-114-POSTGRES-ATOMIC-DEPLOYMENT-AUTHORITY.md
allowed_paths:
  - packages/deploy/postgres-state.ts
  - tests/product/deploy-postgres.test.ts
  - specs/tasks/TASK-114-POSTGRES-ATOMIC-DEPLOYMENT-AUTHORITY.md
forbidden_paths:
  - packages/contracts/**
  - packages/catalog/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/runtime-core/**
  - packages/deploy/index.ts
  - packages/deploy/storage.ts
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

Implement the TASK-113 atomic activation seam in the Deploy PostgreSQL reference provider using one transaction and database-enforced compare-and-set semantics.

# Context

TASK-113 defines the additive atomic activation API. Sprint 1 already provides authenticated transaction-capable PostgreSQL execution. `TD-P7-01` remains because DeploymentRecord persistence and active-pointer mutation are not one multi-writer-safe authority transition.

# Current behavior

The provider now has an atomic activation path that serializes authority mutation in PostgreSQL. Legacy synchronous setters remain for predecessor compatibility and are not used by the new atomic API.

# Required change

Persist the candidate record and evaluate/update the environment active pointer atomically. Serialize the environment authority in PostgreSQL so a stale expected-active value cannot overwrite a newer winner. Failed candidates remain durable history but never replace active authority.

# Inputs / contracts

TASK-113 atomic activation seam, existing PostgreSQL tables/provider, authenticated transaction substrate.

# Outputs / contracts

A PostgreSQL implementation that returns the same deterministic atomic activation result semantics while remaining internal to Deploy.

# Acceptance criteria

- record history and active-pointer decision occur in one transaction for atomic activation;
- concurrent writers are serialized by PostgreSQL rather than a process-local Promise queue alone;
- expected-active mismatch returns stale evidence and does not update active authority;
- candidate record history remains durable without producing torn record/pointer state;
- failed candidates cannot become active;
- reconstruction observes the authoritative winner;
- secret-safe diagnostics preserved;
- no storage/API contract expansion beyond TASK-113;
- declared validations pass.

# Non-goals

Cross-context PostgreSQL consolidation, distributed fleet orchestration, traffic rollback, schema migration framework, Sprint 3 E2E.

# Evidence expected

Authenticated PostgreSQL product tests covering CAS success, stale rejection, failed candidate behavior and reconstruction.

# Escalation

Stop if implementation requires another bounded context, canonical contract changes, destructive migration or changing TASK-113 semantics.
