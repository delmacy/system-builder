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

# Context
The accepted L3 change control permits only bounded data-only structured policy semantics and explicitly keeps legacy free-text non-executable.

# Current behavior
Runtime does not yet evaluate the optional bounded structured policy context authorized for Construction B.

# Required change
Evaluate only explicitly represented bounded structured policy fields and fail closed when required policy context is missing, unknown or ambiguous.

# Inputs / contracts
Use TASK-240/TASK-242 structured policy descriptors and the permission decision path established by TASK-244.

# Outputs / contracts
A deterministic bounded policy result consumable by shared Runtime authorization gating.

# Acceptance criteria
No eval/code/expression DSL; missing/unknown/ambiguous policy context fails closed; free-text statement never affects authorization.

# Non-goals
Do not execute free-text, add a general policy DSL, mutate contracts/compiler, or introduce provider-specific authorization systems.

# Evidence expected
Runtime tests prove bounded structured evaluation, fail-closed behavior and free-text non-execution; repository verification passes.

# Escalation
Stop if requirements exceed the accepted bounded data-only representation or imply an unbounded policy language/L4 change.
