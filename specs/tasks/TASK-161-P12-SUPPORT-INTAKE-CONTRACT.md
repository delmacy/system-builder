---
id: TASK-161
title: Define SupportEvidenceIntake contract
status: ready
priority: 500
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - project_docs/12-support-evolution/WBS.md
  - project_docs/12-support-evolution/scope/README.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
  - docs/architecture/MASTER_BLUEPRINT.md
allowed_paths:
  - packages/support-evolution/intake.ts
  - packages/support-evolution/index.ts
  - tests/product/support-evidence-intake-contract.test.ts
  - specs/tasks/TASK-161-P12-SUPPORT-INTAKE-CONTRACT.md
forbidden_paths:
  - apps/**
  - packages/observe/**
  - packages/deploy/**
  - packages/runtime-core/**
  - packages/release/**
  - packages/contracts/**
  - docs/adr/**
  - .github/**
  - tooling/**
  - package.json
  - package-lock.json
max_files: 4
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Define provider-neutral deterministic `SupportEvidenceIntake` with content-addressed `intakeId`, source kind, provenance/evidence refs, summary and optional deployment/release/environment/runtime refs.

# Context
P11 integrated the deterministic Observe finding chain and the P11 package review selected Support & Evolution evidence intake as the strongest bounded successor. This TASK starts the first committed P12 Sprint without changing upstream contracts.

# Current behavior
The repository has no `packages/support-evolution` product implementation and no durable Support/Evolution intake artifact. Observe findings exist upstream but have no downstream lifecycle intake representation.

# Required change
Create `packages/support-evolution/intake.ts` and `index.ts` with an immutable `SupportEvidenceIntake` whose identity is derived deterministically from its payload. Add focused product coverage for deterministic identity, content addressing and immutability.

# Inputs / contracts
P12 Sprint manifest, Support & Evolution WBS/scope, ADR-0007 no-value-leakage, ADR-0009 provider-neutral evidence principles, and the Master Blueprint lifecycle boundary.

# Outputs / contracts
An additive Support/Evolution-local intake contract exported from `packages/support-evolution/index.ts`. No canonical deployment, Observe, Runtime or public cross-context contract changes.

# Acceptance criteria
The artifact is additive, deterministic, immutable, content-addressed, reference-oriented and exported from the Support/Evolution package with focused positive coverage.

# Non-goals
Deep validation, serialization, finding mapping, human capture, classification, priority, support-case lifecycle, remediation, production mutation or public cross-context contract changes.

# Evidence expected
`packages/support-evolution/intake.ts`, `packages/support-evolution/index.ts`, `tests/product/support-evidence-intake-contract.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence
Implemented on the Sprint branch in commit `199eef978ba4f1482542ec819076a0589a950549`. CI #428 reached lint and typecheck successfully; the run failed later because the newly materialized TASK specs lacked mandatory parser sections, which this planning repair addresses.

# Escalation
Stop if a canonical contract, another bounded context implementation, L3/L4 boundary or ADR is required.