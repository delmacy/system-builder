# Next Work — AgentFactory Ignition

The repository is authoritative. During the AgentFactory ignition track, use the I1 milestone/WP DAG and explicit task IDs rather than blindly selecting the first globally READY product task.

## Immediate sequence

1. Synchronize local `main` and run `npm ci` plus `npm run verify`.
2. Read `AGENTS.md`, `docs/current/PROJECT_STATE.md`, `docs/current/CURRENT_MILESTONE.md`, `project_docs/agentfactory/`, `project_docs/agentfactory_i1/` and execution-governance docs.
3. Execute TASK-022 in its dedicated branch and complete implementation plus state closure.
4. Materialize WP-I1-12 only from the accepted TASK-022 readiness receipt, using all actual I1 interfaces including TASK-020.
5. Execute the proof and record I1 exit-gate evidence; do not infer a GO result from task count alone.
6. Pass the I1 exit gate before advancing to I2; do not resume product M1 while AgentFactory remains the active focus.
7. Continue through the I1 exit gate, then I2 Sequential Pipeline and I3 Sprint Autonomous.
8. Return majority development capacity to System Builder after I2/I3; only continue I4–I7 when maturity/dependency evidence justifies it.

## Per-task loop

`approved task -> branch -> bounded implementation -> verify -> PR -> review/merge -> evidence/state -> recompute DAG/readiness -> refine next task`.

## Stop/escalate

Stop the current implementation and surface a decision when work requires an undeclared architecture/public contract change, scope expansion, destructive migration, weakened evaluator/security control or files outside the task contract.

## Product track

TASK-010 and TASK-004 remain valid READY product work, but are intentionally deferred by execution focus while AgentFactory ignition is underway.
