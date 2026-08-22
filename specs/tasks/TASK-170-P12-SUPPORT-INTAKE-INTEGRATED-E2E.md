---
id: TASK-170
title: Prove Observe finding to Support intake E2E
status: ready
priority: 509
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-168
  - TASK-169
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/observe/index.ts
  - packages/support-evolution/index.ts
allowed_paths:
  - tests/product/support-evidence-intake-e2e.test.ts
  - specs/tasks/TASK-170-P12-SUPPORT-INTAKE-INTEGRATED-E2E.md
forbidden_paths:
  - packages/**
  - docs/adr/**
  - .github/**
  - tooling/**
  - package.json
  - package-lock.json
max_files: 2
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Use the actual public P11 `DeploymentFinding` constructor and actual Support/Evolution adapter to prove the downstream evidence handoff without hand-authoring the finding artifact.
# Acceptance criteria
Finding -> SupportEvidenceIntake preserves finding/deployment/release/environment/runtime correlation, validates/round-trips and implies no remediation or production mutation.
# Escalation
Stop if E2E requires Support to depend on Observe internals or package implementation edits.
