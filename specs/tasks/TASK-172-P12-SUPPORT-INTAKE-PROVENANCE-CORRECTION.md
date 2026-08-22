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
Sprint Review found that `sourceKind` could be accepted with all source-specific provenance absent despite the explicit/fail-closed source contract.
# Current behavior
Corrected: every `observe_finding` requires `findingCode + observationId`; every `human_request` requires `requestKind + actorRef + channelRef`.
# Required change
Require complete source provenance while preserving existing base-field validation precedence and all valid adapter/human paths.
# Inputs / contracts
TASK-162 source model, TASK-163 validation, Sprint Review finding and public Support intake API.
# Outputs / contracts
Bounded Support-local validation correction only.
# Acceptance criteria
Absent/partial provenance fails deterministically; valid paths remain accepted; malformed base fields preserve their established diagnostics; repository verification passes.
# Non-goals
Triage/classification, priority/SLA, remediation, production mutation, Observe changes or L3/L4 widening.
# Evidence expected
Initial correction `d1f73ffd02bb3bf674c771589ab25a9f26a11dc5` produced CI #457 FAIL because diagnostic precedence changed. Bounded repair `84446b01b1c41fae2c20c2672f0e6df4c6b3bf3d` preserved base validation precedence and CI #458 PASS. The two-commit history is retained because the connector rejected a force rewrite of the failed commit.
# Escalation
Stop if correction requires another bounded context, ADR or architectural widening.
