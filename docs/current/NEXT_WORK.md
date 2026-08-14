# Next Work — AgentFactory Ignition

The repository is authoritative. During the AgentFactory ignition track, use the I1 milestone/WP DAG and explicit task IDs rather than blindly selecting the first globally READY product task.

## Immediate sequence

1. Synchronize local `main` and run `npm ci` plus `npm run verify`.
2. Read `AGENTS.md`, `docs/current/PROJECT_STATE.md`, `docs/current/CURRENT_MILESTONE.md`, `project_docs/agentfactory_ignition/`, `project_docs/agentfactory_i1/`, `project_docs/agentfactory_i2/` and execution-governance docs.
3. Treat TASK-012 through TASK-031 as the integrated I1/I2 pre-run baseline; TASK-028 through TASK-031 reconcile as DONE through exact durable approval.
4. Treat TASK-032 as the integrated and state-closed WP-I2-02 kernel baseline.
5. Treat TASK-033/WP-I2-03, TASK-034/WP-I2-04 and TASK-035/WP-I2-05 as integrated and state-closed.
6. Treat TASK-010 implementation/state PRs #99/#100 as accepted bootstrap `DONE`, while preserving its terminal Supervisor `EVIDENCE_MISSING` run as a failed I2 proof.
7. Treat TASK-036/ADR-0012 as integrated and state-closed.
8. Treat TASK-037/ADR-0013 as integrated and state-closed.
9. Treat TASK-038 as integrated/state-closed and `PKG-AF-I2-I5-001` as the active signed 23-descriptor routine package.
10. Execute/state-close TASK-039 through exact evaluator approval to bootstrap rolling-wave spec delivery and implement ADR-0012 authority closure.
11. Materialize PWD-AF-003 then PWD-AF-004 from the signed package and actual TASK-039 outputs.
12. Do not select TASK-004 or authorize A/B/C = TASK-004 -> TASK-005 -> TASK-006 until the fresh proof integrates real AFEV, causal ledger, state reconciliation and readiness authority and the I2 Exit Gate receives an exact GO.

## Per-task loop

`approved task -> branch -> bounded implementation -> verify -> PR -> review/merge -> evidence/state -> recompute DAG/readiness -> refine next task`.

## Stop/escalate

Stop the current implementation and surface a decision when work requires an undeclared architecture/public contract change, scope expansion, destructive migration, weakened evaluator/security control or files outside the task contract.

## Product track

TASK-010 and TASK-004 remain valid READY product work, but are intentionally deferred by execution focus while AgentFactory ignition is underway.
