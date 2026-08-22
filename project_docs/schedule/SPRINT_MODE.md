# Sprint Mode

Sprint Mode is the default product-development execution model for System Builder. It maximizes throughput while preserving repository-first governance, deterministic validation and explicit review/closure boundaries.

## Core execution unit

The Sprint is the operational delivery unit.

`main -> sprint/<SPRINT-ID> -> committed TASKs -> full verification -> Sprint Review -> one PR -> main`

A Sprint branch is created from a known synchronized `main` commit. All TASKs committed to that Sprint execute on the same Sprint branch unless an explicitly approved exception requires isolation.

## Work Package lifecycle

For newly planned Work Packages, the authoritative default is:

`Planning & Materialization -> Construction A -> Construction B -> [Construction C only if justified] -> Package Integration & Review -> Documentation & Closure`

Only the active Sprint is committed. Later Sprints are forecast until fresh-main revalidation and predecessor gates permit promotion.

Planning, Package Review and Documentation & Closure have distinct purposes and must not be used as overflow containers for product construction.

A legacy Work Package already materially executed under an older cadence may finish under that recorded cadence when repository memory explicitly marks it grandfathered. Do not rewrite completed history to resemble the new policy.

## Pre-code Sprint manifest

Before product code is changed, an active Construction Sprint must have a durable manifest under `project_docs/execution_planning/` declaring:

- Sprint ID and Goal;
- intended base/branch;
- committed TASK set and dependency order;
- predecessor gate;
- growing integration/E2E proof expected at exit;
- final validation command;
- explicit stop/escalation conditions.

Forecast Sprints may have candidate goals/exit proofs, but only the active Sprint is committed.

## Planning & Materialization Sprint

Planning begins from freshly reconstructed `main` and must reconcile repository memory before committing new product work.

It revalidates:
- Work Package goal and WBS authority;
- predecessor outputs and current implementation;
- contracts/interfaces and architecture boundaries;
- dependencies, risks and readiness;
- growing package proof;
- forecast Construction A/B and optional C;
- package review and documentation-closure gates.

Planning materializes only the first eligible Construction Sprint. It does not implement product behavior.

## Task execution inside a Construction Sprint

For each committed TASK, in dependency order:

1. read `AGENTS.md` and the required authority chain;
2. read the TASK contract and every applicable `context_paths` authority;
3. confirm predecessor/readiness gates;
4. confirm `allowed_paths`, `forbidden_paths` and `max_files`;
5. implement only declared scope;
6. add/maintain positive, negative and predecessor-integration tests where applicable;
7. run TASK-declared validation commands;
8. correct bounded implementation/validation failures autonomously;
9. create one distinct authoritative commit for the TASK;
10. continue to the next eligible TASK.

Recommended commit convention:

`feat(TASK-045): <bounded outcome>`

## Growing integration proof

Every Construction Sprint extends an integrated proof rather than relying only on isolated unit success. Do not hand-author a downstream artifact inside E2E tests when the corresponding executable module already exists; invoke the actual module API.

## Construction Sprint completion

After the last committed TASK:

1. run repository-wide final validation (`npm run verify` unless stricter authority exists);
2. update required docs/contracts/evidence incrementally;
3. produce a Sprint Report with TASK results, commits, validations, deviations, discoveries and residual work;
4. push the Sprint branch;
5. open one PR to `main`;
6. use GitHub CI as objective exact-head validation;
7. stop for Sprint Review unless explicit Work Package execution authorization permits deterministic intermediate integration.

A successor Sprint is never started merely because it appears in forecast.

## Optional third Construction Sprint

Construction C is conditional. After Construction B is merged, reconstruct fresh `main` and determine whether the Package Goal is already satisfied strongly enough to proceed to package review.

Promote Construction C only when fresh evidence shows a bounded remaining construction increment is necessary. Otherwise skip it and proceed to Package Integration & Review.

## Package Integration & Review Sprint

This Sprint evaluates the full integrated package outcome. It must inspect end-to-end regression, contract/schema drift, architecture fitness, dependency accuracy, technical debt, security/trust, CI health, documentation consistency, performance where relevant, risks and actual-vs-forecast effort.

It may contain bounded corrections necessary to prove the already-built Package Goal. A missing product capability is not review work: return it to explicit construction/change control.

Outputs include findings, debt classification, readiness/go-no-go, updated forecast and explicit disposition for Documentation & Closure.

## Documentation & Closure Sprint

Documentation is updated throughout construction; this Sprint performs final reconciliation and package closure.

It must reconcile, as applicable:
- `docs/current/PROJECT_STATE.md`;
- `docs/current/CURRENT_MILESTONE.md`;
- `docs/current/NEXT_WORK.md`;
- Work Package status/report and Sprint reports;
- WBS/DAG/readiness/risks/lessons;
- module/public/operations docs affected by the package;
- contract/ADR references and delivery traceability.

No new product behavior is allowed in Documentation & Closure. Any functional gap found here becomes explicit blocked/corrective/successor work.

The Work Package is not closed while current repository-memory documents still describe obsolete active gates as current truth.

## Explicit Work Package execution mode

A user may explicitly authorize execution of a named Work Package as one bounded delivery authorization. Such authorization may allow progression across eligible successor Sprints only when each successor becomes `COMMITTED` after fresh-main revalidation.

Work Package authorization does not pre-authorize forecast scope and never overrides:
- `FORECAST`, `BLOCKED` or dependency/readiness state;
- TASK path/file/validation constraints;
- undeclared L3/L4 contract or architecture change;
- ADR acceptance requirements;
- destructive/irreversible migration gates;
- security/governance weakening;
- conflicting repository authorities or explicit human-decision gates.

Intermediate Construction Sprint integration under explicit package authorization requires:
1. all committed TASK authoritative commits;
2. Sprint Report;
3. repository-wide final verification;
4. open PR against `main`;
5. required exact-head GitHub checks passing;
6. no repository-defined escalation/blocker.

After merge, reconstruct fresh `main` before promoting at most one successor Sprint.

Package automation must stop at Package Integration & Review, Documentation & Closure, or any human/ADR/L3/L4/security/governance/validation/safety blocker unless explicit authority covers that exact transition.

## Human review boundary

Normal standalone execution uses one human review per Sprint at the Sprint PR gate. Explicit Work Package mode may defer review of eligible intermediate Construction Sprints according to repository policy, but immediate escalation remains required for:
- undeclared L3/L4 changes;
- scope expansion outside committed TASKs;
- destructive/irreversible migration;
- conflicting authority;
- required forbidden paths;
- security/governance weakening;
- unresolved ambiguity that repository authority cannot settle.

## Executor

The default executor is `scripts/sprint-run-local.ps1`, using one disposable `opencode run` session per committed TASK and enforcing one authoritative commit per TASK.

GitHub-hosted OpenCode automation workflows are disabled by repository decision. GitHub is source/history plus objective deterministic CI; Actions do not drive normal product execution.

A connected coding agent may execute in another environment if it obeys the same authority chain, TASK contracts, validations, branch boundary and stop conditions. Never claim unobserved local test execution.

## Git and merge policy

- `main` is the protected **product truth semantically**; this statement does not require GitHub branch protection settings during the current construction phase.
- Current repository governance deliberately keeps GitHub branch protection/required checks deferred until an explicit future maturity gate unless superseded by owner authority.
- A Sprint uses one `sprint/<SPRINT-ID>` branch.
- TASKs use separate authoritative commits, not separate PRs by default.
- No autonomous direct write to `main`.
- No merge before final Sprint validation and the applicable review gate.
- Preferred integration path is one GitHub PR per Sprint.

## State truth

A TASK/Sprint may distinguish:
- `IMPLEMENTED_ON_SPRINT_BRANCH`;
- `CI_PASS`;
- `MERGED`.

Do not describe branch-only work as integrated into `main`.

## Evidence and repository memory

Repository-as-memory remains mandatory. Durable outcomes end as code, tests, contracts, specs, ADRs, task status, Sprint Reports, package review evidence or closure documentation.

## Planning relationship

`Project Scope -> WBS -> Work Package -> Planning Sprint -> Construction Sprint(s) -> Package Integration & Review -> Documentation & Closure -> next Work Package`

WBS/Work Packages define scope; dependencies define ordering; milestones define integrated outcomes; Sprint Mode defines execution/review/closure boundaries.

## Default autonomy contract

An authorized executor may continue through all committed TASKs while scope remains bounded, validations can pass, no escalation is triggered and it remains on the Sprint branch. It may not silently promote forecast work.
