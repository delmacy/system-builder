# Codex AgentFactory Continuation Handoff

## Mission

Continue the bounded AgentFactory delivery-infrastructure project from the repository state until its approved ignition milestones are implemented and evidenced, while preserving System Builder architecture, governance and product scope.

The repository is the only durable authority. Do not rely on chat history.

## Bootstrap on maintainer PC

```bash
git switch main
git fetch origin
git pull --ff-only origin main
npm ci
npm run verify
```

The working tree must be clean before starting a task.

## Required reading order

1. `AGENTS.md`
2. `docs/current/PROJECT_STATE.md`
3. `docs/current/CURRENT_MILESTONE.md`
4. `docs/current/NEXT_WORK.md`
5. `project_docs/agentfactory/MASTER_SCOPE.md`
6. `project_docs/agentfactory/WBS_MASTER.md`
7. `project_docs/agentfactory/WORK_PACKAGES.md`
8. `project_docs/agentfactory/DAG.md`
9. `project_docs/agentfactory/IGNITION_MILESTONES.md`
10. `project_docs/agentfactory/EXIT_CRITERIA.md`
11. `project_docs/agentfactory_i1/`
12. `project_docs/execution_governance/`
13. the exact `specs/tasks/TASK-*.md` being executed

Read deeper architecture/ADR files only when the task context or `AGENTS.md` requires them.

## Current starting point

- TASK-011 OpenCode argument-order fix is integrated.
- TASK-012 AgentFactory execution contracts is the first implementation task for the active I1 track.
- TASK-014 DAG/READY evaluator requires completed TASK-012.
- TASK-013 OpenCode adapter hardening requires completed TASK-011 and TASK-012.
- Product tasks TASK-010 and TASK-004 remain valid READY work but are intentionally deferred while AgentFactory ignition is the active execution focus.

Do not use global `task:next` alone to decide the workstream while product and AgentFactory tasks coexist. Select the active AgentFactory milestone explicitly until milestone-aware scheduling is implemented.

## Per-task protocol

For each implementation task:

1. Confirm predecessor task/gate completion from repository state.
2. Create a dedicated task branch from current `origin/main`.
3. Prepare/read the bounded task contract and context.
4. Modify only `allowed_paths`; respect `forbidden_paths` and `max_files`.
5. Do not invent missing architecture or public contract decisions.
6. Run the task's declared validation, normally including `npm run verify`.
7. Review the diff for scope, test/evaluator weakening and architecture drift.
8. Commit/push/open the task PR using the repository's documented Git workflow.
9. Require deterministic CI success and required review/approval before merge.
10. After accepted merge, reconcile/close task metadata, evidence and ledger through the repository workflow.
11. Recompute the AgentFactory DAG/readiness before choosing dependent work.

A completed sprint/task is not kept open for later discoveries. Create a corrective/follow-up item linked to its WP and evidence.

## Rolling-wave task generation

Do not generate the entire future task catalog speculatively.

After an accepted predecessor changes the concrete execution interfaces:

1. read the next eligible Work Package(s) in the AgentFactory DAG;
2. inspect the actual merged outputs/contracts;
3. decompose the WP until the next task is independently verifiable and bounded;
4. create a new `specs/tasks/TASK-XXX-*.md` using `specs/tasks/TASK-TEMPLATE.md`;
5. include complete YAML metadata, required sections, exact dependencies, context, allowed/forbidden paths, max files and validation;
6. validate the catalog with `npm run verify` before treating the new task as executable;
7. preserve traceability to milestone, WP and dependency gate.

Do not let a coding executor decide architecture merely because the next task spec has not yet been written. Use Codex planning/review capability to materialize the spec first, then execute it as a separate bounded task.

## Milestone progression

### I1 — Single Task Autonomous

Prove `READY -> Task Pack -> route -> OpenCode -> bounded execution -> independent validation -> evidence/state -> integration -> successor readiness`, including a controlled failure path.

### I2 — Sequential Pipeline

Automatically execute a chain of dependent READY tasks one at a time, closing/recomputing state between tasks and failing closed on unmet gates.

### I3 — Sprint Autonomous

Generate/commit a bounded sprint from READY work, execute it according to capacity and close/replan using evidence. This is the minimum useful factory maturity at which System Builder product throughput should become the main beneficiary.

### I4 — DAG Autonomous

Use machine-readable DAG/gates as the scheduler authority, including independent branches and readiness recomputation without LLM-based dependency decisions.

### I5 — Review/Replanning

Automate bounded integration/debt review inputs, corrective work generation and forecast refresh while preserving scope/change governance.

### I6 — Parallel Execution

Enable only dependency-safe concurrent work with WIP/review/CI/integration capacity controls. Sequential execution remains a valid configuration.

### I7 — Self-Operating Factory

Reach the approved exit criteria where ordinary low/medium-risk delivery progresses from the repository plan with human involvement mainly at explicit governance gates.

Progress to a later milestone only after the previous exit evidence exists. Do not implement features merely because they sound useful; AgentFactory is infrastructure, not a second product.

## Model/executor policy

- Deterministic scheduler/validation work: code, not LLM reasoning at runtime.
- Mechanical bounded implementation: future AgentFactory should route to cheap OpenCode models when tests/contracts are strong.
- Codex is explicitly being used during the AgentFactory bootstrap/implementation and for architecture/critical review.
- Escalate rather than guess when the task implies L3/L4 architecture/public-contract change.

## Mandatory stop gates

Stop affected work and surface a decision/ADR/change item for:

- undeclared public contract or architecture boundary changes;
- scope expansion outside approved WBS/WP;
- destructive data/migration action;
- security/auth/secrets/trust-boundary changes beyond task authority;
- evaluator/test/governance weakening;
- missing dependency/gate evidence;
- files outside allowed scope;
- dependency cycles or contradictory authoritative documents.

Unrelated READY branches need not be blocked by a local issue.

## Definition of AgentFactory completion

Completion is evidence-based, not a task-count target. The implementation must satisfy the applicable `project_docs/agentfactory/EXIT_CRITERIA.md`, milestone exit gates, deterministic CI/validation and execution-governance controls. At completion, repository state/documentation must make the operating procedure reproducible on a clean checkout without this handoff conversation.
