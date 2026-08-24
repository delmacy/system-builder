---
id: TASK-245
title: Evaluate bounded structured policy declarations when explicitly present
status: ready
priority: 245
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-244]
context_paths:
  - project_docs/execution_planning/P13-PACKAGE-02.construction-b-l3-change-control.md
  - packages/runtime-core/**
allowed_paths:
  - packages/runtime-core/**
  - tests/product/runtime*.test.ts
  - specs/tasks/TASK-245-P13-RUNTIME-STRUCTURED-POLICY.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/compiler/**
max_files: 10
validation: [npm run test:product, npm run check:tasks, npm run verify]
---
# Objective
Evaluate only the bounded data-only structured policy representation introduced by TASK-240 when present; keep legacy free-text statement descriptive.

# Acceptance criteria
No eval/code/expression DSL; missing/unknown/ambiguous policy context fails closed; free-text statement never affects authorization.
