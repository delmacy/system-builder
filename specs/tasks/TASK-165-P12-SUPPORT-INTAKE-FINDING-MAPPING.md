---
id: TASK-165
title: Map deployment findings into SupportEvidenceIntake
status: ready
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
Map a structurally compatible P11 deployment finding into `SupportEvidenceIntake`.

# Context
WBS 11.3.3 remains the direct downstream gap after P11: findings evidence must reach Support/Evolution without turning Observe into an auto-governance engine.

# Current behavior
P11 exposes `DeploymentFinding`; the Support/Evolution intake model exists locally but has no adapter from the proven finding shape.

# Required change
Add a structural `fromDeploymentFinding` adapter that reads only the stable public finding fields and produces deterministic Support intake evidence. The Support package must not import Observe implementation internals.

# Inputs / contracts
Public shape exported by `packages/observe/index.ts`, Support intake validation/serialization from TASK-164, WBS 11.3.3 and module-boundary rules.

# Outputs / contracts
A Support/Evolution-local structural adapter preserving finding and deployment/release/environment/runtime correlation refs.

# Acceptance criteria
Valid finding-like input maps deterministically and malformed input fails closed; no Observe source file is modified or imported by Support implementation.

# Non-goals
Observe changes, classification, priority, remediation, Support case creation or production mutation.

# Evidence expected
`packages/support-evolution/intake.ts`, `tests/product/support-evidence-intake-finding-mapping.test.ts`, and GitHub Deterministic CI.

# Escalation
Stop if a direct dependency on Observe internals or a new canonical cross-context contract is required.