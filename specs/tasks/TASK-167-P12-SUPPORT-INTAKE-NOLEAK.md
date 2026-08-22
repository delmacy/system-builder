---
id: TASK-167
title: Enforce no-value-leak Support intake
status: ready
priority: 506
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-165
  - TASK-166
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/support-evolution/intake.ts
allowed_paths:
  - packages/support-evolution/intake.ts
  - tests/product/support-evidence-intake-noleak.test.ts
  - specs/tasks/TASK-167-P12-SUPPORT-INTAKE-NOLEAK.md
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
Reject resolved secret, credential, token, password, authorization, private-key or CA value markers across durable intake strings while accepting stable references.
# Acceptance criteria
Finding-origin and human-origin intake both enforce reference-only semantics deterministically.
# Escalation
Stop if broader security architecture or policy change is required.
