# P8-ATOMIC-DEPLOYMENT-AUTHORITY-01 — Atomic Multi-Writer Deployment Authority

Status: IMPLEMENTED_ON_SPRINT_BRANCH / TASK_CI_PASS / FINAL_CI_PENDING
Base SHA: `209e192ec56599a05f6972e347f5b70989165c54`
Branch: `sprint/P8-ATOMIC-DEPLOYMENT-AUTHORITY-01`
Package: `P8-PACKAGE-01`
Milestone: M9

## Sprint Goal

Make DeploymentRecord persistence and active-version promotion concurrency-safe across multiple Deploy writers by adding an explicit atomic activation operation to the Deploy storage boundary, implementing it transactionally in PostgreSQL and proving deterministic stale-writer rejection plus reconstruction.

## Predecessor gate

`P8-DEPLOY-POSTGRES-TRANSPORT-01` merged through PR #189 at `209e192ec56599a05f6972e347f5b70989165c54` after final Deterministic CI #333 PASS and human Sprint Review acceptance.

## Committed TASKs

1. `TASK-113` — completed at `470f436318c0ef633f25bd9576051512c8830004`; Deterministic CI #336 PASS.
2. `TASK-114` — completed at authoritative commit `9d30185892687ef9b66f771db55d7daa71d7c346`; Deterministic CI #338 PASS.
3. `TASK-115` — completed at `ba12bf64631a38c209b208895afa99e6200dec02`; Deterministic CI #339 PASS.

Dependency order preserved: `TASK-113 -> TASK-114 -> TASK-115`.

Materialization required one schema-only correction before product work: initial CI #334 rejected unsupported `model_tier: strong`; commit `005cebfc272317e61c7f20856874f126b86b898a` normalized the task tiers and CI #335 passed. TASK-114 CI #337 then exposed TypeScript narrowing errors; the failed TASK commit was replaced on the Sprint branch so `9d30185892687ef9b66f771db55d7daa71d7c346` remains the single authoritative TASK-114 commit.

## Growing integration proof

Predecessor proof:

`authenticated PostgreSQL reference connection -> existing Deploy storage boundary -> durable DeploymentRecord/active observation -> provider/process reconstruction -> equivalent state with no credential leakage`

Sprint achieved proof:

`active A -> two independent writers with expected A -> one database-serialized authoritative transition -> stale writer rejected -> no torn record/active state -> failed candidate retains winner -> fresh provider reconstruction -> same authoritative deployment + durable history`

## Architecture / contract disposition

TASK-113 is the explicitly authorized L3 Deploy-module API addition for this Sprint. It adds an asynchronous atomic activation path and `stale-active` evidence while preserving predecessor synchronous APIs. No canonical `packages/contracts/**` change, no Builder/Runtime boundary change and no L4 ADR was required.

PostgreSQL remains a Deploy-owned replaceable reference provider. The implementation uses database transaction + table-level write serialization for the bounded reference proof; process-local `#pending` is not the concurrency authority for atomic activation.

## Residual bounded debt

- the reference implementation uses coarse table-level serialization rather than a finer-grained per-environment lock/CAS primitive; correctness is proven, throughput tuning remains future provider work;
- positive encrypted TLS/certificate validation, pooling, retry/richer cancellation and provider observability remain outside this Sprint;
- duplicated raw PostgreSQL transport across bounded contexts remains `TD-P6-01`;
- production traffic/process rollback, fleet coordination and SecretResolver remain outside P8 Sprint 2;
- full package E2E with Factory/Runtime is deferred to the forecast Sprint 3.

## Final validation

`npm run verify` through GitHub Deterministic CI on the closure head.

## Stop boundary

After final CI, open/promote the Sprint PR and stop at human Sprint Review. Do not materialize `P8-HARDENED-ACTIVATION-E2E-01` or the package review without a new instruction after this Sprint is reviewed/merged and `main` is freshly reconstructed.
