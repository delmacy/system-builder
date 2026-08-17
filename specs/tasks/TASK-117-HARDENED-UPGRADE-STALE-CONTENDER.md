---
id: TASK-117
title: Prove hardened successful B promotion rejects stale contender
status: completed
priority: 393
milestone: M9
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-116
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P8-PACKAGE-01.md
  - project_docs/execution_planning/P8-HARDENED-ACTIVATION-E2E-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - tests/product/p8-hardened-activation-e2e.test.ts
  - packages/deploy/index.ts
  - packages/deploy/postgres-state.ts
  - packages/deploy/local-deployment.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-116-HARDENED-FACTORY-ACTIVATION-RUNTIME.md
  - specs/tasks/TASK-117-HARDENED-UPGRADE-STALE-CONTENDER.md
allowed_paths:
  - tests/product/p8-hardened-activation-e2e.test.ts
  - specs/tasks/TASK-117-HARDENED-UPGRADE-STALE-CONTENDER.md
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

Extend the hardened P8 E2E from active A through successful atomic promotion B, then prove a contender using stale expected A cannot replace B while autonomous Runtime continuity is preserved.

# Context

TASK-116 establishes actual durable Factory output -> authenticated atomic A -> autonomous Runtime. P8 atomic authority defines explicit expected-active semantics and `stale-active` rejection.

# Current behavior

Completed evidence now promotes B with expected A, submits successful C with stale expected A, receives `stale-active`, reconstructs B as authoritative and preserves B Runtime health.

# Required change

Extend the same P8 E2E evidence using actual durable release/artifact output. Atomically promote successful B with expected A, reconstruct B as active, then submit a successful stale contender C with expected A and prove deterministic `stale-active` without overwriting B. Execute B through the existing autonomous Runtime path.

# Inputs / contracts

TASK-116 evidence path and existing Release/Artifact/Deploy/Runtime APIs.

# Outputs / contracts

Test evidence only.

# Acceptance criteria

- positive/predecessor: A from TASK-116 semantics is established first through authenticated atomic Deploy;
- positive: B is a real durable PublishedRelease reconstructed from existing Release/Artifact storage;
- positive: B activation with expected A returns `activated` and B becomes authoritative;
- negative: a successful contender C submitted with stale expected A returns `stale-active`;
- negative: stale C is durable attempted history but cannot replace B;
- positive: B executes through autonomous Runtime while Builder/Observe remain unavailable;
- positive: fresh Deploy reconstruction observes B rather than A/C as active;
- negative: evidence leaks no PostgreSQL URL, username, password or resolved secret;
- no product/provider changes;
- declared validations pass.

# Non-goals

Failed contender retention, production traffic switching, schema/provider modification or Runtime feature expansion.

# Evidence expected

The focused P8 E2E extended through A -> B -> stale C rejection with Runtime continuity.

# Escalation

Stop if proof requires a forbidden path or any product/contract/architecture change.
