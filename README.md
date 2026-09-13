# System Builder

Open, compatibility-first factory for process-driven business systems.

System Builder is a suite of interoperable tools that transforms operational knowledge into autonomous, versioned and deployable software. The repository is intentionally repository-first: durable decisions must end as code, tests, contracts, ADRs, specifications or maintained documentation.

## Core idea

```text
Real business
  -> Mirror / Elicitation
  -> Business Recipe
  -> Analysis
  -> System Definition
  -> Assembly
  -> Validation
  -> Compiler
  -> Release
  -> Deploy
  -> Autonomous Runtime
  -> Observe / Support / Evolution
```

## Non-negotiable direction

- The principle is the process.
- Compatibility before replacement.
- BusinessRecipe != SystemDefinition.
- Builder != Runtime.
- Published runtimes must remain operational without the Builder.
- The suite is modular; no user is required to consume every System Builder module.
- Open by architecture, not only by license.
- Data, contracts and release artifacts must be portable.
- Agents execute bounded work; the repository is project memory.

## Start here

For current development work, read in this order:

1. `AGENTS.md` — repository-wide execution and architecture invariants.
2. `docs/current/PROJECT_STATE.md` — integrated current state.
3. `docs/current/CURRENT_MILESTONE.md` — current milestone/package gate.
4. `docs/current/NEXT_WORK.md` — near-horizon next work.
5. `project_docs/schedule/SPRINT_GENERATION_POLICY.md` — rolling-wave Work Package policy.
6. `project_docs/schedule/SPRINT_MODE.md` — current product-development execution model.
7. the active Work Package, Sprint manifest and TASK specifications.

For documentation authority and historical classification, see `docs/README.md` and `docs/engineering/DOCUMENTATION_GOVERNANCE.md`.

## Development model

Normal product development uses Sprint Mode:

```text
fresh main
  -> Planning & Materialization
  -> Construction A
  -> Construction B
  -> [Construction C only when fresh evidence requires it]
  -> Package Integration & Review
  -> Documentation & Closure
```

A Construction Sprint uses one `sprint/<SPRINT-ID>` branch. Its committed TASKs execute in dependency order, with one authoritative commit per TASK, declared validations, repository-wide verification at Sprint completion and one Sprint PR to `main`.

The normal local executor is `scripts/sprint-run-local.ps1`, which uses disposable OpenCode sessions per committed TASK. GitHub is source/history plus objective CI; hosted OpenCode generation/execution is not the default product executor.

Do not use the legacy task-per-PR bootstrap flow as the normal development process. Older harness/orchestrator documents are retained only where explicitly classified as legacy, recovery or historical reference.

## Local prerequisites

Current repository guidance expects Git, Node.js 24 and npm 11 or newer.

```text
git clone https://github.com/delmacy/system-builder.git
cd system-builder
npm install
npm run verify
```

Before running any development automation, read `AGENTS.md` and the active Sprint/TASK authority chain.

## Current phase

The project state changes quickly. Do not hard-code the current milestone from this README. The authoritative live status is always:

- `docs/current/PROJECT_STATE.md`
- `docs/current/CURRENT_MILESTONE.md`
- `docs/current/NEXT_WORK.md`

## Legacy/reference repository

`delmacy/gestaotecnica` is a legacy/reference quarry, not an authority for this repository. Reusable concepts or code may be extracted only through evidence-backed, bounded work under current System Builder architecture and contracts.
