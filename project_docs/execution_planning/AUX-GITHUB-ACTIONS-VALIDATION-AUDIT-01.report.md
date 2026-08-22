# AUX-GITHUB-ACTIONS-VALIDATION-AUDIT-01 — Audit Report

Status: IN PROGRESS
Base main: `7763177596cb684d3e3c6f9a55042337a865c2bc`
Planning head: `df9ebd49539848d780a69fc85c606982b622cb30`

## TASK-196 — Workflow inventory

Fresh `main` contains exactly seven workflows.

| Workflow | Class | Trigger | Permissions | Concurrency | Services | Validation / governance role |
| --- | --- | --- | --- | --- | --- | --- |
| `ci.yml` — Deterministic CI | validation | `pull_request` targeting `main` | `contents: read` | `ci-${PR/ref}`, cancel in progress | Postgres + auth Postgres | installs locked deps and runs `npm run verify`; primary PR repository gate |
| `heavy-tests.yml` — Heavy Product Tests | validation | nightly schedule + `workflow_dispatch` | `contents: read` | singleton `heavy-tests`, no cancellation | Postgres + auth Postgres | runs `npm run test:product:heavy`; slow integration/process/Postgres/TLS coverage |
| `opencode-next-sprint-materialize.yml` | orchestration/materialization | manual dispatch + merged PR closure | actions/contents/PR write | per-run, no cancellation | Postgres + auth Postgres | revalidates package/planning state, runs `npm run verify` before publishing planning result, may open/merge planning PR and dispatch successor |
| `opencode-sprint-task-loop.yml` | orchestration/execution | manual dispatch | actions/contents/PR write | per Sprint branch, no cancellation | Postgres + auth Postgres | executes one bounded Sprint unit, enforces one commit/session; on closure runs `npm run verify`, opens Sprint PR, optionally waits on PR checks and continues Work Package |
| `opencode-work-package-planner-schedule.yml` | orchestration/scheduler | every 4h + manual dispatch | actions write, PR/contents read | singleton, no cancellation | none | gates competing forecast PRs and dispatches Work Package planner; no repository test command itself |
| `opencode-work-package-planner.yml` | planning/orchestration | manual dispatch | contents/PR write | singleton, no cancellation | Postgres + auth Postgres | creates bounded planning projection, path-checks output, re-runs `npm run verify`, then opens review PR |
| `opencode-work-package.yml` | orchestration/dispatcher | manual dispatch | actions/contents/PR write | not declared | none | validates dispatch inputs and starts `opencode-sprint-task-loop.yml`; no repository validation command itself |

### Factual overlap
- `npm run verify` is executed by PR CI and also by OpenCode planning/closure controllers before they publish authoritative state.
- This overlap is intentional in role: controller-local pre-publication verification versus independent PR validation.
- Postgres service definitions are repeated across PR CI, heavy tests and OpenCode workflows that need repository verification/integration tests.
- Only `ci.yml` is a general pull-request validation workflow; `heavy-tests.yml` is the separate scheduled/manual heavy partition.
- None of the five OpenCode workflows should be counted as an additional general-purpose CI workflow because their triggers and write permissions serve orchestration state transitions.

### TASK-196 conclusion
The seven-workflow topology is reconciled with fresh `main`. No workflow addition is justified from inventory alone. Subsequent TASKs must decide command coverage and governance gaps from this complete topology.

Boundaries preserved: no `.github/**`, repository-setting, product/runtime, or P12 WBS 12.3.x mutation.
