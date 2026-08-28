# Next Work — P18 Package 02 Construction B Planning Gate

Fresh main `db48bda8c2451cdfb054b4b506cb1b1851f597db` contains Construction A integrated and the bounded post-A reconciliation. Construction B `P18-PROCESS-SEMANTIC-CHANGE-INTEGRATION-01` is now COMMITTED / MATERIALIZED / NOT EXECUTED on a separate Planning & Materialization branch, bounded to WBS 18.2.1–18.2.3.

## Current gate
TASK-404..408 are materialized serially around the representative existing `packages/support-evolution/**` consumer seam. Do not execute TASK-404 before the Planning head passes exact-head Deterministic CI + Heavy Product Tests, integrates with expected-head protection, and fresh main is revalidated.

## Execution order after Planning integration
Execute only `TASK-404 -> TASK-405 -> TASK-406 -> TASK-407 -> TASK-408`, serially with exact-head gates before each successor. TASK-404 creates the additive consumer admission seam; TASK-405 binds predecessor/diff/classification/rationale truth; TASK-406 enforces canonical human process-change authority; TASK-407 proves deterministic approved/rejected consumer outcomes and backward compatibility; TASK-408 closes with the integrated growing proof and Sprint Report.

Construction C remains OPTIONAL / FORECAST / NOT MATERIALIZED and may be promoted only after Construction B integration if fresh evidence proves it necessary. WBS 18.3 remains FORECAST / NOT MATERIALIZED.

Do not use Git as business-version authority, treat classification/model output as approval, reuse ADR-0010 PR approval as business approval, change Decision Boundary, alter WBS 18.1 identity semantics, absorb unrelated findings/TDs or infer L4.