# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- P1–P7 construction/review history is integrated.
- P7 Integration & Technical Debt Review merged through PR #187 at `aa79f1fbeefb1f49faddf24db35a9ea35f74df29` after final Deterministic CI #327 PASS.
- P8-PACKAGE-01 planning merged through PR #188 at `91f5cb23145c901c508e9673ef8cd38b52bbb413` after planning CI #328 PASS.
- `P8-DEPLOY-POSTGRES-TRANSPORT-01` implementation is complete on PR #189 and awaiting closure-head CI / Sprint Review.
- GitHub Actions with PostgreSQL 17.6 remains the objective deterministic integration gate.
- AgentFactory Supervisor/runtime remains frozen non-blocking infrastructure.

## Integrated proof baseline

P7 integrated baseline:

`durable Factory output -> durable Deploy activation A -> autonomous Runtime -> successful B activation -> failed candidate C -> reconstruct deployment authority -> B remains active + Runtime continuity`

Current Sprint adds:

`authenticated PostgreSQL reference connection -> existing Deploy storage boundary -> durable DeploymentRecord/active observation -> provider/process reconstruction -> equivalent state with no credential leakage`

The Deploy reference provider now proves actual PostgreSQL 17.6 SCRAM authentication, deterministic TLS-mode boundary behavior and bounded transaction commit/rollback while preserving predecessor trust-auth evidence.

## Active Sprint

`P8-DEPLOY-POSTGRES-TRANSPORT-01 — Authenticated Deploy PostgreSQL Transport`

Base: `91f5cb23145c901c508e9673ef8cd38b52bbb413`
Branch: `sprint/P8-DEPLOY-POSTGRES-TRANSPORT-01`
PR: #189
Status: `SPRINT_REVIEW_PREPARATION / IMPLEMENTATION_CI_PASS`.

TASK results:
1. TASK-110 — PASS at `6e0145206f0b2316e19eafebae2444f835189ed9`; CI #330 PASS;
2. TASK-111 — PASS at `bbe77a77cee88958a8193e1d4143b92685fce900`; CI #331 PASS;
3. TASK-112 — PASS at `e39f740e4bc605da2ccd6704979ae8be9de1f6f4`; CI #332 PASS.

Materialization `7b4979ccd1f43c8d2c2355002059743a49c8e5a8` passed CI #329 before TASK execution.

## Architecture boundary

ADR-0002 and ADR-0007 remain controlling and preserved. No canonical contract, public Deploy semantic or L4 change occurred. PostgreSQL remains a Deploy-owned replaceable provider detail; no cross-context PostgreSQL ownership was introduced.

No npm dependency was added. The CI keeps the predecessor trust PostgreSQL service and adds a separate authenticated SCRAM reference service for Deploy evidence.

## Residual debt

- `TD-P4-03` is reduced but not closed: SCRAM authentication and deterministic TLS-mode handling are now proven, while positive encrypted TLS/certificate policy, pooling, retry/richer cancellation and provider observability remain open.
- `TD-P6-01` remains carried: raw PostgreSQL transport remains duplicated across bounded contexts.
- `TD-P7-01` remains carried: transactional multi-writer/CAS active authority is forecast Sprint 2 work, not part of this Sprint.

## Current gate

Run final Deterministic CI on the closure head. If green, verify the PR remains within Sprint scope, mark PR #189 Ready for human Sprint Review and stop.

Do not merge PR #189 automatically. Do not materialize `P8-ATOMIC-DEPLOYMENT-AUTHORITY-01` until predecessor review and merge gates pass followed by fresh `main` reconstruction.
