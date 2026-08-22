---
id: TASK-210
title: Prove Evolution cannot bypass operational or production boundaries
status: ready
priority: 580
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
  - packages/release/index.ts
allowed_paths:
  - tests/product/evolution-boundary-negative.test.ts
  - specs/tasks/TASK-210-P12-EVOLUTION-BOUNDARY-NEGATIVE.md
forbidden_paths:
  - packages/**
  - .github/**
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Lock the negative boundary for controlled evolution: evidence/linkage must not become an operational-resolution or production-control API.

# Acceptance criteria
- Evolution still fails through SupportCaseRecord and ProblemRecord constructors;
- evolution APIs expose no execute/apply/deploy/remediate/mutateProduction operation;
- ReleaseRegistry publication/transition remains external to Support/Evolution;
- missing Mirror/Recipe/release lineage fails closed;
- no resolved secret/credential values are accepted in durable linkage refs;
- verification passes.
