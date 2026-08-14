# Next Work — AgentFactory Ignition

The repository is authoritative. During the AgentFactory ignition track, use the I1 milestone/WP DAG and explicit task IDs rather than blindly selecting the first globally READY product task.

## Immediate sequence

1. Synchronize local `main` and run `npm ci` plus `npm run verify`.
2. Read `AGENTS.md`, `docs/current/PROJECT_STATE.md`, `docs/current/CURRENT_MILESTONE.md`, `project_docs/agentfactory_ignition/`, `project_docs/agentfactory_i1/`, `project_docs/agentfactory_i2/` and execution-governance docs.
3. Treat TASK-012 through TASK-031 as the integrated I1/I2 pre-run baseline; TASK-028 through TASK-031 reconcile as DONE through exact durable approval.
4. Treat TASK-032 as the integrated and state-closed WP-I2-02 kernel baseline.
5. Treat TASK-033/WP-I2-03 and TASK-034/WP-I2-04 as integrated and state-closed; the post-correction Supervisor readiness gate is GO.
6. Create and start only the strict external TASK-010-only Supervisor plan, with a free-only selector and no fixed model ID. Do not select TASK-004 or authorize A/B/C = TASK-004 -> TASK-005 -> TASK-006 before TASK-010 is accepted and the I2 gate is reassessed.

## Per-task loop

`approved task -> branch -> bounded implementation -> verify -> PR -> review/merge -> evidence/state -> recompute DAG/readiness -> refine next task`.

## Stop/escalate

Stop the current implementation and surface a decision when work requires an undeclared architecture/public contract change, scope expansion, destructive migration, weakened evaluator/security control or files outside the task contract.

## Product track

TASK-010 and TASK-004 remain valid READY product work, but are intentionally deferred by execution focus while AgentFactory ignition is underway.
