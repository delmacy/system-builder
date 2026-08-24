---
id: TASK-241
title: Project and validate bounded Runtime authority declarations
status: ready
priority: 241
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-240]
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-AUTHORITY-GENERATED-INTERACTION-01.md
  - packages/compiler/runtime-projection.ts
  - packages/contracts/system-definition/system-definition.schema.json
allowed_paths:
  - packages/compiler/**
  - tests/product/compiler-runtime*.test.ts
  - specs/tasks/TASK-241-P13-AUTHORITY-COMPILER-PROJECTION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/runtime-core/**
max_files: 12
validation: [npm run test:product, npm run check:tasks, npm run verify]
---
# Objective
Normalize TASK-240 declarations into deterministic Compiler projection with explicit referential validation and no inferred role/view binding.

# Acceptance criteria
Unknown/duplicate/ambiguous role, membership, resource, action, entity, field or view references fail deterministically; identical logical input yields identical projection; free-text policy is not compiled as executable logic.
