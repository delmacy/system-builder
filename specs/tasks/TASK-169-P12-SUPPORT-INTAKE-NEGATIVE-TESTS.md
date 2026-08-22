---
id: TASK-169
title: Add negative SupportEvidenceIntake product coverage
status: ready
priority: 508
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-167
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/support-evolution/index.ts
  - packages/support-evolution/intake.ts
allowed_paths:
  - tests/product/support-evidence-intake-negative.test.ts
  - specs/tasks/TASK-169-P12-SUPPORT-INTAKE-NEGATIVE-TESTS.md
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
Add negative product tests for unknown fields, malformed/conflicting sources, wrong identity, invalid JSON and resolved-value markers.
# Acceptance criteria
Invalid categories fail deterministically with `SUPPORT_INTAKE` errors and no mutation occurs.
# Escalation
Stop if coverage requires broader architecture changes.
