---
id: TASK-121
title: Prove managed Runtime predecessor compatibility
status: blocked
priority: 418
milestone: M10
model_tier: free
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-120
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P9-PACKAGE-01.md
  - project_docs/execution_planning/P9-MANAGED-RUNTIME-PROCESS-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/deploy/managed-process.ts
  - packages/deploy/local-process.ts
  - tests/product/managed-runtime-process.test.ts
  - tests/product/local-process-deploy.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-121-MANAGED-RUNTIME-PREDECESSOR-EVIDENCE.md
allowed_paths:
  - tests/product/managed-runtime-process.test.ts
  - specs/tasks/TASK-121-MANAGED-RUNTIME-PREDECESSOR-EVIDENCE.md
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

Close the Sprint with deterministic evidence that the new managed path and existing one-shot `runLocalProcessDeployment` can consume equivalent real compiler/release/artifact/environment inputs while preserving their intentionally different lifecycle semantics.

# Context

TASK-119/120 add a retained single-host Runtime process lifecycle. The Sprint must prove that this additive path did not silently change or replace the existing one-shot Deploy reference behavior.

# Current behavior

The predecessor one-shot path starts, verifies and cleans a generated Runtime before returning. The new managed path retains an accepted Runtime until explicit stop and then cleans it deterministically.

# Required change

Add evidence-only tests invoking both paths from equivalent actual compiler/release/artifact/environment inputs, proving one-shot cleanup, managed retention/queryability, explicit stop cleanup and Builder/Observe independence.

# Inputs / contracts

Existing compiler output, release registry, artifact payload repository, EnvironmentProfile, `runLocalProcessDeployment`, TASK-120 managed-process API, ADR-0002 and ADR-0007.

# Outputs / contracts

No product output. Deterministic product-test evidence only.

# Acceptance criteria

- both paths use actual executable compiler/release/artifact inputs rather than hand-authored downstream artifacts;
- managed path remains health-queryable before explicit stop;
- one-shot predecessor still completes with its historical cleanup semantics;
- after managed stop, health is unreachable and materialization is removed;
- Builder/Observe may be unavailable without breaking the generated Runtime proof;
- serialized evidence contains no secret values;
- no `packages/**` changes are required;
- declared validations pass.

# Non-goals

Any product modification, atomic promotion, restart reconciliation, external traffic/fleet topology, canonical contracts or package review work.

# Evidence expected

Focused predecessor-integration tests in `tests/product/managed-runtime-process.test.ts` plus repository-wide verification.

# Escalation

Evidence-only TASK. If proof requires product or contract changes, stop and escalate rather than editing `packages/**`.
