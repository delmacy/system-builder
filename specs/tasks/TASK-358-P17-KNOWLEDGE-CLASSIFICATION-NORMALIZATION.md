---
id: TASK-358
title: Add deterministic classification validation and normalization
status: ready
priority: 358
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-356
  - TASK-357
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-01.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01.md
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-358-P17-KNOWLEDGE-CLASSIFICATION-NORMALIZATION.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/catalog/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Provide deterministic fail-closed validation and canonical normalization across the TASK-355..357 Knowledge Boundary contracts.

# Context
Portable classification decisions require stable canonical handling before later consumer integration.

# Current behavior
The new classification/ownership/purpose/decision shapes require one deterministic normalization boundary.

# Inputs / contracts
- TASK-355 class/ownership descriptor;
- TASK-356 purpose/use restrictions;
- TASK-357 classification decision record.

# Outputs / contracts
- pure validation/normalization helpers;
- tests for valid, invalid and canonical-equivalent inputs.

# Required change
Normalize ordered/unordered fields only where semantics permit, reject unknown/duplicate/ambiguous state and inject no hidden defaults or authority.

# Acceptance criteria
- invalid structures fail explicitly;
- canonical-equivalent inputs normalize identically where ordering is non-semantic;
- no missing purpose/owner becomes implicit permission;
- no provider/network/storage/secret/authorization lookup exists;
- declared validations pass.

# Non-goals
No consumer integration, enforcement, promotion or inference.

# Evidence expected
Deterministic normalization and fail-closed product tests.

# Escalation
Stop if canonicalization would erase meaningful decision/evidence ordering or invent policy.
