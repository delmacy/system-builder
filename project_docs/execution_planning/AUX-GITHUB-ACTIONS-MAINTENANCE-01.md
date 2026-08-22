# AUX-GITHUB-ACTIONS-MAINTENANCE-01 — Existing Workflow Maintenance

Status: COMMITTED / READY
Base: `86bde8830995e5d0a51bd3e3fd27734b5066f9d5`
Branch: `sprint/AUX-GITHUB-ACTIONS-MAINTENANCE-01`
Milestone: M12 auxiliary maintenance

## Sprint Goal
Perform one bounded maintenance intervention on existing GitHub Actions workflows only: update deprecated first-party Action majors consistently and review the lightweight Work Package dispatcher for least privilege without impairing the current construction-phase development dynamic.

## Predecessor gate
SATISFIED. PR #230 (`AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01`) merged to `main` at `86bde8830995e5d0a51bd3e3fd27734b5066f9d5` after governance reconciliation and Deterministic CI #521 PASS on exact review head `6c86f8e029d36623a6966bbbbc92b31424173789`.

## Governance authority
During construction, `main` intentionally remains unprotected and broad owner privilege remains available under point-in-time owner instructions. Branch protection, required checks and broad privilege reduction are DEFERRED until an explicit future pre-commercial maturity gate. This Sprint must not alter repository settings or reinterpret that decision.

## Committed TASK set
1. `TASK-200` — update deprecated `actions/checkout@v4` and `actions/setup-node@v4` references in existing workflows to the maintained major identified by the completed audit, without changing triggers, jobs, services, commands, concurrency or permissions.
2. `TASK-201` — review `opencode-work-package.yml` permissions against its actual dispatcher behavior and reduce only permissions proven unnecessary and safe; `NO_CHANGE` is the required outcome when minimum permissions cannot be proven without risk to the current development dynamic.

Dependency order: `TASK-200 -> TASK-201`.

## Exit proof
- every affected first-party Action reference is consistently maintained;
- existing workflow topology remains seven workflows; no workflow is added or removed;
- no trigger, schedule, repository setting, branch protection, required check, product/runtime/business behavior or P12 scope changes;
- any dispatcher permission reduction is evidence-backed and behavior-preserving, otherwise explicitly recorded as `NO_CHANGE`;
- repository-wide `npm run verify` passes on the final Sprint head;
- one authoritative commit per TASK.

## Final validation
`npm run verify`

## Stop / escalation conditions
Stop rather than broaden scope if:
- an Action upgrade requires semantic workflow redesign rather than a version-only compatibility update;
- a permission cannot be proven unnecessary from repository/workflow behavior;
- a change would weaken current owner authority or construction-phase development dynamics;
- repository settings, branch protection, required checks, new workflows, product/runtime/business behavior or P12 WBS 12.3.x would need modification;
- an undeclared architecture/security/governance decision is required.

## Explicit boundaries
- no repository-setting mutation;
- no branch protection or required-check change;
- no broad privilege reduction;
- no new general validation workflow;
- no `push: main` duplicate verify;
- no `merge_group` until merge queue is adopted;
- no mandatory PR-heavy gate without new evidence;
- no P12 Sprint 4 / WBS 12.3.x materialization or execution.

## Current gate
Materialized only. TASK-200 and TASK-201 are ready but not executed. Execute in dependency order under Sprint Mode, then run final verification and open Sprint Review PR evidence on the exact final head.
