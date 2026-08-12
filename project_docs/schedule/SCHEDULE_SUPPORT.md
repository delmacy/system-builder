# Schedule Support

## Pipeline
Scope Baseline -> Work Packages -> DAG -> topological order -> logical waves -> milestones/increments -> activity decomposition -> estimates -> critical path -> schedule baseline -> sprint loading.

## Milestone rule
Milestone is evidence-based, not date-only. It is reached when a defined integrated capability/evidence exists.

Candidate milestones:
- M0 Planning baseline approved.
- M1 Semantic/identity foundations stable.
- M2 Process knowledge can be captured/versioned/provenanced.
- M3 Recipe -> Analysis -> Design chain validated.
- M4 Catalog/capability contracts stable.
- M5 First assembled and validated vertical slice.
- M6 First autonomous compiled runtime slice.
- M7 Release/deploy/rollback path proven.
- M8 Runtime observation/support feedback loop proven.
- M9 Improvement loop proven.

## Critical path method
Duration estimates are attached to activities/tasks, never invented at WBS level. After task decomposition, calculate earliest/latest starts, float and critical chain of mandatory predecessors. Recalculate after material scope/dependency/estimate changes.

## Sprint loading gate
A task may be loaded only if parent WP is READY; mandatory predecessor is DONE or accepted contract gate is satisfied; acceptance/evidence are known; task is small enough; required environment/tool/agent is available.

## Sequential default, parallel optional
Operational default may remain sequential for simplicity. Parallel work is allowed when DAG shows no blocking edge and integration capacity exists. Parallelism is optimization, never a reason to violate dependency gates.

## Traceability
Every future task records: requirement -> WBS -> WP -> predecessor(s) -> milestone/increment -> sprint -> PR/commit -> validation/evidence.
