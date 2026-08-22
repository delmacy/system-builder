---
id: TASK-175
title: Model triage priority and context references
status: verification
priority: 521
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-174
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-TRIAGE-CLASSIFICATION-01.md
  - project_docs/12-support-evolution/WBS.md
  - packages/support-evolution/triage.ts
allowed_paths:
  - packages/support-evolution/triage.ts
  - tests/product/support-triage-context.test.ts
  - specs/tasks/TASK-175-P12-SUPPORT-TRIAGE-CONTEXT.md
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
Add explicit impact, criticality, SLA, priority and context references to triage evidence without inventing scoring policy.
# Context
WBS 12.1.3 requires prioritization inputs, but the repository defines no automatic scoring algorithm or canonical impact taxonomy.
# Current behavior
TASK-174 decision has classification/provenance only.
# Required change
Add required stable `impactRef`, `criticalityRef`, `slaRef`, `priorityRef` and deterministic context references supplied explicitly by the caller.
# Inputs / contracts
TASK-174 contract and WBS 12.1.3.
# Outputs / contracts
Reference-oriented context fields local to Support/Evolution.
# Acceptance criteria
Context is deterministic and portable; no inferred score, SLA calculation or provider-specific locator is introduced.
# Non-goals
Automatic prioritization, scheduling, ownership, remediation or external policy engine.
# Evidence expected
Focused context tests and GitHub Deterministic CI.
# Escalation
Stop if a new business-policy taxonomy must be invented.
