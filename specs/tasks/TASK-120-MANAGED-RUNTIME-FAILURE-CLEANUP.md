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

# Context

TASK-119 introduces a retained Deploy-owned local Runtime process. A retained process becomes operational state, so lifecycle cleanup and secret handling must remain fail-closed before later P9 promotion/reconciliation work can depend on it.

# Current behavior

After TASK-119, a successful managed Runtime may remain alive until explicit stop. Existing one-shot Deploy already performs bounded termination and cleanup on failure, but the new retained path needs equivalent safety and stable repeated-stop semantics.

# Required change

Make explicit stop idempotent, use bounded graceful termination with forced fallback, remove materialization exactly when management ends, and guarantee all startup/health/process failure paths clean child/directory and expose only redacted secret-free diagnostics/state.

# Inputs / contracts

TASK-119 managed-process API, existing local-process diagnostic conventions, `EnvironmentProfile`, runtime-only resolved secrets and local process execution semantics. No canonical contract changes.

# Outputs / contracts

Stable stopped lifecycle state plus deterministic cleanup/failure behavior for the Deploy-local managed process implementation.

# Acceptance criteria

- repeated stop is safe and returns stable stopped state;
- graceful stop is bounded and forced cleanup is available when needed;
- working directory exists only while the process is managed, then is removed;
- startup/health/process failure leaves no retained live process or directory;
- lifecycle snapshot reflects unexpected process exit rather than falsely reporting running;
- resolved secret values do not appear in snapshot, stdout/stderr-derived diagnostics or serialized evidence;
- TASK-119 happy path remains compatible;
- declared validations pass.

# Non-goals

Deployment authority promotion, external traffic switching, durable process reconstruction, multi-host supervision, production SecretResolver, canonical contracts.

# Evidence expected

Product tests for repeated stop, deterministic cleanup, failure cleanup and secret redaction, extending TASK-119 positive evidence.

# Escalation

Stop for canonical contract changes, external supervisor topology, security weakening or required edits outside allowed paths.
