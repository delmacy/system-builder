---
id: TASK-206
title: Link Evolution evidence to ProcessMirror and BusinessRecipe artifacts
status: ready
priority: 540
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-205
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-CONTROLLED-EVOLUTION-LINKAGE-01.md
  - project_docs/01-process-mirror/WBS.md
  - project_docs/02-business-recipe/WBS.md
  - packages/contracts/process-mirror/index.ts
  - packages/contracts/business-recipe/index.ts
  - packages/support-evolution/evolution-request.ts
allowed_paths:
  - packages/support-evolution/evolution-link.ts
  - packages/support-evolution/index.ts
  - tests/product/evolution-mirror-recipe-link.test.ts
  - specs/tasks/TASK-206-P12-EVOLUTION-MIRROR-RECIPE-LINK.md
forbidden_paths:
  - packages/contracts/**
  - packages/release/**
  - packages/deploy/**
  - .github/**
max_files: 4
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Represent the controlled reopening of business knowledge as deterministic linkage from validated `EvolutionRequestEvidence` to canonical ProcessMirror and BusinessRecipe artifact identities/references.

# Required change
Add an `EvolutionKnowledgeLink` (name may vary only if equally explicit) that records the evolution evidence identity plus ProcessMirror and BusinessRecipe artifact refs/schema identity needed for traceability. Consume existing public contract constants/schemas; do not modify them and do not invent an executor.

# Acceptance criteria
- linkage requires validated EvolutionRequestEvidence;
- ProcessMirror and BusinessRecipe refs are explicit and canonicalized;
- linkage proves ordering/relationship without executing Mirror or Recipe;
- repeated equivalent inputs have stable identity;
- no shared schema change;
- verification passes.
