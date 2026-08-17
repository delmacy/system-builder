---
id: TASK-103
title: Prove durable deployment state reconstruction
status: completed
priority: 407
milestone: M8
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-102
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
  - packages/deploy/postgres-state.ts
  - tests/product/deploy.test.ts
  - tests/product/deploy-postgres.test.ts
  - specs/tasks/TASK-101-DEPLOYMENT-STATE-BOUNDARY.md
  - specs/tasks/TASK-102-POSTGRES-DEPLOYMENT-STATE.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-103-DURABLE-DEPLOYMENT-STATE-EVIDENCE.md
allowed_paths:
  - tests/product/durable-deployment-state.test.ts
  - specs/tasks/TASK-103-DURABLE-DEPLOYMENT-STATE-EVIDENCE.md
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

Prove the Sprint exit chain using existing Deploy output and the durable state provider without changing product source.

# Context

TASK-101 supplies the Deploy-owned state boundary and TASK-102 supplies its PostgreSQL implementation. Sprint closure requires evidence across the existing Deploy API and provider/process reconstruction rather than isolated provider tests.

# Current behavior

The predecessor TASKs can record and reconstruct deployment state, but no focused growing E2E proof yet starts from actual existing `dryRunDeploy` output and verifies active-state observation after reconstruction.

# Required change

Create focused PostgreSQL integration evidence that starts from an actual existing `dryRunDeploy` DeploymentRecord, records it through the Deploy state boundary, reconstructs the provider/process and observes equivalent history plus active release/version for the same environment.

# Inputs / contracts

Existing `dryRunDeploy`, TASK-101 `DeploymentRegistry`/storage boundary, TASK-102 PostgreSQL provider, EnvironmentProfile and unchanged DeploymentRecord semantics.

# Outputs / contracts

Test evidence only. No product or contract source change is permitted.

# Acceptance criteria

- actual `dryRunDeploy` successful output is persisted and reconstructed;
- reconstructed DeploymentRecord is structurally equivalent to the original immutable record;
- active observation resolves to the same successful deployment and published release reference;
- a failed existing Deploy record may be persisted as history but does not replace the active successful deployment;
- deterministic ordering survives reconstruction;
- persisted/reconstructed evidence contains no provider connection material or inline secret value;
- no product source or contract file is modified;
- declared validations pass.

# Non-goals

Rollback orchestration, Runtime process supervision, production traffic switching or any product change.

# Evidence expected

One focused product E2E test file plus final repository verification.

# Escalation

Stop if the proof requires product/contract modification, altered Deploy semantics, CI workflow changes or expansion beyond the two allowed files.