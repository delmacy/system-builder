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
# Acceptance criteria
Additive, deterministic, reference-only, exported from `packages/support-evolution/index.ts`, with focused positive coverage.
# Escalation
Stop if a canonical contract, other bounded context implementation, L3/L4 boundary or ADR is required.
