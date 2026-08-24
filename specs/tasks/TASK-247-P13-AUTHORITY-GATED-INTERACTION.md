---
id: TASK-247
title: Gate representative Runtime action and generated interaction through shared authority
status: ready
priority: 247
milestone: M13
model_tier: cheap
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-244, TASK-245, TASK-246]
context_paths:
  - packages/runtime-core/**
  - project_docs/execution_planning/P13-RUNTIME-IDENTITY-SESSION-01.md
allowed_paths:
  - packages/runtime-core/**
  - tests/product/runtime*.test.ts
  - specs/tasks/TASK-247-P13-AUTHORITY-GATED-INTERACTION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
max_files: 14
validation: [npm run test:product, npm run check:tasks, npm run verify]
---
# Objective
Use one authorization decision path for a representative API/action execution and corresponding generated view/form interaction.

# Acceptance criteria
Allowed actor succeeds; denied actor is rejected consistently on both paths; no Builder/Observe lookup; actor/session evidence remains bounded and secret-free.
