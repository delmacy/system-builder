# Development Documentation Reconciliation — 2026-09-13

Status: `EVIDENCE`
Authority level: `reconciliation-evidence`
Applies to: sampled high-risk development/engineering/operations documentation
Baseline main: `d5478b4cb48c7b601ab151d2021d8bfca6ead8ff`
Reconciliation branch: `docs/development-documentation-reconciliation`

## Objective

Reconcile development documentation that could misdirect maintainers or agents because older bootstrap/task-harness/automation rules coexisted with the current Sprint Mode and Generation 2 repository state.

This evidence does not create product scope. It records documentation findings and the bounded documentation changes used to contain them.

## Reviewed authority/reference set

- `AGENTS.md`
- `README.md`
- `docs/README.md`
- `docs/current/PROJECT_STATE.md`
- `docs/engineering/GIT_WORKFLOW.md`
- `docs/engineering/LOCAL_TASK_ORCHESTRATOR.md`
- `docs/operations/AUTOMATION_HANDOFF_STATE_MACHINE.md`
- `docs/operations/OPENCODE_GITHUB_SPRINT_FACTORY.md`
- `project_docs/schedule/SPRINT_GENERATION_POLICY.md`
- `project_docs/schedule/SPRINT_MODE.md`
- `project_docs/schedule/AUTHORITY_ORDER.md`
- `project_docs/schedule/AGENT_SCHEDULER_RULES.md`

## Material findings

### F-01 — Root README described obsolete project phase and task-per-PR bootstrap
Severity: `HIGH`

The root README still stated that product implementation had not started and taught the old `task:branch -> task:prepare -> task:verify -> task:commit -> task:push -> task:pr -> task:close` lifecycle as the primary path. Current repository truth is Generation 2 Sprint Mode with multiple TASKs on one Sprint branch and one Sprint PR.

Disposition: `REFRESH_CURRENT`.

Resolution:
- remove stale M0/M1 phase claim;
- make `docs/current/*` the dynamic status source;
- document the current Sprint lifecycle and local executor;
- explicitly warn that task-per-PR bootstrap is not the normal product path.

### F-02 — Git workflow encoded the obsolete one-TASK/one-PR delivery topology
Severity: `HIGH`

`docs/engineering/GIT_WORKFLOW.md` described independent TASK branches/PRs and a second state PR. That is incompatible with current Sprint Mode for newly planned Work Packages.

Disposition: `REFRESH_CURRENT`.

Resolution:
- rewrite around `sprint/<SPRINT-ID>`;
- retain one authoritative commit per TASK;
- use one Sprint PR and fresh-main reconciliation;
- retain the old task harness only as legacy/recovery compatibility.

### F-03 — Local Task Orchestrator appeared current despite being superseded for normal product work
Severity: `HIGH`

The v1 task orchestrator state machine remained detailed enough to be mistaken for the default delivery process.

Disposition: `SUPERSEDE`.

Resolution:
- classify it `SUPERSEDED`;
- point normal product execution to `SPRINT_MODE.md` + `scripts/sprint-run-local.ps1`;
- preserve only historical/safety/recovery value.

### F-04 — Automation handoff documentation lacked a clear applicability boundary
Severity: `HIGH`

The `:10/:30/:50` state-machine document could be read as repository-default product execution even though the repository default is local-first Sprint Mode.

Disposition: `BOUND_CONDITIONALLY`.

Resolution:
- classify it `CONDITIONAL_REFERENCE`;
- bind it to externally scheduled recurring workers only when explicitly enabled;
- state that telemetry never creates product authority;
- require those workers, when active, to operate inside the same Sprint/TASK/GitHub exact-head gates.

### F-05 — Sprint sizing still carried an obsolete 10–15 TASK target
Severity: `MEDIUM`

The policy said there was no quota but simultaneously preserved a 10–15 TASK common target. Recent G2 Construction Sprints demonstrate that smaller semantically dense task sets can be the correct decomposition. The numeric target could incentivize artificial fragmentation.

Disposition: `REFRESH_CURRENT`.

Resolution:
- remove numeric TASK target;
- make Sprint Goal, dependency graph, proof obligations, reviewability and bounded failure surface authoritative;
- explicitly reject task-count inflation.

## Existing documents already correctly bounded

`docs/operations/OPENCODE_GITHUB_SPRINT_FACTORY.md` already carries an explicit `DEPRECATED / HISTORICAL DESIGN — DO NOT EXECUTE` banner and points to current authority.

`project_docs/schedule/AGENT_SCHEDULER_RULES.md` already states that scheduler/AgentFactory behavior is conditional and not the current default executor.

`AGENTS.md`, `SPRINT_MODE.md`, `AUTHORITY_ORDER.md` and current repository memory were consistent on the principal authority chain and Sprint-based development model in the sampled review.

## Governance added

`docs/engineering/DOCUMENTATION_GOVERNANCE.md` now defines:

- documentation status taxonomy;
- minimum metadata;
- conflict handling;
- staleness indicators;
- reconciliation dispositions;
- review triggers;
- documentation-quality dimensions;
- severity model;
- package-closure documentation question.

`docs/README.md` now exposes the same taxonomy at the documentation entry point.

## Sampled quality baseline

This is a qualitative baseline for the reviewed high-risk set, not a claim that every repository document has been individually audited.

| Dimension | Before | After reconciliation |
| --- | --- | --- |
| Authority clarity | AMBER | GREEN |
| Currentness | RED | GREEN for reviewed high-risk set |
| Conflict containment | AMBER | GREEN |
| Discoverability | AMBER | GREEN |
| Operational correctness | RED | GREEN for reviewed paths |
| Historical traceability | GREEN | GREEN |
| Low-volatility/current-state hygiene | AMBER | GREEN |

## Residual documentation debt

The reconciliation is intentionally bounded. Residual work remains:

1. not every file in `docs/operations/`, `docs/engineering/`, `project_docs/schedule/`, bootstrap/history or old execution reports carries explicit status metadata yet;
2. historical TASK specs naturally preserve obsolete metadata/process assumptions and must continue to be treated as historical evidence, not current policy;
3. older P19/pre-alpha operational proof documents are still useful but should receive explicit status metadata if they are reused as operator guidance;
4. future executor/model/automation changes must trigger documentation reconciliation rather than merely code/workflow edits.

These residual items are documentation debt, not blockers for the current product Work Package unless a stale document is about to be used as execution authority.

## Closure assessment

For the reviewed high-risk development documents, the principal contradictions that could redirect a maintainer/agent into the obsolete task-per-PR or unbounded automation model are reconciled.

The repository now has an explicit governance mechanism to distinguish current authority, current reference, conditional reference, evidence, historical, deprecated and superseded material without erasing project history.
