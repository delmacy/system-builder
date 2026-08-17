# P7-PACKAGE-01 — Durable Deployment Lifecycle

Status: READY / ROLLING_WAVE_PLAN
Base SHA: `3dfe567f4af539819a7ae96b524f0060f85b9825` (P6 Integration & Technical Debt Review merged through PR #182)
Milestone: M8

## Package Goal

Advance Deploy from bounded process-local evidence to a deterministic durable deployment lifecycle: persist/reconstruct DeploymentRecord and active-version authority, then add bounded acceptance/rollback semantics and prove them against the existing durable Factory output and autonomous Runtime without introducing production-only infrastructure claims.

## Authority

- WBS 10.3.1/10.3.2: deployment records and active-version visibility;
- WBS 10.2.3: health/acceptance and rollback on failure;
- WBS 13.3.3: safe upgrade/rollback path;
- ADR-0002: Runtime ordinary operation remains autonomous from Builder/Factory availability;
- ADR-0007: Release + Environment = Deployment; secrets remain outside Release artifacts.

P6 is fully integrated. The package does not make PostgreSQL a canonical Deploy contract and does not authorize production TLS, traffic routing, fleet supervision or secret-manager implementation.

## Construction Sprints

### 1. P7-DURABLE-DEPLOYMENT-STATE-01 — COMMITMENT CANDIDATE

Goal: place DeploymentRecord/active-version state behind a Deploy-owned replaceable persistence boundary, add a PostgreSQL reference provider and prove deterministic reconstruction while preserving existing dry-run/local Deploy semantics.

Exit proof:

`existing successful DeploymentRecord -> durable Deploy state -> provider/process reconstruction -> equivalent record + active release/version observation`

Candidate dependency chain: `TASK-101 -> TASK-102 -> TASK-103`.

### 2. P7-DEPLOYMENT-ROLLBACK-01 — FORECAST / NOT_MATERIALIZED

Goal: introduce bounded acceptance/activation semantics where a failed candidate deployment does not replace the last known-good active version, with explicit rollback/failed-attempt evidence rather than production traffic-management claims.

Expected growing proof:

`active durable deployment A -> candidate B -> acceptance failure -> A remains authoritative active version + deterministic failure/rollback evidence`.

### 3. P7-DURABLE-DEPLOYMENT-E2E-01 — FORECAST / NOT_MATERIALIZED

Goal: join durable Factory reconstruction, durable deployment lifecycle and autonomous Runtime into one package-level integration proof, including successful upgrade and bounded failed-candidate recovery.

Expected growing proof:

`durable Factory output -> durable Deploy activation -> autonomous Runtime -> next release activation or bounded failure -> reconstruct deployment authority -> correct active version + Runtime continuity`.

## Mandatory package review

`P7 Integration & Technical Debt Review` — FORECAST / MANDATORY / NOT_MATERIALIZED after all construction Sprints merge.

## Growing E2E proof

P6 baseline:

`durable Catalog -> Assembly/Validation/Compiler -> durable Release/Artifact -> Deploy -> autonomous persisted Runtime`

P7 adds durable operational deployment authority and bounded safe-upgrade/rollback evidence without changing the fundamental Builder/Runtime or Release/Environment boundaries.

## Explicit non-goals for the package

- production load balancer/traffic switching/TLS;
- fleet scheduler or long-running supervisor;
- production SecretResolver provider;
- PostgreSQL TLS/SCRAM/pooling transport hardening unless a committed Sprint explicitly promotes it;
- broad generated Runtime capability work;
- canonical public contract expansion unless separately escalated and authorized.

## Gates

Only the first construction Sprint may be materialized after this package plan merges and `main` is reconstructed. Sprints 2/3 and the package review remain forecast until their predecessor merge gates pass.