---
id: TASK-209
title: Prove human process-change request through Evolution linkage
status: verification
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

# Context
TASK-202..208 provide the bounded evidence/linkage APIs needed for controlled Evolution. The Sprint requires a growing proof rooted in the real P12 human intake path rather than isolated hand-authored downstream evidence.

# Current behavior
Before this TASK, the individual Evolution evidence and linkage components may be proven separately, but no single positive test traverses the actual human process-change intake through final release traceability.

# Required change
Use existing public APIs produced by TASK-202..208. Where ProcessMirror/BusinessRecipe have only public contracts and no executable module, construct minimal schema-conformant artifact identities solely as test evidence; do not invent product execution.

# Inputs / contracts
Actual `SupportEvidenceIntake` human capture, `SupportTriageDecision`, TASK-202..208 Support/Evolution APIs, canonical ProcessMirror/BusinessRecipe contract identities and public `PublishedRelease` evidence.

# Outputs / contracts
Executable product E2E evidence only. No product/public contract or implementation change.

# Acceptance criteria
- origin is actual `SupportEvidenceIntake` human process-change capture;
- triage is explicitly `Evolution`;
- original intake/triage request remains traceable through final linkage;
- canonical ProcessMirror/BusinessRecipe contract identities are represented;
- resulting release identity/version/artifactRef is linked back;
- final artifacts validate and round-trip where APIs provide serialization;
- verification passes.

# Non-goals
Modifying product packages, implementing Mirror/Recipe authoring, publishing/deploying a release or exercising production infrastructure.

# Evidence expected
One positive product E2E covering the complete human controlled-evolution linkage path and repository verification.

# Escalation
Stop if the proof requires product-code changes, invented Mirror/Recipe execution, shared-schema mutation or direct release/deploy authority.
