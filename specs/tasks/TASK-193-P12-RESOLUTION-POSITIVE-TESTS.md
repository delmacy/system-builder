---
id: TASK-193
title: Add positive operational resolution coverage
status: ready
priority: 548
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on: [TASK-192]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-RESOLUTION-01.md
  - packages/support-evolution/index.ts
allowed_paths:
  - tests/product/support-resolution-positive.test.ts
  - specs/tasks/TASK-193-P12-RESOLUTION-POSITIVE-TESTS.md
forbidden_paths:
  - packages/contracts/**
  - packages/observe/**
  - packages/deploy/**
  - .github/**
  - tooling/**
max_files: 2
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Prove canonical positive Support and Maintenance operational-resolution flows.
# Context
TASK-185..192 establish all Sprint 3 artifacts and boundaries.
# Current behavior
No consolidated positive proof exists.
# Required change
Add deterministic tests covering Support case + knowledge + resolution and Maintenance problem + permitted correction + resolution, including lossless round-trip where public APIs expose it.
# Inputs / contracts
Public `packages/support-evolution` API.
# Outputs / contracts
Positive regression proof for WBS 12.2.x.
# Acceptance criteria
Both explicit lifecycle paths succeed deterministically without inferred fields or production actions.
# Non-goals
Evolution execution or automatic policy.
# Evidence expected
Passing product test and CI.
# Escalation
Stop if test construction requires downstream mutation APIs.
