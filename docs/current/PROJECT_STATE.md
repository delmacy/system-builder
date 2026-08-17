# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- P1–P6 construction/review history is integrated; P6 review merged through PR #182.
- P7-PACKAGE-01 planning merged through PR #183 at `ee17702742a07e78f70f05f653e60445ddd72167`; planning CI #306 PASS.
- P7-DURABLE-DEPLOYMENT-STATE-01 implementation is complete on PR #184 and awaiting closure-head CI / Sprint Review.
- GitHub Actions with PostgreSQL 17.6 remains the objective deterministic integration gate.
- AgentFactory Supervisor/runtime remains frozen non-blocking infrastructure.

## Growing proof

Integrated predecessor:

`durable Catalog -> deterministic Assembly/Validation/Compiler -> durable Release/Artifact -> existing Deploy -> autonomous persisted Runtime`

Current Sprint adds:

`existing successful DeploymentRecord -> Deploy-owned persistence -> PostgreSQL durability -> provider/process reconstruction -> equivalent immutable history + active release/version observation`

A failed deployment attempt is durable history but does not replace the active successful deployment.

## Active Sprint

`P7-DURABLE-DEPLOYMENT-STATE-01 — Durable Deployment State Authority`

Base: `ee17702742a07e78f70f05f653e60445ddd72167`
Branch: `sprint/P7-DURABLE-DEPLOYMENT-STATE-01`
PR: #184
Status: `SPRINT_REVIEW_PREPARATION / IMPLEMENTATION_CI_PASS`.

TASK results:
1. TASK-101 — PASS at `e002f7e1065d39106d4d0b3afc4217686b6d5854`; CI #310 PASS;
2. TASK-102 — PASS at `18ee73fbb04bfaaf4d3c2b5a83f335fc3860413e`; CI #311 PASS;
3. TASK-103 — PASS at `f9a7a1de866f241f380aff04e4e2a963222e4d0d`; CI #312 PASS.

## Architecture boundary

ADR-0002 and ADR-0007 remain controlling and preserved. No canonical contract or L4 change occurred. PostgreSQL remains a replaceable Deploy reference provider. Production TLS/auth/pooling/traffic/supervision and rollback orchestration remain outside this Sprint.

## Current gate

Require final Deterministic CI on the closure head. If green, PR #184 becomes Ready for human Sprint Review and execution stops there.

`P7-DEPLOYMENT-ROLLBACK-01`, `P7-DURABLE-DEPLOYMENT-E2E-01` and the mandatory P7 Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED.
