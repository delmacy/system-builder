---
id: TASK-165
title: Map deployment findings into SupportEvidenceIntake
status: ready
priority: 504
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-164
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/observe/index.ts
  - packages/support-evolution/intake.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-finding-mapping.test.ts
  - specs/tasks/TASK-165-P12-SUPPORT-INTAKE-FINDING-MAPPING.md
forbidden_paths:
  - packages/observe/**
  - packages/contracts/**
  - packages/deploy/**
  - packages/runtime-core/**
  - docs/adr/**
  - .github/**
  - tooling/**
  - package.json
  - package-lock.json
max_files: 3
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Add structural `fromDeploymentFinding` adapter without importing Observe implementation internals.
# Acceptance criteria
Finding id/code/message and correlation refs become deterministic Support intake evidence; malformed finding-like input fails closed.
# Escalation
Stop if direct compile-time dependency on Observe internals or a new canonical cross-context contract is required.
