---
id: TASK-172
title: Enforce complete Support intake source provenance
status: verification
priority: 511
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-171
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-contract.test.ts
  - tests/product/support-evidence-intake-validation.test.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-contract.test.ts
  - tests/product/support-evidence-intake-validation.test.ts
  - specs/tasks/TASK-172-P12-SUPPORT-INTAKE-PROVENANCE-CORRECTION.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
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
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Close the Sprint Review provenance-completeness gap in `SupportEvidenceIntake`.
# Context
Sprint Review found that `sourceKind` could be accepted with all source-specific provenance fields absent, despite TASK-162/163 promising explicit fail-closed provenance.
# Current behavior
`observe_finding` rejects partial finding provenance but accepts none; `human_request` rejects partial human provenance but accepts none.
# Required change
Require `findingCode` + `observationId` for every `observe_finding`, and `requestKind` + `actorRef` + `channelRef` for every `human_request`. Update affected contract coverage and add regressions for fully absent provenance.
# Inputs / contracts
TASK-162 source model, TASK-163 fail-closed validation, Sprint Review finding, current public Support intake API.
# Outputs / contracts
Bounded Support-local validation correction only; no new cross-context contract or lifecycle behavior.
# Acceptance criteria
Both source kinds fail deterministically when required provenance is absent or partial; all valid existing adapter/human paths remain accepted; full repository verification passes.
# Non-goals
Triage/classification, priority/SLA, remediation, production mutation, Observe changes, public L3/L4 contract changes.
# Evidence expected
Corrected intake validation, contract/regression tests and GitHub Deterministic CI on the correction head.
# Escalation
Stop if correction requires another bounded context, ADR or architectural widening.
