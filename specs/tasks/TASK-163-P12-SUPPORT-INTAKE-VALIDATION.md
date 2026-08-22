---
id: TASK-163
title: Validate SupportEvidenceIntake fail closed
status: ready
priority: 502
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-162
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/support-evolution/intake.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-validation.test.ts
  - specs/tasks/TASK-163-P12-SUPPORT-INTAKE-VALIDATION.md
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
Implement deterministic fail-closed validation for malformed, unknown, conflicting-source and identity-mismatched intake payloads.
# Acceptance criteria
Invalid input is rejected with stable `SUPPORT_INTAKE` errors; valid payloads normalize immutably.
# Escalation
Stop if validation requires shared/canonical contract changes.
