# Sprint Mode

Sprint Mode is the default product-development execution model for System Builder.

Its purpose is to maximize product throughput while preserving repository-first governance, deterministic validation and a human review boundary at the Sprint level by default.

## Core execution unit

The Sprint is the operational delivery unit.

`main -> sprint/<SPRINT-ID> -> committed TASKs -> full verification -> Sprint Review -> one PR -> main`

A Sprint branch is created from a known synchronized `main` commit. All TASKs committed to that Sprint are implemented on the same Sprint branch unless an explicitly approved exception requires isolation.

## Pre-code Sprint manifest

Before product code is changed, the active Sprint must have a durable manifest under `project_docs/execution_planning/` declaring:

- Sprint ID and Goal;
- intended base/branch;
- committed TASK set and dependency order;
- predecessor gate;
- growing integration/E2E proof expected at exit;
- final validation command;
- explicit stop/escalation conditions.

Do not invent the Sprint while implementing it. Forecast Sprints may be prepared earlier, but only the active Sprint is committed.

## Task execution inside a Sprint

For each committed TASK, in dependency order:

1. read `AGENTS.md` and the required repository authority chain;
2. read the TASK contract and every applicable `context_paths` authority;
3. confirm predecessor/readiness gates;
4. confirm `allowed_paths`, `forbidden_paths` and `max_files` before editing;
5. implement only the declared scope;
6. add/maintain positive, negative and predecessor-integration tests where applicable;
7. run the TASK-declared validation commands;
8. correct implementation/validation failures autonomously when the correction remains inside scope;
9. create a distinct commit for the TASK;
10. continue to the next eligible TASK.

Recommended commit convention:

`feat(TASK-045): <bounded outcome>`

TASK boundaries remain authoritative even though branch and PR boundaries move to the Sprint.

## Growing integration proof

Every construction Sprint must extend an integrated proof rather than relying only on isolated unit success.

Examples:

- contracts/knowledge Sprint: Mirror -> Recipe -> Analysis -> Definition;
- factory Sprint: Definition -> Catalog -> AssemblyPlan;
- validation/compiler Sprint: ... -> ValidationEvidence -> ReleaseArtifact;
- release/deploy Sprint: ... -> PublishedRelease -> DeploymentRecord.

Do not hand-author a downstream artifact inside an E2E test when the corresponding executable module already exists; invoke the actual module API.

## Sprint completion

After the last committed TASK:

1. run the repository-wide final validation (`npm run verify` unless the Sprint declares a stricter command);
2. update required docs/contracts/evidence;
3. produce a Sprint Report with TASK results, commits, validations, deviations, discoveries and residual work;
4. push the Sprint branch;
5. open one PR from `sprint/<SPRINT-ID>` to `main`;
6. use GitHub CI as objective final validation;
7. stop for Sprint Review unless an explicit Work Package execution authorization below permits deterministic intermediate integration.

The next Sprint does not begin automatically unless the user explicitly authorizes more than one Sprint and repository policy permits it.

## Explicit Work Package execution mode

A user may explicitly authorize execution of a named Work Package as one bounded delivery authorization. This is the supported mode for GitHub-hosted automation across a package containing multiple construction Sprints.

The authorization must name the Work Package and begin from a committed/materialized Sprint. It may allow the controller to continue across successor Sprints without a new user dispatch only when each successor becomes `COMMITTED` from freshly integrated repository truth.

Work Package authorization does **not** pre-authorize forecast scope. It never overrides:

- `FORECAST`, `BLOCKED` or dependency/readiness state;
- TASK `allowed_paths`, `forbidden_paths`, `max_files` or validation commands;
- an undeclared L3/L4 contract or architecture change;
- an ADR acceptance requirement;
- destructive/irreversible migration gates;
- security/governance weakening;
- conflicting repository authorities or explicit human-decision gates.

For an explicitly authorized Work Package, an intermediate construction Sprint may be integrated automatically only after all of the following are true:

1. every committed TASK has its distinct authoritative commit;
2. the Sprint Report exists;
3. repository-wide final verification passes;
4. the Sprint PR is open against `main`;
5. required GitHub checks pass on that exact PR head;
6. no repository-defined escalation/blocker is present.

After that merge, the controller must reconstruct fresh `main` and use a fresh OpenCode session to revalidate the Work Package before promoting/materializing at most one successor Sprint. A forecast Sprint cannot be executed merely because it was listed in the original package forecast.

The Work Package automation stops when:

- the package Integration & Technical Debt Review/final review boundary is reached;
- no eligible committed successor Sprint can be produced;
- a human/ADR/L3/L4/security/governance gate is encountered;
- validation or CI fails;
- the configured safety ceiling is reached.

The normal human review boundary for this mode is the final Work Package review/blocker PR. Intermediate Sprint PRs remain durable integration evidence and may be automatically merged only under the explicit Work Package authorization and the deterministic conditions above.

## Human review boundary

Normal standalone Sprint execution uses one human review per Sprint, at the Sprint PR/review gate.

Explicit Work Package execution mode may defer human review of intermediate Sprints to the Work Package boundary under the rules above. Immediate escalation is still required when execution encounters:

- an undeclared L3/L4 contract or architecture change;
- scope expansion outside committed TASKs;
- destructive or irreversible migration;
- conflicting repository authorities;
- a required path forbidden by the TASK contract;
- security/governance weakening;
- an ambiguity that cannot be resolved from repository authority.

Routine implementation choices, test fixes and bounded refactors do not require per-TASK approval.

## Executor

The default executor is the local OpenCode orchestrator: `scripts/sprint-run-local.ps1`.

It executes the committed TASK set in dependency order, one disposable `opencode run` session per TASK on the Sprint branch, enforces exactly one authoritative commit per TASK, pushes the branch, runs Sprint closure (final verification + Sprint Report + closure commit), and may open the Sprint Review PR.

GitHub-hosted OpenCode automation workflows are disabled by repository decision. GitHub is used only as source/history and as objective deterministic CI on the Sprint PR head; GitHub Actions never drive OpenCode execution.

A connected coding agent may execute through another environment instead, provided it obeys the same repository authority chain, TASK contracts, validation gates, branch boundary and stop conditions. Local commands/tests must never be claimed unless actually observed; GitHub Actions may serve as objective remote verification.

The AgentFactory Supervisor/runtime is not required to execute product Sprints. Its current implementation is preserved as development infrastructure but is frozen as a non-blocking track until explicitly reactivated.

## Git and merge policy

- `main` remains protected product truth.
- A Sprint uses one branch: `sprint/<SPRINT-ID>`.
- TASKs use separate commits, not separate PRs by default.
- No autonomous direct write to `main`.
- No merge to `main` before final Sprint validation and the applicable Sprint/Work Package review gate.
- The preferred integration path is one GitHub PR per Sprint.
- Intermediate Sprint PR auto-integration is permitted only in explicit Work Package execution mode after required checks pass.
- Synchronization from `main` during an active Sprint is deliberate, not automatic; record it in the Sprint Report.

## State truth

A TASK/Sprint may distinguish three states:

- `IMPLEMENTED_ON_SPRINT_BRANCH` — code exists only on the Sprint branch;
- `CI_PASS` — objective Sprint CI passed for the current head;
- `MERGED` — accepted into `main` and therefore published repository truth.

Do not describe branch-only work as integrated/completed in `main`.

## Evidence and repository memory

Sprint Mode does not weaken repository-as-memory.

Durable outcomes still end as code, tests, contracts, specs, ADRs, task status, Sprint Report or other repository artifacts. Runtime callback/heartbeat/state-closure artifacts are not product-Sprint completion gates unless a future Sprint explicitly reauthorizes them.

## Planning relationship

WBS and Work Packages define scope. Dependencies define valid ordering. Milestones define integrated outcomes. Sprint Packages define the short rolling-wave horizon. Sprint Mode defines the execution container and review cadence.

`Project Scope -> WBS -> Work Package -> Sprint Package -> Sprint manifest -> TASK -> Sprint Review -> main`

In explicit Work Package mode, the controller repeats the Sprint segment only after fresh-main revalidation and stops at the Work Package review/blocker boundary.

## Default autonomy contract

An authorized Sprint executor may continue through all committed TASKs without human intervention while:

- scope remains bounded;
- declared validations can be satisfied;
- no escalation condition is triggered;
- the executor stays on the Sprint branch;
- the next Sprint is not started without authorization.

An explicit named Work Package dispatch is valid authorization for eligible successor Sprints in that package under the Work Package execution rules above; it is not authorization for blocked/forecast work or architecture/security decisions.

This is the default meaning of `sprint-mode` in this repository.
