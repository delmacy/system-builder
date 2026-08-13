# Next Work — AgentFactory Ignition

The repository is authoritative. During the AgentFactory ignition track, use the I1 milestone/WP DAG and explicit task IDs rather than blindly selecting the first globally READY product task.

## Immediate sequence

1. Synchronize local `main` and run `npm ci` plus `npm run verify`.
2. Read `AGENTS.md`, `docs/current/PROJECT_STATE.md`, `docs/current/CURRENT_MILESTONE.md`, `project_docs/agentfactory/`, `project_docs/agentfactory_i1/` and execution-governance docs.
3. Create a dedicated branch for TASK-017 and execute only `specs/tasks/TASK-017-AGENTFACTORY-EXECUTION-HARNESS-ENFORCEMENT.md`.
4. Run declared verification, create/review/merge the task PR and close/reconcile task state/evidence before treating WP-I1-07 as unblocked.
5. Generate the WP-I1-07 task contract only after TASK-017's enforcement output is accepted. Continue to use actual merged interfaces rather than speculative downstream contracts.
6. Generate further I1 implementation task contracts progressively from accepted outputs and the approved WP DAG. Do not pre-invent downstream public interfaces.
7. Continue through the I1 exit gate, then I2 Sequential Pipeline and I3 Sprint Autonomous.
8. Return majority development capacity to System Builder after I2/I3; only continue I4–I7 when maturity/dependency evidence justifies it.

## Per-task loop

`approved task -> branch -> bounded implementation -> verify -> PR -> review/merge -> evidence/state -> recompute DAG/readiness -> refine next task`.

## Stop/escalate

Stop the current implementation and surface a decision when work requires an undeclared architecture/public contract change, scope expansion, destructive migration, weakened evaluator/security control or files outside the task contract.

## Product track

TASK-010 and TASK-004 remain valid READY product work, but are intentionally deferred by execution focus while AgentFactory ignition is underway.
