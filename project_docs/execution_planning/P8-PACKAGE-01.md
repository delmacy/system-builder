# P8-PACKAGE-01 — Durable Deployment Authority Hardening

Status: READY / ROLLING_WAVE_PLAN
Base SHA: `aa79f1fbeefb1f49faddf24db35a9ea35f74df29` (P7 Integration & Technical Debt Review merged through PR #187)
Milestone: M9

## Why this package is next

Fresh reconstruction after the P7 review shows that the highest-leverage successor direction is production durability/activation hardening before broader deployment orchestration, Observe publication or Runtime feature breadth.

P7 made durable deployment authority structurally important but intentionally bounded. The integrated review carries three directly connected high-priority gaps:

- `TD-P4-03`: PostgreSQL transport/auth lifecycle remains proof-grade;
- `TD-P6-01`: durable-provider transport/concurrency lifecycle remains bounded and duplicated;
- `TD-P7-01`: Deploy active-pointer persistence is not transactionally multi-writer safe.

The review explicitly ranks production durability/activation hardening first among successor directions. This package therefore hardens the existing Deploy-owned durable authority boundary without changing canonical contracts, Builder/Runtime separation or Release/Environment/Deployment semantics.

The package identifier `P8` follows the integrated P1–P7 package sequence; its content is selected from post-P7 readiness rather than from numbering.

## Package Goal

Advance the existing bounded durable Deploy authority from single-process/proof-grade PostgreSQL evidence toward authenticated, transaction-capable and concurrency-safe reference-provider behavior, then prove that hardened activation authority preserves deterministic last-known-good semantics and autonomous Runtime continuity across reconstruction.

This package does **not** claim complete production deployment readiness. Production traffic switching, fleet supervision, SecretResolver providers, migration-fleet coordination and infrastructure rollback remain separate concerns unless explicitly promoted by a committed successor package.

## Authority

- P7 Integration & Technical Debt Review successor ranking: production durability/activation hardening first;
- WBS 10.2.3: health/acceptance and rollback when necessary;
- WBS 10.3.1/10.3.2: operational deployment records and effectively active version;
- WBS 13.3.3: safe upgrade/rollback according to release/deploy contracts;
- ADR-0002: Runtime ordinary operation remains autonomous from Builder/Observe;
- ADR-0007: Release remains immutable and separate from Environment/config/secrets.

## Construction Sprints

### 1. P8-DEPLOY-POSTGRES-TRANSPORT-01 — COMMITMENT CANDIDATE

Goal: harden the PostgreSQL reference transport used by the existing Deploy-owned `DeploymentRecordStorage` boundary so authenticated connections and transaction-capable operations no longer depend on the current raw trust-only/simple-query proof transport, while preserving provider replaceability and secret-safe diagnostics.

Expected exit proof:

`authenticated PostgreSQL reference connection -> existing Deploy storage boundary -> durable DeploymentRecord/active observation -> provider/process reconstruction -> equivalent state with no credential leakage`

Candidate implementation concerns to resolve inside the Sprint manifest/TASKs from the then-current repository:

- authenticated PostgreSQL connection support rather than auth mode 0 only;
- configurable TLS capability where supported by the selected provider implementation;
- bounded timeout/cancellation/pooling lifecycle appropriate to the reference provider;
- transaction-capable execution needed by the next Sprint;
- sanitized provider diagnostics and no secret material in persisted evidence.

The Sprint must not create a shared cross-context PostgreSQL infrastructure module unless repository authority explicitly approves that ownership. Default scope remains Deploy-owned.

### 2. P8-ATOMIC-DEPLOYMENT-AUTHORITY-01 — FORECAST / NOT_MATERIALIZED

Goal: make DeploymentRecord persistence and active-version promotion concurrency-safe under multiple activation attempts using transactional/compare-and-set semantics behind the existing Deploy persistence boundary.

Expected growing proof:

`active A -> concurrent/stale candidate activation attempts -> one deterministic authoritative transition -> no torn record/active state -> provider/process reconstruction -> same authoritative active deployment`

Expected failure evidence includes stale/competing activation rejection without silently overwriting a newer active deployment.

### 3. P8-HARDENED-ACTIVATION-E2E-01 — FORECAST / NOT_MATERIALIZED

Goal: join durable Factory output, hardened authenticated Deploy persistence, concurrency-safe activation authority and autonomous Runtime in one package-level proof covering successful upgrade plus stale/failed contender behavior.

Expected growing proof:

`durable Factory output -> authenticated durable Deploy state -> activate A -> autonomous Runtime -> promote B -> stale/failed contender cannot replace B -> reconstruct deployment authority -> B remains authoritative + Runtime continuity`

No downstream artifact may be hand-authored when an executable module API already exists.

## Mandatory package review

`P8 Integration & Technical Debt Review` — FORECAST / MANDATORY / NOT_MATERIALIZED after all construction Sprints merge.

The review must reclassify at minimum `TD-P4-03`, `TD-P6-01`, `TD-P7-01`, and any new transport/concurrency debt discovered during the package.

## Growing E2E proof

P7 baseline:

`durable Factory output -> durable Deploy activation A -> autonomous Runtime -> successful B activation -> failed candidate C -> reconstruct deployment authority -> B remains active + Runtime continuity`

P8 adds authenticated reference-provider transport and concurrency-safe activation authority without weakening the existing last-known-good or Runtime-autonomy evidence.

## Explicit non-goals

- production load balancer/traffic switching/zero-downtime cutover;
- process/fleet supervisor or scheduler;
- production SecretResolver provider;
- distributed migration locking/down-migration/fleet coordination;
- WBS 10.3.3 Observe/operations publication;
- broad Runtime entities/workflows/jobs/auth/views capability expansion;
- cross-context PostgreSQL transport consolidation without explicit ownership/ADR authority;
- canonical `packages/contracts/**` expansion unless separately escalated;
- declaration of full production readiness.

## Gates

Only Sprint 1 may be materialized after this package plan passes CI, receives human planning acceptance, merges to `main`, and `main` is freshly reconstructed.

Sprints 2/3 and the mandatory package review remain forecast until their predecessor merge gates pass. Before each successor becomes committed, revalidate actual predecessor outputs, contracts, risks, TASK readiness and the growing proof from repository truth.

## Planning validation

This package plan is documentation-only. Repository-wide `npm run verify` through GitHub Deterministic CI is the objective planning gate.

No construction Sprint, TASK spec or product implementation is authorized by this planning PR.
