---
id: TASK-177
title: Serialize SupportTriageDecision losslessly
status: ready
priority: 523
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-176
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-TRIAGE-CLASSIFICATION-01.md
  - packages/support-evolution/triage.ts
allowed_paths:
  - packages/support-evolution/triage.ts
  - tests/product/support-triage-serialization.test.ts
  - specs/tasks/TASK-177-P12-SUPPORT-TRIAGE-SERIALIZATION.md
forbidden_paths:
  - packages/contracts/**
  - packages/observe/**
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
Add lossless JSON serialization for validated `SupportTriageDecision`.
# Context
Triage evidence must remain durable and portable across later Support/Evolution lifecycle stages.
# Current behavior
TASK-176 validates but has no transport round-trip.
# Required change
Add `toJson/fromJson` through the canonical validator, preserving identity, classification, provenance and every context reference.
# Inputs / contracts
Validated TASK-176 triage contract.
# Outputs / contracts
Support-local lossless serialization API.
# Acceptance criteria
Valid decision round-trips without identity/field loss; malformed JSON or invalid payload fails closed.
# Non-goals
Storage, external serialization libraries, classification inference or remediation.
# Evidence expected
Serialization tests and GitHub Deterministic CI.
# Escalation
Stop if external dependencies or shared contract changes are required.
