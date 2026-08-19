# Project State

Date: 2026-08-19

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
- `P10-PRODUCTION-SECRETRESOLVER-01` (1st construction Sprint) merged through PR #201 at `4301936`; Deterministic CI PASS on closure head `a1e0ed6` (run `32136056276`).
- ADR-0015 (positive TLS server-identity verification, `TD-P8-02`) accepted by a human through PR #206 at `99f344b`; `P10-TLS-SERVER-IDENTITY-01` (Construction Sprint 2) materialized as COMMITTED.
- P10 Work Package revalidated after the real Sprint 1 merge from freshly reconstructed `main` `e9f1b4d` (after PR #212): Sprint 2 `P10-TLS-SERVER-IDENTITY-01` confirmed as the sole eligible COMMITTED successor (revalidation commit on `planning/P10-PACKAGE-01-after-201`).
- Re-validation re-confirmed on the post-credential-fix re-dispatch: from freshly reconstructed `main` `e9f1b4d`, Sprint 2 `P10-TLS-SERVER-IDENTITY-01` remains the sole eligible COMMITTED successor; no blocker, unaccepted ADR, L3/L4, destructive-migration or security-weakening gate is present.

## Active milestone

M10. `P10-PACKAGE-01` direction is **selected (A — Production SecretResolver + TLS/server-identity hardening)**. The 1st construction Sprint `P10-PRODUCTION-SECRETRESOLVER-01` (TASK-128/129/130) is **MERGED** through PR #201 at `4301936`, closing the production SecretResolver gap `TD-P4-05`. The `TD-P8-02` gate is **unblocked**: ADR-0015 is accepted by a human (PR #206), and Construction Sprint 2 `P10-TLS-SERVER-IDENTITY-01` (TASK-131/132/133) is **COMMITTED**.

## Achieved P9 construction proof

`durable Catalog -> Assembly -> Validation -> Compiler -> durable Release/Artifact -> managed A -> durable authority A -> accepted B promotion -> durable authority B -> stale C + failed D retention -> controlled old-manager shutdown -> fresh authenticated Deploy/Release/Artifact reconstruction -> fresh manager rematerializes B -> B health UP with Builder/Observe unavailable`

## Achieved P10 Sprint 1 construction proof

`managed A -> durable authority A -> production SecretResolver resolves symbolic secret bindings -> managed Runtime process starts with resolved ephemeral values -> no resolved value in durable Release/Deployment evidence -> Runtime continuity with Builder/Observe unavailable`

## P10 Sprint 2 materialized (not yet constructed)

`P10-TLS-SERVER-IDENTITY-01` — COMMITTED (manifest + TASK-131/132/133 specs, status `ready`). Goal: positive PostgreSQL TLS server-identity verification (`verify-ca`/`verify-full`) in the shared transport and the rendered autonomous Runtime, fail-closed, closing `TD-P8-02` under ADR-0015. No product construction has been performed.

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
- verified PostgreSQL TLS/server identity (`TD-P8-02`) is **unblocked** — ADR-0015 accepted (PR #206) and Sprint 2 `P10-TLS-SERVER-IDENTITY-01` committed, not yet constructed — plus migration/fleet coordination (`TD-P4-04`) and Observe publication (`WBS 10.3.3`) remain open;
- process supervision/reconciliation is single-host and process-local (`TD-P9-01`/`TD-P9-02`).
- production SecretResolver (`TD-P4-05`) is now constructed and **MERGED** (Sprint 1, PR #201).

## Current gate

`P10-PACKAGE-01` direction A (Production SecretResolver + TLS hardening) is selected, Sprint 1 is **MERGED** (PR #201), and the `TD-P8-02` human/ADR gate is **satisfied** (ADR-0015 accepted through PR #206). Construction Sprint 2 `P10-TLS-SERVER-IDENTITY-01` is **COMMITTED** and eligible; it executes on `sprint/P10-TLS-SERVER-IDENTITY-01` with TASK-131/132/133 in dependency order. The package Integration & Technical Debt Review remains FORECAST until Sprint 2 merges.
