---
id: TASK-073
title: Define bounded Runtime state and migration descriptor contract
status: ready
priority: 389
milestone: M5
model_tier: cheap
risk: medium
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-072
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P4-PACKAGE-01.md
  - project_docs/execution_planning/P4-MIGRATION-STATE-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/08-compiler/WBS.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/runtime-core/index.ts
  - specs/tasks/TASK-072-SECRET-STATE-E2E.md
  - specs/tasks/TASK-073-RUNTIME-STATE-MIGRATION-CONTRACT.md
allowed_paths:
  - packages/runtime-core/state-migrations.ts
  - packages/runtime-core/index.ts
  - tests/product/runtime-state-migrations.test.ts
  - specs/tasks/TASK-073-RUNTIME-STATE-MIGRATION-CONTRACT.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/deploy/**
  - packages/release/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
max_files: 4
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Define a bounded provider-neutral Runtime state/migration descriptor contract that can be consumed by Compiler and Deploy while keeping connection secrets external and leaving canonical Release/Environment/Deployment schemas unchanged.

# Context

P3 proved in-process state only. P4 requires migration ownership before PostgreSQL is introduced. The first step is a deterministic metadata boundary that identifies the state capability, SQL-store class, symbolic connection binding name and ordered migration source assets without carrying an EnvironmentProfile reference or resolved value.

# Current behavior

Runtime Core exposes environment requirements, health/bootstrap behavior and a generated persistent service with an in-process counter. There is no provider-neutral state requirement or migration descriptor contract, no migration ownership metadata, and no deterministic normalization boundary for migration inputs.

# Required change

Add `packages/runtime-core/state-migrations.ts` with immutable `RuntimeStateRequirement` / `RuntimeStateMigrationDescriptor` types and a deterministic normalizer. Export them from Runtime Core. The normalizer must validate non-empty tokens, `sql` store kind, a `secret-reference` connection binding name, positive integer migration order, safe `migrations/...` relative paths, non-empty migration source content, matching capability ownership and uniqueness. Normalize migrations by order/id/path and reject inline `value` or durable `reference` fields on the connection binding.

# Inputs / contracts

P4 package/Sprint authority, ADR-0002, ADR-0007, WBS 8.1/10.2/13.1 and the predecessor state/secret proof.

# Outputs / contracts

A bounded L3 Runtime Core metadata API only. No canonical `packages/contracts/**` schema, ReleaseArtifact schema or EnvironmentProfile schema change.

# Acceptance criteria

- requirement is immutable and deterministic;
- connection binding contains only `name` + `kind: secret-reference`;
- inline `value` and durable `reference` are rejected;
- migration paths cannot escape `migrations/`;
- migration order is positive/integer and output is sorted deterministically;
- duplicate migration id/order/path within a requirement fails closed;
- migration capability must match owning requirement;
- source content is preserved as Compiler input, never treated as environment/secret state;
- declared validations pass.

# Non-goals

Compiler generation, Deploy preflight, PostgreSQL connection/application, database provisioning, public contract changes or capability graph solving.

# Evidence expected

Focused product tests for positive normalization, input-order determinism and negative binding/path/order/duplicate/capability cases, plus GitHub Deterministic CI.

# Escalation

Stop if this contract requires changing canonical EnvironmentProfile/Release/Deployment contracts or accepted architecture.
