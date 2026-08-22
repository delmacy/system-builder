---
id: TASK-169
title: Add negative SupportEvidenceIntake product coverage
status: ready
priority: 508
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
  - tests/product/support-evidence-intake-negative.test.ts
  - specs/tasks/TASK-169-P12-SUPPORT-INTAKE-NEGATIVE-TESTS.md
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
Add negative product coverage for the complete Support evidence intake boundary.

# Context
P12 intake must fail closed before later Support/Evolution classification or lifecycle routing can trust the evidence artifact.

# Current behavior
Predecessor implementation tests cover focused failures, but there is no consolidated public-API suite spanning all malformed/conflicting/no-leak categories.

# Required change
Add additive product tests for unknown fields, malformed required values, conflicting provenance, wrong content identity, invalid JSON and resolved-value markers.

# Inputs / contracts
Public Support/Evolution intake API after TASK-167 and stable `SUPPORT_INTAKE` diagnostic conventions.

# Outputs / contracts
Negative product-test evidence only; no implementation change.

# Acceptance criteria
Every invalid category fails deterministically and no test path implies or performs production mutation.

# Non-goals
Implementation edits, external security tooling, triage/classification or case lifecycle behavior.

# Evidence expected
`tests/product/support-evidence-intake-negative.test.ts` and GitHub Deterministic CI.

# Escalation
Stop if coverage requires broader architecture changes.