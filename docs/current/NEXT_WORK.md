# Next Work — Product Sprint Mode

The repository is authoritative. Product execution now uses Sprint Mode: one Sprint branch, sequential TASK execution, one commit per TASK, final full verification and one Sprint PR/review before merging to `main`.

Read `project_docs/schedule/SPRINT_MODE.md` before execution.

## Immediate sequence

1. Synchronize local `main` and confirm `npm run verify` passes.
2. Create or reset the active product Sprint branch from the intended `main` base: `sprint/M1-SPRINT-01`.
3. Read `AGENTS.md`, `docs/current/PROJECT_STATE.md`, `docs/current/CURRENT_MILESTONE.md`, `project_docs/execution_planning/M1-SPRINT-01.md` and the committed TASK specs.
4. Treat TASK-004 as completed and integrated.
5. Execute TASK-005 on the Sprint branch, run its declared validation and create a dedicated TASK commit.
6. Execute TASK-006 only after TASK-005 is satisfied, then run its declared validation and create a dedicated TASK commit.
7. Run final repository-wide `npm run verify`.
8. Produce the Sprint Report, push `sprint/M1-SPRINT-01` and open one PR to `main`.
9. Stop for Sprint Review. Do not begin the next Sprint automatically.

## Per-task loop inside the Sprint

`read TASK -> confirm dependency -> implement bounded scope -> validate -> autonomously fix bounded failures -> TASK commit -> next eligible TASK`

No per-TASK PR or per-TASK merge is required in the default Sprint Mode.

## Stop/escalate

Stop the Sprint and surface a decision when work requires an undeclared architecture/public contract change, scope expansion, destructive migration, weakened evaluator/security control, a forbidden path, conflicting repository authorities or an ambiguity that cannot be resolved from the repository.

## AgentFactory track

The AgentFactory design, specs, tests and implementation remain preserved in the repository. Its Supervisor/runtime/heartbeat/callback execution path is frozen and is no longer a prerequisite for product progress.

Do not spend product Sprint capacity repairing AgentFactory runtime unless a future explicitly authorized Sprint reactivates that work.
