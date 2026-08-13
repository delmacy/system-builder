# Next Work — AgentFactory Ignition

The repository is authoritative. During the AgentFactory ignition track, use the I1 milestone/WP DAG and explicit task IDs rather than blindly selecting the first globally READY product task.

## Immediate sequence

1. Synchronize local `main` and run `npm ci` plus `npm run verify`.
2. Read `AGENTS.md`, `docs/current/PROJECT_STATE.md`, `docs/current/CURRENT_MILESTONE.md`, `project_docs/agentfactory/`, `project_docs/agentfactory_i1/` and execution-governance docs.
3. TASK-024 implementation and state closure are integrated.
4. TASK-025 implementation and state closure are integrated.
5. Execute TASK-026 in its dedicated branch, then re-run the complete I1 proof after hardening and publish `POST_I1_REVIEW.md` with the I2 readiness decision.
6. If I2 is GO, stop before executing the documented A -> B -> C chain.

## Per-task loop

`approved task -> branch -> bounded implementation -> verify -> PR -> review/merge -> evidence/state -> recompute DAG/readiness -> refine next task`.

## Stop/escalate

Stop the current implementation and surface a decision when work requires an undeclared architecture/public contract change, scope expansion, destructive migration, weakened evaluator/security control or files outside the task contract.

## Product track

TASK-010 and TASK-004 remain valid READY product work, but are intentionally deferred by execution focus while AgentFactory ignition is underway.
