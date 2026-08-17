# P7-DURABLE-DEPLOYMENT-STATE-01 — Sprint Report

Status: READY_FOR_SPRINT_REVIEW
Base: `ee17702742a07e78f70f05f653e60445ddd72167`
Branch: `sprint/P7-DURABLE-DEPLOYMENT-STATE-01`
PR: #184

## Result

PASS.

The Sprint proves:

`existing successful DeploymentRecord -> Deploy-owned persistence -> PostgreSQL durability -> provider/process reconstruction -> equivalent immutable history + active release/version observation`

A later failed Deploy record remains durable history but does not replace the last successful active deployment.

## TASK results

| TASK | Result | Commit | Objective validation |
| --- | --- | --- | --- |
| TASK-101 | PASS | `e002f7e1065d39106d4d0b3afc4217686b6d5854` | Deterministic CI #310 PASS |
| TASK-102 | PASS | `18ee73fbb04bfaaf4d3c2b5a83f335fc3860413e` | Deterministic CI #311 PASS |
| TASK-103 | PASS | `f9a7a1de866f241f380aff04e4e2a963222e4d0d` | Deterministic CI #312 PASS |

Dependency order was preserved: `TASK-101 -> TASK-102 -> TASK-103`.

Each TASK has one authoritative implementation/evidence commit in final Sprint history.

## Delivered evidence

- Deploy now owns a replaceable `DeploymentRecordStorage` boundary and default in-memory implementation;
- `DeploymentRegistry` retains immutable deterministic history and exposes the active successful deployment per environment;
- identical re-recording is idempotent; conflicting content for an occupied deployment identity fails closed;
- failed deployment evidence is retained but cannot replace the active successful deployment;
- a PostgreSQL 17.6 reference provider persists records and environment active pointers across provider/process reconstruction;
- provider configuration failures use sanitized diagnostics and persisted/reconstructed evidence contains no connection string or inline secret value;
- actual existing `dryRunDeploy` output is used by the Sprint E2E evidence rather than a hand-authored downstream success artifact;
- reconstructed active observation preserves the actual published release reference;
- existing Release/Environment separation and Runtime autonomy remain unchanged.

## Scope / architecture disposition

- `packages/contracts/**` changed: NO;
- Release/Environment semantics changed: NO;
- local deployment/process activation semantics changed: NO;
- PostgreSQL promoted to canonical public dependency: NO;
- production TLS/SCRAM/pooling/traffic/fleet/supervision claimed: NO;
- ADR-0002 preserved: YES;
- ADR-0007 preserved: YES;
- L4 architecture change: NO.

## Deviation / repair

The first TASK-101 CI attempt (#308) failed before product validation because the newly materialized TASK specs omitted repository-required task-catalog headings (`Current behavior`, `Inputs / contracts`, `Outputs / contracts`). The three specs were normalized on the materialization baseline, the Sprint branch was reanchored before TASK-101, and TASK-101 was recreated as the single authoritative commit `e002f7e...`. The failed intermediate TASK commit is not part of final authoritative branch history. No product scope or architecture expansion resulted.

## Residual work

`P7-DEPLOYMENT-ROLLBACK-01`, `P7-DURABLE-DEPLOYMENT-E2E-01` and the mandatory P7 Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED. Production PostgreSQL transport hardening remains prior technical debt and was not promoted into this Sprint.

## Review gate

- Sprint Goal: PASS
- committed TASKs implemented: YES
- TASK CI gates: PASS (#310, #311, #312)
- final closure-head Deterministic CI: REQUIRED
- successor Sprint materialized/executed: NO
- decision: PENDING FINAL CLOSURE CI / HUMAN SPRINT REVIEW
