---
id: TASK-162
title: Model SupportEvidenceIntake sources
status: ready
priority: 501
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-161
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - project_docs/12-support-evolution/WBS.md
  - packages/support-evolution/intake.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-source.test.ts
  - specs/tasks/TASK-162-P12-SUPPORT-INTAKE-SOURCE-MODEL.md
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
Model explicit provider-neutral source variants for Observe-finding evidence and human-originated evidence.

# Context
TASK-161 establishes the Support/Evolution-local intake envelope. P12 must accept both the integrated P11 findings path and the human requests/incidents/feedback named by WBS 12.1.1 without coupling to producer internals.

# Current behavior
The base intake contract identifies a source kind but does not yet model the provenance fields that distinguish an Observe finding from a human-originated request.

# Required change
Extend the Support/Evolution-local model with structurally distinct `observe_finding` and `human_request` provenance fields and stable reference-only types. Add focused tests proving the variants are expressible deterministically without importing Observe implementation code.

# Inputs / contracts
TASK-161 output, P12 Sprint manifest, Support & Evolution WBS 12.1.1, and provider-neutral/no-value-leak architecture principles.

# Outputs / contracts
Additive source/provenance types inside `packages/support-evolution/intake.ts` and focused source-model product tests.

# Acceptance criteria
Source variants are explicit, deterministic, portable and contain only stable evidence/provenance references; no producer locator or resolved value is required.

# Non-goals
Observe imports, fail-closed validation, serialization, classification, priority, SLA, remediation or production mutation.

# Evidence expected
`packages/support-evolution/intake.ts`, `tests/product/support-evidence-intake-source.test.ts`, and GitHub Deterministic CI.

# Escalation
Stop if another bounded context must be modified or a canonical cross-context contract is required.