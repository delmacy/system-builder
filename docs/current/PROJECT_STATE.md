# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is canonical. Reconstruct technical context from repository files, not chat history.

## Integrated maturity

- P1–P8 construction/review history is integrated.
- P8 Integration & Technical Debt Review merged through PR #192 at `78e4e9a8056bf1e9c4bb4f49a798dd080cfd128a`, final review CI #348 PASS.
- `P9-PACKAGE-01 — Managed Runtime Deployment Orchestration` planning merged through PR #193 at `14cdccbd391d3c337f749bc14e470e5a8bb1742f`, planning CI #349 PASS.
- `P9-MANAGED-RUNTIME-PROCESS-01` merged through PR #194 at `cea8f09ccb99b2bf5bed27e9f01782db1520bb67`; final Sprint CI #356 PASS.
- `P9-ACTIVE-RUNTIME-PROMOTION-01` merged through PR #195 at `34379b744661468d8f3575facdbb6ed7140f8470`; final Sprint CI #362 PASS.

## Integrated proof baseline

`managed A -> durable authority A -> accepted B promoted while A stays UP until decision -> durable authority B -> A retired -> stale/failed contender cannot replace/terminate B -> authenticated PostgreSQL authority reconstruction reports B while B remains healthy`

## Active Sprint

`P9-RUNTIME-RECONCILIATION-E2E-01 — Runtime Restart Reconciliation`

Base: `34379b744661468d8f3575facdbb6ed7140f8470`
Branch: `sprint/P9-RUNTIME-RECONCILIATION-E2E-01`
Status: `MATERIALIZED / PRE_CODE_CI_PENDING`.

Committed TASKs:
- TASK-125 — bounded authoritative Runtime reconciliation;
- TASK-126 — reconciliation failure/retention safety;
- TASK-127 — durable restart E2E evidence.

## Revalidated boundary

A controlled manager restart is sufficient for the package goal without generic process discovery: the old Deploy-owned manager stops the process it owns, a fresh manager reconstructs durable Deployment authority plus durable Release/Artifact evidence, and rematerializes only the authoritative Runtime. This remains additive L2 Deploy behavior and preserves ADR-0002/ADR-0007.

No external load balancer, DNS/reverse proxy, scheduler/Kubernetes, fleet/cloud topology, canonical contract expansion or Runtime topology change is authorized.

## Current gate

Run pre-code Deterministic CI on the materialization head. Product edits remain blocked until green.

P9 Integration & Technical Debt Review remains mandatory but not materialized until this Sprint passes human review and merges.
