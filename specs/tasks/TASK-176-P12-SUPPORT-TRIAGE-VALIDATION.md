---
id: TASK-176
title: Validate SupportTriageDecision fail closed
status: verification
priority: 522
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-175
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-TRIAGE-CLASSIFICATION-01.md
  - packages/support-evolution/triage.ts
allowed_paths:
  - packages/support-evolution/triage.ts
  - tests/product/support-triage-validation.test.ts
  - specs/tasks/TASK-176-P12-SUPPORT-TRIAGE-VALIDATION.md
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
Implement deterministic fail-closed validation for `SupportTriageDecision`.
# Context
The triage artifact must reject malformed, unknown, unsupported-classification and identity-divergent payloads before later lifecycle records can trust it.
# Current behavior
TASK-174/175 define the shape without arbitrary durable-input validation.
# Required change
Add a canonical validator for known fields, required decision/context provenance, the three supported classifications and content identity.
# Inputs / contracts
TASK-174/175 triage model and repository fail-closed conventions.
# Outputs / contracts
Support-local validation API with stable diagnostics.
# Acceptance criteria
Valid decisions normalize immutably; unknown/malformed/missing context, unsupported classification and wrong identity fail deterministically.
# Non-goals
Serialization, intake mapping, auto-classification, remediation or workflow execution.
# Evidence expected
Validation implementation/tests and GitHub Deterministic CI.
# Escalation
Stop if validation requires shared schemas or broader architecture.
