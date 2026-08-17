---
id: TASK-112
title: Prove authenticated durable Deploy reconstruction
status: ready
priority: 398
milestone: M9
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-111
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P8-PACKAGE-01.md
  - project_docs/execution_planning/P8-DEPLOY-POSTGRES-TRANSPORT-01.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/index.ts
  - packages/deploy/postgres-state.ts
  - packages/deploy/storage.ts
  - tests/product/deploy-postgres.test.ts
  - specs/tasks/TASK-110-DEPLOY-POSTGRES-AUTH-TRANSPORT.md
  - specs/tasks/TASK-111-DEPLOY-POSTGRES-TRANSACTION-LIFECYCLE.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-112-AUTHENTICATED-DEPLOY-RECONSTRUCTION-EVIDENCE.md
allowed_paths:
  - tests/product/p8-deploy-postgres-transport.test.ts
  - specs/tasks/TASK-112-AUTHENTICATED-DEPLOY-RECONSTRUCTION-EVIDENCE.md
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

Close the Sprint with package-level evidence that authenticated Deploy PostgreSQL persistence preserves DeploymentRecord history and active-version observation across provider/process reconstruction without leaking credentials.

# Context

TASK-110 hardens authentication transport and TASK-111 adds bounded transaction capability. The Sprint exit proof requires those capabilities to carry the existing durable Deploy state semantics, not just pass isolated protocol tests.

# Current behavior

P7 proves durable reconstruction only through the trust-auth reference service. There is no focused evidence that the same state boundary reconstructs equivalently through an authenticated PostgreSQL service after transport hardening.

# Required change

Add a focused product integration test using the authenticated CI PostgreSQL URL. Persist successful and failed DeploymentRecords through `DeploymentRegistry` + `PostgresDeploymentRecordStorage`, flush/close, reconstruct a fresh provider/registry, and verify equivalent immutable history plus the expected active successful deployment.

Serialize only repository evidence and assert that neither the authenticated connection string nor its password/user material appears in that evidence or provider errors.

# Inputs / contracts

Existing Deploy module API, TASK-110 authenticated transport, TASK-111 transaction-capable provider lifecycle and PostgreSQL 17.6 CI fixture.

# Outputs / contracts

Evidence-only product test. No product or canonical contract changes.

# Acceptance criteria

- actual authenticated PostgreSQL 17.6 connection is used;
- successful and failed records persist through the existing Deploy storage boundary;
- active successful deployment reconstructs equivalently after provider close/reopen;
- deterministic history ordering remains unchanged;
- serialized evidence excludes authenticated URL, username and password material;
- invalid-auth diagnostics remain sanitized;
- predecessor trust-auth tests remain green;
- no product/provider source change in this TASK;
- declared validations pass.

# Non-goals

Atomic concurrent activation, Runtime E2E, traffic/fleet orchestration, Observe publication or provider changes.

# Evidence expected

One authenticated PostgreSQL-backed product integration test proving Deploy state reconstruction plus repository verification.

# Escalation

Stop if the proof requires changing product/provider behavior, contracts, ADRs or CI after TASK-111.
