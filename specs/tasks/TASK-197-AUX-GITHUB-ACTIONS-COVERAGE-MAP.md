---
id: TASK-197
title: Map repository test surfaces to GitHub Actions coverage
status: verification
priority: 552
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on: [TASK-196]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01.md
  - project_docs/execution_planning/AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01.report.md
  - package.json
  - scripts/run-product-tests.mjs
  - .github/workflows/ci.yml
  - .github/workflows/heavy-tests.yml
allowed_paths:
  - project_docs/execution_planning/AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01.report.md
  - specs/tasks/TASK-197-AUX-GITHUB-ACTIONS-COVERAGE-MAP.md
forbidden_paths:
  - .github/**
  - packages/**
  - apps/**
  - tooling/**
  - scripts/**
  - package.json
  - package-lock.json
max_files: 2
validation:
  - npm run check:tasks
  - npm run verify
---
# Objective
Map every repository validation/test surface to the GitHub Actions job that actually executes it and identify evidence-backed coverage gaps.
# Context
`npm run verify` covers lint, typecheck, unit/core product tests, task/architecture checks and build; heavy product tests are scheduled separately; `test:product:full` also exists.
# Current behavior
There is no authoritative matrix showing which commands run on pull request, schedule, manual dispatch, push to main or not at all.
# Required change
Build a command-to-workflow/trigger matrix for lint, typecheck, unit, product core/heavy/full, task validation, architecture gates and build. Determine whether `test:product:full` adds coverage beyond the current PR + nightly combination rather than assuming it does.
# Inputs / contracts
Fresh `package.json`, product-test runner and validation workflow definitions.
# Outputs / contracts
Coverage matrix and concrete uncovered/duplicated surfaces in the audit report.
# Acceptance criteria
Every validation script is classified as PR-covered, scheduled-covered, manual-only, indirectly covered, duplicated or uncovered with evidence.
# Non-goals
Adding jobs/workflows, changing test partitioning or changing product behavior.
# Evidence expected
Traceable script/trigger/coverage matrix and any discovered gap.
# Escalation
Stop if test partition semantics cannot be established from repository code.
