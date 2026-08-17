# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- P1–P6 construction/review history is integrated; P6 review merged through PR #182.
- P7-PACKAGE-01 planning merged through PR #183 at `ee17702742a07e78f70f05f653e60445ddd72167` after Deterministic CI #306 PASS.
- GitHub Actions with PostgreSQL 17.6 remains the objective deterministic integration gate.
- AgentFactory Supervisor/runtime remains frozen non-blocking infrastructure.

## Integrated predecessor proof

`durable Catalog -> deterministic Assembly/Validation/Compiler -> durable Release/Artifact -> existing Deploy -> autonomous persisted Runtime`

## Active Sprint

`P7-DURABLE-DEPLOYMENT-STATE-01 — Durable Deployment State Authority`

Base: `ee17702742a07e78f70f05f653e60445ddd72167`
Branch: `sprint/P7-DURABLE-DEPLOYMENT-STATE-01`
Status: `COMMITTED / IMPLEMENTATION_PENDING`

Committed dependency order: `TASK-101 -> TASK-102 -> TASK-103`.

Sprint goal: durable Deploy-owned DeploymentRecord history and active-version observation across PostgreSQL provider/process reconstruction while preserving current Deploy, Release/Environment and Runtime autonomy semantics.

## Architecture boundary

ADR-0002 and ADR-0007 remain controlling. No canonical contract or L4 change is authorized. PostgreSQL remains a replaceable reference provider internal to Deploy. Production TLS/auth/pooling/traffic/supervision and rollback orchestration are outside this Sprint.

## Current gate

Execute TASK-101, TASK-102 and TASK-103 in dependency order, one authoritative commit per TASK, with declared validations. Then run final closure verification, generate the Sprint Report and stop at Sprint Review.

Later P7 Sprints and the mandatory package review remain FORECAST / NOT_MATERIALIZED.