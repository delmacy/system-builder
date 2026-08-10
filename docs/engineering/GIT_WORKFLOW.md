# Git and GitHub Task Workflow

## Purpose

Move a bounded task from synchronized `main` to an auditable Pull Request without depending on an AI executor or provider. The harness invokes only Git and, for PR operations, the optional GitHub CLI.

## Normal delivery sequence

```text
git switch main
git pull --ff-only origin main
npm run task:next
npm run task:branch -- TASK-ID
npm run task:prepare -- TASK-ID
[executor changes only allowed files]
npm run task:status -- TASK-ID
npm run task:verify -- TASK-ID
npm run task:commit -- TASK-ID
npm run task:push -- TASK-ID
npm run task:pr -- TASK-ID
[CI and human review]
[merge without automatic force/rebase]
git switch main
git pull --ff-only origin main
npm run task:close -- TASK-ID
```

`task:close` writes the completed task status, durable receipt and task ledger after confirming that the recorded PR was merged into synchronized `main`. These state changes require their own reviewed state-update commit/PR; the bootstrap intentionally does not commit directly on protected `main` or hide that second governance step.

## Commands and guarantees

### `task:branch`

- requires a clean working tree, a ready/unblocked task and current branch `main`;
- fetches `origin/main` and requires local/remote equality;
- derives `task/NNN-title-slug`, refuses existing local/remote refs and never resets/overwrites;
- writes ignored association metadata under `.agent/git/TASK-ID.json`.

### `task:status`

Read-only JSON containing task state, expected/current/associated branch, base/HEAD, clean/dirty state, ahead/behind, prepared/verified/committed/pushed flags and recorded PR.

### `task:commit`

- runs only on the associated non-`main` branch;
- requires a passing receipt tied to the unchanged Task Pack, task spec, base commit and content fingerprint;
- rechecks the exact changed-file set and scans for known generated paths, credential files, private keys and common token formats;
- stages only verified files and creates `TASK-ID: lower-case task title`;
- never amends, rebases, resets or stages `.agent/context/**`.

### `task:push`

Pushes only the associated branch to `origin`, sets upstream when absent and verifies the resulting remote SHA. There is no force-push path.

### `task:pr`

Uses authenticated `gh` when available. It creates a PR from the task branch to `main` containing task metadata, objective, changed files, validation commands/results, base/head commits, evidence path, non-goals and escalation risks. If `gh` is missing or unauthenticated, it fails without changing Git history and prints the manual compare URL.

## Task state vs delivery evidence

Public task states remain unchanged:

`draft -> ready -> running -> verification -> completed`

Git delivery stages are separate evidence:

`prepared -> verified -> committed -> pushed -> PR opened -> merged`

For tasks created through `task:branch`, closure requires the merged PR and synchronized `main`. Legacy tasks without Git association retain the TASK-001 local closure behavior for compatibility.

## Merge policy

- No automatic merge is configured in this bootstrap.
- `architecture` tasks always require human review.
- `high` risk tasks always require human review.
- Low-risk/free tasks may become eligible for a later policy, only through a separate accepted change.
- Force pushes, branch deletion with unintegrated work and automatic rebase/reset recovery are outside the harness.

## Recommended manual GitHub configuration

Create a branch ruleset for `main`:

1. require a Pull Request before merging;
2. require at least one approval;
3. require status check `validate` from workflow `Deterministic CI`;
4. require conversation resolution;
5. block force pushes and branch deletion;
6. optionally require branches to be up to date before merge.

The repository does not configure branch protection through an API in this phase.

## Recovery

The harness does not run `reset --hard`, `clean -fd`, automatic rebase, branch overwrite/delete or force push. When status reports divergence or a dirty tree, inspect it and recover manually; do not delete work merely to satisfy the command.

The optional `task:advance`/`task:run` layer composes this workflow and stops at CI/review/merge gates. After implementation merge it invokes `task:close` on fast-forwarded `main`, then delivers exactly the closure task spec, evidence and ledger through `state/TASK-ID-close`. State PRs also require human merge. See `docs/engineering/LOCAL_TASK_ORCHESTRATOR.md`.
