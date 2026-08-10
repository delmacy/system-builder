# System Builder

Open, compatibility-first factory for process-driven business systems.

The System Builder is a suite of interoperable tools that transforms operational knowledge into autonomous, versioned and deployable software. The project is designed to be useful first to its own maintainers and their client systems, then to other developers, consultants and software teams.

## Core idea

```text
Real business
  -> Mirror
  -> Business Recipe
  -> Analysis
  -> Design / System Definition
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
- The suite is modular; no user is required to consume every SB module.
- Open by architecture, not only by license.
- Data, contracts and releases must be portable.
- Agents execute bounded work; the repository is the project memory.

## Local bootstrap

Prerequisites: Git, Node.js 24 and npm 11.

```text
git clone https://github.com/delmacy/system-builder.git
cd system-builder
npm install
npm run task:next
npm run task:branch -- TASK-002
npm run task:prepare -- TASK-002
```

Give only `.agent/context/TASK-002/TASK_PACK.md` to the normal OpenCode executor. After implementation:

```text
npm run task:verify -- TASK-002
npm run task:commit -- TASK-002
npm run task:push -- TASK-002
npm run task:pr -- TASK-002
npm run task:close -- TASK-002
```

Merge only after deterministic CI and review. Then update local `main` and close the task. Review and integrate closure-state changes deliberately; the harness never auto-merges.

## Current phase

M0 produced the durable project memory, evidence-backed legacy audit and local engineering harness. Product implementation has not started; M1 defines the public contract spine for one vertical proof.

Start with:

1. `AGENTS.md`
2. `ARCHITECTURE.md`
3. `docs/architecture/MASTER_BLUEPRINT.md`
4. `docs/current/PROJECT_STATE.md`
5. `docs/current/NEXT_WORK.md`

The previous `delmacy/gestaotecnica` repository is a legacy/reference source. Reusable concepts and code may be extracted only through evidence-backed tasks; its old architecture is not authoritative for this repository.
