---
id: TASK-106
title: Prove durable rollback evidence across PostgreSQL reconstruction
status: ready
priority: 404
milestone: M8
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-105
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P7-PACKAGE-01.md
  - project_docs/execution_planning/P7-DEPLOYMENT-ROLLBACK-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/deploy/index.ts
  - packages/deploy/storage.ts
  - packages/deploy/postgres-state.ts
  - tests/product/deploy-postgres.test.ts
  - tests/product/deployment-rollback.test.ts
  - specs/tasks/TASK-104-DEPLOYMENT-ACTIVATION-DECISION.md
  - specs/tasks/TASK-105-DEPLOYMENT-ROLLBACK-EVIDENCE.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-106-DURABLE-ROLLBACK-RECONSTRUCTION.md
allowed_paths:
  - tests/product/deployment-rollback-postgres.test.ts
  - specs/tasks/TASK-106-DURABLE-ROLLBACK-RECONSTRUCTION.md
forbidden_paths:
  - packages/**
  - apps/**
  - tooling/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Prove the Sprint exit chain across PostgreSQL provider/process reconstruction: active A, failed candidate B, durable history, retained active A, and deterministic rollback/retention evidence.

# Context

Sprint 1 made deployment state reconstructible. TASK-104 makes activation/retention decisions explicit and TASK-105 proves acceptance failure with the in-memory path. The Sprint closes only when the same authority survives provider reconstruction under PostgreSQL 17.6 CI.

# Current behavior

The durable provider reconstructs DeploymentRecord history and the active pointer, but rollback/retention evidence has not yet been revalidated from reconstructed state after a failed candidate attempt.

# Required change

Add evidence-only PostgreSQL product tests that create A and failing B from actual `dryRunDeploy`, evaluate them through the activation decision API backed by `PostgresDeploymentRecordStorage`, flush/close, reconstruct the provider and registry, and verify A remains active while failed B remains history. Re-evaluating the identical failed B after reconstruction must yield equivalent deterministic retention evidence.

# Inputs / contracts

Existing `dryRunDeploy`, TASK-104 activation decision API, TASK-102 PostgreSQL deployment state provider, PostgreSQL 17.6 CI service and immutable DeploymentRecord semantics.

# Outputs / contracts

Test evidence only. No product, provider, contract, ADR or CI source change is permitted.

# Acceptance criteria

- actual successful A and acceptance-failed B are persisted through the existing PostgreSQL provider;
- provider/process reconstruction preserves both records and active A;
- B remains failed history and does not become active;
- re-evaluating identical B after reconstruction is idempotent and reproduces equivalent deterministic retention evidence;
- ordering/identity remain deterministic;
- serialized evidence contains no PostgreSQL URL, credential or inline secret value;
- no product/provider source is modified;
- declared validations pass under the existing PostgreSQL CI service.

# Non-goals

Persisting a new rollback log/schema, traffic switching, Runtime supervision, cross-context contract changes or production database hardening.

# Evidence expected

One PostgreSQL-backed product E2E test file plus repository verification.

# Escalation

Stop if proof requires product/provider/storage interface changes, new schema, canonical contracts, ADR changes or CI workflow changes.
