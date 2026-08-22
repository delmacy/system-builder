---
id: TASK-164
title: Serialize SupportEvidenceIntake losslessly
status: ready
priority: 503
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-163
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/support-evolution/intake.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-serialization.test.ts
  - specs/tasks/TASK-164-P12-SUPPORT-INTAKE-SERIALIZATION.md
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
Serialize and deserialize `SupportEvidenceIntake` losslessly.

# Context
Validated durable evidence needs a deterministic transport representation before downstream Support/Evolution lifecycle records can consume it.

# Current behavior
TASK-163 provides validation but the Support/Evolution intake API has no JSON round-trip.

# Required change
Add `toJson` and `fromJson` through the canonical validator, preserving identity and every optional correlation/provenance field.

# Inputs / contracts
Validated Support intake model from TASK-163 and repository deterministic serialization conventions.

# Outputs / contracts
Lossless JSON serialization API local to `packages/support-evolution`.

# Acceptance criteria
Valid intake round-trips byte-semantically without field or identity loss; malformed JSON or payloads fail closed.

# Non-goals
Finding mapping, classification, remediation, external serialization libraries or storage.

# Evidence expected
`packages/support-evolution/intake.ts`, `tests/product/support-evidence-intake-serialization.test.ts`, and GitHub Deterministic CI.

# Escalation
Stop if external dependencies or shared contract changes are required.