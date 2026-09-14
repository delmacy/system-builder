# Git and GitHub Sprint Workflow

Status: `CURRENT_REFERENCE`
Authority level: `engineering-reference`
Applies to: Git/GitHub mechanics for current Sprint Mode
Superseded process: legacy task-per-PR bootstrap workflow
Last reconciled: 2026-09-13

This document describes the Git/GitHub mechanics for the current repository development model. It is subordinate to `AGENTS.md`, `project_docs/schedule/SPRINT_GENERATION_POLICY.md`, `project_docs/schedule/SPRINT_MODE.md`, active Work Package/Sprint authority and committed TASK specifications.

## Normal delivery unit

The normal product delivery unit is the Sprint, not an individual TASK.

```text
fresh main
  -> sprint/<SPRINT-ID>
  -> committed TASKs in dependency order
  -> one authoritative commit per TASK
  -> repository-wide verification
  -> one Sprint PR
  -> exact-head CI/review
  -> merge to main
  -> fresh-main reconciliation
```

TASKs still remain bounded implementation units with their own scope, dependencies, path restrictions and validations. They do not normally receive independent branches/PRs inside Sprint Mode.

## Start a Sprint branch

Before product mutation:

1. synchronize `main` without destructive recovery;
2. confirm repository memory and active Sprint manifest are current;
3. verify predecessor gates and committed TASK set;
4. create/switch to the declared `sprint/<SPRINT-ID>` branch from the intended fresh-main base.

Representative Git sequence:

```text
git switch main
git pull --ff-only origin main
git switch -c sprint/<SPRINT-ID>
```

If the working tree is dirty, diverged or ambiguous, stop and inspect rather than resetting or deleting work merely to satisfy automation.

## TASK execution inside the Sprint

For each committed TASK, in dependency order:

- read the TASK specification and all `context_paths`;
- confirm `allowed_paths`, `forbidden_paths`, `max_files`, dependencies and validation commands;
- implement only declared scope;
- run TASK-declared validation;
- correct bounded failures inside the same TASK scope;
- create exactly one authoritative commit for that TASK when repository policy requires it.

Preferred commit form:

```text
feat(TASK-NNN): <bounded outcome>
```

The local executor `scripts/sprint-run-local.ps1` automates this loop with one disposable OpenCode session per committed TASK. A connected coding agent may execute elsewhere only if it obeys the same branch, TASK, validation and stop conditions.

## Sprint completion

After the final committed TASK:

1. run repository-wide final validation (`npm run verify` unless stricter authority exists);
2. reconcile required Sprint evidence/reports/documentation;
3. push the Sprint branch without force;
4. open one PR from `sprint/<SPRINT-ID>` to `main`;
5. require the repository-defined exact-head GitHub checks;
6. resolve review findings without broadening scope;
7. merge only after the applicable Sprint Review/integration gate passes.

After merge, reconstruct fresh `main` before promoting or materializing successor work.

## GitHub role

GitHub is source/history plus objective CI/review evidence. GitHub Actions do not drive the normal OpenCode product executor.

Do not describe branch-only work as integrated. Distinguish at least:

```text
IMPLEMENTED_ON_SPRINT_BRANCH
CI_PASS
MERGED
```

Only the integrated state on `main` is repository product truth.

## Safety rules

- No autonomous direct product write to `main`.
- No force push as normal recovery.
- No `reset --hard`, `clean -fd` or destructive branch overwrite to manufacture a clean state.
- No merge before required validations/review.
- No successor Sprint promotion merely because it appears in forecast.
- Re-fetch/reconcile `main` after every Sprint integration boundary.
- Preserve one authoritative TASK commit when the active Sprint policy requires it.

## Branch protection

Repository policy may treat `main` as protected semantically even when GitHub branch-protection settings are intentionally deferred. The absence of a server-side ruleset does not authorize bypassing PR/review/CI policy.

## Legacy task harness

The repository still contains the earlier `task:branch`, `task:prepare`, `task:verify`, `task:commit`, `task:push`, `task:pr`, `task:close`, `task:advance` and `task:run` harness lineage.

That flow is retained for bootstrap compatibility, recovery/debugging and historical evidence where applicable. It is **not** the normal product-development workflow for newly planned Work Packages. Do not infer one-branch/one-PR-per-TASK behavior from legacy harness documentation when Sprint Mode authority is active.

See `docs/engineering/LOCAL_TASK_ORCHESTRATOR.md` for the legacy orchestrator's bounded applicability.
