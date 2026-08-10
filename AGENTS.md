# AGENTS.md — System Builder

This repository is the canonical source of truth. Do not rely on chat history, model memory or undocumented decisions.

## Required reading before work

Read, in order:

1. `docs/current/PROJECT_STATE.md`
2. `docs/current/CURRENT_MILESTONE.md`
3. the task specification being executed
4. the affected module/package documentation
5. relevant contracts
6. applicable accepted ADRs
7. `docs/architecture/MASTER_BLUEPRINT.md` when architecture is involved

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
11. **Local-first development.** The normal executor is OpenCode on the maintainer desktop using free/cheap models; GitHub backs source/history and later CI.
12. **Premium intelligence is exceptional.** Use Codex/strong models primarily for bootstrap, architecture, critical review, security-sensitive changes and exceptions.

## Agent behavior

- Execute only the declared task scope.
- Do not broaden a running task because you noticed adjacent work; create a backlog finding instead.
- Prefer deterministic evidence over prose claims.
- Run declared validations before reporting completion.
- Never hide failing tests, architecture violations or unresolved ambiguities.
- If documentation is incomplete for an architecture decision, stop implementation and propose an ADR instead of inventing policy.
- Do not modify unrelated paths.

## Change levels

- **L1 Local:** bug, UI, internal refactor, focused tests.
- **L2 Module:** behavior/API internal to one bounded context.
- **L3 Contract:** shared schemas, public APIs, capability contracts.
- **L4 Architecture:** boundaries, pipeline, suite topology, Builder/Runtime, release model.

L3/L4 work requires explicit review; L4 always requires an ADR.

## Model policy

Task metadata chooses the minimum execution tier. See `tooling/agent-harness/policies/MODEL_ROUTING.md`.

## Legacy repository

`delmacy/gestaotecnica` is a reference quarry, not this repository's source of truth. Reuse only after classification as `REUSE`, `ADAPT`, `CLIENT_ONLY`, or `RETIRE`.
