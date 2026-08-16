# Sprint Mode

Sprint Mode is the default product-development execution model for System Builder.

Its purpose is to maximize product throughput while preserving repository-first governance, deterministic validation and a human review boundary at the Sprint level.

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
7. stop for Sprint Review.

The next Sprint does not begin automatically unless the user explicitly authorizes more than one Sprint and repository policy permits it.

## Human review boundary

Normal human review is once per Sprint, at the Sprint PR/review gate.

Immediate escalation is still required when execution encounters:

- an undeclared L3/L4 contract or architecture change;
- scope expansion outside committed TASKs;
- destructive or irreversible migration;
- conflicting repository authorities;
- a required path forbidden by the TASK contract;
- security/governance weakening;
- an ambiguity that cannot be resolved from repository authority.

Routine implementation choices, test fixes and bounded refactors do not require per-TASK approval.

## Executor

The default local executor is OpenCode CLI operating directly on the Sprint branch.

A connected coding agent may execute through GitHub instead, provided it obeys the same repository authority chain, TASK contracts, validation gates, branch boundary and stop conditions. Local commands/tests must never be claimed unless actually observed; GitHub Actions may serve as objective remote verification.

The AgentFactory Supervisor/runtime is not required to execute product Sprints. Its current implementation is preserved as development infrastructure but is frozen as a non-blocking track until explicitly reactivated.

## Git and merge policy

- `main` remains protected product truth.
- A Sprint uses one branch: `sprint/<SPRINT-ID>`.
- TASKs use separate commits, not separate PRs by default.
- No autonomous direct write to `main`.
- No merge to `main` before final Sprint validation and Sprint Review.
- The preferred integration path is one GitHub PR per Sprint.
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

## Default autonomy contract

An authorized Sprint executor may continue through all committed TASKs without human intervention while:

- scope remains bounded;
- declared validations can be satisfied;
- no escalation condition is triggered;
- the executor stays on the Sprint branch;
- the next Sprint is not started without authorization.

This is the default meaning of `sprint-mode` in this repository.
