---
id: TASK-200
title: Maintain first-party GitHub Actions majors
status: ready
priority: 555
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/execution_planning/AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01.report.md
  - project_docs/execution_planning/AUX-GITHUB-ACTIONS-MAINTENANCE-01.md
allowed_paths:
  - .github/workflows/ci.yml
  - .github/workflows/heavy-tests.yml
  - .github/workflows/opencode-next-sprint-materialize.yml
  - .github/workflows/opencode-sprint-task-loop.yml
  - .github/workflows/opencode-work-package-planner-schedule.yml
  - .github/workflows/opencode-work-package-planner.yml
  - .github/workflows/opencode-work-package.yml
  - specs/tasks/TASK-200-AUX-GITHUB-ACTIONS-MAINTAIN-FIRST-PARTY-MAJORS.md
forbidden_paths:
  - packages/**
  - apps/**
  - tooling/**
  - scripts/**
  - package.json
  - package-lock.json
  - project_docs/wbs/**
max_files: 8
validation:
  - npm run verify
---
# Objective
Update existing deprecated first-party GitHub Action major references identified by the completed audit without changing workflow behavior or topology.

# Context
The auxiliary validation audit found `actions/checkout@v4` and `actions/setup-node@v4` usages running through GitHub runtime compatibility forcing. The audit established maintenance of existing workflows as the correct remediation class and found no justification for a new workflow.

# Required change
Replace only existing `actions/checkout@v4` and `actions/setup-node@v4` references with the maintained major established by the audit/current upstream evidence. Apply the update consistently to every affected existing workflow.

Do not alter triggers, schedules, permissions, concurrency, runner labels, services, environment variables, commands, job structure, repository settings, branch protection or required checks as part of this TASK.

# Acceptance criteria
- no affected `actions/checkout@v4` or `actions/setup-node@v4` reference remains;
- no unrelated Action reference is upgraded opportunistically;
- workflow count and roles are unchanged;
- semantic diff is version-reference-only except TASK status/evidence metadata;
- `npm run verify` passes;
- P12 Sprint 4 remains forecast-only.

# Non-goals
Permission reduction, workflow redesign, new workflows, repository settings, branch protection, required checks, product/runtime/business changes or P12 WBS 12.3.x.

# Evidence expected
Exact affected workflow list, before/after Action references, validation result and one authoritative TASK commit.

# Escalation
Stop if the maintained major requires workflow semantic changes beyond version compatibility or if current upstream evidence conflicts with the completed audit.
