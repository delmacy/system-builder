---
id: TASK-161
title: Define SupportEvidenceIntake contract
status: verification
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
Define deterministic provider-neutral `SupportEvidenceIntake` with content-addressed identity.
# Context
P11 review selected Support/Evolution evidence intake as the bounded successor.
# Current behavior
Before this TASK no Support/Evolution intake artifact existed.
# Required change
Create and export the immutable deterministic intake contract with focused tests.
# Inputs / contracts
P12 Sprint manifest, Support/Evolution WBS, ADR-0007/0009 and Master Blueprint.
# Outputs / contracts
Additive Support/Evolution-local intake contract only.
# Acceptance criteria
Deterministic, immutable, content-addressed, reference-oriented contract is publicly exported.
# Non-goals
Validation/serialization/mapping/triage/remediation or cross-context contract changes.
# Evidence expected
Implementation/tests plus GitHub Deterministic CI.
# Implementation evidence
Implemented in `199eef978ba4f1482542ec819076a0589a950549`; planning parser repair `0f550f6adb272c780afba5beb27e9a018376e1dc`; CI #429 PASS.
# Escalation
Stop for canonical/L3/L4/ADR scope expansion.
