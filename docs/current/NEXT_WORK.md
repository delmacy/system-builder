# Next Work — AgentFactory Ignition

The repository is authoritative. During the AgentFactory ignition track, use the I1 milestone/WP DAG and explicit task IDs rather than blindly selecting the first globally READY product task.

## Immediate sequence

1. Synchronize local `main` and run `npm ci` plus `npm run verify`.
2. Read `AGENTS.md`, `docs/current/PROJECT_STATE.md`, `docs/current/CURRENT_MILESTONE.md`, `project_docs/agentfactory_ignition/`, `project_docs/agentfactory_i1/`, `project_docs/agentfactory_i2/` and execution-governance docs.
3. Treat TASK-024 through TASK-027 and `POST_I1_REVIEW.md` as the integrated hardened I1 baseline.
4. Treat TASK-028 implementation and bootstrap closure as integrated, but its hardened lifecycle reconciliation as blocked by missing required GitHub approvals.
5. Execute TASK-030, retry TASK-029 closure only after the correction, then obtain human-signed approval evidence and reassess the pre-run gate.
6. Do not execute TASK-010 or A/B/C = TASK-004 -> TASK-005 -> TASK-006 before an explicit GO.

## Per-task loop

`approved task -> branch -> bounded implementation -> verify -> PR -> review/merge -> evidence/state -> recompute DAG/readiness -> refine next task`.

## Stop/escalate

Stop the current implementation and surface a decision when work requires an undeclared architecture/public contract change, scope expansion, destructive migration, weakened evaluator/security control or files outside the task contract.

## Product track

TASK-010 and TASK-004 remain valid READY product work, but are intentionally deferred by execution focus while AgentFactory ignition is underway.
