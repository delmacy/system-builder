---
id: TASK-196
title: Inventory GitHub Actions validation topology
status: ready
priority: 551
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01.md
  - .github/workflows/ci.yml
  - .github/workflows/heavy-tests.yml
  - .github/workflows/opencode-next-sprint-materialize.yml
  - .github/workflows/opencode-sprint-task-loop.yml
  - .github/workflows/opencode-work-package-planner-schedule.yml
  - .github/workflows/opencode-work-package-planner.yml
  - .github/workflows/opencode-work-package.yml
allowed_paths:
  - project_docs/execution_planning/AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01.report.md
  - specs/tasks/TASK-196-AUX-GITHUB-ACTIONS-INVENTORY.md
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
Inventory every current GitHub Actions workflow and its validation/governance role before proposing any CI topology change.
# Context
The repository has multiple validation and OpenCode orchestration workflows; adding another workflow without a complete topology map risks duplication or conflicting triggers.
# Current behavior
There is no single fresh-main audit artifact mapping workflow triggers, permissions, concurrency, services, commands, artifacts and intended gates.
# Required change
Record each workflow, trigger, job, relevant service dependency, permissions, concurrency behavior and validation command in the auxiliary Sprint report. Explicitly separate validation workflows from orchestration/materialization workflows.
# Inputs / contracts
Fresh `main` `.github/workflows/**` and GitHub Actions metadata.
# Outputs / contracts
Evidence-backed workflow inventory in the audit report.
# Acceptance criteria
All current workflows are accounted for; no recommendation is made from a partial inventory; duplicated or overlapping validation surfaces are identified factually.
# Non-goals
Changing workflows, repository settings, branch protection or product code.
# Evidence expected
Inventory table with source workflow and observed purpose/trigger/command.
# Escalation
Stop if workflow state cannot be reconciled with fresh `main`.
