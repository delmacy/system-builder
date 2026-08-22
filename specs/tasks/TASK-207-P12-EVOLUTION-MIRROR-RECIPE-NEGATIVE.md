---
id: TASK-207
title: Reject incomplete or bypassing Mirror/Recipe evolution linkage
status: ready
priority: 550
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-206
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-CONTROLLED-EVOLUTION-LINKAGE-01.md
  - packages/support-evolution/evolution-link.ts
allowed_paths:
  - packages/support-evolution/evolution-link.ts
  - tests/product/evolution-mirror-recipe-negative.test.ts
  - specs/tasks/TASK-207-P12-EVOLUTION-MIRROR-RECIPE-NEGATIVE.md
forbidden_paths:
  - packages/contracts/**
  - packages/release/**
  - packages/deploy/**
  - .github/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Make the WBS 12.3.2 boundary fail closed: business behavior evolution cannot be represented as complete without explicit Mirror and Recipe linkage.

# Acceptance criteria
- missing ProcessMirror or BusinessRecipe refs fail;
- substituted Evolution evidence identity fails;
- unknown fields/direct-execution flags are rejected;
- linkage API exposes no `execute`, `apply`, `deploy`, `mutateProduction` or equivalent operation;
- verification passes.
