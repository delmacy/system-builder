---
id: TASK-115
title: Prove multi-writer atomic deployment authority
status: completed
priority: 395
milestone: M9
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-114
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
  - tests/product/p8-deploy-postgres-transport.test.ts
  - specs/tasks/TASK-113-ATOMIC-DEPLOYMENT-ACTIVATION-BOUNDARY.md
  - specs/tasks/TASK-114-POSTGRES-ATOMIC-DEPLOYMENT-AUTHORITY.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-115-MULTI-WRITER-DEPLOYMENT-AUTHORITY-EVIDENCE.md
allowed_paths:
  - tests/product/p8-atomic-deployment-authority.test.ts
  - specs/tasks/TASK-115-MULTI-WRITER-DEPLOYMENT-AUTHORITY-EVIDENCE.md
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

Prove the Sprint exit condition with multiple independent authenticated PostgreSQL provider instances contending for one environment authority and reconstructing the same winner.

# Context

TASK-113 defines the atomic activation API and TASK-114 implements database-enforced CAS. The Sprint requires an integrated proof that process-local caches cannot silently override database authority.

# Current behavior

The completed evidence races two independently opened provider/registry instances from the same expected active A and verifies one authoritative winner plus deterministic stale rejection.

# Required change

Add focused PostgreSQL-backed evidence using at least two independently opened provider/registry instances. Establish active A, race competing B/C attempts from a shared expected authority, prove exactly one admissible authoritative transition, reject stale contender overwrite, and reconstruct from a fresh provider.

# Inputs / contracts

Actual executable Deploy registry/storage APIs and PostgreSQL 17.6 authenticated CI fixture.

# Outputs / contracts

Test evidence only. No product, contract, ADR or workflow changes.

# Acceptance criteria

- active A is established durably;
- two independent writers contend from the same expected A authority;
- exactly one successful contender becomes authoritative;
- stale contender returns deterministic stale evidence and cannot overwrite the winner;
- no torn record/active state is observable after reconstruction;
- failed candidate cannot replace the winner;
- fresh provider reconstruction observes the same authoritative deployment and durable history;
- evidence contains no connection credentials;
- predecessor authenticated reconstruction remains green;
- declared validations pass.

# Non-goals

Factory/Runtime package E2E, production traffic/process rollback, shared PostgreSQL infrastructure, further API changes.

# Evidence expected

One authenticated PostgreSQL multi-writer product test plus repository-wide verification.

# Escalation

Stop if evidence requires product/provider changes, contracts/ADRs, workflow changes or Sprint 3 scope.
