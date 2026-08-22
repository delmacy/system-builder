---
id: TASK-215
title: Execute generated entity persistence in autonomous Runtime
status: pending
priority: 215
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-214
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-CORE-EXECUTION-01.md
  - packages/runtime-core/index.ts
  - packages/runtime-core/postgres-state.ts
  - packages/postgres/**
allowed_paths:
  - packages/runtime-core/**
  - packages/postgres/**
  - tests/product/runtime*.test.ts
  - tests/product/postgres*.test.ts
  - specs/tasks/TASK-215-P13-ENTITY-PERSISTENCE.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/deploy/**
max_files: 12
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Add the bounded Runtime execution layer that persists generated entities through the existing PostgreSQL/external-binding boundary.

# Context
TASK-214 materializes the deterministic entity model and migrations. P4-P10 already establish PostgreSQL-backed state, external symbolic bindings, runtime-only resolved values and autonomous operation. Construction A should reuse those boundaries rather than create a new persistence subsystem.

# Current behavior
The Runtime can execute the reference `state.counter` capability against PostgreSQL and survive restart/redeploy, but it has no general entity persistence surface derived from generated entity metadata.

# Required change
Use the TASK-214 runtime model to implement bounded generated entity CRUD persistence through the existing Runtime/PostgreSQL path. Validate entity/field identity and payload types deterministically, preserve fail-closed behavior, and keep resolved connection material runtime-only.

# Inputs / contracts
TASK-214 runtime model/migrations; current Runtime/PostgreSQL state support; external EnvironmentProfile/SecretResolver binding behavior as predecessor evidence; ADR-0002 autonomy boundary.

# Outputs / contracts
Runtime-local generated entity persistence behavior backed by existing PostgreSQL infrastructure. No new public shared contract or deployment authority.

# Acceptance criteria
- generated entity create/read/update/delete behavior uses the materialized runtime model;
- required fields/types are validated deterministically;
- unknown entities/fields and invalid payloads fail closed;
- persistence survives Runtime restart/redeploy through the existing PostgreSQL path;
- DATABASE_URL or equivalent resolved material is consumed only at runtime and never emitted into durable evidence;
- existing state.counter behavior remains green.

# Non-goals
HTTP API exposure beyond persistence internals; auth/permissions/views; jobs/events/files/integrations; new storage/database ownership; Deploy or production topology changes.

# Evidence expected
Focused Runtime/PostgreSQL product tests for CRUD, validation/failure behavior, restart/redeploy persistence, no-value leakage and state.counter regression, plus repository-wide verification.

# Escalation
Stop if implementation requires auth/permissions/views, a new storage ownership boundary or production topology work.
