---
id: TASK-077
title: Apply verified PostgreSQL migrations before Runtime activation
status: ready
priority: 389
milestone: M5
model_tier: cheap
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-076
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P4-PACKAGE-01.md
  - project_docs/execution_planning/P4-POSTGRES-STATE-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/migration-preflight.ts
  - packages/deploy/secret-resolver.ts
  - packages/deploy/local-process.ts
  - tests/product/local-process-deploy.test.ts
  - specs/tasks/TASK-076-POSTGRES-RUNTIME-STATE-ADAPTER.md
  - specs/tasks/TASK-077-DEPLOY-POSTGRES-MIGRATION-APPLICATION.md
allowed_paths:
  - packages/deploy/postgres-migrations.ts
  - packages/deploy/local-process.ts
  - tests/product/local-process-deploy.test.ts
  - specs/tasks/TASK-077-DEPLOY-POSTGRES-MIGRATION-APPLICATION.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/runtime-core/**
  - packages/release/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
  - .github/**
max_files: 4
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Apply the already verified and preflighted PostgreSQL migrations deterministically after external secret resolution and before Runtime materialization/activation, with idempotent evidence and fail-closed behavior.

# Context

TASK-075 proves migration manifest/file integrity and ordering but deliberately executes no SQL. TASK-076 makes a stateful generated Runtime require PostgreSQL when state metadata exists. Deploy therefore owns the bounded migration-application step before activation per WBS 10.2.1/10.2.2.

# Current behavior

`runLocalProcessDeployment` verifies ArtifactPayload, validates paths, runs migration preflight, resolves secrets, materializes files and activates Runtime. It returns preflight evidence but never applies migration content.

# Required change

Add a Deploy-bounded PostgreSQL migration applier using the preflight output plus verified migration files and runtime-only resolved secret map. Maintain a small migration ledger in PostgreSQL keyed by capability/migration identity and content hash. Apply new migrations in deterministic order, skip an already-applied migration with the same hash, reject a previously applied identity whose hash differs, and return only non-secret application evidence. Invoke it after secret resolution and before working-directory creation/Runtime activation. Preserve empty-migration predecessor paths. Generalize the local state-sequence assertion from hard-coded `1 -> 2` to consecutive increments so restart persistence can be proven later.

# Inputs / contracts

Verified ArtifactPayload, `LocalMigrationPreflight`, runtime-only resolved secret environment, ADR-0007 and WBS 10.2.

# Outputs / contracts

Deploy-bounded `LocalMigrationApplication` evidence only. No canonical DeploymentRecord/Release/Environment schema change.

# Acceptance criteria

- migration preflight still occurs before secret resolution;
- migration application occurs only after secret resolution and before materialization/activation;
- empty migration plan remains a successful no-op without requiring PostgreSQL;
- missing connection secret, connection/query failure or applied-hash mismatch fails with `activated: false` before materialization;
- a migration already recorded with the same hash is skipped idempotently;
- successful evidence contains only capability/id/order/path/hash/status and no SQL content or resolved secret;
- secret values never appear in diagnostics/stdout/stderr/application evidence;
- Runtime state proof accepts any two consecutive integer increments while preserving predecessor `1 -> 2` behavior;
- focused tests prove ordering with a bounded injected applier/failure boundary without requiring live PostgreSQL in this TASK;
- declared validations pass.

# Non-goals

Actual PostgreSQL CI integration proof, database provisioning, schema rollback/down migrations, production retry orchestration, Runtime adapter changes or canonical contract changes.

# Evidence expected

Deploy product tests covering no-op, ordering, pre-activation application, idempotent evidence boundary, application failure/no secret leakage and predecessor behavior, plus Deterministic CI.

# Escalation

Stop for destructive migration policy, canonical DeploymentRecord changes, resolved-secret persistence or any L4 architecture change.
