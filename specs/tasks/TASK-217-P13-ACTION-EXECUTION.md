---
id: TASK-217
title: Execute explicitly declared generated actions
status: pending
priority: 217
milestone: M13
model_tier: strong
risk: high
architecture_impact: false
depends_on:
  - TASK-212
  - TASK-216
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-CORE-EXECUTION-01.md
  - packages/contracts/system-definition/system-definition.schema.json
  - packages/runtime-core/index.ts
allowed_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - tests/product/runtime*.test.ts
  - tests/product/compiler*.test.ts
  - specs/tasks/TASK-217-P13-ACTION-EXECUTION.md
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
Execute only the action effects explicitly declared under TASK-212 and materialized by Compiler; never infer semantics from action name.

# Acceptance criteria
- declared action identity/effect is present in generated runtime model;
- supported declared effects execute against generated entity persistence;
- unknown action, unsupported effect, invalid target and invalid input fail closed;
- ordering and generated output remain deterministic;
- no Builder call or authoring behavior is introduced.

# Escalation
Stop if additional action semantics require another shared-contract change or a new runtime ownership boundary.
