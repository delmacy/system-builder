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

# Context

ADR-0002 requires generated client systems to operate independently of System Builder. The Autonomous Runtime WBS requires external configuration, startup/operation with Builder unavailable and health without making Observe mandatory. P2-BOUNDARY-01 established the canonical EnvironmentProfile that this Runtime boundary consumes.

# Current behavior

The repository has deterministic Compiler/Release/Deploy dry-run behavior but no Runtime package, entrypoint or RuntimeHealth proof. Compiler output is not yet runnable.

# Required change

Add `packages/runtime-core/` with a deterministic public bootstrap API that consumes canonical EnvironmentProfile, validates runtime compatibility and required symbolic bindings, rejects inline values, exposes RuntimeHealth, and renders a self-contained Node ESM entrypoint. The rendered entrypoint receives EnvironmentProfile externally and performs no Builder/Observe/network call for startup or health.

# Inputs / contracts

Accepted ADR-0002, Autonomous Runtime WBS 13.1.3/13.3.1/13.3.2, canonical EnvironmentProfile and repository Node 24 toolchain.

# Outputs / contracts

Internal Runtime bootstrap package and standalone entrypoint renderer. No public domain contract changes.

# Acceptance criteria

- Runtime bootstrap succeeds with compatible runtime version and complete required bindings;
- missing binding and incompatible runtime fail with explicit diagnostics;
- inline secret/config values are not accepted as canonical binding data;
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
