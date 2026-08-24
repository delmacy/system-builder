---
id: TASK-246
title: Materialize deterministic generated view and form bindings
status: ready
priority: 246
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-242]
context_paths:
  - packages/compiler/runtime-model.ts
  - packages/runtime-core/**
allowed_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - tests/product/runtime*.test.ts
  - tests/product/compiler-runtime*.test.ts
  - specs/tasks/TASK-246-P13-GENERATED-VIEW-BINDINGS.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
max_files: 14
validation: [npm run test:product, npm run check:tasks, npm run verify]
---
# Objective
Materialize explicit view/form bindings to already-declared Runtime entities, fields and actions without framework-specific UI assumptions.

# Acceptance criteria
Unknown/ambiguous bindings fail; ordering/names do not infer bindings; descriptors remain deterministic and renderer-agnostic.
