# M1-SPRINT-01 — Vertical Contract Spine

## Authority

This Sprint is authorized by `DEVSCOPE:M1-SPRINT-01` in `tooling/agent-harness/policies/HUMAN_APPROVAL.json`.

Bounded scope:

- TASK-004 / WP-FH-02 — ProcessMirror public contract
- TASK-005 / WP-FH-03 — BusinessRecipe public contract
- TASK-006 / WP-FH-04 — SystemAnalysis public contract
- risk ceiling: `medium`
- architecture: allowed only inside the listed tasks
- automatic executor: `opencode`
- model tier: task metadata `architecture`, execution route `T3`
- executor override: allowed from task preference `codex` to the authorized OpenCode transport
- base branch: `main`
- valid from: `2026-08-15T00:00:00.000Z`
- expires at: `2026-08-22T23:59:59.000Z`

The authority does not cover high/critical risk, additional tasks, another base branch, another executor, or work after expiration.

## Supervisor plan

Use `project_docs/execution_planning/M1-SPRINT-01.plan.json`.

The plan preserves the repository DAG order:

`TASK-004 -> TASK-005 -> TASK-006`

Each task uses a selected `T3` OpenCode route with `authority_ref=DEVSCOPE:M1-SPRINT-01` and dynamic free-model resolution. Current preference order is `deepseek`, `mimo`, `nemotron`; the resolver remains responsible for selecting an actually available compatible free model.

## Start on Windows

From a synchronized clean checkout:

```powershell
$repo = 'C:\Users\admin\Documents\system-builder'
$plan = 'project_docs\execution_planning\M1-SPRINT-01.plan.json'
$pipeline = 'm1-sprint-01'
$correlation = "m1-sprint-01-$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"
$env:SYSTEM_BUILDER_DEVELOPMENT_AUTHORITY_SCOPE = 'M1-SPRINT-01'
Set-Location -LiteralPath $repo
git switch main
git pull --ff-only origin main
git status --short
npm run pipeline:start -- --plan $plan --pipeline $pipeline --correlation $correlation
```

`pipeline:start` is finite. The Supervisor continues through local callbacks for internal progress and relies on GitHub-state callbacks or the heartbeat recovery path for facts that become true after the process exits, such as CI completion.

## Status and recovery

```powershell
npm run pipeline:status -- --plan $plan --pipeline $pipeline
npm run pipeline:heartbeat -- --plan $plan
npm run pipeline:resume -- --plan $plan --pipeline $pipeline
```

The same `SYSTEM_BUILDER_DEVELOPMENT_AUTHORITY_SCOPE=M1-SPRINT-01` environment variable must be present in every Supervisor/heartbeat invocation. A mismatch fails closed.

## Completion

The Sprint is complete only after TASK-004, TASK-005 and TASK-006 each have integrated implementation authority, deterministic evidence/ledger closure, merged state closure and successor readiness reconciliation. No later M1 task is implicitly authorized by this Sprint.
