---
id: TASK-181
title: Add negative Support triage product coverage
status: verification
priority: 527
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
  - tests/product/support-triage-negative.test.ts
  - specs/tasks/TASK-181-P12-SUPPORT-TRIAGE-NEGATIVE-TESTS.md
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
Add consolidated negative public-API coverage for the Support triage boundary.
# Context
Downstream lifecycle routing can trust triage evidence only if malformed/unknown/unsupported/missing-context/identity-divergent/no-leak inputs fail closed.
# Current behavior
Focused predecessor tests exist but no consolidated failure suite spans the full public boundary.
# Required change
Add tests for unsupported classification, absent decision/context provenance, malformed refs, unknown fields, wrong identity, invalid JSON and resolved-value markers.
# Inputs / contracts
Public Support/Evolution triage API and stable diagnostics after TASK-179.
# Outputs / contracts
Negative product-test evidence only.
# Acceptance criteria
Every invalid category fails deterministically and no test path performs classification inference or production mutation.
# Non-goals
Implementation edits, external security tooling, remediation or case lifecycle.
# Evidence expected
`tests/product/support-triage-negative.test.ts` and GitHub Deterministic CI.
# Escalation
Stop if coverage requires broader architecture changes.
