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
- P9 Integration & Technical Debt Review merged through PR #198 at `6662c64`; final CI validate PASS (run `32097982545`).
- P9 corrective SCRAM/TLS merged through PR #197 at `898a14f`; CI validate PASS on rebased head (run `32097697770`).
- Sprint-starter-prompt update merged through PR #199 at `6279b98` (doc-only).
- P10 materialization merged through PR #200 at `d178445` (direction A selected + first construction Sprint manifest + TASK-128/129/130 specs).
- `P10-PRODUCTION-SECRETRESOLVER-01` (1st construction Sprint) built on `sprint/P10-PRODUCTION-SECRETRESOLVER-01`, head `a1e0ed6`; Deterministic CI PASS (run `32136056276`); PR #201 open and promoted to human Sprint Review.

## Active milestone

M10. `P10-PACKAGE-01` direction is **selected (A — Production SecretResolver + TLS/server-identity hardening)**. The 1st construction Sprint `P10-PRODUCTION-SECRETRESOLVER-01` (TASK-128/129/130) is implemented on `sprint/P10-PRODUCTION-SECRETRESOLVER-01` (head `a1e0ed6`, CI PASS), promoted to human Sprint Review via PR #201. Merge is a human decision. Construction Sprint 2 (TLS) stays FORECAST pending the `TD-P8-02` ADR.

## Achieved P9 construction proof

`durable Catalog -> Assembly -> Validation -> Compiler -> durable Release/Artifact -> managed A -> durable authority A -> accepted B promotion -> durable authority B -> stale C + failed D retention -> controlled old-manager shutdown -> fresh authenticated Deploy/Release/Artifact reconstruction -> fresh manager rematerializes B -> B health UP with Builder/Observe unavailable`

## Achieved P10 Sprint 1 construction proof

`managed A -> durable authority A -> production SecretResolver resolves symbolic secret bindings -> managed Runtime process starts with resolved ephemeral values -> no resolved value in durable Release/Deployment evidence -> Runtime continuity with Builder/Observe unavailable`

## Corrective traceability

`sprint/CORRECTION-INFRA-01` (PR #197) is registered as a traceable corrective: Postgres overwrite crash repair + consolidation of duplicated PostgreSQL transports onto a shared SCRAM/TLS client. Rebased over new `main` `a559d1a`; head `0f4161a`; Deterministic CI run `32097697770` validate SUCCESS. Merge is human. Effective in `main` at `898a14f`.

## Architecture boundary

- Deploy-owned single-host reference lifecycle only.
- Additive `packages/deploy/managed-process.ts` + `runtime-reconciliation.ts`; existing Deploy predecessors unchanged.
- No canonical contracts, Runtime topology or ADR/L4 changes.
- No generic process discovery/PID scan, unmanaged-process adoption or external service manager.
- No load balancer/DNS/reverse proxy/scheduler/Kubernetes/fleet/cloud topology.

## Residual P9 inputs (carried debt)

- production traffic/fleet/infrastructure rollback remains unclaimed;
- verified PostgreSQL TLS/server identity (`TD-P8-02`) — escalated to ADR before any TLS construction — plus migration/fleet coordination (`TD-P4-04`) and Observe publication (`WBS 10.3.3`) remain open;
- process supervision/reconciliation is single-host and process-local (`TD-P9-01`/`TD-P9-02`).
- production SecretResolver (`TD-P4-05`) is now constructed (Sprint 1) and promoted to human Sprint Review via PR #201.

## Current gate

`P10-PACKAGE-01` direction A (Production SecretResolver + TLS hardening) is selected and the 1st construction Sprint `P10-PRODUCTION-SECRETRESOLVER-01` is implemented (head `a1e0ed6`, Deterministic CI PASS) and promoted to human Sprint Review via PR #201. `TD-P8-02` (positive TLS verification) is escalated as an L3/L4-adjacent change requiring an ADR accepted by a human before any TLS construction. No TLS policy change may be started until that ADR; Construction Sprint 2 stays FORECAST.
