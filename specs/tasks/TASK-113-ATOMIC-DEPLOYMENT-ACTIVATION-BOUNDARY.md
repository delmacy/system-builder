---
id: TASK-113
title: Add atomic activation boundary to Deploy storage
status: ready
priority: 397
milestone: M9
model_tier: strong
risk: medium
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P8-PACKAGE-01.md
  - project_docs/execution_planning/P8-ATOMIC-DEPLOYMENT-AUTHORITY-01.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/index.ts
  - packages/deploy/storage.ts
  - packages/deploy/postgres-state.ts
  - tests/product/deploy.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-113-ATOMIC-DEPLOYMENT-ACTIVATION-BOUNDARY.md
allowed_paths:
  - packages/deploy/index.ts
  - packages/deploy/storage.ts
  - tests/product/deploy.test.ts
  - specs/tasks/TASK-113-ATOMIC-DEPLOYMENT-ACTIVATION-BOUNDARY.md
forbidden_paths:
  - packages/contracts/**
  - packages/catalog/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/runtime-core/**
  - packages/deploy/postgres-state.ts
  - apps/**
  - tooling/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 4
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Add an explicit asynchronous atomic activation operation to the Deploy-owned storage/API boundary so a caller can require an expected active deployment before a successful candidate becomes authoritative.

# Context

Sprint 1 provides authenticated transaction-capable PostgreSQL transport. Current `DeploymentRegistry.activateCandidate` and storage setters remain synchronous/cache-oriented and cannot express multi-writer compare-and-set authority.

# Current behavior

A successful `record()` writes history and then changes the active pointer independently. Separate provider instances can observe stale state and overwrite each other.

# Required change

Add an additive Deploy-module API for durable atomic candidate activation. Preserve the existing synchronous `record()` and `activateCandidate()` behavior for predecessor compatibility. Define deterministic result semantics for activated, retained-active/rejected-no-active and stale-active outcomes.

# Inputs / contracts

Existing `DeploymentRecord`, `DeploymentActivationDecision`, `DeploymentRecordStorage`, ADR-0002 and ADR-0007. No canonical contract change.

# Outputs / contracts

An additive exported Deploy-module atomic activation API and storage seam that provider implementations can satisfy asynchronously.

# Acceptance criteria

- existing synchronous APIs remain behaviorally compatible;
- caller may supply the active deployment it expects, including explicit no-active expectation;
- stale expectation returns deterministic non-activation evidence rather than overwriting authority;
- failed candidates never replace an active deployment;
- in-memory provider implements equivalent atomic semantics for unit evidence;
- positive, stale-negative and failed-candidate tests exist;
- no `packages/contracts/**` or L4 change;
- declared validations pass.

# Non-goals

PostgreSQL implementation, process/fleet rollback, traffic switching, shared DB transport, Sprint 3 E2E.

# Evidence expected

Focused product tests for additive atomic activation behavior and predecessor compatibility.

# Escalation

Stop if the change requires canonical contracts, removing/changing existing public method semantics, cross-context ownership or an L4 ADR.
