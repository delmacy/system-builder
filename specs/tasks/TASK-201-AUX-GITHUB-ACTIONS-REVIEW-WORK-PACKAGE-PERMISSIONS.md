---
id: TASK-201
title: Review Work Package dispatcher permissions
status: ready
priority: 556
milestone: M12
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-200]
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/execution_planning/AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01.report.md
  - project_docs/execution_planning/AUX-GITHUB-ACTIONS-MAINTENANCE-01.md
  - .github/workflows/opencode-work-package.yml
allowed_paths:
  - .github/workflows/opencode-work-package.yml
  - project_docs/execution_planning/AUX-GITHUB-ACTIONS-MAINTENANCE-01.report.md
  - specs/tasks/TASK-201-AUX-GITHUB-ACTIONS-REVIEW-WORK-PACKAGE-PERMISSIONS.md
forbidden_paths:
  - .github/workflows/ci.yml
  - .github/workflows/heavy-tests.yml
  - .github/workflows/opencode-next-sprint-materialize.yml
  - .github/workflows/opencode-sprint-task-loop.yml
  - .github/workflows/opencode-work-package-planner-schedule.yml
  - .github/workflows/opencode-work-package-planner.yml
  - packages/**
  - apps/**
  - tooling/**
  - scripts/**
  - package.json
  - package-lock.json
  - project_docs/wbs/**
max_files: 3
validation:
  - npm run verify
---
# Objective
Review the permissions declared by the lightweight Work Package dispatcher against its actual workflow behavior and apply only a permission reduction that is demonstrably unnecessary, behavior-preserving and compatible with the current construction-phase development dynamic.

# Context
The completed audit observed that `opencode-work-package.yml` primarily validates dispatch inputs and dispatches downstream workflow execution, while its declared `contents: write` and `pull-requests: write` permissions appear broader than visible behavior. This is a review candidate, not a pre-authorized privilege reduction.

Current owner governance explicitly retains broad privilege during construction. Repository settings, branch protection and required checks are deferred until a future pre-commercial maturity gate.

# Required change
Trace every operation performed by `opencode-work-package.yml` and map each operation to the GitHub token permission it actually requires. Record the evidence in the Sprint report.

If and only if a declared permission is proven unnecessary from the workflow's complete behavior, reduce that permission in this workflow alone. If the minimum permission cannot be proven safely, make no workflow permission change and record `NO_CHANGE` with the unresolved dependency/evidence gap.

Do not alter triggers, schedules, inputs, downstream dispatch targets, job logic, repository settings, branch protection, required checks or other workflows.

# Acceptance criteria
- each currently declared permission is mapped to observed workflow behavior;
- any reduction is supported by direct repository/workflow evidence and preserves dispatch behavior;
- uncertainty resolves to `NO_CHANGE`, never guessed hardening;
- no broad privilege reduction or repository-setting mutation occurs;
- `npm run verify` passes;
- P12 Sprint 4 remains forecast-only.

# Non-goals
Repository hardening policy, branch protection, required checks, permissions in other workflows, workflow topology changes, new validation workflows, product/runtime/business behavior or P12 WBS 12.3.x.

# Evidence expected
Permission-to-operation matrix, final `REDUCE` or `NO_CHANGE` disposition, validation result and one authoritative TASK commit.

# Escalation
Stop if exact permissions depend on undocumented GitHub behavior, external settings not observable from repository authority, or a reduction could impair current owner-directed construction workflows.
