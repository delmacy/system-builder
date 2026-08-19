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
- Revalidated on this fresh re-dispatch from freshly reconstructed `main` `e9f1b4d`: Sprint 2 `P10-TLS-SERVER-IDENTITY-01` remains the sole eligible COMMITTED successor; no blocker, unaccepted ADR, L3/L4, destructive-migration or security-weakening gate is present.
- `P10-TLS-SERVER-IDENTITY-01` (2nd construction Sprint) **merged** through PR #214 at `3fdfb95`; Deterministic CI PASS (run `32248430431`). `TD-P8-02` is **closed** under the human-accepted ADR-0015 (PR #206).
- P10 Integration & Technical Debt Review materialized on `review/P10-PACKAGE-01-integration-debt` (PR pending): package goal PASS, both P10 Sprints merged, successor `P11-PACKAGE-01` (Observe/operations publication) materialized as **SKELETON ONLY / FORECAST**.
- P10 Integration & Technical Debt Review **merged** through PR #216 at `72e6b09` (Deterministic CI PASS). P10 package is complete and closed.
- `P11-PACKAGE-01` (Observe/operations publication) **materialized as COMMITTED/DIRECTION_SELECTED** with Construction Sprint 1 `P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` (TASK-134/135/136 specs, `ready`) on the planning branch; no product construction performed.
- `P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` (Construction Sprint 1) **merged** through PR #219 at `fd05da2` (Deterministic CI run `32273409636` PASS). `TD-P7-03` closed; `TD-P4-08` partially closed.
- `P11-PACKAGE-01` **re-materialized** with Construction Sprint 2 `P11-OBSERVE-OPERATIONAL-METADATA-01` (TASK-137..148 specs, `ready`) as COMMITTED on the planning branch; no product construction performed.
- `P11-OBSERVE-OPERATIONAL-METADATA-01` (Construction Sprint 2) **constructed** on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` (TASK-137..147 commits `7d20a6d`..`7f6a5e2`, one per TASK in dependency order; TASK-148 closure in `P11-OBSERVE-OPERATIONAL-METADATA-01.report.md`). Operational-metadata path proven; `TD-P4-08` closed. Merge pending through the Sprint Review PR (Deterministic CI required).

## Active milestone

M11 (candidate). P10 package is complete and closed (PR #201, #214, #216). `P11-PACKAGE-01` direction is **selected (B — Observe/operations publication, WBS 10.3.3)**. Construction Sprint 1 `P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` (TASK-134/135/136) is **MERGED** (PR #219, `fd05da2`). Construction Sprint 2 `P11-OBSERVE-OPERATIONAL-METADATA-01` (TASK-137..148) is **CONSTRUCTED** on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` (commits `7d20a6d`..`7f6a5e2`), pending merge through its Sprint Review PR.

## Achieved P9 construction proof

`durable Catalog -> Assembly -> Validation -> Compiler -> durable Release/Artifact -> managed A -> durable authority A -> accepted B promotion -> durable authority B -> stale C + failed D retention -> controlled old-manager shutdown -> fresh authenticated Deploy/Release/Artifact reconstruction -> fresh manager rematerializes B -> B health UP with Builder/Observe unavailable`

## Achieved P10 construction proof

`managed A -> durable authority A -> production SecretResolver resolves symbolic secret bindings -> managed Runtime process starts with resolved ephemeral values -> no resolved value in durable Release/Deployment evidence -> Runtime continuity with Builder/Observe unavailable -> shared Transport and rendered Runtime perform positive PostgreSQL TLS server-identity verification (verify-ca/verify-full, fail-closed) -> authenticated SCRAM positive-verification E2E`

## P11 Sprint 1 constructed (merged)

`P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` — **MERGED** through PR #219 at `fd05da2` (Deterministic CI run `32273409636` PASS). Goal achieved: provider-neutral `DeploymentObservation` derived from the durable `DeploymentRecord`, fail-open publication to Observe/operations when configured, no value leakage, Runtime autonomy preserved. `TD-P7-03` closed; `TD-P4-08` partially closed.

## Achieved P11 construction proof (Sprint 1)

`durable DeploymentRecord -> provider-neutral DeploymentObservation (deterministic, content-addressed) -> fail-open publish -> Observe/operations receives deployment observations when configured -> Runtime continuity with Observe unavailable -> no resolved secret/credential/CA value in any emitted observation -> observations linkable to release/environment/status/health correlation`

## P11 Sprint 2 constructed (merge pending)

`P11-OBSERVE-OPERATIONAL-METADATA-01` — **CONSTRUCTED** on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` (TASK-137..147 commits `7d20a6d`..`7f6a5e2`, TASK-148 closure recorded). Goal achieved: executor/source operational metadata (WBS 10.3.1/11.1.2) correlated to release/environment/runtime context, provider-neutral, fail-open, deterministic, value-leak-free, extending the Sprint 1 `DeploymentObservation` additively without altering canonical identity. `TD-P4-08` closed. Merge pending through the Sprint Review PR (Deterministic CI required).

## Achieved P11 construction proof (Sprint 2)

`durable DeploymentRecord -> provider-neutral DeploymentObservation -> operational metadata (executor/source/mode) correlated to release/environment/runtime context -> enriched observation -> Observe/operations receives deployment observations when configured -> Runtime continuity with Observe unavailable -> observations linkable to release/environment context -> no resolved secret/CA value in any emitted observation`

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
- `TD-P4-08` — operational DeploymentRecord semantics: durable identity, release/environment/timestamps, result/history, active version, **Observe publication** and executor/source operational metadata (WBS 10.3.1/11.1.2) all proven across P11 Sprints 1 and 2. **CLOSED**.
- process supervision/reconciliation is single-host and process-local (`TD-P9-01`/`TD-P9-02`).
- production SecretResolver (`TD-P4-05`) is constructed and **MERGED** (Sprint 1, PR #201).
- successor readiness: `P11-PACKAGE-01` (Observe/operations publication, WBS 10.3.3, `TD-P7-03`/`TD-P4-08`) — Sprint 1 **MERGED** (PR #219, `fd05da2`); Sprint 2 `P11-OBSERVE-OPERATIONAL-METADATA-01` **CONSTRUCTED** (TASK-137..148, commits `7d20a6d`..`7f6a5e2`), merge pending; Sprint 3 and the package review remain FORECAST.

## Current gate

`P10-PACKAGE-01` is **complete and closed** (Sprint 1 PR #201, Sprint 2 PR #214, review PR #216). `P11-PACKAGE-01` direction B (Observe/operations publication) is selected; Construction Sprint 1 `P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` is **MERGED** (PR #219, `fd05da2`); Construction Sprint 2 `P11-OBSERVE-OPERATIONAL-METADATA-01` (TASK-137..148) is **CONSTRUCTED** on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` and pending merge through its Sprint Review PR (Deterministic CI required). Sprint 3 and the package review remain FORECAST until the Sprint 2 PR merges and `main` is freshly reconstructed.
