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

# Context
TASK-242 carries the normalized generated-interaction descriptors required by WBS 13.2.3.

# Current behavior
Runtime does not yet materialize deterministic renderer-agnostic bindings from those explicit descriptors.

# Required change
Resolve and materialize only explicit entity/field/action bindings, rejecting unknown or ambiguous references without inference.

# Inputs / contracts
Use TASK-242 RuntimeModel descriptors and existing Compiler/Runtime entity/action metadata.

# Outputs / contracts
Deterministic renderer-agnostic generated view/form binding descriptors for Runtime interaction.

# Acceptance criteria
Unknown/ambiguous bindings fail; ordering/names do not infer bindings; descriptors remain deterministic and renderer-agnostic.

# Non-goals
Do not introduce a mandatory UI framework, infer bindings, change SystemDefinition contracts, or add Builder/Observe runtime dependency.

# Evidence expected
Compiler/Runtime product tests prove deterministic explicit binding and invalid-reference failure; repository verification passes.

# Escalation
Stop if generated interaction requires framework-specific ownership, inferred binding semantics, new contracts, or L4 change.
