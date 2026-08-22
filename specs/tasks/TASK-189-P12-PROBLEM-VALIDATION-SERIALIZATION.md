---
id: TASK-189
title: Validate and serialize ProblemRecord
status: ready
priority: 544
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on: [TASK-188]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-RESOLUTION-01.md
  - packages/support-evolution/problem.ts
  - packages/support-evolution/triage.ts
allowed_paths:
  - packages/support-evolution/problem.ts
  - tests/product/support-problem-validation.test.ts
  - tests/product/support-problem-serialization.test.ts
  - specs/tasks/TASK-189-P12-PROBLEM-VALIDATION-SERIALIZATION.md
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
Add fail-closed validation and lossless JSON serialization for `ProblemRecord`.
# Context
TASK-188 establishes the problem contract.
# Current behavior
No validation/round-trip proof exists for the new problem artifact.
# Required change
Validate required fields/identity/shape and provide deterministic lossless serialization/deserialization.
# Inputs / contracts
TASK-188 output and existing Support/Evolution conventions.
# Outputs / contracts
Validated/lossless `ProblemRecord` behavior.
# Acceptance criteria
Valid records round-trip exactly; malformed, unknown-field or identity-mismatched records fail closed.
# Non-goals
Correction authorization policy, remediation or production mutation.
# Evidence expected
Focused positive/negative tests and CI.
# Escalation
Stop if validation requires a shared contract change.
