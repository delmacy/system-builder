# OpenCode GitHub Work Package Factory

## Purpose

Run a complete System Builder Work Package as a bounded GitHub-hosted execution chain while preserving repository-first governance, and provide a separate planning workflow that projects the next Work Package horizon from WBS and integrated repository evidence.

The automation deliberately does **not** recreate the AgentFactory Supervisor. GitHub Actions owns deterministic scheduling/isolation; OpenCode owns one bounded cognitive unit per fresh session; Git is durable memory; GitHub CI is objective evidence.

## Factory hierarchy

The factory is split into two deliberately separate planes:

`Work Package Planner -> projection PR -> human review/merge -> Work Package Executor`

Execution then follows:

`Work Package -> Sprint -> TASK -> fresh OpenCode session`

Planning approval does not imply construction authorization. A merged Work Package projection becomes repository planning truth; execution still starts through the explicit Work Package workflow.

## Work Package projection planner

Start `.github/workflows/opencode-work-package-planner.yml` with `workflow_dispatch`.

Inputs:

- `horizon_count`: number of successor Work Packages to project, default `3`, hard-capped at `6` to avoid false long-range precision;
- `model`: optional OpenCode `provider/model`; blank uses `OPENCODE_FACTORY_MODEL`;
- `planning_focus`: optional bounded focus supplied by the operator. Blank means derive direction entirely from repository truth.

The planner always starts from fresh `main` on an isolated `planning/work-packages-<run>-<attempt>` branch and uses a fresh OpenCode session. It reads the repository authority chain, including current milestone/state, WBS method, rolling-wave/Sprint policy, relevant module scope/WBS documents, prior package/review evidence, technical debt, contracts, accepted ADRs and the master blueprint when architecture affects sequencing.

The planner must reconstruct a dependency/readiness DAG and project the requested Work Package horizon. Only the nearest actually eligible package may be promoted to `READY`/`SELECTED`/`COMMITTED`; farther packages remain `FORECAST`/`CANDIDATE`, and blocked packages must retain their explicit gates.

Each projected Work Package records at least:

- package ID and goal/deliverables;
- WBS traceability;
- predecessors/dependencies and readiness state;
- risk/change level;
- expected integrated proof;
- forecast-level 2-3 construction Sprint decomposition;
- mandatory Integration & Technical Debt Review;
- explicit ADR/L3/L4/security/governance/destructive-migration stop gates;
- successor implications.

Durable planning output is centered on `project_docs/execution_planning/WORK_PACKAGE_ROADMAP.md` plus package planning files under `project_docs/execution_planning/`. The workflow forbids product code, TASK execution, `.github/**`, `tooling/**`, tests and package/application changes.

The planner requires exactly one planning commit, a clean tree, planning-only paths and a successful repository-wide `npm run verify`. It then opens a **Work Package Projection review PR**. That PR is never auto-merged by the planner and merging it does not start construction.

## Entry point: Work Package execution

Start `.github/workflows/opencode-work-package.yml` with `workflow_dispatch`.

Inputs:

- `work_package_id`: authoritative Work Package ID, for example `P10-PACKAGE-01`;
- `first_sprint_id`: first already `COMMITTED` Sprint;
- `first_sprint_branch`: its `sprint/<SPRINT-ID>` branch;
- `model`: optional OpenCode `provider/model`; blank uses `OPENCODE_FACTORY_MODEL`;
- `authorize_full_work_package`: when `true`, this initial dispatch is the explicit authorization to cross eligible successor Sprints without another user dispatch;
- `max_sprints`: package-level safety ceiling;
- `max_cycles_per_sprint`: session-level safety ceiling inside each Sprint.

If `authorize_full_work_package=false`, only the first Sprint runs and the workflow stops at its normal Sprint review PR.

## Inside one Sprint

`.github/workflows/opencode-sprint-task-loop.yml` executes one bounded unit per GitHub runner/OpenCode session.

Each run:

1. reconstructs the declared Sprint branch;
2. installs Node 24, locked repository dependencies, OpenCode and the same PostgreSQL services used by deterministic CI;
3. starts a new OpenCode session, never `--continue`/`--session`;
4. reads `AGENTS.md`, Sprint Mode, parent Work Package, Sprint manifest, TASK spec and all declared `context_paths`;
5. executes exactly the next eligible TASK, including its declared validations;
6. requires exactly one authoritative commit and a clean working tree;
7. pushes the Sprint branch;
8. recursively dispatches another fresh runner/session for the next TASK;
9. after the final TASK, uses one fresh session for Sprint closure/report and runs repository-wide `npm run verify`;
10. opens one Sprint PR against `main`.

## Intermediate Sprint integration in Work Package mode

When `authorize_full_work_package=true`, the Sprint PR is an intermediate Work Package integration boundary. The controller may merge it only after:

- all committed TASKs have distinct commits;
- the Sprint report exists;
- repository-wide verification passed;
- the PR exists against `main`;
- required GitHub checks on that PR pass;
- no repository-defined escalation/blocker exists.

The controller never writes product work directly to `main`; integration still occurs only through the Sprint PR.

After the intermediate Sprint merge, the controller dispatches `.github/workflows/opencode-next-sprint-materialize.yml` as a **new runner and new OpenCode session**.

## Between Sprints

The next-Sprint materializer reconstructs fresh `main` and re-reads the parent Work Package, WBS, predecessor Sprint report, rolling-wave policy, contracts and ADRs.

It performs exactly one bounded transition:

- promote/materialize at most one next eligible construction Sprint to `COMMITTED`; or
- materialize/perform the Work Package Integration & Technical Debt Review when construction is complete; or
- record an authoritative blocker and stop.

It does not implement product code.

When exactly one committed successor Sprint is detected, the planning PR is verified, merged as an intermediate package transition after checks pass, and the successor Sprint task loop is dispatched with a fresh session chain.

When no committed successor Sprint exists, automation stops at the planning/Work Package review PR. This represents either the final package review boundary or a real governance/ADR/blocker boundary and therefore requires human review.

## Full factory chain

Planning and execution together become:

`WP Planner dispatch`
`-> fresh repository/WBS projection session`
`-> Work Package roadmap + package forecast`
`-> projection PR`
`-> HUMAN PLANNING REVIEW / MERGE`
`-> explicit WP execution dispatch`
`-> Sprint 1 / TASK session(s)`
`-> Sprint 1 verify + PR + checks + merge`
`-> fresh next-Sprint planning session`
`-> Sprint 2 materialization + PR + checks + merge`
`-> Sprint 2 / TASK session(s)`
`-> ...`
`-> final construction Sprint merge`
`-> fresh package-review session`
`-> Work Package Integration & Technical Debt Review PR`
`-> HUMAN REVIEW`

A blocked package terminates safely at the first non-automatable authority gate. A completed package review can later be followed by another explicit Work Package Planner run to refresh the planning horizon from newly integrated truth.

## Callback and heartbeat behavior

GitHub Actions is the callback authority. Completion of `opencode run`, the step, job and workflow provides deterministic success/failure/cancelled/timeout state. Successful units explicitly dispatch the next workflow; failed units do not advance.

No custom heartbeat is required initially. Each unit has a GitHub `timeout-minutes` watchdog, and recursive progression occurs only after a successful process return plus durable Git progress. A future observability layer may add progress heartbeats without making them completion authority.

## Required GitHub configuration

Create the Actions repository variables:

- `OPENCODE_FACTORY_MODEL` = exact OpenCode model ID in `provider/model` form.
- `OPENCODE_VERSION` (optional) = OpenCode CLI version installed in each runner; defaults to `1.18` when unset.

Configure the secret required by the selected provider. The workflows expose conventional secrets when present:

- `DEEPSEEK_API_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`

Never commit provider credentials.

## Safety properties

- Planning and construction authorization are separate gates.
- The planner may forecast several Work Packages but may promote at most the nearest actually eligible one.
- Planner changes are restricted to planning/current-state documentation and require repository-wide verification.
- `main` is never the OpenCode working branch for construction.
- Every TASK/control transition uses a fresh runner and fresh OpenCode session.
- Exactly one authoritative commit is allowed per cognitive unit.
- Dirty working tree or ambiguous/multiple successor Sprint materialization is a hard stop.
- No-progress runs stop rather than loop.
- `max_cycles_per_sprint` and `max_sprints` bound recursion.
- Forecast work is never executed solely because full Work Package progression was authorized.
- ADR, L3/L4, destructive migration, security/governance and conflicting-authority gates always stop automation.
- Existing TASK `allowed_paths`, `forbidden_paths`, `max_files`, dependencies and validation commands remain authoritative.
- The final Work Package review/blocker PR is not auto-merged.

## P10 example

`P10-PACKAGE-01` currently has `P10-PRODUCTION-SECRETRESOLVER-01` committed, while its TLS/server-identity Sprint remains `FORECAST` behind an ADR/human gate. Therefore a full-P10 dispatch may execute the SecretResolver Sprint automatically, integrate it after objective checks, reconstruct `main`, and then must stop when fresh package revalidation reaches the unaccepted TLS ADR gate. It must not manufacture authorization for the TLS Sprint.

A Work Package Planner run after that blocker is resolved can reconstruct the WBS/debt horizon and project the next package sequence from the newly authoritative state rather than relying on an old forecast.

## Relationship to repository policy

`project_docs/WBS_METHOD.md` defines Work Packages as deliverable-oriented WBS scope, while `project_docs/schedule/SPRINT_GENERATION_POLICY.md` defines the shorter rolling-wave Sprint horizon. The planner therefore projects Work Packages from WBS first; Sprint detail remains subordinate to package scope.

`project_docs/schedule/SPRINT_MODE.md` defines explicit Work Package execution mode. The initial named Work Package dispatch supplies the authorization to cross eligible successor Sprints, while repository truth after each real merge determines whether a successor is actually eligible.

The frozen AgentFactory Supervisor/runtime remains unnecessary; callback/heartbeat artifacts are not Work Package completion gates.
