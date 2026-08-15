# AGENTS.md — System Builder

This repository is the canonical source of truth. Do not rely on chat history, model memory or undocumented decisions.

## Required reading before work

Read, in order:

1. `docs/current/PROJECT_STATE.md`
2. `docs/current/CURRENT_MILESTONE.md`
3. `project_docs/schedule/SPRINT_MODE.md` for product Sprint execution
4. `project_docs/execution_planning/PRODUCT_10_SPRINT_PLAN.md` when the work belongs to the first product horizon
5. the committed task specification
6. the affected module/package documentation
7. relevant contracts
8. applicable accepted ADRs
9. `docs/architecture/MASTER_BLUEPRINT.md` when architecture is involved

## Constitutional invariants

1. **The principle is the process.** Operational reality precedes technical abstraction.
2. **BusinessRecipe != SystemDefinition.** Business knowledge must survive technology changes.
3. **Builder != Runtime.** The factory is not the product it manufactures.
4. **Published runtime autonomy.** A client system must keep operating when System Builder is unavailable.
5. **Compatibility before replacement.** Integrate with legacy systems before requiring migration.
6. **Open by architecture.** Open source alone is insufficient; contracts, data and artifacts must be portable.
7. **Replaceable suite modules.** A System Builder module is a reference implementation of a contract, not a mandatory dependency when interoperability is possible.
8. **Explicit contracts between bounded contexts.** Do not depend on another module's internals.
9. **No silent architecture changes.** Public contracts, module boundaries, Builder/Runtime relations or constitutional principles require an ADR.
10. **Repository is memory.** Every durable decision must end as docs, contract, ADR, spec, test or code.
11. **Local-first development.** OpenCode CLI is the default local coding executor; connected agents may orchestrate repository work through GitHub when they can objectively observe the required evidence.
12. **Premium intelligence is exceptional.** Use stronger models primarily for architecture, critical review, security-sensitive changes and exceptions.

## Product Sprint behavior

- The Sprint is the default product execution/review unit.
- Default branch naming: `sprint/<SPRINT-ID>`.
- The first product horizon is `project_docs/execution_planning/PRODUCT_10_SPRINT_PLAN.md`.
- Default Sprint scope is one primary product TASK so module boundaries remain independently testable.
- The accepted TASK remains the implementation authority; Sprint Mode does not broaden it.
- Run the TASK-declared validation, then final repository validation.
- Produce the compact Sprint Report before review.
- Open one PR to `main` and stop for Sprint Review.
- Do not begin the next Sprint before the current Sprint integration/review boundary.

## Agent behavior

- Execute only the declared Sprint/TASK scope.
- Do not broaden running work because you noticed adjacent work; create a backlog finding instead.
- Prefer deterministic evidence over prose claims.
- Run or objectively observe declared validations before reporting completion.
- Never claim a local test/CLI execution occurred unless it was actually observed.
- Never hide failing tests, architecture violations or unresolved ambiguities.
- If documentation is incomplete for an architecture decision, stop implementation and propose an ADR instead of inventing policy.
- Do not modify unrelated paths.

## Change levels

- **L1 Local:** bug, UI, internal refactor, focused tests.
- **L2 Module:** behavior/API internal to one bounded context.
- **L3 Contract:** shared schemas, public APIs, capability contracts.
- **L4 Architecture:** boundaries, pipeline, suite topology, Builder/Runtime, release model.

L3/L4 work requires explicit review; L4 always requires an ADR.

## AgentFactory status

AgentFactory design/specs/tests remain repository history and reusable infrastructure. The Supervisor/runtime/heartbeat/callback path is frozen and is not a prerequisite for product Sprint execution unless a future explicitly authorized Sprint reactivates it.

## Legacy repository

`delmacy/gestaotecnica` is a reference quarry, not this repository's source of truth. Reuse only after classification as `REUSE`, `ADAPT`, `CLIENT_ONLY`, or `RETIRE`.
