# Sprint Mode

Sprint Mode is the default product-development execution model for System Builder.

Its purpose is to maximize product throughput while preserving repository-first governance, deterministic validation and a human review boundary at the Sprint level.

## Core execution unit

The Sprint is the operational delivery unit.

`main -> sprint/<SPRINT-ID> -> committed TASK -> full verification -> Sprint Report -> one PR -> Sprint Review -> main`

A Sprint branch is created from a known synchronized `main` commit. The default product Sprint contains one primary TASK so module boundaries can be tested and reviewed independently. A bounded cross-module contract-enabler Sprint is allowed when an already-accepted task intentionally defines several linked public boundaries.

## Task execution inside a Sprint

For the committed TASK:

1. read the TASK contract and required context;
2. confirm predecessor/readiness gates;
3. implement only the declared scope;
4. run the TASK-declared validation commands;
5. correct implementation/validation failures autonomously when the correction remains inside scope;
6. create the TASK commit;
7. run the final Sprint validation.

Recommended commit convention:

`feat(TASK-005): <bounded outcome>`

TASK boundaries remain authoritative even though the review boundary is the Sprint.

## Sprint completion

After the committed work:

1. run repository-wide final validation (`npm run verify` unless the Sprint declares a stricter command);
2. update required docs/contracts/evidence;
3. produce a Sprint Report with TASK result, commit, validations, deviations, discoveries and residual work;
4. push the Sprint branch;
5. open one PR from `sprint/<SPRINT-ID>` to `main`;
6. stop for Sprint Review.

The next Sprint does not begin automatically.

## Human review boundary

Normal human review is once per Sprint, at the Sprint PR/review gate.

Immediate escalation is still required when execution encounters:

- an undeclared L3/L4 contract or architecture change;
- scope expansion outside the committed TASK;
- destructive or irreversible migration;
- conflicting repository authorities;
- a required path forbidden by the TASK contract;
- security/governance weakening;
- an ambiguity that cannot be resolved from repository authority.

Routine implementation choices, test fixes and bounded refactors do not require intermediate approval.

## Executors and orchestration

The default local executor is OpenCode CLI operating directly on the Sprint branch. Cursor or another compatible coding agent may be substituted without changing Sprint governance.

A connected repository agent such as ChatGPT may also orchestrate Sprint work through GitHub: create/read branch artifacts, prepare bounded code/document changes, inspect CI, prepare the Sprint Report and open/manage the Sprint PR. It must not claim local OpenCode execution or local test success unless those facts are actually observed through the available execution/CI surface.

The AgentFactory Supervisor/runtime is not required to execute product Sprints. Its current implementation is preserved as development infrastructure but is frozen as a non-blocking track until explicitly reactivated.

## Git and merge policy

- `main` remains protected product truth.
- A Sprint uses one branch: `sprint/<SPRINT-ID>`.
- No autonomous direct write to `main`.
- No merge to `main` before final Sprint validation and Sprint Review.
- The preferred integration path is one GitHub PR per Sprint.
- Synchronization from `main` during an active Sprint is deliberate, not automatic; record it in the Sprint Report.

## Evidence and repository memory

Sprint Mode does not weaken repository-as-memory.

Durable outcomes still end as code, tests, contracts, specs, ADRs, task status, Sprint Report or other repository artifacts. Runtime callback/heartbeat/state-closure artifacts are not product-Sprint completion gates unless a future Sprint explicitly reauthorizes them.

## Planning relationship

WBS and Work Packages define scope. Dependencies define valid ordering. Milestones define integrated outcomes. Sprint Mode changes the execution container and review cadence.

`Project Scope -> WBS -> Work Package -> TASK -> Sprint branch -> Sprint Review -> main`

The first committed product horizon is defined in `project_docs/execution_planning/PRODUCT_10_SPRINT_PLAN.md`.

## Default autonomy contract

An authorized Sprint executor/orchestrator may continue through the committed Sprint without human intervention while:

- scope remains bounded;
- declared validations can be satisfied or objectively observed;
- no escalation condition is triggered;
- work stays on the Sprint branch;
- the next Sprint is not started before the current Sprint review/integration boundary.

This is the default meaning of `sprint-mode` in this repository.
