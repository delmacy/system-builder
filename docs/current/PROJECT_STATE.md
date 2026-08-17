# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is canonical. Reconstruct technical context from repository files, not chat history.

## Integrated maturity

- P1–P8 construction/review history is integrated.
- P8 Integration & Technical Debt Review merged through PR #192 at `78e4e9a8056bf1e9c4bb4f49a798dd080cfd128a`, final review CI #348 PASS.
- `P9-PACKAGE-01 — Managed Runtime Deployment Orchestration` planning merged through PR #193 at `14cdccbd391d3c337f749bc14e470e5a8bb1742f`, planning CI #349 PASS.
- Authenticated atomic Deploy authority and autonomous Runtime continuity remain the integrated predecessor baseline.

## Active Sprint

`P9-MANAGED-RUNTIME-PROCESS-01 — Managed Runtime Process Lifecycle`

Base: `14cdccbd391d3c337f749bc14e470e5a8bb1742f`
Branch: `sprint/P9-MANAGED-RUNTIME-PROCESS-01`
Status: `MATERIALIZED / PRE_CODE_CI_PENDING`.

Committed TASKs:
1. TASK-119 — managed local Runtime lifecycle;
2. TASK-120 — managed Runtime failure cleanup;
3. TASK-121 — predecessor compatibility evidence.

## Sprint architecture boundary

Deploy-owned single-host reference lifecycle only. No external load balancer, DNS/reverse proxy, Kubernetes/container scheduler, fleet/cloud topology, canonical infrastructure contract, Builder/Runtime topology change or `packages/contracts/**` expansion is authorized.

## Growing proof target

`verified ReleaseArtifact + Environment -> managed Runtime start -> health PASS -> process remains managed/queryable -> explicit stop -> deterministic cleanup`, with existing one-shot Deploy semantics preserved.

## Current gate

Run Deterministic CI on this materialization head before product edits. If green, execute TASK-119..121 in dependency order with one authoritative commit per TASK and declared validations. Do not materialize P9 Sprint 2/3 or package review.
