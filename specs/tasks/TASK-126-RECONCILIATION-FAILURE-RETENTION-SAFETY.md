---
id: TASK-126
title: Harden restart reconciliation failure and retention safety
status: verification
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

TASK-125 reconciles a matching durable active record. This TASK adds explicit negative and idempotency evidence without changing predecessor APIs.

# Required change

Within the same reconciliation test boundary:
- fail closed when there is no durable active record;
- preserve pre-start mismatch rejection;
- prove Runtime startup failure returns a secret-free diagnostic and leaves the active DeploymentRecord untouched;
- prove repeated reconciliation of the same active deployment reuses the already managed Runtime rather than creating a second copy;
- prove explicit shutdown removes the process while durable authority remains B.

# Inputs / contracts

TASK-125 reconciliation API and existing P8/P9 Deploy authority/lifecycle APIs.

# Outputs / contracts

Focused failure/retention evidence only; no predecessor or canonical contract changes.

# Acceptance criteria

- no-active authority fails without creating managed state;
- non-authoritative evidence remains rejected before process start;
- startup failure does not modify durable active id and leaves no managed active process;
- resolved secret values never appear in result/diagnostics;
- duplicate reconciliation cannot create an untracked second active process;
- explicit shutdown removes the managed process while durable authority remains B for a later fresh manager;
- predecessor promotion behavior remains unchanged;
- declared validations pass.

# Non-goals

Automatic external process adoption/discovery, host reboot supervision, process daemon/service integration, canonical contract changes, external traffic/fleet topology.

# Evidence expected

`tests/product/runtime-reconciliation.test.ts` covers no-active failure, duplicate reconciliation identity, controlled shutdown authority retention and startup failure with resolved-secret redaction in addition to TASK-125 predecessor proof.

# Implementation evidence

Implemented as additive focused test evidence on the Sprint branch. No product module change was required for TASK-126 because TASK-125 already implemented the necessary fail-closed/idempotent behavior. CI validation is required before TASK-127 becomes eligible.

# Escalation

Stop if safety requires edits to forbidden predecessor APIs, persistent PID/process contracts, external service management or architecture expansion.
