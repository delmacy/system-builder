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

## Current phase

TASK-000 establishes the durable project memory, architecture baseline and agent-development handoff. Product implementation has not started in this repository yet.

Start with:

1. `AGENTS.md`
2. `ARCHITECTURE.md`
3. `docs/architecture/MASTER_BLUEPRINT.md`
4. `docs/current/PROJECT_STATE.md`
5. `specs/tasks/TASK-001-CODEX-BOOTSTRAP.md`

The previous `delmacy/gestaotecnica` repository is a legacy/reference source. Reusable concepts and code may be extracted after audit; its old architecture is not authoritative for this repository.
