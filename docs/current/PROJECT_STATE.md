# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- P1–P7 construction/review history is integrated.
- P8 package planning merged through PR #188 at `91f5cb23145c901c508e9673ef8cd38b52bbb413`.
- `P8-DEPLOY-POSTGRES-TRANSPORT-01` merged through PR #189 at `209e192ec56599a05f6972e347f5b70989165c54` after final CI #333 PASS.
- `P8-ATOMIC-DEPLOYMENT-AUTHORITY-01` is implemented on its Sprint branch through TASK-115 and awaits closure-head final CI / Sprint Review.
- GitHub Actions with PostgreSQL 17.6 remains the objective deterministic integration gate.
- AgentFactory Supervisor/runtime remains frozen non-blocking infrastructure.

## Integrated main baseline

`authenticated PostgreSQL Deploy state -> durable DeploymentRecord/active authority -> provider/process reconstruction -> equivalent state with no credential leakage`

The atomic multi-writer proof described below is branch-only until Sprint Review acceptance and merge.

## Active Sprint

`P8-ATOMIC-DEPLOYMENT-AUTHORITY-01 — Atomic Multi-Writer Deployment Authority`

Base: `209e192ec56599a05f6972e347f5b70989165c54`
Branch: `sprint/P8-ATOMIC-DEPLOYMENT-AUTHORITY-01`
PR: #190
Status: `IMPLEMENTED_ON_SPRINT_BRANCH / TASK_CI_PASS / FINAL_CI_PENDING`.

TASK evidence:
- TASK-113 `470f436318c0ef633f25bd9576051512c8830004` — CI #336 PASS;
- TASK-114 `9d30185892687ef9b66f771db55d7daa71d7c346` — CI #338 PASS;
- TASK-115 `ba12bf64631a38c209b208895afa99e6200dec02` — CI #339 PASS.

## Sprint proof on branch

`active A -> two independent authenticated PostgreSQL writers from expected A -> one database-serialized authoritative transition -> stale writer rejected -> failed candidate retains winner -> fresh reconstruction -> same authoritative deployment + complete durable history`

## Architecture boundary

- TASK-113 is an explicitly authorized additive L3 Deploy-module API change;
- existing synchronous Deploy APIs remain compatible;
- `packages/contracts/**` unchanged;
- ADR-0002 and ADR-0007 remain preserved;
- no L4 decision/ADR or cross-context PostgreSQL ownership was introduced;
- PostgreSQL remains a Deploy-owned replaceable reference provider.

## Residual debt

Atomic authority correctness is now branch-proven for the bounded PostgreSQL reference provider, but the implementation currently uses coarse table-level serialization. Positive TLS certificate policy, pooling/retry/richer cancellation/provider observability, cross-context PostgreSQL duplication and production deployment orchestration remain open/non-goals.

## Current gate

Run repository-wide Deterministic CI on the Sprint closure head. If green, verify PR #190 scope/review gates, mark it Ready for human Sprint Review and stop.

Do not merge PR #190 automatically. Do not materialize `P8-HARDENED-ACTIVATION-E2E-01` or the P8 Integration & Technical Debt Review at this gate.
