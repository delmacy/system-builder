---
id: TASK-058
title: Establish minimal autonomous Runtime bootstrap boundary
status: completed
priority: 340
milestone: M3
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-057
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P2-PACKAGE-01.md
  - project_docs/execution_planning/P2-RUNTIME-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/contracts/environment-profile/**
  - tsconfig.json
  - specs/tasks/TASK-058-AUTONOMOUS-RUNTIME-BOOTSTRAP.md
allowed_paths:
  - packages/runtime-core/**
  - tests/product/runtime-core.test.ts
  - specs/tasks/TASK-058-AUTONOMOUS-RUNTIME-BOOTSTRAP.md
forbidden_paths:
  - apps/**
  - packages/compiler/**
  - packages/deploy/**
  - packages/release/**
  - packages/contracts/**
  - tooling/agent-harness/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Create the smallest autonomous Runtime bootstrap boundary needed for the P2 runtime proof without introducing a dependency on Builder or Observe during ordinary startup/health operation.

# Required change

Add `packages/runtime-core/` with a deterministic public bootstrap API that:

- consumes the canonical EnvironmentProfile shape through its public contract;
- validates runtime-version compatibility and required symbolic bindings;
- rejects missing bindings and attempted inline values explicitly;
- exposes a minimal deterministic RuntimeHealth result;
- can render a self-contained Node ESM entrypoint for later Compiler materialization.

The rendered entrypoint must receive its EnvironmentProfile externally at process startup and must not call Builder, Observe or any network service for startup/health.

# Acceptance criteria

- Runtime bootstrap succeeds with compatible runtime version and complete required bindings;
- missing binding and incompatible runtime fail with explicit diagnostics;
- inline secret/config values are not accepted as part of canonical binding data;
- rendered entrypoint is self-contained and deterministic for identical inputs;
- focused test starts the rendered entrypoint as a Node process and observes health PASS;
- no Builder/Observe dependency is required;
- product tests and repository-wide verification pass.

# Non-goals

Generated business entities/APIs/workflows, auth, database access, secret resolution, Deploy adapters, persistence, telemetry transport or changes to public contracts.

# Evidence expected

Runtime-core implementation, positive/negative process/bootstrap tests and GitHub Deterministic CI.

# Escalation

Stop if implementation requires changing ADR-0002 autonomy, any public contract, or a forbidden path.
