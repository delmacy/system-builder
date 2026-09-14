# Documentation Authority

Status: `CURRENT_AUTHORITY`
Authority level: `documentation-governance`
Applies to: repository documentation classification and conflict resolution
Last reconciled: 2026-09-13

The repository is the durable source of truth. Documents have different authority classes and must not be treated as interchangeable.

## Documentation status classes

Every development/operations document should be classifiable as one of:

- `CURRENT_AUTHORITY` — defines policy or current execution/architecture authority within its declared scope.
- `CURRENT_REFERENCE` — accurate maintained guidance subordinate to higher authority.
- `CONDITIONAL_REFERENCE` — accurate only when an explicitly named mode/tool/automation is active.
- `EVIDENCE` — records what was observed, tested, reviewed or integrated; evidence does not create scope authority.
- `HISTORICAL` — preserved for traceability; never used to select or authorize current work.
- `DEPRECATED` — intentionally retained but should not be used for new work.
- `SUPERSEDED` — replaced by a named current document or process.

For detailed maintenance rules, required metadata and reconciliation triggers, see `docs/engineering/DOCUMENTATION_GOVERNANCE.md`.

## Current-state authority

`docs/current/PROJECT_STATE.md`, `docs/current/CURRENT_MILESTONE.md`, `docs/current/NEXT_WORK.md` and current risk documentation describe integrated repository state and near-horizon gates. They must be reconciled at repository-defined Sprint/package boundaries and must not be used as historical logs.

`docs/current/TASK_LEDGER.json` is retained byte-for-byte as a legacy compatibility/evidence fixture for deterministic AgentFactory I2 tests. Despite its path, it is **not current planning or execution authority**; its historical READY entries must never drive work selection.

Current-state prose does not override `AGENTS.md`, accepted architecture/ADRs, public/shared contracts, approved WBS/Work Package scope, active Sprint manifests or committed TASK specifications.

## Development authority

For normal product development, the current authority chain is:

1. `AGENTS.md` constitutional/repository rules;
2. accepted architecture decisions and public/shared contracts;
3. approved Scope Baseline, WBS and Work Package authority;
4. `docs/current/*` repository memory;
5. `project_docs/schedule/SPRINT_GENERATION_POLICY.md` for planning/materialization;
6. `project_docs/schedule/SPRINT_MODE.md` for execution;
7. active Work Package/Sprint manifest and committed TASK specifications;
8. declared TASK context paths and affected module documentation.

`project_docs/schedule/AUTHORITY_ORDER.md` defines the planning-specific precedence model.

## Stable reference

- `docs/adr/`: accepted architecture decisions and their lifecycle.
- `docs/architecture/`: durable architecture/reference material; implementation claims still require repository evidence.
- `docs/product/`: product intent and durable product reference.
- `docs/engineering/`: current engineering procedures where consistent with `AGENTS.md` and repository execution policy. Legacy procedures must carry explicit status metadata.
- `docs/evidence/`: durable evidence; evidence records facts and does not create new scope authority.
- `docs/examples/`, `docs/migration/`, `docs/research/` and `docs/exec-plans/`: supporting/reference material whose authority is bounded by purpose and status.

## Operations documentation

`docs/operations/` contains a mixture of current, conditional and historical material. A document in that directory is **not operational authority merely because it describes a mechanism**.

Operational documents must state whether they are current, conditional, historical, deprecated or superseded. A conditional document applies only when the named mechanism is explicitly active. Historical/deprecated documents must not override the current local-first Sprint workflow.

## Historical or deprecated guidance

`docs/bootstrap/` primarily preserves bootstrap-era handoffs and kickoff material. It is historical unless a file explicitly states that it remains current.

Old task-per-PR harness/orchestrator instructions are not the normal product-development model. Normal product work uses Sprint Mode and a `sprint/<SPRINT-ID>` branch with one Sprint PR, as defined by `AGENTS.md` and `project_docs/schedule/SPRINT_MODE.md`.

Historical documents are retained for traceability. Their old task IDs, milestones, workflows, READY states or execution instructions must not be interpreted as current authority.

## Execution authority

READY, FORECAST, candidate, backlog or historical ledger state is not execution authorization. Use `AGENTS.md`, the current Sprint policy/mode, fresh repository memory, the active Work Package/Sprint and committed TASK specifications to determine what may execute.

When documents conflict, stop and resolve the authority conflict rather than choosing the instruction that permits more work.
