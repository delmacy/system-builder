---
id: TASK-101
title: Establish Deploy-owned deployment state boundary
status: completed
priority: 409
milestone: M8
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P7-PACKAGE-01.md
  - project_docs/execution_planning/P7-DURABLE-DEPLOYMENT-STATE-01.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/index.ts
  - tests/product/deploy.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-101-DEPLOYMENT-STATE-BOUNDARY.md
allowed_paths:
  - packages/deploy/index.ts
  - packages/deploy/storage.ts
  - tests/product/deploy.test.ts
  - specs/tasks/TASK-101-DEPLOYMENT-STATE-BOUNDARY.md
forbidden_paths:
  - packages/contracts/**
  - packages/catalog/**
  - packages/assembly/**
  - packages/compiler/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/runtime-core/**
  - packages/deploy/local-deployment.ts
  - packages/deploy/local-process.ts
  - packages/deploy/postgres-migrations.ts
  - packages/deploy/postgres-state.ts
  - apps/**
  - tooling/**
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

Introduce a replaceable Deploy-owned storage boundary for existing `DeploymentRecord` history and active deployment observation while preserving current Deploy semantics.

# Context

Deploy already emits deterministic `DeploymentRecord` evidence, but history and active-version state have no durable owner. WBS 10.3.1/10.3.2 requires deployment records and active-version visibility.

# Current behavior

`dryRunDeploy` and local deployment return immutable deterministic `DeploymentRecord` values to their caller. Deploy has no owned registry/storage abstraction for historical records or active deployment observation.

# Required change

Add a Deploy-internal storage interface, default in-memory implementation and registry that stores immutable deployment evidence, lists it deterministically and exposes the active successful deployment per environment. Failed records remain history and do not replace active successful state. PostgreSQL is not part of this TASK.

# Inputs / contracts

Existing `DeploymentRecord`, `dryRunDeploy`, EnvironmentProfile compatibility behavior, WBS 10.3.1/10.3.2 and ADR-0007 Release/Environment/Deployment separation.

# Outputs / contracts

Deploy-internal storage/registry API and default in-memory implementation. Existing DeploymentRecord and canonical contract shapes remain unchanged.

# Acceptance criteria

- replaceable Deploy-internal storage boundary exists;
- default in-memory behavior requires no provider configuration;
- stored snapshots are immutable and deterministic;
- list ordering is deterministic;
- succeeded records become active for their environment;
- failed records remain history but do not become active;
- identical re-recording is idempotent and conflicting content for an existing deploymentId fails closed;
- current dry-run behavior remains compatible;
- no canonical contract or other bounded-context source changes;
- declared validations pass.

# Non-goals

PostgreSQL, production traffic switching, rollback orchestration, long-running supervision or public contract extraction.

# Evidence expected

Focused product tests for history, active state, failure behavior, idempotence/conflict and deterministic ordering plus repository verification.

# Escalation

Stop if this requires canonical contract changes, Release/Environment semantic changes, an existing DeploymentRecord shape change or an L4 boundary change.