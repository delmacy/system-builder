---
id: TASK-325
title: Define model capability and limit descriptors
status: committed
priority: 325
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-324
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-01.md
  - project_docs/execution_planning/P16-PROVIDER-ABSTRACTION-CONTRACT-01.md
  - project_docs/16-ai-gateway/WBS.md
  - project_docs/16-ai-gateway/scope/README.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-325-P16-MODEL-CAPABILITY-LIMIT-CONTRACT.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define explicit provider-neutral capability and limit descriptors required by WBS 16.1.3.

# Context
TASK-324 establishes the common request/response boundary. Consumers need explicit declared capabilities/limits rather than hidden provider assumptions.

# Current behavior
No canonical M16 capability/limit descriptor exists at the AI Gateway contract boundary.

# Inputs / contracts
- TASK-324 request/response contract;
- M16 WBS 16.1.3 and AI Gateway scope.

# Outputs / contracts
- additive capability and limit descriptors under `packages/contracts/ai-gateway/**`;
- focused validation/tests.

# Required change
Represent capabilities and bounded limits explicitly and deterministically, without encoding provider IDs, credentials, routing preference, prices/budgets or authorization.

# Acceptance criteria
- capabilities are explicit and provider-neutral;
- numeric/string limits validate deterministically when present;
- unknown/invalid descriptor shapes fail closed where validation exists;
- no routing/budget/fallback semantics are introduced;
- declared validations pass.

# Non-goals
No provider selection, adapter invocation, budget/quota policy, secrets or WBS 16.2/16.3 behavior.

# Evidence expected
Positive/negative product tests for capabilities/limits and predecessor compatibility.

# Escalation
Stop if capability representation requires provider-specific identity in core contracts or an undeclared L4 boundary change.
