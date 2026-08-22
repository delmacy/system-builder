---
id: TASK-214
title: Materialize deterministic runtime model and entity migrations
status: ready
priority: 214
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-213
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-CORE-EXECUTION-01.md
  - packages/compiler/index.ts
  - packages/compiler/runtime-capabilities.ts
  - packages/runtime-core/state-migrations.ts
allowed_paths:
  - packages/compiler/**
  - packages/runtime-core/state-migrations.ts
  - tests/product/compiler*.test.ts
  - tests/product/runtime-compiler.test.ts
  - specs/tasks/TASK-214-P13-RUNTIME-MODEL-MATERIALIZATION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/deploy/**
max_files: 10
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Generate a deterministic runtime model and PostgreSQL migration assets from the validated SystemDefinition entity/action/process projection.

# Acceptance criteria
- generated model is canonical/order-independent and contains only executable metadata;
- entity fields map deterministically to bounded PostgreSQL persistence assets;
- duplicate/invalid entity/action/process identities fail closed;
- migrations are included in existing artifact integrity/file hashing;
- no resolved environment/config/secret value is emitted;
- existing state.counter migrations remain compatible.

# Escalation
Stop if entity persistence requires a new database ownership boundary or a shared contract change beyond TASK-212.
