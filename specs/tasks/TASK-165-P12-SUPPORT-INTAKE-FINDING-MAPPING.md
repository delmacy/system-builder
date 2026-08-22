---
id: TASK-165
title: Map deployment findings into SupportEvidenceIntake
status: verification
priority: 504
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-164
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/observe/index.ts
  - packages/support-evolution/intake.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-finding-mapping.test.ts
  - specs/tasks/TASK-165-P12-SUPPORT-INTAKE-FINDING-MAPPING.md
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
Map structurally compatible P11 deployment findings into `SupportEvidenceIntake`.
# Context
WBS 11.3.3 requires findings evidence to reach Support/Evolution without auto-governance.
# Current behavior
No finding adapter existed before this TASK.
# Required change
Add a structural adapter preserving stable public finding correlations without Observe-internal imports.
# Inputs / contracts
Public finding shape, TASK-164 intake API and WBS 11.3.3.
# Outputs / contracts
Support-local finding-to-intake adapter.
# Acceptance criteria
Valid input maps deterministically; malformed input fails closed; Support implementation imports no Observe internals.
# Non-goals
Observe changes, triage, remediation or case creation.
# Evidence expected
Implementation/tests and CI.
# Implementation evidence
Implemented in `9edb4202b93be78a8ebdec542b4aea7415483e08`; CI #433 PASS.
# Escalation
Stop for direct Observe-internal or canonical dependency.
