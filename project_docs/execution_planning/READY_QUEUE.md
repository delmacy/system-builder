# First Horizon READY Queue

## Current product readiness
- `WP-FH-01 / TASK-010`: product dependencies satisfied by completed TASK-003, but execution through OpenCode is operationally gated by the unmerged TASK-011 adapter hotfix.
- `WP-FH-02 / TASK-004`: architecture work is logically READY from TASK-003 and can proceed in parallel; final closure is gated by successful ArtifactEnvelope executable-schema validation from WP-FH-01.
- `WP-FH-03..06`: BLOCKED by the serial public-contract chain.

## Operational vs product dependency
Do not encode the OpenCode hotfix as a business/product dependency of ArtifactEnvelope. It is an execution-tool dependency. If TASK-010 is executed by an unaffected executor, the tooling gate may be irrelevant; if executed through the affected OpenCode adapter, TASK-011 must be merged/validated first.

## Initial selection policy
Sequential-first mode should prefer clearing the tooling gate, then WP-FH-01, while architecture capacity may work on WP-FH-02 in parallel. After WP-FH-02 closes, the remaining spine advances WP-FH-03 -> WP-FH-04 -> WP-FH-05 -> WP-FH-06.
