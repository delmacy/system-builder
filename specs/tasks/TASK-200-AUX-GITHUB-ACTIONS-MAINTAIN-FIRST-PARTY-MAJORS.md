---
id: TASK-200
title: Maintain first-party GitHub Actions majors
status: verification
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

# Current behavior
The seven existing workflows use `actions/checkout@v4` and/or `actions/setup-node@v4`. Current CI logs show these Node 20-targeting action runtimes being forced onto Node 24 and emit a deprecation warning. Workflow triggers, jobs, services, commands, concurrency and permissions otherwise represent the accepted current topology.

# Required change
Replace only existing `actions/checkout@v4` and `actions/setup-node@v4` references with the maintained major established by the audit/current upstream evidence. Apply the update consistently to every affected existing workflow.

Do not alter triggers, schedules, permissions, concurrency, runner labels, services, environment variables, commands, job structure, repository settings, branch protection or required checks as part of this TASK.

# Inputs / contracts
The exact seven workflow files on the Sprint base, the completed AUX validation-audit report, current upstream first-party Action major evidence, and the repository's existing `npm run verify` contract.

# Outputs / contracts
A version-reference-only maintenance delta across affected existing workflow files plus TASK-200 status/evidence metadata. Workflow count, trigger semantics, jobs, services, commands, concurrency, permissions and repository settings remain unchanged.

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

# Execution evidence
Upstream revalidation on 2026-08-22 confirms maintained majors `actions/checkout@v7` and `actions/setup-node@v7`; current `setup-node` documentation demonstrates both with Node 24 and states v7 preserves setup-node inputs/outputs/behavior apart from documented compatibility changes that do not affect these workflows.

Affected workflow set from the Sprint base:
- `.github/workflows/ci.yml`: `checkout@v4 -> v7`, `setup-node@v4 -> v7`;
- `.github/workflows/heavy-tests.yml`: `checkout@v4 -> v7`, `setup-node@v4 -> v7`;
- `.github/workflows/opencode-next-sprint-materialize.yml`: `checkout@v4 -> v7`, `setup-node@v4 -> v7`;
- `.github/workflows/opencode-sprint-task-loop.yml`: `checkout@v4 -> v7`, `setup-node@v4 -> v7`;
- `.github/workflows/opencode-work-package-planner-schedule.yml`: `checkout@v4 -> v7`;
- `.github/workflows/opencode-work-package-planner.yml`: `checkout@v4 -> v7`, `setup-node@v4 -> v7`.

`.github/workflows/opencode-work-package.yml` contains neither affected reference and is intentionally unchanged. No trigger, schedule, permission, concurrency, runner, service, command, job-structure or topology change is part of the TASK-200 delta. Repository-wide validation is delegated to the PR-head Deterministic CI as objective connected execution evidence.

# Escalation
Stop if the maintained major requires workflow semantic changes beyond version compatibility or if current upstream evidence conflicts with the completed audit.
