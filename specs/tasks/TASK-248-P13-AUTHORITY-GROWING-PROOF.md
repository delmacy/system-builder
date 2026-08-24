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

# Context
TASK-243..247 establish the complete bounded Construction B authority and generated-interaction chain on top of integrated Construction A.

# Current behavior
The growing proof currently stops at identity/session and does not yet prove the Construction B authority/generated-interaction behavior end to end.

# Required change
Extend representative product proof coverage across explicit role/membership, deterministic permission/policy decisions, generated bindings and shared gated interaction.

# Inputs / contracts
Use integrated Construction A behavior, the active Construction B Sprint plan, TASK-243..247 Runtime behavior and existing product proof fixtures.

# Outputs / contracts
A deterministic end-to-end product proof for autonomous fail-closed authority and generated interaction.

# Acceptance criteria
Proof covers allowed and denied actor, missing/ambiguous membership, missing permission/policy context, invalid generated binding, free-text policy non-execution, Runtime operation without Builder/Observe and no secret/resolved-value leakage.

# Non-goals
Do not add new product semantics, absorb technical debt, broaden authorization policy, require Builder/Observe, or start successor Package work.

# Evidence expected
Product/architecture/repository verification demonstrates the full representative chain and all fail-closed/security boundaries.

# Escalation
Stop if proof exposes a missing semantic outside the authorized TASK/Sprint/Work Package scope or requires an L4 change.
