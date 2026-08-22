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
Add positive product coverage for the complete Support evidence intake slice built by TASK-161..167.

# Context
The implementation path now includes deterministic contract/source provenance, validation, serialization, finding mapping, human capture and no-leak enforcement. This TASK proves those behaviors through the public Support/Evolution API only.

# Current behavior
Focused predecessor tests exist per implementation TASK, but there is no consolidated positive product suite for the completed intake API.

# Required change
Add additive tests covering finding-origin intake, human-origin intake, stable optional correlations, determinism, immutability, validation and lossless JSON round-trip.

# Inputs / contracts
Public exports from `packages/support-evolution/index.ts` and the committed Sprint behavior from TASK-161..167.

# Outputs / contracts
Positive product-test evidence only; no product implementation change.

# Acceptance criteria
All positive Sprint behaviors are exercised through public APIs and deterministic equality/identity assertions.

# Non-goals
Implementation edits, negative/failure testing, triage/classification, remediation or later P12 lifecycle behavior.

# Evidence expected
`tests/product/support-evidence-intake-positive.test.ts` and GitHub Deterministic CI.

# Escalation
Stop if positive coverage exposes an out-of-scope contract change.