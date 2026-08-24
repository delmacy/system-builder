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

# Acceptance criteria
No resolved credentials/tokens/endpoints; old models remain stable where declarations are absent; deterministic hashes/output preserved.
