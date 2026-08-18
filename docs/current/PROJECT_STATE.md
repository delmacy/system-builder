# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is canonical. Reconstruct technical context from repository files, not chat history.

## Integrated maturity

- P1–P8 construction/review history is integrated.
- P8 Integration & Technical Debt Review merged through PR #192 at `78e4e9a8056bf1e9c4bb4f49a798dd080cfd128a`, final review CI #348 PASS.
- `P9-PACKAGE-01 — Managed Runtime Deployment Orchestration` planning merged through PR #193 at `14cdccbd391d3c337f749bc14e470e5a8bb1742f`, planning CI #349 PASS.
- `P9-MANAGED-RUNTIME-PROCESS-01` merged through PR #194 at `cea8f09ccb99b2bf5bed27e9f01782db1520bb67`; final Sprint CI #356 PASS before merge.
- Managed single-host Runtime lifecycle and authenticated atomic Deploy authority are now both integrated predecessor capabilities.

## Active Sprint

`P9-ACTIVE-RUNTIME-PROMOTION-01 — Active Runtime Promotion`

Base: `cea8f09ccb99b2bf5bed27e9f01782db1520bb67`
Branch: `sprint/P9-ACTIVE-RUNTIME-PROMOTION-01`
Status: `COMMITTED / PRE_CODE`.

Committed TASKs:
- TASK-122 `ATOMIC-ACTIVE-RUNTIME-PROMOTION` — READY;
- TASK-123 `ACTIVE-RUNTIME-RETENTION-SAFETY` — BLOCKED by TASK-122;
- TASK-124 `DURABLE-ACTIVE-RUNTIME-PROMOTION-EVIDENCE` — BLOCKED by TASK-123.

## Sprint goal

Bind the Deploy-owned managed Runtime lifecycle to existing P8 atomic deployment authority so an accepted candidate becomes active only after authority promotion, with last-known-good process continuity across stale/failed contenders.

## Architecture boundary

- Deploy-owned single-host reference orchestration only.
- Existing `DeploymentRegistry.activateCandidateAtomically` remains deployment truth.
- Existing `startManagedLocalRuntime` remains process provider.
- No canonical contracts, Runtime changes, ADR/L4, external load balancer/DNS/reverse proxy/Kubernetes/scheduler/fleet/cloud topology.

## Current gate

Run pre-code Deterministic CI on the materialized Sprint head. Product edits begin only after it passes.

Do not materialize or execute P9 Sprint 3 or the package review in this Sprint.
