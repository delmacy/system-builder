# Sprint Report — P8-ATOMIC-DEPLOYMENT-AUTHORITY-01

Date: 2026-08-17
Status: IMPLEMENTED_ON_SPRINT_BRANCH / FINAL_CI_PENDING
Base: `209e192ec56599a05f6972e347f5b70989165c54`
Branch: `sprint/P8-ATOMIC-DEPLOYMENT-AUTHORITY-01`
PR: #190

## Goal result

PASS on committed TASK evidence.

Achieved proof:

`active A -> two independent authenticated PostgreSQL writers -> one authoritative CAS transition -> stale contender rejected without overwrite -> failed contender retains winner -> fresh reconstruction -> same active deployment + complete durable history`

## TASK results

- TASK-113 — `470f436318c0ef633f25bd9576051512c8830004` — CI #336 PASS.
  - additive `activateCandidateAtomically` Deploy API;
  - explicit `stale-active` decision outcome;
  - in-memory atomic semantics;
  - existing synchronous `record`/`activateCandidate` behavior retained.
- TASK-114 — `9d30185892687ef9b66f771db55d7daa71d7c346` — CI #338 PASS.
  - PostgreSQL history + active decision in one transaction;
  - database-level serialization prevents stale cross-process overwrite;
  - stale, failed and successful outcomes reconstruct correctly;
  - secret-safe diagnostics preserved.
- TASK-115 — `ba12bf64631a38c209b208895afa99e6200dec02` — CI #339 PASS.
  - two independently opened providers contend concurrently from expected A;
  - exactly one contender activates and the other returns `stale-active`;
  - failed candidate retains winner;
  - fresh provider reconstructs winner and all attempted history;
  - serialized evidence contains no PostgreSQL credential material.

## Validation history

- materialization CI #334: FAIL before product work — unsupported task `model_tier` values only;
- materialization correction `005cebfc272317e61c7f20856874f126b86b898a`: CI #335 PASS;
- TASK-113: CI #336 PASS;
- TASK-114 first validation #337: FAIL on TypeScript narrowing only;
- TASK-114 branch history rewritten to retain one authoritative TASK commit; corrected `9d30185892687ef9b66f771db55d7daa71d7c346`: CI #338 PASS;
- TASK-115: CI #339 PASS;
- final closure CI: PENDING.

No local execution is claimed. GitHub Actions is the objective validation evidence.

## Deviations / discoveries

1. Task metadata accepts only repository-defined `model_tier` values (`free|cheap|architecture`); materialization was corrected before implementation.
2. Real multi-writer authority required an additive async Deploy-module API rather than pretending the existing synchronous cache API was concurrency-safe. This L3 addition was explicitly authorized in the Sprint manifest; no canonical contract or L4 architecture changed.
3. PostgreSQL correctness currently uses a coarse table-level write lock for the bounded reference implementation. This proves serialization and CAS safety but is intentionally not a throughput/production-scaling claim.

## Scope disposition

Changed product scope is limited to Deploy:
- `packages/deploy/index.ts`;
- `packages/deploy/storage.ts`;
- `packages/deploy/postgres-state.ts`.

Tests/specs/docs are Sprint-scoped. No `packages/contracts/**`, Catalog/Release/Artifact provider, Runtime, ADR, package dependency or CI workflow change was needed in Sprint 2.

## Residual work

- `P8-HARDENED-ACTIVATION-E2E-01` remains forecast and not materialized;
- P8 Integration & Technical Debt Review remains forecast/mandatory after all construction Sprints merge;
- table-lock granularity, TLS certificate policy, pooling/retry/cancellation/observability and cross-context PG duplication remain debt/non-goals;
- production traffic/process rollback/fleet orchestration remain outside this Sprint.

## Review gate

After closure-head Deterministic CI passes, PR #190 may be marked Ready for human Sprint Review. Do not merge automatically and do not start Sprint 3 without new authorization after merge/reconstruction.
