---
id: TASK-120
title: Harden managed Runtime cleanup and lifecycle safety
status: blocked
priority: 419
milestone: M10
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-119
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P9-PACKAGE-01.md
  - project_docs/execution_planning/P9-MANAGED-RUNTIME-PROCESS-01.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/managed-process.ts
  - packages/deploy/local-process.ts
  - tests/product/managed-runtime-process.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-120-MANAGED-RUNTIME-FAILURE-CLEANUP.md
allowed_paths:
  - packages/deploy/managed-process.ts
  - tests/product/managed-runtime-process.test.ts
  - specs/tasks/TASK-120-MANAGED-RUNTIME-FAILURE-CLEANUP.md
forbidden_paths:
  - packages/contracts/**
  - packages/runtime-core/**
  - packages/deploy/local-process.ts
  - packages/deploy/postgres-state.ts
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

Harden the managed process lifecycle so stop is deterministic/idempotent, startup/health failures leave no retained process/materialization, and secret-bearing runtime material never appears in snapshots or diagnostics.

# Required behavior

- idempotent explicit stop;
- bounded graceful termination with forced cleanup fallback;
- working directory retained only while the process is managed, then removed;
- startup/health/process failure cleans the child and directory;
- secret values remain runtime-only and are redacted from diagnostics/snapshots;
- no falsely running lifecycle state after process exit.

# Tests

Positive: repeated stop returns stable stopped state and cleanup remains complete.
Negative: invalid startup/health or process failure leaves no managed live process/materialization.
Predecessor integration: TASK-119 happy path remains unchanged.

# Escalation

Stop for canonical contract changes, external supervisor topology, security weakening or required edits outside allowed paths.
