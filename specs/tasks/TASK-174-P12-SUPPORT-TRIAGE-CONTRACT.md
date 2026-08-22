---
id: TASK-174
title: Define SupportTriageDecision contract
status: verification
priority: 520
milestone: M12
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-TRIAGE-CLASSIFICATION-01.md
  - project_docs/12-support-evolution/WBS.md
  - project_docs/12-support-evolution/scope/README.md
  - packages/support-evolution/index.ts
  - packages/support-evolution/intake.ts
  - docs/architecture/MASTER_BLUEPRINT.md
allowed_paths:
  - packages/support-evolution/triage.ts
  - packages/support-evolution/index.ts
  - tests/product/support-triage-contract.test.ts
  - specs/tasks/TASK-174-P12-SUPPORT-TRIAGE-CONTRACT.md
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
max_files: 4
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Define additive `SupportTriageDecision` with deterministic identity, intake reference, explicit `Support|Maintenance|Evolution` classification, triage actor/time provenance and reason.
# Context
Sprint 1 integrated durable intake. WBS 12.1.2 and the Master Blueprint require classification while preserving controlled evolution.
# Current behavior
No durable triage decision exists.
# Required change
Create a Support/Evolution-local immutable content-addressed decision contract and export it from the package. Classification is supplied explicitly; no inference engine is introduced.
# Inputs / contracts
Validated `SupportEvidenceIntake` identity, WBS 12.1.2, Sprint manifest and lifecycle boundary.
# Outputs / contracts
Additive Support/Evolution public-module API only; no shared contract changes.
# Acceptance criteria
Three canonical classifications are expressible deterministically; decision is immutable/content-addressed and references intake rather than embedding upstream internals.
# Non-goals
Priority context, deep validation, serialization, auto-classification, remediation, case management or Evolution execution.
# Evidence expected
Contract implementation, focused product test and GitHub Deterministic CI.
# Escalation
Stop if shared contracts, another bounded context or L4 architecture is required.
