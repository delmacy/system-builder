# P7-DEPLOYMENT-ROLLBACK-01 — Sprint Report

Status: READY_FOR_SPRINT_REVIEW
Base: `fafc07c0c3a3f8661f50fbad30aa091bbea83731`
Branch: `sprint/P7-DEPLOYMENT-ROLLBACK-01`
PR: #185

## Result

PASS.

The Sprint proves:

`active durable deployment A -> candidate B -> acceptance failure -> A remains authoritative active version + deterministic failure/rollback evidence`

Rollback is intentionally bounded here: a failed candidate remains durable history while the last known-good successful deployment remains the authoritative active deployment. No production traffic switching or process supervisor is claimed.

## TASK results

| TASK | Result | Commit | Objective validation |
| --- | --- | --- | --- |
| TASK-104 | PASS | `14465edba7a1a8f3e68838305fdca16670306111` | Deterministic CI #316 PASS |
| TASK-105 | PASS | `25027492eb0c540c759fdbf9d7be7d482d18e506` | Deterministic CI #317 PASS |
| TASK-106 | PASS | `ec9c971e38fc991db55baa38e4bbb4c3f282f0ba` | Deterministic CI #318 PASS |

Dependency order was preserved: `TASK-104 -> TASK-105 -> TASK-106`.

Each TASK has one authoritative implementation/evidence commit in final Sprint history.

## Delivered evidence

- Deploy exposes an immutable `DeploymentActivationDecision` with deterministic `decisionId`;
- successful candidates produce `activated` and become authoritative active state;
- failed candidates with a prior active deployment produce `retained-active`, remain durable history and cannot replace the last known-good deployment;
- failed candidates without prior active state produce `rejected-no-active` and do not fabricate active authority;
- identical failed-candidate evaluation is idempotent and produces equivalent decision evidence;
- actual `dryRunDeploy` acceptance checks produce both A success and B failure in the growing integration proof;
- PostgreSQL 17.6 reconstruction preserves A, B and the active pointer, and re-evaluating B after reconstruction reproduces the same retention decision;
- persisted/reconstructed evidence contains no PostgreSQL URL, credential or inline secret value;
- no provider schema, canonical contract or Runtime behavior changed.

## Scope / architecture disposition

- `packages/contracts/**` changed: NO;
- PostgreSQL provider/storage interface changed: NO;
- Release/Environment semantics changed: NO;
- local process activation semantics changed: NO;
- production traffic switching/load balancer implemented: NO;
- production TLS/SCRAM/pooling/fleet supervision claimed: NO;
- ADR-0002 preserved: YES;
- ADR-0007 preserved: YES;
- L4 architecture change: NO.

## Deviation / repair

Materialization passed Deterministic CI #314. The first TASK-104 head failed CI #315 because its own spec used unsupported task status `done`; repository task metadata accepts `completed`. This was corrected strictly inside TASK-104 scope by reanchoring the Sprint branch to the materialization commit and recreating TASK-104 as the single authoritative commit `14465ed...`. The failed intermediate commit is not part of final authoritative branch history. No product behavior or scope expansion was needed for the repair.

## Residual work

`P7-DURABLE-DEPLOYMENT-E2E-01` remains FORECAST / NOT_MATERIALIZED. The mandatory P7 Integration & Technical Debt Review remains FORECAST / NOT_MATERIALIZED until all construction Sprints merge. Production PostgreSQL transport hardening and production deployment supervision remain outside this Sprint.

## Review gate

- Sprint Goal: PASS
- materialization CI: PASS (#314)
- committed TASKs implemented: YES
- TASK CI gates: PASS (#316, #317, #318)
- final closure-head Deterministic CI: REQUIRED
- successor Sprint materialized/executed: NO
- decision: PENDING FINAL CLOSURE CI / HUMAN SPRINT REVIEW
