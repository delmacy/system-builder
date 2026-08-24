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

# Context
TASK-244/TASK-245 provide shared authority decisions and TASK-246 provides explicit generated-interaction bindings.

# Current behavior
Representative action execution and generated interaction are not yet demonstrably gated by the same authority result.

# Required change
Route both representative execution paths through the same bounded fail-closed authorization decision without external Builder/Observe lookup.

# Inputs / contracts
Use existing actor/session context, TASK-244/TASK-245 authority results and TASK-246 generated bindings.

# Outputs / contracts
Consistent gated Runtime action and generated-interaction behavior for allowed and denied actors.

# Acceptance criteria
Allowed actor succeeds; denied actor is rejected consistently on both paths; no Builder/Observe lookup; actor/session evidence remains bounded and secret-free.

# Non-goals
Do not create a new authorization path, infer permissions, add Builder/Observe runtime dependency, or broaden UI/runtime scope.

# Evidence expected
Runtime product tests demonstrate identical allow/deny gating across both representative paths with bounded evidence; repository verification passes.

# Escalation
Stop if the two paths require incompatible authority semantics, new contracts, or an L4 ownership/topology change.
