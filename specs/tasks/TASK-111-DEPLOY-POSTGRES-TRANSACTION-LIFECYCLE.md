---
id: TASK-111
title: Add bounded Deploy PostgreSQL transaction lifecycle
status: ready
priority: 399
milestone: M9
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-110
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P8-PACKAGE-01.md
  - project_docs/execution_planning/P8-DEPLOY-POSTGRES-TRANSPORT-01.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/postgres-state.ts
  - packages/deploy/storage.ts
  - tests/product/deploy-postgres.test.ts
  - specs/tasks/TASK-110-DEPLOY-POSTGRES-AUTH-TRANSPORT.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-111-DEPLOY-POSTGRES-TRANSACTION-LIFECYCLE.md
allowed_paths:
  - packages/deploy/postgres-state.ts
  - tests/product/deploy-postgres.test.ts
  - specs/tasks/TASK-111-DEPLOY-POSTGRES-TRANSACTION-LIFECYCLE.md
forbidden_paths:
  - packages/contracts/**
  - packages/catalog/**
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

Make the hardened Deploy PostgreSQL transport transaction-capable with a bounded connection/timeout/cancellation lifecycle suitable as the substrate for the forecast atomic-authority Sprint.

# Context

TASK-110 adds authenticated transport. P8 Sprint 2 will require atomic compare-and-set semantics, but this Sprint must first prove the reference provider can run bounded transactional operations without changing DeploymentRegistry semantics.

# Current behavior

The provider executes one simple query per connection and relies on separate operations for related storage work. It has a fixed timeout that destroys the socket, but no explicit transaction helper or transaction failure proof.

# Required change

Refactor the Deploy-local PostgreSQL execution path to support an ordered transaction batch using one connection and PostgreSQL `BEGIN`/`COMMIT`, with failure causing connection teardown/rollback rather than partial success. Keep the reference lifecycle intentionally bounded: no shared pool or cross-context manager is introduced; each operation owns one connection, one timeout and deterministic teardown.

Use the transaction path for an existing logically grouped provider operation where safe (for example schema initialization) so transaction capability is exercised by production provider code without changing public storage semantics.

# Inputs / contracts

TASK-110 authenticated transport, existing `DeploymentRecordStorage`, PostgreSQL 17.6 and P8 package authority.

# Outputs / contracts

Deploy-internal transaction-capable execution and focused commit/rollback evidence. No new public contract.

# Acceptance criteria

- transaction helper executes ordered statements on one authenticated connection;
- successful transaction commits all intended statements;
- a failing statement cannot leave later statements applied and connection teardown causes rollback of the open transaction;
- timeout/error paths deterministically destroy the operation connection;
- reference provider lifecycle remains bounded and leak-free without introducing a shared pool;
- existing deployment persistence/reconstruction tests remain green;
- no DeploymentRegistry/DeploymentRecord semantic change;
- positive, negative and predecessor integration tests pass;
- declared validations pass.

# Non-goals

CAS/multi-writer activation, retry policy, cross-context connection pooling, production traffic orchestration or canonical contracts.

# Evidence expected

Product tests proving transaction commit and rollback behavior through the Deploy-local PostgreSQL executor plus repository verification.

# Escalation

Stop if transaction capability requires changing `DeploymentRecordStorage`, public Deploy semantics, another bounded context, CI workflow or architecture ownership.
