# P8-DEPLOY-POSTGRES-TRANSPORT-01 — Sprint Report

Status: READY_FOR_SPRINT_REVIEW_AFTER_CLOSURE_CI
Base: `91f5cb23145c901c508e9673ef8cd38b52bbb413`
Branch: `sprint/P8-DEPLOY-POSTGRES-TRANSPORT-01`
PR: #189

## Result

PASS, subject only to final closure-head Deterministic CI.

Achieved proof:

`authenticated PostgreSQL reference connection -> existing Deploy storage boundary -> durable DeploymentRecord/active observation -> provider/process reconstruction -> equivalent state with no credential leakage`

## TASK results

| TASK | Result | Commit | Objective validation |
| --- | --- | --- | --- |
| TASK-110 | PASS | `6e0145206f0b2316e19eafebae2444f835189ed9` | Deterministic CI #330 PASS |
| TASK-111 | PASS | `bbe77a77cee88958a8193e1d4143b92685fce900` | Deterministic CI #331 PASS |
| TASK-112 | PASS | `e39f740e4bc605da2ccd6704979ae8be9de1f6f4` | Deterministic CI #332 PASS |

Materialization `7b4979ccd1f43c8d2c2355002059743a49c8e5a8` — Deterministic CI #329 PASS before implementation.

## Evidence

- TASK-110 adds Deploy-local PostgreSQL password/SCRAM authentication, bounded MD5/cleartext compatibility and deterministic `sslmode=disable|prefer|require` negotiation without external npm dependencies. CI gains a separate PostgreSQL 17.6 SCRAM-authenticated fixture while retaining the predecessor trust fixture.
- TASK-111 adds bounded transaction execution on one authenticated connection. Successful batches commit; a failing statement closes the connection with the transaction open so PostgreSQL rolls it back. Provider schema initialization now exercises the transaction path.
- TASK-112 reconstructs actual successful/failed DeploymentRecord history and the active successful deployment through the authenticated PostgreSQL provider and proves serialized evidence/auth errors exclude URL, username and password material.

## Architecture / contract disposition

- ADR-0002 preserved;
- ADR-0007 preserved;
- no `packages/contracts/**` changes;
- no `DeploymentRecordStorage`, `DeploymentRegistry` or public DeploymentRecord semantic change;
- PostgreSQL remains a Deploy-owned replaceable provider detail;
- no cross-context PostgreSQL transport consolidation;
- no L3/L4 change or ADR required;
- no package dependency added.

## Residual work / discoveries

- Positive encrypted PostgreSQL TLS is not CI-proven. The Sprint proves `sslmode=prefer` fallback and `sslmode=require` fail-closed behavior only; production certificate/TLS verification policy remains debt.
- Pooling, retry policy, richer cancellation and provider observability remain outside this bounded reference lifecycle; `TD-P4-03` is reduced but not closed.
- Duplicated raw PostgreSQL transport across Catalog/Release/Artifact/Deploy remains `TD-P6-01`.
- Atomic compare-and-set / multi-writer active-version semantics remain `TD-P7-01` and are not silently pulled into this Sprint.

## Validation

- materialization CI #329 PASS;
- TASK-110 CI #330 PASS;
- TASK-111 CI #331 PASS;
- TASK-112 CI #332 PASS;
- final closure-head Deterministic CI: PENDING.

No local execution is claimed. GitHub Actions is the objective validation evidence.

## Review boundary

After closure-head CI passes, mark PR #189 Ready for human Sprint Review and stop. Do not merge automatically and do not materialize `P8-ATOMIC-DEPLOYMENT-AUTHORITY-01` without new authorization after predecessor review/merge/reconstruction.
