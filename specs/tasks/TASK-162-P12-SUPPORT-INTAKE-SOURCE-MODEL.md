---
id: TASK-162
title: Model SupportEvidenceIntake sources
status: ready
priority: 501
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-161
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - project_docs/12-support-evolution/WBS.md
  - packages/support-evolution/intake.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-source.test.ts
  - specs/tasks/TASK-162-P12-SUPPORT-INTAKE-SOURCE-MODEL.md
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
Add structurally exclusive provider-neutral source variants for `observe_finding` and `human_request`, using only stable references/provenance.
# Acceptance criteria
Source variants are deterministic and cannot express provider locators or resolved values.
# Escalation
Stop if another bounded context must be modified.
