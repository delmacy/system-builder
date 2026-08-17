# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- P1–P6 construction/review history is integrated; P6 review merged through PR #182.
- P7-PACKAGE-01 planning merged through PR #183.
- P7-DURABLE-DEPLOYMENT-STATE-01 merged through PR #184 at `fafc07c0c3a3f8661f50fbad30aa091bbea83731` after closure CI #313 PASS.
- P7-DEPLOYMENT-ROLLBACK-01 is the committed second P7 construction Sprint.
- GitHub Actions with PostgreSQL 17.6 remains the objective deterministic integration gate.
- AgentFactory Supervisor/runtime remains frozen non-blocking infrastructure.

## Growing proof

Integrated predecessor:

`successful DeploymentRecord -> durable Deploy state -> provider/process reconstruction -> equivalent history + active release/version observation`

Current Sprint target:

`active durable deployment A -> candidate B -> acceptance failure -> A remains authoritative active version + deterministic failure/rollback evidence`

## Active Sprint

`P7-DEPLOYMENT-ROLLBACK-01 — Bounded Deployment Acceptance & Rollback`

Base: `fafc07c0c3a3f8661f50fbad30aa091bbea83731`
Branch: `sprint/P7-DEPLOYMENT-ROLLBACK-01`
Status: `COMMITTED / READY_FOR_TASK-104`.

Committed dependency order:
1. TASK-104 — bounded activation/retention decision;
2. TASK-105 — acceptance-failure integration evidence;
3. TASK-106 — PostgreSQL reconstruction of rollback evidence.

## Architecture boundary

ADR-0002 and ADR-0007 remain controlling. No canonical contract or L4 change is authorized. Rollback is bounded operational authority: retain the last known-good active deployment when a candidate fails acceptance. Production traffic switching, load balancers, TLS, fleet supervision and secret-manager implementation remain outside scope.

## Current gate

Execute TASK-104 -> TASK-105 -> TASK-106 with one authoritative commit per TASK and declared validation before advancing. After repository-wide final verification, produce the Sprint Report and stop at the PR Sprint Review.

`P7-DURABLE-DEPLOYMENT-E2E-01` and the mandatory P7 Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED.
