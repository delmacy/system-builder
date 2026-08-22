---
id: TASK-185
title: Define SupportCaseRecord contract
status: ready
priority: 540
milestone: M12
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - project_docs/execution_planning/P12-SUPPORT-RESOLUTION-01.md
  - project_docs/12-support-evolution/WBS.md
  - project_docs/12-support-evolution/scope/README.md
  - packages/support-evolution/index.ts
  - packages/support-evolution/triage.ts
  - docs/architecture/MASTER_BLUEPRINT.md
allowed_paths:
  - packages/support-evolution/case.ts
  - packages/support-evolution/index.ts
  - tests/product/support-case-contract.test.ts
  - specs/tasks/TASK-185-P12-SUPPORT-CASE-CONTRACT.md
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
Define additive deterministic `SupportCaseRecord` evidence for WBS 12.2.1, linked to an explicit `SupportTriageDecision` classified `Support`.
# Context
Intake and explicit triage are integrated; no operational support-case record exists.
# Current behavior
Support triage evidence has no durable downstream case identity.
# Required change
Create an immutable, content-addressed Support/Evolution-local case record with triage reference and explicit actor/time/reason references. Reject non-`Support` triage when constructed from a validated decision.
# Inputs / contracts
`SupportTriageDecision`, WBS 12.2.1, Sprint manifest.
# Outputs / contracts
Additive public API inside `packages/support-evolution` only.
# Acceptance criteria
A validated explicit Support decision can deterministically create a case record; Maintenance/Evolution decisions cannot silently become support cases.
# Non-goals
Knowledge links, problem records, resolution, prioritization, SLA calculation, remediation or production mutation.
# Evidence expected
Contract implementation, focused product test and deterministic CI.
# Escalation
Stop if shared contracts or L4 architecture are required.
