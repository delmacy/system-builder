# Project State

Date: 2026-08-18

## Repository

`delmacy/system-builder` is canonical. Reconstruct technical context from repository files, not chat history.

## Integrated maturity

- P1–P8 construction/review history is integrated.
- P8 Integration & Technical Debt Review merged through PR #192 at `78e4e9a8056bf1e9c4bb4f49a798dd080cfd128a`.
- `P9-PACKAGE-01 — Managed Runtime Deployment Orchestration` planning merged through PR #193 at `14cdccbd391d3c337f749bc14e470e5a8bb1742f`.
- `P9-MANAGED-RUNTIME-PROCESS-01` merged through PR #194 at `cea8f09ccb99b2bf5bed27e9f01782db1520bb67`; final CI #356 PASS.
- `P9-ACTIVE-RUNTIME-PROMOTION-01` merged through PR #195 at `34379b744661468d8f3575facdbb6ed7140f8470`; final CI #362 PASS.
- `P9-RUNTIME-RECONCILIATION-E2E-01` merged through PR #196 at `a559d1af5d97562c0537cfb257de7dd2de889c84`; closure Deterministic CI PASS.

## Active milestone

M10. The mandatory `P9 Integration & Technical Debt Review` is in progress on branch `review/P9-PACKAGE-01-integration-debt` (PR #198).

## Achieved P9 construction proof

`durable Catalog -> Assembly -> Validation -> Compiler -> durable Release/Artifact -> managed A -> durable authority A -> accepted B promotion -> durable authority B -> stale C + failed D retention -> controlled old-manager shutdown -> fresh authenticated Deploy/Release/Artifact reconstruction -> fresh manager rematerializes B -> B health UP with Builder/Observe unavailable`

## Corrective traceability

`sprint/CORRECTION-INFRA-01` (PR #197) is registered as a traceable corrective: Postgres overwrite crash repair + consolidation of duplicated PostgreSQL transports onto a shared SCRAM/TLS client. Rebased over new `main` `a559d1a`; head `0f4161a`; Deterministic CI run `32097697770` validate SUCCESS. Merge is human.

## Architecture boundary

- Deploy-owned single-host reference lifecycle only.
- Additive `packages/deploy/managed-process.ts` + `runtime-reconciliation.ts`; existing Deploy predecessors unchanged.
- No canonical contracts, Runtime topology or ADR/L4 changes.
- No generic process discovery/PID scan, unmanaged-process adoption or external service manager.
- No load balancer/DNS/reverse proxy/scheduler/Kubernetes/fleet/cloud topology.

## Residual P9 inputs (carried debt)

- production traffic/fleet/infrastructure rollback remains unclaimed;
- carried production SecretResolver (`TD-P4-05`), verified PostgreSQL TLS/server identity (`TD-P8-02`), migration/fleet coordination (`TD-P4-04`) and Observe publication (`WBS 10.3.3`) remain open;
- process supervision/reconciliation is single-host and process-local (`TD-P9-01`/`TD-P9-02`).

## Current gate

The P9 Integration & Technical Debt Review reclassified the package debts, verified no external/fleet topology was absorbed, registered PR #197 as a traceable corrective with CI evidence, and materialized only a `P10-PACKAGE-01` planning skeleton. Review PR #198 is promoted to human Sprint Review after final Deterministic CI PASS. Do not merge automatically or start any successor construction until the review is accepted, merged and `main` is freshly reconstructed.
