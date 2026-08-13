# Next Work — AgentFactory Ignition

The repository is authoritative. During the AgentFactory ignition track, use the I1 milestone/WP DAG and explicit task IDs rather than blindly selecting the first globally READY product task.

## Immediate sequence

1. Synchronize local `main` and run `npm ci` plus `npm run verify`.
2. Read `AGENTS.md`, `docs/current/PROJECT_STATE.md`, `docs/current/CURRENT_MILESTONE.md`, `project_docs/agentfactory/`, `project_docs/agentfactory_i1/` and execution-governance docs.
3. Treat I1 as accepted only at integrated baseline `21674b34c55fa024cdc360802065e76ab97fa08d` plus the exit-gate decision PR.
4. If continuing AgentFactory, materialize the first bounded I2 task by rolling-wave from accepted I1 outputs and the approved I2 Work Packages/DAG.
5. Do not begin I2 implementation in the I1 gate branch and do not resume product M1 while AgentFactory remains the declared execution focus.
6. Pass the I1 exit gate before advancing to I2; do not resume product M1 while AgentFactory remains the active focus.
7. Continue through the I1 exit gate, then I2 Sequential Pipeline and I3 Sprint Autonomous.
8. Return majority development capacity to System Builder after I2/I3; only continue I4–I7 when maturity/dependency evidence justifies it.

## Per-task loop

`approved task -> branch -> bounded implementation -> verify -> PR -> review/merge -> evidence/state -> recompute DAG/readiness -> refine next task`.

## Stop/escalate

Stop the current implementation and surface a decision when work requires an undeclared architecture/public contract change, scope expansion, destructive migration, weakened evaluator/security control or files outside the task contract.

## Product track

TASK-010 and TASK-004 remain valid READY product work, but are intentionally deferred by execution focus while AgentFactory ignition is underway.
