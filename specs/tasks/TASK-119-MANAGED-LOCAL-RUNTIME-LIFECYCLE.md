---
id: TASK-119
title: Add Deploy-owned managed local Runtime lifecycle
status: ready
priority: 420
milestone: M10
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
  - project_docs/execution_planning/P9-PACKAGE-01.md
  - project_docs/execution_planning/P9-MANAGED-RUNTIME-PROCESS-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/deploy/local-process.ts
  - tests/product/local-process-deploy.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-119-MANAGED-LOCAL-RUNTIME-LIFECYCLE.md
allowed_paths:
  - packages/deploy/managed-process.ts
  - tests/product/managed-runtime-process.test.ts
  - specs/tasks/TASK-119-MANAGED-LOCAL-RUNTIME-LIFECYCLE.md
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

Add an additive Deploy-owned single-host managed process API that starts an accepted generated Runtime, verifies health, leaves it alive and queryable, and exposes explicit bounded stop semantics.

# Required behavior

- invoke actual verified artifact payload and EnvironmentProfile inputs;
- preserve Release/Artifact immutability;
- keep the accepted child process alive after health PASS;
- expose a secret-free lifecycle snapshot with running/stopped state, Runtime version, environment ref and local port;
- expose explicit stop without leaking the raw child process;
- do not change existing `runLocalProcessDeployment` behavior.

# Tests

Positive: compiled verified Runtime starts, health passes, remains queryable, then stops cleanly.
Negative: incompatible artifact/environment fails before a managed process exists.
Predecessor: use the same executable compiler/release/artifact inputs as existing local Deploy tests.

# Escalation

Stop if this requires canonical contracts, Runtime changes, external traffic/fleet topology or modification of predecessor API semantics.
