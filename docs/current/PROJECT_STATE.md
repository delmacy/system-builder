# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- P1–P6 construction/review history is integrated; P6 review merged through PR #182.
- P7-PACKAGE-01 planning merged through PR #183.
- P7-DURABLE-DEPLOYMENT-STATE-01 merged through PR #184 at `fafc07c0c3a3f8661f50fbad30aa091bbea83731` after closure CI #313 PASS.
- P7-DEPLOYMENT-ROLLBACK-01 implementation is complete on PR #185 and awaiting closure-head CI / Sprint Review.
- GitHub Actions with PostgreSQL 17.6 remains the objective deterministic integration gate.
- AgentFactory Supervisor/runtime remains frozen non-blocking infrastructure.

## Growing proof

Integrated predecessor:

`successful DeploymentRecord -> durable Deploy state -> provider/process reconstruction -> equivalent history + active release/version observation`

Current Sprint adds:

`active durable deployment A -> candidate B -> acceptance failure -> A remains authoritative active version + deterministic failure/rollback evidence`

A failed candidate remains durable history while the last known-good successful deployment remains authoritative active state across PostgreSQL reconstruction.

## Active Sprint

`P7-DEPLOYMENT-ROLLBACK-01 — Bounded Deployment Acceptance & Rollback`

Base: `fafc07c0c3a3f8661f50fbad30aa091bbea83731`
Branch: `sprint/P7-DEPLOYMENT-ROLLBACK-01`
PR: #185
Status: `SPRINT_REVIEW_PREPARATION / IMPLEMENTATION_CI_PASS`.

TASK results:
1. TASK-104 — PASS at `14465edba7a1a8f3e68838305fdca16670306111`; CI #316 PASS;
2. TASK-105 — PASS at `25027492eb0c540c759fdbf9d7be7d482d18e506`; CI #317 PASS;
3. TASK-106 — PASS at `ec9c971e38fc991db55baa38e4bbb4c3f282f0ba`; CI #318 PASS.

Materialization CI #314 PASS. Initial non-authoritative TASK-104 head CI #315 failed only on invalid task status metadata and was replaced before successor execution.

## Architecture boundary

ADR-0002 and ADR-0007 remain controlling and preserved. No canonical contract, provider schema or L4 change occurred. PostgreSQL remains a replaceable Deploy reference provider. Production TLS/auth/pooling/traffic/fleet supervision and production rollback orchestration remain outside this Sprint.

## Current gate

Require final Deterministic CI on the closure head. If green, PR #185 becomes Ready for human Sprint Review and execution stops there.

`P7-DURABLE-DEPLOYMENT-E2E-01` and the mandatory P7 Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED.
