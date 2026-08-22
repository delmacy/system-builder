---
id: TASK-198
title: Audit GitHub Actions governance triggers and runtime maintenance
status: verification
priority: 553
milestone: M12
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-197]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01.md
  - project_docs/execution_planning/AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01.report.md
  - .github/workflows/ci.yml
  - .github/workflows/heavy-tests.yml
allowed_paths:
  - project_docs/execution_planning/AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01.report.md
  - specs/tasks/TASK-198-AUX-GITHUB-ACTIONS-GOVERNANCE-RUNTIME-AUDIT.md
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
Audit workflow-level governance, trigger coverage and action-runtime maintenance risks that repository-local test commands cannot prove.
# Context
Fresh `main` currently reports no branch protection or required checks; PR CI is the primary deterministic gate. Recent runner logs also warn that `actions/checkout@v4` and `actions/setup-node@v4` target the deprecated Node 20 action runtime while GitHub forces Node 24.
# Current behavior
The repository has no current evidence-backed decision on required checks, push/merge-queue validation, workflow permissions, concurrency semantics, action-version maintenance or whether these concerns require new workflows versus repository settings/existing-job changes.
# Required change
Audit PR/push/schedule/manual/merge-queue trigger coverage, current required-check/branch-protection state, permissions, concurrency/cancellation behavior, service assumptions and action runtime/version warnings. For every concern, distinguish a workflow-code remedy from a GitHub repository-setting remedy.
# Inputs / contracts
Fresh workflow definitions, recent Actions run evidence and GitHub repository protection/status-check metadata.
# Outputs / contracts
Governance/runtime risk section in the audit report with evidence and bounded remediation options.
# Acceptance criteria
No recommendation conflates branch protection with workflow code; action-runtime warnings are evaluated against current supported action versions; trigger gaps are stated by lifecycle event.
# Non-goals
Changing `.github/**`, enabling protection, requiring checks or changing repository permissions/settings.
# Evidence expected
Risk/evidence/remedy classification covering triggers, required checks, permissions, concurrency and action runtime maintenance.
# Escalation
Stop if a recommended setting or workflow change cannot be justified from observed evidence.
