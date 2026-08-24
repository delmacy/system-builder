---
id: TASK-242
title: Materialize deterministic authorization and generated interaction RuntimeModel
status: ready
priority: 242
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-240, TASK-241]
context_paths:
  - packages/compiler/runtime-projection.ts
  - packages/compiler/runtime-model.ts
allowed_paths:
  - packages/compiler/runtime-model.ts
  - tests/product/compiler-runtime*.test.ts
  - specs/tasks/TASK-242-P13-AUTHORITY-RUNTIME-MODEL.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/deploy/**
max_files: 8
validation: [npm run test:product, npm run check:tasks, npm run verify]
---
# Objective
Carry normalized role/membership, permission/policy and generated view/form descriptors into RuntimeModel deterministically, reference-only and backward-compatibly.

# Context
TASK-241 provides the validated deterministic projection; RuntimeModel is the compiler-owned handoff into autonomous Runtime execution.

# Current behavior
RuntimeModel does not yet carry the normalized Construction B authority/generated-interaction descriptors.

# Required change
Add only the normalized reference-only descriptors required by the active Sprint while preserving historical models when declarations are absent.

# Inputs / contracts
Consume TASK-241 normalized projection and the existing RuntimeModel contract.

# Outputs / contracts
Deterministic RuntimeModel authority and generated-interaction descriptors with no resolved secret/provider values.

# Acceptance criteria
No resolved credentials/tokens/endpoints; old models remain stable where declarations are absent; deterministic hashes/output preserved.

# Non-goals
Do not change SystemDefinition, Deploy ownership, external binding ownership, or execute authorization inside Compiler.

# Evidence expected
Compiler/RuntimeModel product tests demonstrate deterministic, backward-compatible, reference-only materialization and repository verification passes.

# Escalation
Stop if the RuntimeModel change requires resolved runtime values, a second contract family, or L4 ownership/topology change.
