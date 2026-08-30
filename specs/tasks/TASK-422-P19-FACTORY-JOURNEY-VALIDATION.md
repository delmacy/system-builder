---
id: TASK-422
title: Validate canonical factory journey fail-closed
status: blocked
priority: 422
milestone: M19
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-421
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-PACKAGE-01-CONSOLIDATED-PREALPHA.md
  - project_docs/execution_planning/P19-FACTORY-JOURNEY-CONTRACT-01.md
  - project_docs/19-pre-alpha-productization/WBS.md
  - packages/contracts/factory-boundary/**
  - packages/contracts/process-versioning/**
allowed_paths:
  - packages/contracts/factory-boundary/**
  - tests/product/**
  - specs/tasks/TASK-422-P19-FACTORY-JOURNEY-VALIDATION.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/contracts/decision-boundary/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Provide deterministic normalization and fail-closed validation for the complete WBS 19.1.1 journey contract.

# Required change
Validate ordered stage identity, predecessor continuity, canonical lineage and compatibility across the journey envelope, rejecting missing, stale, duplicate, reordered, incompatible, forged and lineage-broken references.

# Acceptance criteria
- canonical valid journey normalizes deterministically;
- missing/duplicate/reordered stages fail closed;
- stale or incompatible predecessor identity fails closed;
- forged cross-process/system/release/deployment links fail closed;
- unknown extra state is rejected where the contract requires closed shape;
- declared validations pass.

# Non-goals
No execution command/API, runtime behavior, persistence, release publication or deployment side effects.

# Escalation
Stop for destructive public-contract replacement, new authority semantics or undeclared L4.