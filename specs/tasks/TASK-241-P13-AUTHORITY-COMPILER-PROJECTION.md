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

# Context
TASK-240 establishes the only shared-contract descriptors this projection may consume.

# Current behavior
Compiler projection does not yet normalize or validate the Construction B authority and generated-interaction descriptors.

# Required change
Project the authorized descriptors deterministically and reject invalid, duplicate, unknown or ambiguous references without inference.

# Inputs / contracts
Consume the TASK-240 SystemDefinition descriptors and the existing compiler runtime-projection contract.

# Outputs / contracts
Deterministic normalized compiler projection suitable for later RuntimeModel materialization.

# Acceptance criteria
Unknown/duplicate/ambiguous role, membership, resource, action, entity, field or view references fail deterministically; identical logical input yields identical projection; free-text policy is not compiled as executable logic.

# Non-goals
Do not modify shared contracts, Runtime execution, provider bindings, or introduce policy-expression evaluation.

# Evidence expected
Compiler product tests prove referential validation, deterministic projection and non-execution of free-text policy; task and repository verification pass.

# Escalation
Stop if projection requires new shared-contract semantics beyond TASK-240 or an L4 boundary change.
