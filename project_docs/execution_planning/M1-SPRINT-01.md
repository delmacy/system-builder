# M1-SPRINT-01 — Vertical Contract Spine

## Sprint Goal

Deliver the integrated public contract spine:

`ProcessMirror -> BusinessRecipe -> SystemAnalysis`

The Sprint is reviewed and integrated as one unit.

## Committed scope

- TASK-004 / WP-FH-02 — ProcessMirror public contract — **DONE in main**
- TASK-005 / WP-FH-03 — BusinessRecipe public contract — **READY**
- TASK-006 / WP-FH-04 — SystemAnalysis public contract — **READY after TASK-005**
- risk ceiling: `medium`
- architecture: allowed only inside the listed TASK contracts and accepted ADR boundaries
- default executor: OpenCode CLI
- base: synchronized `main`
- Sprint branch: `sprint/M1-SPRINT-01`

No later M1 TASK is implicitly authorized by this Sprint.

## Execution model

This Sprint follows `project_docs/schedule/SPRINT_MODE.md`.

`main -> sprint/M1-SPRINT-01 -> TASK-005 commit -> TASK-006 commit -> npm run verify -> Sprint Report -> Sprint Review -> one PR -> main`

TASK-004 is already completed in `main`; it remains part of the Sprint Goal/baseline but does not need to be reimplemented.

The historical Supervisor plan `M1-SPRINT-01.plan.json` is retained as repository history/AgentFactory input, but the AgentFactory Supervisor/runtime is not required to execute or close this product Sprint.

## Start on Windows

From CMD:

```bat
cd /d C:\Users\admin\Documents\system-builder

git switch main
git pull --ff-only origin main
git status --short
npm run verify

git switch -c sprint/M1-SPRINT-01
```

If the Sprint branch already exists locally/remotely, do not recreate it blindly. Inspect it, synchronize deliberately and preserve valid Sprint commits.

## OpenCode direct execution

OpenCode CLI may execute the Sprint directly without the AgentFactory Supervisor.

Recommended invocation pattern:

```bat
opencode run --agent sprint-builder "Execute M1-SPRINT-01 according to AGENTS.md, project_docs/schedule/SPRINT_MODE.md and this Sprint definition. Work only on sprint/M1-SPRINT-01. TASK-004 is already complete. Execute TASK-005 then TASK-006. For each TASK: read its contract, implement only allowed scope, run declared validation, fix bounded failures autonomously and create a distinct commit. After TASK-006 run npm run verify, produce the Sprint Report and stop. Do not merge main and do not start another Sprint."
```

A dedicated OpenCode agent is optional; the Sprint contract remains authoritative even when the default agent is used.

## Per-TASK gates

### TASK-005

- TASK-004 dependency satisfied;
- implement only TASK-005 allowed scope;
- run TASK-005 declared validation;
- satisfy acceptance criteria;
- commit separately before TASK-006.

### TASK-006

- TASK-005 must be satisfied first;
- implement only TASK-006 allowed scope;
- run TASK-006 declared validation;
- satisfy acceptance criteria;
- commit separately.

## Final Sprint gate

After all committed work:

1. run `npm run verify` on the integrated Sprint branch;
2. update durable repository artifacts required by the completed TASKs;
3. create `project_docs/execution_planning/M1-SPRINT-01.report.md` with:
   - TASK status;
   - commit IDs;
   - validations;
   - architecture/contract deviations;
   - backlog discoveries;
   - residual work;
4. push `sprint/M1-SPRINT-01`;
5. open one PR to `main`;
6. stop for Sprint Review.

## Escalation

Stop for human review before Sprint completion if execution requires:

- an architecture/public-contract change not already authorized by the TASK/ADR set;
- scope outside TASK-004/005/006;
- a forbidden path;
- destructive/irreversible migration;
- security/governance weakening;
- resolution of conflicting repository authority.

Routine code decisions, bounded refactors and validation fixes stay autonomous.

## Completion

The Sprint is complete when TASK-005 and TASK-006 are satisfied on the Sprint branch, final repository verification passes, the Sprint Report exists and the Sprint PR is ready for review.

The next Sprint begins only after explicit post-review authorization.
