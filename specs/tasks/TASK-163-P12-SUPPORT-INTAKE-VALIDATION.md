---
id: TASK-163
title: Validate SupportEvidenceIntake fail closed
status: verification
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
Implement deterministic fail-closed validation for `SupportEvidenceIntake`.
# Context
Source provenance must be trusted before downstream use.
# Current behavior
No arbitrary durable-payload validator existed before this TASK.
# Required change
Reject unknown/malformed/conflicting/identity-divergent payloads and normalize valid ones.
# Inputs / contracts
TASK-161/162 model and deterministic identity conventions.
# Outputs / contracts
Support-local validation API with stable diagnostics.
# Acceptance criteria
Invalid input fails deterministically; valid input normalizes immutably.
# Non-goals
Serialization, mapping, triage or mutation.
# Evidence expected
Implementation/tests and CI.
# Implementation evidence
Implemented in `fa9f01c258593d359118e299f6692697e2a18748`; CI #431 PASS.
# Escalation
Stop for shared/canonical contract changes.
