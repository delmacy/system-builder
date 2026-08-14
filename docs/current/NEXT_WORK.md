# Next Work — AgentFactory Ignition

The repository is authoritative. During the AgentFactory ignition track, use the I1 milestone/WP DAG and explicit task IDs rather than blindly selecting the first globally READY product task.

## Immediate sequence

1. Synchronize local `main` and run `npm ci` plus `npm run verify`.
2. Read `AGENTS.md`, `docs/current/PROJECT_STATE.md`, `docs/current/CURRENT_MILESTONE.md`, `project_docs/agentfactory_ignition/`, `project_docs/agentfactory_i1/`, `project_docs/agentfactory_i2/` and execution-governance docs.
3. Treat TASK-012 through TASK-031 as the integrated I1/I2 pre-run baseline; TASK-028 through TASK-031 reconcile as DONE through exact durable approval.
4. Execute TASK-032 for WP-I2-02 from ADR-0011 and `project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md`.
5. After TASK-032 is integrated and state-closed, materialize WP-I2-03 from its actual contracts and implement the local runtime/Windows command bridge.
6. Do not execute TASK-010 or A/B/C = TASK-004 -> TASK-005 -> TASK-006 before the supplemental Supervisor readiness reassessment.

## Per-task loop

`approved task -> branch -> bounded implementation -> verify -> PR -> review/merge -> evidence/state -> recompute DAG/readiness -> refine next task`.

## Stop/escalate

Stop the current implementation and surface a decision when work requires an undeclared architecture/public contract change, scope expansion, destructive migration, weakened evaluator/security control or files outside the task contract.

## Product track

TASK-010 and TASK-004 remain valid READY product work, but are intentionally deferred by execution focus while AgentFactory ignition is underway.
