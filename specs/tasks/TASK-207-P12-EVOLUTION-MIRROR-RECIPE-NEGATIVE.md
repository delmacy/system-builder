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

# Context
TASK-206 introduces the explicit knowledge linkage. Controlled evolution must not be allowed to skip either ProcessMirror or BusinessRecipe or smuggle direct-execution semantics into a traceability artifact.

# Current behavior
Before this TASK, no dedicated negative proof exists for incomplete knowledge linkage or direct-execution field injection.

# Required change
Add fail-closed validation/tests for missing ProcessMirror/BusinessRecipe refs, substituted Evolution identity, unknown fields and forbidden execution semantics.

# Inputs / contracts
TASK-206 `EvolutionKnowledgeLink` and Sprint 4 boundary invariants.

# Outputs / contracts
Negative validation evidence only; no new public/shared contract.

# Acceptance criteria
- missing ProcessMirror or BusinessRecipe refs fail;
- substituted Evolution evidence identity fails;
- unknown fields/direct-execution flags are rejected;
- linkage API exposes no `execute`, `apply`, `deploy`, `mutateProduction` or equivalent operation;
- verification passes.

# Non-goals
Implementing authoring/execution, release linkage or deployment.

# Evidence expected
Focused negative product tests proving incomplete/bypassing linkage is rejected, plus repository verification.

# Escalation
Stop if enforcing the boundary requires modifying shared Mirror/Recipe contracts or adding an execution API.
