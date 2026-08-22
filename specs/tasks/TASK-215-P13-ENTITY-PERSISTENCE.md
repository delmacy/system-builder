---
id: TASK-215
title: Execute generated entity persistence in autonomous Runtime
status: pending
priority: 215
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
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

# Acceptance criteria
- generated entity create/read/update/delete behavior uses the materialized runtime model;
- required fields/types are validated deterministically;
- unknown entities/fields and invalid payloads fail closed;
- persistence survives Runtime restart/redeploy through the existing PostgreSQL path;
- DATABASE_URL or equivalent resolved material is consumed only at runtime and never emitted into durable evidence;
- existing state.counter behavior remains green.

# Escalation
Stop if implementation requires auth/permissions/views, a new storage ownership boundary or production topology work.
