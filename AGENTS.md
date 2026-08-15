# AGENTS.md — System Builder

This repository is the canonical source of truth. Do not rely on chat history, model memory or undocumented decisions.

## Required reading before work

Read, in order:

1. `docs/current/PROJECT_STATE.md`
2. `docs/current/CURRENT_MILESTONE.md`
3. `project_docs/schedule/SPRINT_MODE.md` when executing product work
4. the active Sprint definition
5. the task specification being executed
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
11. **Local-first development.** The normal product executor is OpenCode CLI on the maintainer desktop using free/cheap models; GitHub backs source/history and deterministic CI.
12. **Premium intelligence is exceptional.** Use Codex/strong models primarily for bootstrap, architecture, critical review, security-sensitive changes and exceptions.

## Sprint Mode

Product development executes in Sprint Mode by default.

- One Sprint uses one branch: `sprint/<SPRINT-ID>`.
- All committed TASKs execute on that branch in dependency order.
- Keep one distinct commit per TASK.
- Run each TASK's declared validations before advancing.
- Run repository-wide final verification at Sprint completion.
- Open one PR from the Sprint branch to `main`.
- Human review is normally at the Sprint boundary, not after every TASK.
- Do not start the next Sprint automatically.
- Do not write directly to `main`.

The AgentFactory Supervisor/runtime is preserved but is not a prerequisite or completion gate for product Sprints unless explicitly reactivated by repository authority.

## Agent behavior

- Execute only the declared Sprint and TASK scope.
- Do not broaden a running TASK because you noticed adjacent work; record a backlog finding instead.
- Continue autonomously through routine implementation, bounded fixes and declared validation failures while they remain inside scope.
- Prefer deterministic evidence over prose claims.
- Run declared validations before reporting completion.
- Never hide failing tests, architecture violations or unresolved ambiguities.
- If documentation is incomplete for an architecture decision, stop implementation and propose an ADR instead of inventing policy.
- Do not modify unrelated paths.
- Stop the Sprint for a human decision only when an explicit escalation condition in `project_docs/schedule/SPRINT_MODE.md` is reached.

## Change levels

- **L1 Local:** bug, UI, internal refactor, focused tests.
- **L2 Module:** behavior/API internal to one bounded context.
- **L3 Contract:** shared schemas, public APIs, capability contracts.
- **L4 Architecture:** boundaries, pipeline, suite topology, Builder/Runtime, release model.

L3/L4 work requires explicit Sprint authority/review; L4 always requires an ADR.

## Model policy

Task metadata chooses the minimum execution tier. Existing AgentFactory model-routing policy remains useful guidance, but Sprint Mode may invoke OpenCode CLI directly rather than through the Supervisor runtime.

## Legacy repository

`delmacy/gestaotecnica` is a reference quarry, not this repository's source of truth. Reuse only after classification as `REUSE`, `ADAPT`, `CLIENT_ONLY`, or `RETIRE`.
