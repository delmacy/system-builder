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

# Context
Construction A supplies authenticated actor/session context; TASK-242 supplies the bounded authority descriptors carried by RuntimeModel.

# Current behavior
Authentication exists, but Runtime does not yet resolve explicit membership/role authority for the authenticated actor.

# Required change
Resolve only declared active membership and role references and fail closed for missing, disabled, unknown or ambiguous authority state.

# Inputs / contracts
Use existing authenticated actor/session context and TASK-242 RuntimeModel descriptors.

# Outputs / contracts
A bounded Runtime role/membership context used by later permission/policy evaluation.

# Acceptance criteria
Missing, disabled, unknown or ambiguous membership/role fails closed; authentication alone yields no role; actor identity/name/provider/order cannot imply authority.

# Non-goals
Do not modify authentication/session contracts, infer default roles, add provider-specific IAM, or change Compiler/shared contracts.

# Evidence expected
Runtime product tests cover valid explicit resolution and all fail-closed cases; task and repository verification pass.

# Escalation
Stop if authority resolution requires implicit privilege inference, new shared-contract semantics, or an L4 change.
