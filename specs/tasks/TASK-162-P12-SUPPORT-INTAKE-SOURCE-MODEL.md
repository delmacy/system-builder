---
id: TASK-162
title: Model SupportEvidenceIntake sources
status: verification
priority: 501
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-161
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - project_docs/12-support-evolution/WBS.md
  - packages/support-evolution/intake.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-source.test.ts
  - specs/tasks/TASK-162-P12-SUPPORT-INTAKE-SOURCE-MODEL.md
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
Model explicit provider-neutral Observe-finding and human evidence sources.
# Context
TASK-161 created the intake envelope; WBS 12.1.1 requires both source families.
# Current behavior
The base contract lacked explicit source provenance fields.
# Required change
Add stable reference-only source variants and focused tests.
# Inputs / contracts
TASK-161, Sprint manifest and Support/Evolution WBS.
# Outputs / contracts
Support-local source/provenance types.
# Acceptance criteria
Both variants are deterministic, portable and reference-only.
# Non-goals
Observe imports, validation, serialization, triage or mutation.
# Evidence expected
Implementation/tests and CI.
# Implementation evidence
Implemented in `5f8e44e994f5707a8d77e82f02004420fbba17fb`; CI #430 PASS.
# Escalation
Stop for cross-context/canonical expansion.
