---
id: TASK-216
title: Expose generated entity APIs from materialized Runtime model
status: ready
priority: 216
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-215
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-CORE-EXECUTION-01.md
  - packages/runtime-core/index.ts
allowed_paths:
  - packages/runtime-core/**
  - tests/product/runtime*.test.ts
  - specs/tasks/TASK-216-P13-ENTITY-API.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/deploy/**
max_files: 8
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Expose deterministic HTTP APIs derived from the materialized entity model and backed by TASK-215 persistence.

# Acceptance criteria
- routes derive from generated entity identity rather than caller-authored route stand-ins;
- create/read/update/delete positive paths are proven;
- unknown entity/record, invalid method/body and validation failures return explicit deterministic diagnostics;
- health and predecessor state routes remain compatible;
- no auth/permissions/view behavior is introduced.

# Escalation
Stop if API execution requires P13-PACKAGE-02 identity/authority scope or a new public API contract.
