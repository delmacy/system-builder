---
id: TASK-166
title: Capture human-origin SupportEvidenceIntake
status: verification
priority: 505
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-164
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - project_docs/12-support-evolution/WBS.md
  - packages/support-evolution/intake.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-human.test.ts
  - specs/tasks/TASK-166-P12-SUPPORT-INTAKE-HUMAN-CAPTURE.md
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
Capture deterministic human-origin request/incident/feedback evidence.
# Context
WBS 12.1.1 requires human inputs in addition to telemetry/findings.
# Current behavior
No ergonomic human intake constructor existed before this TASK.
# Required change
Add human capture with stable actor/channel/evidence refs and common intake identity/validation.
# Inputs / contracts
TASK-164 intake and WBS 12.1.1.
# Outputs / contracts
Human-origin intake API.
# Acceptance criteria
Human provenance is deterministic and performs no action/mutation.
# Non-goals
Auth changes, triage, SLA, ownership or remediation.
# Evidence expected
Implementation/tests and CI.
# Implementation evidence
Implemented in `9c26207ec2747687b6a1c75bb78103854d4e76de`; CI #434 PASS.
# Escalation
Stop for auth/cross-context changes.
