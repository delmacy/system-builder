---
id: TASK-164
title: Serialize SupportEvidenceIntake losslessly
status: ready
priority: 503
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-163
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/support-evolution/intake.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-serialization.test.ts
  - specs/tasks/TASK-164-P12-SUPPORT-INTAKE-SERIALIZATION.md
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
Add lossless `toJson`/`fromJson` round-trip through validation, preserving identity and optional correlation fields.
# Acceptance criteria
Round-trip is lossless; invalid JSON/payloads fail closed.
# Escalation
Stop if external serialization dependencies are required.
