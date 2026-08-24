---
id: TASK-248
title: Prove fail-closed autonomous authority and generated interaction end to end
status: ready
priority: 248
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-243, TASK-244, TASK-245, TASK-246, TASK-247]
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-IDENTITY-SESSION-01.md
  - project_docs/execution_planning/P13-RUNTIME-AUTHORITY-GENERATED-INTERACTION-01.md
  - tests/product/**
allowed_paths:
  - tests/product/**
  - packages/runtime-core/**
  - specs/tasks/TASK-248-P13-AUTHORITY-GROWING-PROOF.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
max_files: 16
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Extend the growing real-artifact proof from integrated identity/session through explicit role/membership, allow/deny authorization and generated interaction.

# Acceptance criteria
Proof covers allowed and denied actor, missing/ambiguous membership, missing permission/policy context, invalid generated binding, free-text policy non-execution, Runtime operation without Builder/Observe and no secret/resolved-value leakage.
