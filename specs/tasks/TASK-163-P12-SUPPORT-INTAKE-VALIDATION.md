---
id: TASK-163
title: Validate SupportEvidenceIntake fail closed
status: ready
priority: 502
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-162
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/support-evolution/intake.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-validation.test.ts
  - specs/tasks/TASK-163-P12-SUPPORT-INTAKE-VALIDATION.md
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
Implement deterministic fail-closed validation for `SupportEvidenceIntake`.

# Context
TASK-162 makes source provenance explicit. Before intake evidence can cross the Support/Evolution boundary durably, malformed, unknown, conflicting and identity-divergent payloads must fail deterministically.

# Current behavior
TASK-161 construction validates required strings during creation, but there is no parser/validator for arbitrary durable intake payloads and no source-conflict or content-identity verification.

# Required change
Add validation that accepts only the known field set and source combinations, validates required/source-specific fields, recomputes the canonical identity and rejects any mismatch. Add positive and negative validation tests.

# Inputs / contracts
TASK-161/162 Support intake model, P12 Sprint manifest, deterministic hash helper and repository fail-closed conventions.

# Outputs / contracts
`SupportEvidenceIntake.validate(value)` or equivalent Support/Evolution-local validation API with stable `SUPPORT_INTAKE` diagnostics.

# Acceptance criteria
Unknown fields, malformed values, conflicting source provenance and wrong `intakeId` are rejected deterministically; valid input normalizes to an immutable intake artifact.

# Non-goals
Serialization, finding mapping, human capture helpers, classification, SLA/priority, remediation or production mutation.

# Evidence expected
`packages/support-evolution/intake.ts`, `tests/product/support-evidence-intake-validation.test.ts`, and GitHub Deterministic CI.

# Escalation
Stop if validation requires shared/canonical contract changes.