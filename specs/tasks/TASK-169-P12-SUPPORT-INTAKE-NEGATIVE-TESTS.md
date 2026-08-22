---
id: TASK-169
title: Add negative SupportEvidenceIntake product coverage
status: verification
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
Add negative coverage for the complete Support evidence intake boundary.
# Context
Later lifecycle behavior must receive fail-closed trustworthy intake evidence.
# Current behavior
No consolidated public-API negative suite existed.
# Required change
Cover unknown fields, malformed values, conflicting provenance, wrong identity, invalid JSON and resolved-value markers.
# Inputs / contracts
Public Support/Evolution API and stable diagnostics.
# Outputs / contracts
Negative product-test evidence only.
# Acceptance criteria
Invalid categories fail deterministically and perform no production mutation.
# Non-goals
Implementation edits, triage or external security tooling.
# Evidence expected
Negative test and CI.
# Implementation evidence
Implemented in `fb70af675e61be653da1b45494bd0139320b83d6`; cumulative CI #437 PASS.
# Escalation
Stop for broader architecture changes.
