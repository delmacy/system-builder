---
id: TASK-243
title: Resolve explicit actor membership and role context at Runtime
status: ready
priority: 243
milestone: M13
model_tier: cheap
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-242]
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-IDENTITY-SESSION-01.md
  - packages/compiler/runtime-model.ts
  - packages/runtime-core/**
allowed_paths:
  - packages/runtime-core/**
  - tests/product/runtime*.test.ts
  - specs/tasks/TASK-243-P13-RUNTIME-ROLE-RESOLUTION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/compiler/**
max_files: 12
validation: [npm run test:product, npm run check:tasks, npm run verify]
---
# Objective
Resolve authenticated actor context to only explicitly declared active membership/role references.

# Acceptance criteria
Missing, disabled, unknown or ambiguous membership/role fails closed; authentication alone yields no role; actor identity/name/provider/order cannot imply authority.
