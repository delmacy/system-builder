---
id: TASK-071
title: Bind runtime-only secrets to bounded stateful action
status: blocked
priority: 387
milestone: M4
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-070
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P3-PACKAGE-01.md
  - project_docs/execution_planning/P3-SECRET-STATE-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/contracts/environment-profile/index.ts
  - packages/deploy/secret-resolver.ts
  - packages/deploy/local-process.ts
  - packages/deploy/local-deployment.ts
  - packages/runtime-core/index.ts
  - tests/product/runtime-core.test.ts
  - tests/product/local-process-deploy.test.ts
  - specs/tasks/TASK-071-STATEFUL-RUNTIME-SECRET-BINDING.md
allowed_paths:
  - packages/runtime-core/index.ts
  - packages/deploy/local-process.ts
  - packages/deploy/local-deployment.ts
  - tests/product/runtime-core.test.ts
  - tests/product/local-process-deploy.test.ts
  - specs/tasks/TASK-071-STATEFUL-RUNTIME-SECRET-BINDING.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/release/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
max_files: 6
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Use TASK-070 secret resolution only at activation time, inject resolved values into the spawned Runtime process, and prove one bounded in-memory state transition through the persistent generated Runtime without leaking the secret.

# Context

TASK-070 introduces the Deploy-bounded resolver. The predecessor Runtime already provides persistent HTTP health and clean shutdown, while local Deploy independently verifies artifact payload before materialization.

# Current behavior

Deploy starts a persistent Runtime with symbolic EnvironmentProfile only, probes `/health`, then shuts it down. The generated Runtime has no business/state action route and Deploy has no SecretResolver input or runtime-only resolved secret injection.

# Required change

Extend the persistent Runtime renderer with `POST /state/counter/increment`. The action must require the first required `secret-reference` environment requirement to be resolved in the process environment, increment an in-memory counter, and return only a safe state result. Extend local Deploy with an optional SecretResolver input: after verified artifact retrieval and before materialization/spawn, resolve secret bindings; inject resolved values into child process environment; after health, invoke the counter action twice when a resolver is supplied, validate monotonic state, then perform existing clean shutdown. Preserve predecessor behavior when no resolver is supplied.

# Inputs / contracts

TASK-070 SecretResolver, canonical EnvironmentProfile symbolic bindings, verified artifact payload, existing persistent Runtime renderer and local Deploy lifecycle.

# Outputs / contracts

Optional secret-aware activation path plus one bounded in-memory Runtime action. Resolved values remain ephemeral process environment only; no canonical schema changes.

# Acceptance criteria

- artifact verification remains before secret resolution/materialization;
- secret resolution failure is pre-activation and produces no false DeploymentRecord success;
- resolved values are injected only into child process environment and are absent from stdout/stderr/health/state result;
- state action fails explicitly if the required runtime secret is absent;
- two action calls in one Runtime process return values 1 then 2;
- Runtime remains Builder/Observe independent;
- predecessor health-only Deploy path remains valid without a resolver;
- canonical contracts remain unchanged;
- declared validations pass.

# Non-goals

Production persistence/database adapter, multi-entity state model, authentication/authorization, restart persistence, production secret managers or public schema changes.

# Evidence expected

Runtime-core tests for state increment and missing-secret failure, local-process Deploy tests for resolution ordering, runtime-only injection, monotonic state and cleanup, plus GitHub Deterministic CI.

# Escalation

Stop if implementing the state slice requires canonical contract changes, production persistence architecture or a forbidden path.
