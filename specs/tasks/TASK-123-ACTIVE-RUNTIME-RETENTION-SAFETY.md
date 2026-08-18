---
id: TASK-123
title: Preserve active Runtime across stale and failed contenders
status: completed
priority: 429
milestone: M10
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-122
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P9-PACKAGE-01.md
  - project_docs/execution_planning/P9-ACTIVE-RUNTIME-PROMOTION-01.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/active-runtime.ts
  - packages/deploy/managed-process.ts
  - packages/deploy/index.ts
  - tests/product/active-runtime-promotion.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-123-ACTIVE-RUNTIME-RETENTION-SAFETY.md
allowed_paths:
  - packages/deploy/active-runtime.ts
  - tests/product/active-runtime-promotion.test.ts
  - specs/tasks/TASK-123-ACTIVE-RUNTIME-RETENTION-SAFETY.md
forbidden_paths:
  - packages/contracts/**
  - packages/runtime-core/**
  - packages/deploy/index.ts
  - packages/deploy/managed-process.ts
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

Harden active-process promotion so stale or failed contenders never replace or terminate the last-known-good managed Runtime and candidate cleanup remains deterministic.

# Context

TASK-122 establishes the successful active-process transition. The package requires last-known-good continuity when atomic authority rejects a stale contender or when a candidate fails before acceptance.

# Current behavior

After TASK-122, accepted candidates may be atomically activated and prior managed processes retired after success. Stale and failed paths require explicit retention semantics and cleanup evidence.

# Required change

For an accepted contender whose atomic activation returns `stale-active`, `retained-active` or `rejected-no-active`, stop/clean only the contender and preserve the currently managed authoritative Runtime. For candidate startup/health failure, do not call authority activation and preserve the active Runtime unchanged. Promotion results must make retention explicit without secret-bearing diagnostics.

# Inputs / contracts

TASK-122 active-runtime API, P8 atomic activation outcomes, existing managed-process failure behavior and DeploymentRegistry authority semantics.

# Outputs / contracts

Deterministic retained-active/failed-candidate process evidence within the Deploy-local orchestrator API. No canonical contract change.

# Acceptance criteria

- stale successful C from obsolete expected authority is cleaned and cannot replace/terminate B;
- failed candidate never invokes atomic promotion and cannot replace/terminate B;
- B remains health-queryable after each rejected/failed contender;
- durable authority result and managed active process remain aligned for all handled outcomes;
- contender materialization is cleaned after rejection/failure;
- diagnostics/evidence remain secret-free;
- TASK-122 success path remains compatible;
- declared validations pass.

# Non-goals

Restart reconciliation, process discovery after manager restart, external traffic switching, fleet/cloud topology, canonical contracts, production supervision.

# Evidence expected

Focused tests covering stale accepted contender, failed startup/health contender, retained active B continuity and candidate cleanup.

# Escalation

Stop for any required change to canonical contracts, external topology, Runtime implementation or forbidden predecessor APIs.

# Implementation evidence

The Deploy-local orchestrator now compares its managed process identity with the currently observed deployment authority rather than with the caller's expected CAS value. This permits a stale caller expectation to reach atomic authority and return `stale-active` while preserving B. Rejected candidates are stopped/cleaned; candidate startup failure does not invoke activation; authority/process divergence fails closed.
