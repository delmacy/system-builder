---
id: TASK-164
title: Serialize SupportEvidenceIntake losslessly
status: verification
priority: 503
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-163
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/support-evolution/intake.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-serialization.test.ts
  - specs/tasks/TASK-164-P12-SUPPORT-INTAKE-SERIALIZATION.md
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
Serialize and deserialize `SupportEvidenceIntake` losslessly.
# Context
Validated evidence needs deterministic transport representation.
# Current behavior
No intake JSON round-trip existed before this TASK.
# Required change
Add `toJson`/`fromJson` through canonical validation.
# Inputs / contracts
TASK-163 validated intake model.
# Outputs / contracts
Support-local lossless JSON API.
# Acceptance criteria
Identity and optional fields survive round-trip; malformed input fails closed.
# Non-goals
Mapping, triage, storage or external dependencies.
# Evidence expected
Implementation/tests and CI.
# Implementation evidence
Implemented in `880f693207eccd18539883c6d86955732bb96ca9`; CI #432 PASS.
# Escalation
Stop for external/shared contract requirements.
