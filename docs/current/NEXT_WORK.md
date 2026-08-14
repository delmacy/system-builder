# Next Work — AgentFactory Ignition

The repository is authoritative. During the AgentFactory ignition track, use the I1 milestone/WP DAG and explicit task IDs rather than blindly selecting the first globally READY product task.

## Immediate sequence

1. Synchronize local `main` and run `npm ci` plus `npm run verify`.
2. Read `AGENTS.md`, `docs/current/PROJECT_STATE.md`, `docs/current/CURRENT_MILESTONE.md`, `project_docs/agentfactory_ignition/`, `project_docs/agentfactory_i1/`, `project_docs/agentfactory_i2/` and execution-governance docs.
3. Treat TASK-012 through TASK-031 as the integrated I1/I2 pre-run baseline; TASK-028 through TASK-031 reconcile as DONE through exact durable approval.
4. Treat TASK-032 as the integrated and state-closed WP-I2-02 kernel baseline.
5. Treat TASK-033/WP-I2-03 as integrated and state-closed, but its recorded GO is superseded by the dynamic-model corrective gate.
6. Execute and close TASK-034, then reassess readiness. Do not create or execute TASK-010 or authorize A/B/C = TASK-004 -> TASK-005 -> TASK-006 before that decision.

## Per-task loop

`approved task -> branch -> bounded implementation -> verify -> PR -> review/merge -> evidence/state -> recompute DAG/readiness -> refine next task`.

## Stop/escalate

Stop the current implementation and surface a decision when work requires an undeclared architecture/public contract change, scope expansion, destructive migration, weakened evaluator/security control or files outside the task contract.

## Product track

TASK-010 and TASK-004 remain valid READY product work, but are intentionally deferred by execution focus while AgentFactory ignition is underway.
