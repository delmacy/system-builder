---
id: TASK-249
title: Preserve declared generated view kind through Compiler and RuntimeModel
status: ready
priority: 249
milestone: M13
model_tier: standard
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-GENERATED-EXPERIENCE-RENDERING-01.md
  - project_docs/execution_planning/P13-PACKAGE-02.post-construction-b-revalidation.md
  - packages/compiler/authority-projection.ts
  - packages/compiler/runtime-model.ts
allowed_paths:
  - packages/compiler/**
  - tests/product/**
  - specs/tasks/TASK-249-P13-GENERATED-VIEW-KIND-PROJECTION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Carry the already-declared SystemDefinition view kind through the existing Construction B Compiler authority/view projection and RuntimeModel so downstream Runtime rendering can distinguish list/detail/form/etc without inventing type from names or ordering.

# Context
Construction B projects explicit view bindings but the current CompilerRuntimeViewDeclaration/compiled view projection drops the public `views.kind` value.

# Required change
Extend internal Compiler/RuntimeModel projection only so an explicitly declared supported view kind is preserved deterministically alongside the existing binding.

# Acceptance criteria
- Existing public SystemDefinition schema is unchanged.
- Projection is deterministic across declaration order.
- Missing/invalid internal view kind fails closed according to existing projection conventions rather than being inferred.
- Historical models without authority/generated view projection remain backward compatible.
- Product proof demonstrates RuntimeModel receives the declared kind with no free-text policy or secret/resolved-value leakage.

# Non-goals
Do not add a UI framework, renderer, new public contract, new view kind, authorization semantics, or P13-PACKAGE-03 scope.

# Escalation
Stop if satisfying this task requires a public schema change or L4 boundary change.