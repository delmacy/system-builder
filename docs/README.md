# Documentation Authority

The repository is the durable source of truth. Documents under `docs/` have different authority classes and must not be treated as interchangeable.

## Current-state authority

`docs/current/PROJECT_STATE.md`, `docs/current/CURRENT_MILESTONE.md`, `docs/current/NEXT_WORK.md` and current risk documentation describe integrated repository state and near-horizon gates. They must be reconciled at the repository-defined Sprint/package boundaries and must not be used as historical logs.

Current-state prose does not override `AGENTS.md`, accepted architecture/ADRs, public/shared contracts, approved WBS/Work Package scope, active Sprint manifests or committed TASK specifications.

## Stable reference

- `docs/adr/`: accepted architecture decisions and their lifecycle.
- `docs/architecture/`: durable architecture/reference material; implementation claims still require repository evidence.
- `docs/product/`: product intent and durable product reference.
- `docs/engineering/`: current engineering procedures where consistent with `AGENTS.md` and repository execution policy.
- `docs/evidence/`: durable evidence; evidence records facts and does not create new scope authority.
- `docs/examples/`, `docs/migration/`, `docs/research/` and `docs/exec-plans/`: supporting/reference material whose authority is bounded by their purpose and status.

## Historical or deprecated guidance

`docs/bootstrap/` primarily preserves bootstrap-era handoffs and kickoff material. It is historical unless a file explicitly states that it remains current.

`docs/operations/` may contain prior automation designs. A document marked historical/deprecated is not an executable procedure and must not override the current local-first Sprint workflow.

Historical documents are retained for traceability. Their old task IDs, milestones, workflows, READY states or execution instructions must not be interpreted as current authority.

## Execution authority

READY, FORECAST, candidate, backlog or historical ledger state is not execution authorization. Use `AGENTS.md`, the current Sprint policy/mode, fresh repository memory, the active Work Package/Sprint and committed TASK specifications to determine what may execute.

When documents conflict, stop and resolve the authority conflict rather than choosing the instruction that permits more work.