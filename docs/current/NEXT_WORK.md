# Next Work — Product Sprint Mode

The repository is authoritative. Product execution uses Sprint Mode: one Sprint branch, one primary product task, declared validation, final full verification and one Sprint PR/review before merging to `main`.

Read:

- `project_docs/schedule/SPRINT_MODE.md`
- `project_docs/execution_planning/PRODUCT_10_SPRINT_PLAN.md`

## Immediate sequence

1. Synchronize local `main` and confirm `npm run verify` passes.
2. Start `P1-SPRINT-01` from the integrated Sprint Mode baseline.
3. Create `sprint/P1-SPRINT-01` from the intended synchronized `main` commit.
4. Execute only `TASK-005 — BusinessRecipe Contract`.
5. Run TASK-005 declared validation and correct bounded failures autonomously.
6. Run final repository-wide `npm run verify`.
7. Produce the compact Sprint Report.
8. Push the Sprint branch and open one PR to `main`.
9. Stop for Sprint Review.
10. Only after integration, begin `P1-SPRINT-02` / TASK-006.

## Ten-Sprint execution horizon

The committed product sequence is:

1. Recipe — TASK-005
2. Analysis — TASK-006
3. Design — TASK-007
4. downstream public contract spine — TASK-008
5. Catalog minimal registry
6. Assembly minimal resolver
7. Validation traceability gate
8. Compiler synthetic artifact
9. Release lifecycle
10. Deploy dry-run vertical proof

Detailed goals and test targets are authoritative in `PRODUCT_10_SPRINT_PLAN.md`.

## Per-Sprint loop

`read Sprint/TASK -> create Sprint branch -> implement bounded scope -> run task tests -> fix bounded failures -> npm run verify -> Sprint Report -> one PR -> Sprint Review -> merge -> next Sprint`

## Stop/escalate

Stop the Sprint and surface a decision when work requires an undeclared architecture/public-contract change, scope expansion, destructive migration, a forbidden path, security/governance weakening, conflicting repository authorities or an ambiguity that cannot be resolved from repository authority.

## AgentFactory track

AgentFactory design, specs, tests and implementation remain preserved. Its Supervisor/runtime/heartbeat/callback path is frozen and is not a prerequisite for product progress.
