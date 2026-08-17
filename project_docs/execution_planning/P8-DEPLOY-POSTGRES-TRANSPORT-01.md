# P8-DEPLOY-POSTGRES-TRANSPORT-01 — Authenticated Deploy PostgreSQL Transport

Status: COMMITTED / PRE_CODE
Base SHA: `91f5cb23145c901c508e9673ef8cd38b52bbb413`
Branch: `sprint/P8-DEPLOY-POSTGRES-TRANSPORT-01`
Package: `P8-PACKAGE-01`
Milestone: M9

## Sprint Goal

Harden the PostgreSQL reference transport behind the existing Deploy-owned `DeploymentRecordStorage` boundary so authenticated PostgreSQL connections and transaction-capable operations are proven without changing canonical contracts, cross-context ownership or Runtime autonomy.

## Predecessor gate

`P8-PACKAGE-01` planning merged to `main` at `91f5cb23145c901c508e9673ef8cd38b52bbb413` after Deterministic CI #328 PASS and human planning acceptance.

## Committed TASKs

1. `TASK-110` — add authenticated/configurable PostgreSQL transport behavior inside Deploy and CI evidence for SCRAM authentication.
2. `TASK-111` — add bounded transaction-capable query lifecycle and prove commit/rollback behavior without broadening provider ownership.
3. `TASK-112` — prove authenticated durable DeploymentRecord/active-state reconstruction and secret-safe evidence through the existing Deploy storage boundary.

Dependency order: `TASK-110 -> TASK-111 -> TASK-112`.

## Growing integration proof

P7 baseline:

`durable Deploy state -> provider/process reconstruction -> active authority + last-known-good continuity`

Sprint exit proof:

`authenticated PostgreSQL reference connection -> existing Deploy storage boundary -> durable DeploymentRecord/active observation -> provider/process reconstruction -> equivalent state with no credential leakage`

TASK-111 additionally proves the provider can execute bounded transactional work needed by the forecast atomic-authority Sprint without yet changing activation semantics.

## Scope boundary

This Sprint is L2 Deploy-module hardening. PostgreSQL remains a replaceable provider detail. No shared cross-context transport module, canonical contract, Builder/Runtime boundary, Release/Environment/Deployment semantic or L4 decision is authorized.

The CI workflow may add a second authenticated PostgreSQL reference service solely to prove Deploy authentication while preserving the existing trust-auth service required by predecessor providers.

## Final validation

`npm run verify`

GitHub Deterministic CI with PostgreSQL 17.6 remains the objective execution evidence. Local validation is not claimed unless actually observed.

## Stop / escalation conditions

Stop if any TASK requires:

- `packages/contracts/**` change;
- modifying Catalog/Release/Artifact PostgreSQL providers or introducing shared cross-context PostgreSQL ownership;
- DeploymentRecord/DeploymentRegistry public semantic change;
- L3/L4 architecture change or new ADR;
- destructive migration;
- production traffic/fleet/supervision/SecretResolver scope;
- weakening CI/security/governance boundaries.

## Explicit non-goals

Atomic multi-writer active-pointer semantics (Sprint 2), production load balancer/traffic rollback, process/fleet supervision, production SecretResolver, migration fleet coordination, Observe publication, broad Runtime work, cross-context PostgreSQL consolidation or full production-readiness claims.
