---
id: TASK-194
title: Add negative lifecycle and mutation boundaries
status: ready
priority: 549
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-192]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-RESOLUTION-01.md
  - project_docs/12-support-evolution/WBS.md
  - packages/support-evolution/index.ts
allowed_paths:
  - tests/product/support-resolution-negative.test.ts
  - specs/tasks/TASK-194-P12-RESOLUTION-NEGATIVE-BOUNDARIES.md
forbidden_paths:
  - packages/contracts/**
  - packages/observe/**
  - packages/deploy/**
  - .github/**
  - tooling/**
max_files: 2
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Prove Sprint 3 cannot silently cross classification/lifecycle or mutation boundaries.
# Context
Operational-resolution evidence must consume explicit triage and keep Evolution for WBS 12.3.x.
# Current behavior
Cross-path rejection needs consolidated proof.
# Required change
Test that Support cannot become a problem record, Maintenance cannot become a support case, Evolution cannot enter Sprint 3 operational-resolution construction, missing explicit permission cannot be treated as permitted correction, and no public Sprint 3 API performs remediation/production mutation.
# Inputs / contracts
Public Support/Evolution APIs and WBS boundaries.
# Outputs / contracts
Negative lifecycle proof.
# Acceptance criteria
All forbidden cross-path/missing-evidence cases fail deterministically; tests rely on behavior/API rather than source-text assertions where possible.
# Non-goals
Defining Evolution behavior or production mutation implementation.
# Evidence expected
Negative product test and CI.
# Escalation
Stop if a negative invariant cannot be represented without changing architecture.
