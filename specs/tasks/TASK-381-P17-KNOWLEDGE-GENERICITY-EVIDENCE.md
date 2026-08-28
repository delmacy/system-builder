---
id: TASK-381
title: Define genericity review and test evidence contract
status: verification
priority: 381
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-380]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-03.md
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-CONTRACT-01.md
  - specs/tasks/TASK-380-P17-KNOWLEDGE-TRANSFORMATION-RESULT.md
  - packages/contracts/knowledge-boundary/index.ts
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-381-P17-KNOWLEDGE-GENERICITY-EVIDENCE.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define explicit genericity review/test evidence for WBS 17.3.2.

# Context
A transformed candidate must be reviewable/testable for genericity without treating tests or model output as authority.

# Current behavior
No canonical payload-minimal evidence envelope records genericity checks against a transformation result.

# Inputs / contracts
TASK-379 candidate and TASK-380 transformation result.

# Outputs / contracts
Versioned deterministic genericity-evidence envelope with explicit review/test outcomes and references.

# Required change
Represent genericity evidence with fail-closed normalization, explicit evidence type/result and no promotion authority semantics.

# Acceptance criteria
- evidence is explicit, deterministic and payload-minimal;
- missing/unknown/conflicting evidence state fails closed;
- probabilistic or automated evidence cannot equal approval;
- candidate/transformation refs must match;
- declared validations pass.

# Non-goals
No reviewer workflow UI, model provider integration or promotion execution.

# Evidence expected
Positive/negative tests for genericity evidence and reference mismatch rejection.

# Escalation
Stop for Decision Boundary change, sensitive payload requirement or undeclared architecture change.