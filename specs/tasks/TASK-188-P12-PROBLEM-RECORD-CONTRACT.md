---
id: TASK-188
title: Define ProblemRecord contract
status: ready
priority: 543
milestone: M12
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: any
depends_on: [TASK-187]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-RESOLUTION-01.md
  - project_docs/12-support-evolution/WBS.md
  - project_docs/12-support-evolution/scope/README.md
  - packages/support-evolution/index.ts
  - packages/support-evolution/triage.ts
  - docs/architecture/MASTER_BLUEPRINT.md
allowed_paths:
  - packages/support-evolution/problem.ts
  - packages/support-evolution/index.ts
  - tests/product/support-problem-contract.test.ts
  - specs/tasks/TASK-188-P12-PROBLEM-RECORD-CONTRACT.md
forbidden_paths:
  - packages/contracts/**
  - packages/observe/**
  - packages/deploy/**
  - packages/runtime-core/**
  - docs/adr/**
  - .github/**
  - tooling/**
max_files: 4
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Define additive deterministic `ProblemRecord` evidence for WBS 12.2.2, linked to an explicit `SupportTriageDecision` classified `Maintenance`.
# Context
Explicit triage is integrated and support-case scope is separate from maintenance/problem scope.
# Current behavior
No durable problem record exists.
# Required change
Create immutable content-addressed problem evidence with triage reference and explicit actor/time/context references. Construction from validated triage must require `Maintenance` classification.
# Inputs / contracts
`SupportTriageDecision`, WBS 12.2.2.
# Outputs / contracts
Additive public API inside `packages/support-evolution` only.
# Acceptance criteria
Maintenance decisions can deterministically form problem records; Support/Evolution decisions cannot silently enter this path.
# Non-goals
Correction execution, root-cause inference, remediation or production mutation.
# Evidence expected
Contract implementation, focused product test and CI.
# Escalation
Stop if shared contracts or L4 architecture are required.
