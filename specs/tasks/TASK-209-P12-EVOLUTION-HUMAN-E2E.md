---
id: TASK-209
title: Prove human process-change request through Evolution linkage
status: ready
priority: 570
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-208
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-CONTROLLED-EVOLUTION-LINKAGE-01.md
  - packages/support-evolution/index.ts
  - packages/contracts/process-mirror/index.ts
  - packages/contracts/business-recipe/index.ts
  - packages/release/index.ts
allowed_paths:
  - tests/product/evolution-human-e2e.test.ts
  - specs/tasks/TASK-209-P12-EVOLUTION-HUMAN-E2E.md
forbidden_paths:
  - packages/**
  - .github/**
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Prove the positive WBS 12.3 chain from an actual human `process_change` intake through explicit Evolution triage, Evolution request evidence, Mirror/Recipe linkage and resulting release linkage.

# Required change
Use existing public APIs produced by TASK-202..208. Where ProcessMirror/BusinessRecipe have only public contracts and no executable module, construct minimal schema-conformant artifact identities solely as test evidence; do not invent product execution.

# Acceptance criteria
- origin is actual `SupportEvidenceIntake` human process-change capture;
- triage is explicitly `Evolution`;
- original intake/triage request remains traceable through final linkage;
- canonical ProcessMirror/BusinessRecipe contract identities are represented;
- resulting release identity/version/artifactRef is linked back;
- final artifacts validate and round-trip where APIs provide serialization;
- verification passes.
