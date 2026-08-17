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

Close the Sprint with deterministic evidence that the new managed path and the existing one-shot `runLocalProcessDeployment` can consume equivalent real compiler/release/artifact/environment inputs without changing predecessor semantics.

# Evidence

- managed path remains alive and health-queryable until explicit stop;
- one-shot predecessor still completes and cleans its materialization;
- both preserve Builder/Observe independence;
- secret values do not enter evidence;
- no hand-authored downstream release artifact when executable APIs exist.

# Tests

Positive/predecessor: run both paths from equivalent actual compiler/release/artifact inputs and assert their intended distinct lifecycle semantics.
Negative: after managed stop, health is unreachable and cleanup is deterministic.

# Escalation

Evidence-only TASK. If proof requires product or contract changes, stop and escalate rather than editing `packages/**`.
