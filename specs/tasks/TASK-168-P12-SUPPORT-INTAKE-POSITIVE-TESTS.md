---
id: TASK-168
title: Add positive SupportEvidenceIntake product coverage
status: ready
priority: 507
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-167
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/support-evolution/index.ts
  - packages/support-evolution/intake.ts
allowed_paths:
  - tests/product/support-evidence-intake-positive.test.ts
  - specs/tasks/TASK-168-P12-SUPPORT-INTAKE-POSITIVE-TESTS.md
forbidden_paths:
  - packages/**
  - docs/adr/**
  - .github/**
  - tooling/**
  - package.json
  - package-lock.json
max_files: 2
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Add positive product tests for finding-origin intake, human-origin intake, determinism, immutability and lossless round-trip.
# Acceptance criteria
Public Support/Evolution intake behavior is proven without implementation edits.
# Escalation
Stop if tests expose an out-of-scope contract change.
