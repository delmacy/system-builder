---
id: TASK-186
title: Validate and serialize SupportCaseRecord
status: verification
priority: 541
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on: [TASK-185]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-RESOLUTION-01.md
  - packages/support-evolution/case.ts
  - packages/support-evolution/triage.ts
allowed_paths:
  - packages/support-evolution/case.ts
  - tests/product/support-case-validation.test.ts
  - tests/product/support-case-serialization.test.ts
  - specs/tasks/TASK-186-P12-SUPPORT-CASE-VALIDATION-SERIALIZATION.md
forbidden_paths:
  - packages/contracts/**
  - packages/observe/**
  - packages/deploy/**
  - .github/**
  - tooling/**
max_files: 4
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Add fail-closed validation and lossless deterministic JSON serialization for `SupportCaseRecord`.
# Context
TASK-185 establishes the case contract.
# Current behavior
No validation/round-trip proof exists for the new case artifact.
# Required change
Validate required fields, identity and allowed shape; serialize/deserialize without changing deterministic identity or accepting unknown/malformed data.
# Inputs / contracts
TASK-185 output and existing Support/Evolution deterministic conventions.
# Outputs / contracts
Validated/lossless `SupportCaseRecord` behavior.
# Acceptance criteria
Valid records round-trip exactly; malformed, unknown-field or identity-mismatched records fail closed.
# Non-goals
Knowledge policy, triage inference, remediation or production mutation.
# Evidence expected
Positive and negative focused tests plus deterministic CI.
# Escalation
Stop if validation requires a shared contract change.
