# Next Work — P9 Managed Runtime Process Sprint

The repository is authoritative. Do not use chat history as technical authority.

## Active Sprint

`P9-MANAGED-RUNTIME-PROCESS-01`

Base: `14cdccbd391d3c337f749bc14e470e5a8bb1742f`
Branch: `sprint/P9-MANAGED-RUNTIME-PROCESS-01`
Status: `MATERIALIZED / PRE_CODE_CI_PENDING`.

## Required action

1. Run Deterministic CI on the materialization head.
2. If green, execute TASK-119, TASK-120 and TASK-121 in dependency order.
3. Respect each TASK's `context_paths`, `allowed_paths`, `forbidden_paths`, `max_files` and validations.
4. Keep one authoritative commit per TASK.
5. Run repository-wide final verification, produce Sprint Report, open/promote one Sprint PR and stop at Sprint Review.

## Boundary

Do not materialize or execute `P9-ACTIVE-RUNTIME-PROMOTION-01`, `P9-RUNTIME-RECONCILIATION-E2E-01` or the P9 Integration & Technical Debt Review.
Stop/escalate if managed process ownership requires external traffic/fleet/cloud topology, canonical infrastructure contracts or an L4 Builder/Runtime change.
