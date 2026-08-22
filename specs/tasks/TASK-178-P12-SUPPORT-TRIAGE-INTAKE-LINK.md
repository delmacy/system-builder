---
id: TASK-178
title: Link intake evidence into triage decisions
status: ready
priority: 524
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-177
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-TRIAGE-CLASSIFICATION-01.md
  - packages/support-evolution/intake.ts
  - packages/support-evolution/triage.ts
allowed_paths:
  - packages/support-evolution/triage.ts
  - tests/product/support-triage-intake-link.test.ts
  - specs/tasks/TASK-178-P12-SUPPORT-TRIAGE-INTAKE-LINK.md
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
Create triage decisions from validated Support intake evidence without embedding or mutating upstream evidence.
# Context
Sprint 2 must extend the real Sprint 1 boundary, not hand-author unrelated downstream artifacts.
# Current behavior
Triage can exist independently but has no predecessor-aware helper.
# Required change
Add a Support-local helper accepting a validated/structurally valid `SupportEvidenceIntake` plus explicit decision/context inputs and preserving `intakeId`/source evidence linkage.
# Inputs / contracts
Public Support intake and triage APIs.
# Outputs / contracts
Deterministic intake-to-triage linkage local to Support/Evolution.
# Acceptance criteria
Linkage preserves intake identity/provenance references and adds only explicit triage decision data; intake remains immutable.
# Non-goals
Observe imports, automatic classification, case creation, remediation or production mutation.
# Evidence expected
Predecessor integration test and GitHub Deterministic CI.
# Escalation
Stop if upstream implementation must be changed.
