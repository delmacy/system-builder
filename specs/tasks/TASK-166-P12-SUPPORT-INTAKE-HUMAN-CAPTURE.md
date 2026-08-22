---
id: TASK-166
title: Capture human-origin SupportEvidenceIntake
status: ready
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
Capture deterministic human-originated Support/Evolution intake evidence.

# Context
WBS 12.1.1 requires requests, incidents and feedback in addition to telemetry/findings. This Sprint must establish intake provenance only, not triage behavior.

# Current behavior
The Support intake contract can represent source kinds but has no ergonomic constructor for human-originated evidence and its actor/channel provenance.

# Required change
Add a human capture helper for request, incident or feedback evidence with stable actor/channel references, submitted-at timestamp, external evidence reference and non-value summary.

# Inputs / contracts
TASK-164 validated/serialized intake, Support & Evolution WBS 12.1.1 and P12 Sprint boundaries.

# Outputs / contracts
Human-originated `SupportEvidenceIntake` creation API using the same deterministic identity and validation model.

# Acceptance criteria
Human evidence preserves source/provenance deterministically, validates through the common intake contract and performs no action or mutation.

# Non-goals
Authentication changes, case management, classification, SLA, priority, ownership, remediation or production mutation.

# Evidence expected
`packages/support-evolution/intake.ts`, `tests/product/support-evidence-intake-human.test.ts`, and GitHub Deterministic CI.

# Escalation
Stop if user/auth contracts or another bounded context must change.