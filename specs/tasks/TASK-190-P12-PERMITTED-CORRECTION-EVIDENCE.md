---
id: TASK-190
title: Record explicit permitted-correction evidence
status: ready
priority: 545
milestone: M12
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: any
depends_on: [TASK-189]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-RESOLUTION-01.md
  - project_docs/12-support-evolution/WBS.md
  - packages/support-evolution/problem.ts
  - packages/support-evolution/index.ts
allowed_paths:
  - packages/support-evolution/correction.ts
  - packages/support-evolution/index.ts
  - tests/product/support-permitted-correction.test.ts
  - specs/tasks/TASK-190-P12-PERMITTED-CORRECTION-EVIDENCE.md
forbidden_paths:
  - packages/contracts/**
  - packages/observe/**
  - packages/deploy/**
  - packages/runtime-core/**
  - .github/**
  - tooling/**
max_files: 4
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Represent the “correções permitidas” part of WBS 12.2.2 as explicit evidence, never as an execution/authorization engine.
# Context
A validated Maintenance `ProblemRecord` exists after TASK-188/189.
# Current behavior
There is no durable record that a proposed correction is permitted by an external governance decision.
# Required change
Create immutable content-addressed `PermittedCorrectionEvidence` linked to a validated problem record with explicit `permissionRef`, correction/proposal reference, actor/time provenance and evidence refs. All values are supplied; nothing is inferred or executed.
# Inputs / contracts
`ProblemRecord`, WBS 12.2.2, Sprint boundaries.
# Outputs / contracts
Additive Support/Evolution-local evidence API only.
# Acceptance criteria
Explicit permission evidence is deterministic and traceable; absence of permission evidence cannot be interpreted as permission; no production action API exists.
# Non-goals
Defining who may authorize, scoring risk, executing remediation, deployment or production mutation.
# Evidence expected
Contract and focused tests showing record-only behavior.
# Escalation
Stop if governance policy or deployment internals would need to be invented.
