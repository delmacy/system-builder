# OpenCode GitHub Sprint Factory

## Purpose

Run System Builder Sprint work on disposable GitHub-hosted runners while preserving repository-first Sprint Mode governance.

The automation deliberately does **not** recreate the AgentFactory Supervisor. GitHub Actions owns scheduling/isolation; OpenCode owns one bounded cognitive unit per session; Git remains durable memory and CI remains objective evidence.

## Execution model

### Inside a Sprint

`.github/workflows/opencode-sprint-task-loop.yml` is started with `workflow_dispatch`.

Each workflow run:

1. reconstructs the declared `sprint/<SPRINT-ID>` branch from GitHub;
2. installs Node 24, locked repository dependencies and OpenCode 1.18.x;
3. starts a **new OpenCode session** (never `--continue` / `--session`);
4. reads `AGENTS.md` and the repository authority chain;
5. executes exactly one next eligible committed TASK, including declared validation and one TASK commit;
6. pushes that authoritative commit;
7. dispatches a fresh workflow run/session for the next TASK when progress occurred and the Sprint is not closed;
8. when no committed TASK remains, uses one fresh session for Sprint closure, final verification and the Sprint report;
9. opens one PR to `main` and stops at human Sprint Review.

The recursion has a configurable `max_cycles` safety bound. A run that produces no authoritative commit does not dispatch another run.

### After a reviewed Sprint merge

`.github/workflows/opencode-next-sprint-materialize.yml` reacts only when a PR whose source branch starts with `sprint/` is actually merged.

It reconstructs fresh `main`, creates an isolated `planning/next-sprint-after-pr-<N>` branch, starts a new OpenCode session and performs **planning/materialization only** for the next eligible Sprint according to rolling-wave policy. Product code and newly materialized TASKs are explicitly forbidden in that run.

If planning produces a valid commit and `npm run verify` passes, the workflow opens a planning PR to `main`. Human review/merge remains required before construction of that new Sprint can be dispatched.

This means automatic progression is:

`TASK session -> TASK session -> ... -> Sprint closure session -> Sprint Review PR -> human merge -> next-Sprint materialization session -> planning PR -> human merge/authorization -> next Sprint task loop`

## Required GitHub configuration

### Repository variable

Create the Actions repository variable:

- `OPENCODE_FACTORY_MODEL` = exact OpenCode model ID in `provider/model` form.

The task-loop workflow also accepts an explicit `model` input, which overrides the repository variable for that invocation. The automatic post-merge materializer requires `OPENCODE_FACTORY_MODEL` because it has no manual model input.

### Provider secret

Configure the secret required by the selected provider. The workflows expose these conventional secrets to OpenCode when present:

- `DEEPSEEK_API_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`

Only the provider selected by `OPENCODE_FACTORY_MODEL` needs to be configured.

Never commit API keys or provider credentials to repository files.

## Starting a Sprint

From GitHub Actions, run **OpenCode Sprint Task Loop** with:

- `sprint_id`: the committed Sprint ID, for example `P10-PRODUCTION-SECRETRESOLVER-01`;
- `branch`: the authoritative Sprint branch, for example `sprint/P10-PRODUCTION-SECRETRESOLVER-01`;
- `model`: optional override; blank uses `OPENCODE_FACTORY_MODEL`;
- `auto_continue_tasks`: normally `true`;
- `max_cycles`: safety ceiling, normally `8` for a three-TASK Sprint plus closure/recovery room;
- `cycle`: leave at `1` for the initial dispatch.

If the Sprint branch does not exist yet, the workflow creates it from fresh `origin/main`. If it exists, the runner reconstructs it from the remote branch.

## Safety properties

- `main` is never the OpenCode working branch for construction.
- Each task execution gets a fresh runner and fresh OpenCode session.
- A dirty working tree after OpenCode returns is a hard failure; the controller refuses to advance.
- No-progress runs stop instead of looping indefinitely.
- The controller never merges a Sprint PR.
- A Sprint report triggers repository-wide `npm run verify` before the review PR is opened.
- Next-Sprint automation runs only after a real human-reviewed Sprint merge and materializes planning only.
- The materializer does not execute the next Sprint and opens a separate human review PR.
- Existing TASK `allowed_paths`, `forbidden_paths`, `max_files`, dependency gates and validation commands remain authoritative.

## Relationship to repository policy

This workflow implements the connected-executor path already allowed by `project_docs/schedule/SPRINT_MODE.md`: GitHub may execute Sprint work provided it obeys the same repository authority chain, TASK contracts, validation gates, Sprint branch and review boundary.

It does not reactivate the frozen AgentFactory Supervisor/runtime and does not make its callback/heartbeat artifacts Sprint completion gates.
