---
id: TASK-420
title: Bind approved process inputs to analysis and definition identities
status: blocked
priority: 420
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-419
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-PACKAGE-01-CONSOLIDATED-PREALPHA.md
  - project_docs/execution_planning/P19-FACTORY-JOURNEY-CONTRACT-01.md
  - project_docs/19-pre-alpha-productization/WBS.md
  - packages/contracts/factory-boundary/**
  - packages/contracts/business-recipe/**
  - packages/contracts/process-versioning/**
  - packages/contracts/system-analysis/**
  - packages/contracts/system-definition/**
allowed_paths:
  - packages/contracts/factory-boundary/**
  - tests/product/**
  - specs/tasks/TASK-420-P19-FACTORY-JOURNEY-INPUT-BINDING.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Bind the canonical approved/versioned BusinessRecipe/process revision identity to exact System Analysis and SystemDefinition identities within the factory journey.

# Context
This task follows the canonical envelope from TASK-419 and reuses P18 lineage plus existing analysis/definition public identities.

# Current behavior
The predecessor contracts expose the required identities independently, but the factory journey does not yet bind the exact approved process predecessor to analysis and definition stages.

# Required change
Extend the journey contract so the first materialization stages reference existing canonical process-versioning and analysis/definition identities exactly, preserving the P18 lineage chain and refusing inferred or mismatched predecessors.

# Inputs / contracts
Existing BusinessRecipe, process-versioning, System Analysis, SystemDefinition and factory-boundary public contracts.

# Outputs / contracts
Additive factory-journey bindings from canonical process revision identity through analysis and SystemDefinition identity.

# Acceptance criteria
- exact process artifact/revision identity is reused, not redefined;
- analysis and definition identities are explicit and predecessor-bound;
- stale, mismatched, missing or reversed predecessor links fail closed;
- human-decision authority remains external and unchanged;
- declared validations pass.

# Non-goals
No capability resolution, assembly, validation, compiler/release/deploy execution, or payload duplication.

# Evidence expected
Focused positive and negative product evidence for exact predecessor binding, plus declared repository validations.

# Escalation
Stop if additive binding requires Decision Boundary change, identity-model replacement or undeclared L4.
