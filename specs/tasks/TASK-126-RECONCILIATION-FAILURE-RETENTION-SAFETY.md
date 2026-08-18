---
id: TASK-126
title: Harden restart reconciliation failure and retention safety
status: blocked
priority: 441
milestone: M10
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-125
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P9-PACKAGE-01.md
  - project_docs/execution_planning/P9-ACTIVE-RUNTIME-PROMOTION-01.report.md
  - project_docs/execution_planning/P9-RUNTIME-RECONCILIATION-E2E-01.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/runtime-reconciliation.ts
  - packages/deploy/active-runtime.ts
  - packages/deploy/managed-process.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-126-RECONCILIATION-FAILURE-RETENTION-SAFETY.md
allowed_paths:
  - packages/deploy/runtime-reconciliation.ts
  - tests/product/runtime-reconciliation.test.ts
  - specs/tasks/TASK-126-RECONCILIATION-FAILURE-RETENTION-SAFETY.md
forbidden_paths:
  - packages/contracts/**
  - packages/runtime-core/**
  - packages/deploy/index.ts
  - packages/deploy/managed-process.ts
  - packages/deploy/active-runtime.ts
  - packages/deploy/local-process.ts
  - packages/deploy/postgres-state.ts
  - packages/release/**
  - packages/artifact-store/**
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

Harden the bounded restart reconciliation seam so missing/corrupt/non-authoritative evidence fails closed, candidate startup failure cannot alter durable authority, and cleanup is deterministic without leaking secrets.

# Context

TASK-125 establishes positive rematerialization of the durable active Runtime after controlled manager restart. This TASK adds the failure/retention behavior needed before package-level E2E evidence.

# Current behavior

After TASK-125, a matching active record can be reconciled. Failure paths still require explicit proof that authority remains unchanged and partial process material is cleaned.

# Required change

Within the same reconciliation module/test:
- fail closed when there is no durable active record;
- fail closed when environmentRef, release reference/hash or artifact hash cannot satisfy the active DeploymentRecord;
- on Runtime startup/health failure, return a bounded secret-free diagnostic and leave the active DeploymentRecord untouched;
- repeated reconciliation into one reconciler instance must not silently create two managed copies for the same active deployment; either return the already reconciled active instance or fail deterministically without changing authority;
- expose deterministic explicit stop/cleanup for the reconciled process so controlled manager shutdown is testable.

# Inputs / contracts

TASK-125 reconciliation API and existing P8/P9 Deploy authority/lifecycle APIs.

# Outputs / contracts

Hardened additive Deploy-local reconciliation behavior only.

# Acceptance criteria

- no-active authority fails without spawning a Runtime;
- mismatched Release/Artifact/Environment fails before process start;
- startup/health failure does not modify durable active id and leaves no managed active process;
- resolved secret values never appear in result/diagnostics;
- duplicate reconciliation cannot create an untracked second active process;
- explicit shutdown removes the managed process while durable authority remains B for a later fresh manager;
- predecessor promotion behavior remains unchanged;
- declared validations pass.

# Non-goals

Automatic external process adoption/discovery, host reboot supervision, process daemon/service integration, canonical contract changes, external traffic/fleet topology.

# Evidence expected

Focused negative tests for authority/evidence mismatch, startup failure, duplicate reconciliation and controlled shutdown while persistent authority remains unchanged.

# Escalation

Stop if safety requires edits to forbidden predecessor APIs, persistent PID/process contracts, external service management or architecture expansion.
