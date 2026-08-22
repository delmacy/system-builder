---
id: TASK-183
title: Prove human intake to triage E2E
status: verification
priority: 529
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-180
  - TASK-181
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-TRIAGE-CLASSIFICATION-01.md
  - packages/support-evolution/index.ts
allowed_paths:
  - tests/product/support-triage-human-e2e.test.ts
  - specs/tasks/TASK-183-P12-SUPPORT-TRIAGE-HUMAN-E2E.md
forbidden_paths:
  - packages/**
  - docs/adr/**
  - .github/**
  - tooling/**
  - package.json
  - package-lock.json
max_files: 2
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Prove the human-origin Sprint 1 intake path extends into explicit deterministic triage.
# Context
WBS 12.1 includes human requests/incidents/feedback as well as telemetry/findings; both predecessor paths must reach the triage boundary.
# Current behavior
Human intake is proven in Sprint 1 but not joined to the Sprint 2 decision artifact.
# Required change
Create a real human request/incident/feedback intake through the public API, triage it explicitly, validate/round-trip it and preserve actor/channel/intake/context references.
# Inputs / contracts
Public Support/Evolution human intake and triage APIs.
# Outputs / contracts
Integrated human-origin product-test evidence only.
# Acceptance criteria
Human intake->triage is deterministic, lossless and evidence-only; no ownership assignment, remediation, production mutation or automatic classification occurs.
# Non-goals
Authentication changes, support-case resolution, scheduling, notifications or Evolution execution.
# Evidence expected
Human-origin E2E test and GitHub Deterministic CI.
# Escalation
Stop if another bounded context must change.
