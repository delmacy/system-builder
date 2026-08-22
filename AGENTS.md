# AGENTS.md — System Builder

This repository is the canonical source of truth. Do not rely on chat history, model memory or undocumented decisions.

## Required reading before work

Read, in order:

1. `docs/current/PROJECT_STATE.md`
2. `docs/current/CURRENT_MILESTONE.md`
3. `project_docs/schedule/SPRINT_GENERATION_POLICY.md` when planning/selecting product Sprints
4. `project_docs/schedule/SPRINT_MODE.md` when executing product work
5. the active Sprint Package when one exists
6. the active Sprint definition
7. the task specification being executed
8. every applicable path declared in that TASK's `context_paths`
9. the affected module/package documentation and WBS
10. relevant contracts
11. applicable accepted ADRs
12. `docs/architecture/MASTER_BLUEPRINT.md` when architecture is involved

Before editing, explicitly confirm the TASK's `allowed_paths`, `forbidden_paths`, `max_files`, dependencies and validation commands.

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
11. **Local-first development.** The normal product executor is OpenCode CLI on the maintainer desktop using free/cheap models; GitHub backs source/history and deterministic CI only.
12. **Premium intelligence is exceptional.** Use Codex/strong models primarily for bootstrap, architecture, critical review, security-sensitive changes and exceptions.

## Sprint Mode

Product development executes in Sprint Mode by default.

- Rolling-wave planning follows `SPRINT_GENERATION_POLICY.md`: a Sprint Package normally carries 4–8 construction Sprints plus one Integration & Technical Debt Review.
- Only the active Sprint is committed; later Sprints remain forecast until predecessor gates pass.
- One Sprint uses one branch: `sprint/<SPRINT-ID>`.
- All committed TASKs execute on that branch in dependency order.
- Keep one distinct commit per TASK.
- Implementation TASKs include positive, negative and predecessor-integration tests where applicable.
- Every construction Sprint extends the growing integration/E2E proof.
- Run each TASK's declared validations before advancing.
- Run repository-wide final verification at Sprint completion.
- Open one PR from the Sprint branch to `main`.
- Human review is normally at the Sprint boundary, not after every TASK.
- Do not start the next Sprint automatically without explicit authorization.
- Do not write directly to `main`.

The AgentFactory Supervisor/runtime is preserved but is not a prerequisite or completion gate for product Sprints unless explicitly reactivated by repository authority.

## Local-first Sprint execution

GitHub-hosted OpenCode task generation/materialization workflows are disabled by repository decision. All planning and execution happen on the maintainer desktop:

- **Planning (Work Packages, WBS, task specs) is produced locally** by the OpenCode planning session and committed through the normal Sprint branch flow.
- **Sprint execution is local and automatic per TASK**: one disposable `opencode run` session per committed TASK, using the repository as the single source of truth, exactly one authoritative commit per TASK, in dependency order.
- Use the local orchestrator `scripts/sprint-run-local.ps1` to iterate the committed TASK set, run each session, validate the one-commit rule, push the Sprint branch, run Sprint closure, and optionally open the Sprint Review PR.
- GitHub is used only as source/history and as objective deterministic CI (`npm run verify`) on the Sprint PR head. GitHub Actions never drive OpenCode execution.
- Default model: `opencode/deepseek-v4-flash-free`. Prefer free/cheap models; do not depend on paid API balance for routine Sprint execution.

## Agent behavior

- Execute only the declared Sprint and TASK scope.
- Do not broaden a running TASK because you noticed adjacent work; record a backlog finding instead.
- Continue autonomously through routine implementation, bounded fixes and declared validation failures while they remain inside scope.
- Prefer deterministic evidence over prose claims.
- Run declared validations before reporting completion.
- Never hide failing tests, architecture violations or unresolved ambiguities.
- If documentation is incomplete for an architecture decision, stop implementation and propose an ADR instead of inventing policy.
- Do not modify unrelated paths.
- Do not claim local test execution unless it was actually observed; connected execution may rely on GitHub Actions as objective CI evidence.
- Stop the Sprint for a human decision only when an explicit escalation condition in `project_docs/schedule/SPRINT_MODE.md` is reached.

## Change levels

- **L1 Local:** bug, UI, internal refactor, focused tests.
- **L2 Module:** behavior/API internal to one bounded context.
- **L3 Contract:** shared schemas, public APIs, capability contracts.
- **L4 Architecture:** boundaries, pipeline, suite topology, Builder/Runtime, release model.

L3/L4 work requires explicit Sprint authority/review; L4 always requires an ADR.

## Model policy

Task metadata chooses the minimum execution tier. Existing AgentFactory model-routing policy remains useful guidance, but Sprint Mode invokes OpenCode CLI directly on the desktop.

Default model: `opencode/deepseek-v4-flash-free` (free). The local orchestrator accepts `-Model <provider/model>` for tasks that require a stronger or paid tier.

## Legacy repository

`delmacy/gestaotecnica` is a reference quarry, not this repository's source of truth. Reuse only after classification as `REUSE`, `ADAPT`, `CLIENT_ONLY`, or `RETIRE`.
