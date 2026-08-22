---
id: TASK-180
title: Add positive Support triage product coverage
status: ready
priority: 526
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-179
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-TRIAGE-CLASSIFICATION-01.md
  - packages/support-evolution/index.ts
  - packages/support-evolution/triage.ts
allowed_paths:
  - tests/product/support-triage-positive.test.ts
  - specs/tasks/TASK-180-P12-SUPPORT-TRIAGE-POSITIVE-TESTS.md
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
Add consolidated positive public-API coverage for the complete triage slice built by TASK-174..179.
# Context
Focused implementation tests need a single user-facing proof of deterministic decision, context refs, validation, serialization, intake linkage and no-leak-compatible data.
# Current behavior
No consolidated positive triage suite exists.
# Required change
Exercise all three classifications, deterministic identity, immutability, required context refs, intake linkage and JSON round-trip through public exports.
# Inputs / contracts
Public Support/Evolution API after TASK-179.
# Outputs / contracts
Product-test evidence only.
# Acceptance criteria
All valid Sprint behaviors are proven through public APIs with stable equality/identity assertions.
# Non-goals
Implementation edits, failure testing, auto-classification or case lifecycle.
# Evidence expected
`tests/product/support-triage-positive.test.ts` and GitHub Deterministic CI.
# Escalation
Stop if positive coverage requires out-of-scope contract changes.
