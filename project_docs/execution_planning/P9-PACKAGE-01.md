# P9-PACKAGE-01 — Managed Runtime Deployment Orchestration

Status: READY / ROLLING_WAVE_PLAN
Base SHA: `78e4e9a8056bf1e9c4bb4f49a798dd080cfd128a` (P8 Integration & Technical Debt Review merged through PR #192)
Milestone: M10

## Why this package is next

Fresh reconstruction after the integrated P8 review ranks production deployment orchestration / actual process-traffic lifecycle first for structural leverage. P8 made authenticated durable deployment authority and deterministic active-version selection reliable, but the current Deploy reference adapter still treats the spawned Runtime as a bounded execution/acceptance probe rather than a managed authoritative service lifecycle.

This package therefore advances the existing Deploy-owned local-process reference implementation into a bounded single-host managed deployment lifecycle. It deliberately does not invent external load-balancer, cluster, scheduler or fleet ownership. Those remain separate architecture choices.

Primary carried drivers:
- `TD-P4-06`: production Runtime supervision/deploy lifecycle remains absent;
- `TD-P7-02`: rollback currently means authority retention, not process/infrastructure reconciliation;
- WBS 10.2.2/10.2.3: deploy release, apply config, health/acceptance and rollback;
- WBS 13.3.3: safe upgrade/rollback according to release/deploy contracts.

## Package Goal

Establish a Deploy-owned, replaceable single-host reference orchestration lifecycle that keeps the authoritative Runtime process managed after acceptance, performs deterministic active-process promotion/retention according to existing deployment authority, and reconstructs/reconciles the authoritative process from durable state after orchestrator restart while preserving Runtime autonomy from Builder/Observe.

This package does not claim complete production deployment readiness.

## Architecture boundary

- ownership stays inside bounded context `Deploy`;
- the existing local-process adapter is the reference execution provider, not a canonical requirement;
- existing durable DeploymentRecord/active authority remains the source of deployment truth;
- Release remains immutable and Environment remains external config/secret references under ADR-0007;
- Runtime ordinary operation remains autonomous from Builder/Observe under ADR-0002;
- no external load-balancer, DNS, reverse proxy, container scheduler, Kubernetes, fleet manager or cloud provider contract is introduced;
- no shared canonical contract expansion is assumed; any discovered L4 topology requirement must stop/escalate to ADR rather than be invented inside a Sprint.

## Construction Sprints

### 1. P9-MANAGED-RUNTIME-PROCESS-01 — COMMITMENT CANDIDATE

Goal: evolve the Deploy-owned local-process reference path from one-shot acceptance execution into an explicit managed process lifecycle that can start, health-check, retain, inspect and terminate one accepted Runtime instance deterministically without leaking secrets or weakening existing failure cleanup.

Expected exit proof:

`verified ReleaseArtifact + Environment -> managed Runtime start -> health PASS -> process remains managed and queryable -> explicit stop -> deterministic cleanup`

Candidate concerns for Sprint materialization:
- lifecycle handle/state owned by Deploy rather than caller-held raw child process;
- bounded start/stop timeout semantics and idempotent cleanup;
- accepted process remains alive after deployment acceptance;
- startup/health failure leaves no falsely managed active process;
- secrets remain runtime-only and diagnostics redacted;
- predecessor `executeLocalDeployment` behavior remains compatible unless a narrowly authorized additive API is required.

### 2. P9-ACTIVE-RUNTIME-PROMOTION-01 — FORECAST / NOT_MATERIALIZED

Goal: bind managed process lifecycle to the existing atomic deployment authority so a candidate is promoted only after acceptance, the prior authoritative Runtime remains available until the decision is known, and stale/failed candidates cannot displace or incorrectly terminate the active process.

Expected growing proof:

`managed A active -> start/accept B -> atomic authority promotes B -> B becomes managed active -> A retires deterministically -> stale/failed C cannot replace or terminate B`

Failure evidence must show that failed/stale promotion retains both durable authority and the corresponding managed Runtime continuity.

This Sprint must not imply external traffic switching. “Active Runtime” means the authoritative process inside the bounded single-host reference orchestrator.

### 3. P9-RUNTIME-RECONCILIATION-E2E-01 — FORECAST / NOT_MATERIALIZED

Goal: prove package-level reconstruction and reconciliation from durable Factory/Release/Artifact/Deploy state into the authoritative managed Runtime after orchestrator/process-manager restart, including successful upgrade and failed/stale contender continuity.

Expected growing proof:

`durable Factory output -> managed A -> promote B -> contender rejected/failed -> stop orchestration manager -> fresh manager reconstructs durable authority -> reconciles B process -> B autonomous Runtime continuity`

No downstream artifact may be hand-authored where executable module APIs already exist.

## Mandatory package review

`P9 Integration & Technical Debt Review` — FORECAST / MANDATORY / NOT_MATERIALIZED after all construction Sprints merge.

The review must reclassify at minimum `TD-P4-06`, `TD-P7-02`, any process-supervision/reconciliation debt introduced by P9, and verify that external traffic/fleet concerns were not silently absorbed.

## Growing E2E proof

P8 baseline:

`durable Factory output -> authenticated atomic Deploy authority -> A Runtime -> B promotion -> stale/failed contender retention -> authority reconstruction -> B Runtime continuity`

P9 adds managed process lifecycle and restart reconciliation so durable authority is enacted by a live single-host Runtime process rather than remaining only a durable selection record.

## Explicit non-goals

- external load-balancer, reverse-proxy, DNS or service-mesh traffic switching;
- Kubernetes/container scheduler/cloud deployment provider;
- multi-host or fleet orchestration;
- zero-downtime production cutover/SLA claim;
- production SecretResolver implementation;
- PostgreSQL TLS/certificate hardening (`TD-P8-02`);
- cross-context PostgreSQL transport consolidation (`TD-P6-01`);
- migration fleet locking/down-migration coordination (`TD-P4-04`);
- Observe/operations publication (`WBS 10.3.3`);
- broad generated Runtime feature expansion;
- canonical `packages/contracts/**` expansion absent explicit escalation;
- declaration of full production readiness.

## Gates

Only Sprint 1 may be materialized after this planning PR passes repository verification, receives human Planning Review acceptance, merges to `main`, and `main` is freshly reconstructed.

Sprints 2/3 and the mandatory package review remain forecast until predecessor merge gates pass. Before each successor becomes committed, revalidate actual predecessor outputs, interfaces/contracts, risks, task readiness and the growing proof from repository truth.

If Sprint materialization discovers that managed process ownership cannot remain Deploy-local without changing Builder/Runtime topology or introducing a canonical infrastructure contract, stop and escalate for architecture review/ADR.

## Planning validation

Planning is documentation-only. Repository-wide `npm run verify` through GitHub Deterministic CI is the objective planning gate.

No TASK spec, construction Sprint or product implementation is authorized by this planning PR.
