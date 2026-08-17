# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- P1–P8 construction/review history is integrated.
- P8 Integration & Technical Debt Review merged through PR #192 at `78e4e9a8056bf1e9c4bb4f49a798dd080cfd128a`; review final CI #348 PASS before merge.
- P8 package result: construction PASS / architecture PASS WITH DEBT / no critical rollback blocker.
- Authenticated atomic Deploy authority is integrated and package-level Runtime continuity is proven.
- GitHub Actions with PostgreSQL 17.6 trust + SCRAM fixtures remains the objective deterministic integration gate.

## Integrated baseline

`durable Factory output -> reconstructed Release/Artifact -> authenticated atomic Deploy authority -> A Runtime -> B promotion -> stale/failed contender retention -> fresh authority reconstruction -> B autonomous Runtime continuity`

## Successor planning decision

Fresh reconstruction after the merged P8 review ranks deployment process orchestration as the highest-leverage next package direction. Existing Deploy already owns a local-process reference adapter, so the next package can remain bounded to Deploy and advance a single-host managed Runtime lifecycle without inventing an external traffic/fleet topology.

Selected planning package:

`P9-PACKAGE-01 — Managed Runtime Deployment Orchestration`

Planning branch: `plan/P9-PACKAGE-01`
Status: `PLANNING / CI_PENDING`.

## Package intent

Advance the existing local-process Deploy reference path from bounded acceptance execution to managed authoritative Runtime lifecycle:
- keep accepted Runtime process managed after health acceptance;
- bind process promotion/retention to existing atomic deployment authority;
- reconcile the authoritative managed Runtime after orchestrator restart from durable state;
- preserve Builder/Observe independence and Release/Environment/Deployment separation.

## Architecture boundary

The package is intentionally single-host/reference-provider scoped. It does not select or introduce external load balancer, DNS, reverse proxy, Kubernetes, container scheduler, fleet manager or cloud orchestration ownership. Any need for such a topology is an explicit architecture escalation, not implicit Sprint scope.

## Carried high-priority debt outside/beyond this package

- `TD-P4-03`: verified PostgreSQL TLS/credential lifecycle remains HIGH;
- `TD-P4-04`: migration/fleet coordination remains HIGH;
- `TD-P4-05`: production SecretResolver remains HIGH;
- `TD-P4-06`: process/traffic supervision remains HIGH and is the primary P9 target in bounded form;
- `TD-P6-01`: cross-context PostgreSQL transport duplication remains HIGH and architecture-gated;
- `TD-P7-02`: authority retention is not process/infrastructure rollback and is a primary P9 target in bounded form;
- `TD-P8-02`: positive TLS certificate/server-identity verification remains HIGH.

## Current gate

Run repository-wide Deterministic CI on the P9 planning branch. If green, verify planning diff scope, promote the single planning PR to human Planning Review and stop.

Do not materialize P9 Sprint 1 or TASK specifications until the planning PR is accepted, merged and `main` is freshly reconstructed.
