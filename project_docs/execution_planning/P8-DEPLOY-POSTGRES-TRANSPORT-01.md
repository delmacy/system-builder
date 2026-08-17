# P8-DEPLOY-POSTGRES-TRANSPORT-01 — Authenticated Deploy PostgreSQL Transport

Status: SPRINT_REVIEW_PREPARATION / IMPLEMENTATION_CI_PASS
Base SHA: `91f5cb23145c901c508e9673ef8cd38b52bbb413`
Branch: `sprint/P8-DEPLOY-POSTGRES-TRANSPORT-01`
PR: #189
Package: `P8-PACKAGE-01`
Milestone: M9

## Sprint Goal

Harden the PostgreSQL reference transport behind the existing Deploy-owned `DeploymentRecordStorage` boundary so authenticated PostgreSQL connections and transaction-capable operations are proven without changing canonical contracts, cross-context ownership or Runtime autonomy.

## Predecessor gate

`P8-PACKAGE-01` planning merged to `main` at `91f5cb23145c901c508e9673ef8cd38b52bbb413` after Deterministic CI #328 PASS and human planning acceptance.

## Committed TASKs

1. `TASK-110` — PASS at `6e0145206f0b2316e19eafebae2444f835189ed9`; Deterministic CI #330 PASS.
2. `TASK-111` — PASS at `bbe77a77cee88958a8193e1d4143b92685fce900`; Deterministic CI #331 PASS.
3. `TASK-112` — PASS at `e39f740e4bc605da2ccd6704979ae8be9de1f6f4`; Deterministic CI #332 PASS.

Dependency order preserved: `TASK-110 -> TASK-111 -> TASK-112`.

Materialization head `7b4979ccd1f43c8d2c2355002059743a49c8e5a8` passed Deterministic CI #329 before TASK execution began.

## Growing integration proof

P7 baseline:

`durable Deploy state -> provider/process reconstruction -> active authority + last-known-good continuity`

Sprint exit proof achieved:

`authenticated PostgreSQL reference connection -> existing Deploy storage boundary -> durable DeploymentRecord/active observation -> provider/process reconstruction -> equivalent state with no credential leakage`

TASK-110 proves actual PostgreSQL 17.6 SCRAM authentication plus deterministic `sslmode` negotiation/failure behavior while preserving the predecessor trust-auth path. TASK-111 proves bounded transaction commit/rollback behavior on one authenticated connection and uses that path for provider schema initialization. TASK-112 proves the actual Deploy storage boundary reconstructs successful/failed history and active authority through the authenticated provider while excluding connection/user/password material from evidence.

## Scope boundary

This Sprint remained L2 Deploy-module hardening. PostgreSQL remains a replaceable provider detail. No shared cross-context transport module, canonical contract, Builder/Runtime boundary, Release/Environment/Deployment semantic or L4 decision changed.

The CI workflow adds a second authenticated PostgreSQL reference service only for Deploy authentication evidence; the existing trust-auth service remains unchanged for predecessor providers.

No npm dependency, `package.json` or lockfile change was introduced.

## Residual debt / bounded claims

- positive encrypted PostgreSQL TLS operation is not proven by CI; `sslmode=prefer` fallback and `sslmode=require` fail-closed behavior are proven, but production certificate/TLS policy remains open;
- pooling, retry/cancellation policy beyond bounded timeout/socket teardown and provider observability remain open parts of `TD-P4-03`;
- raw PostgreSQL mechanics remain duplicated across bounded contexts (`TD-P6-01` carried);
- transactional multi-writer/CAS active-version authority remains the forecast Sprint 2 concern (`TD-P7-01` carried);
- no full production-readiness claim is made.

## Final validation

Repository-wide `npm run verify` on the closure head is the final objective gate before human Sprint Review. GitHub Actions with PostgreSQL 17.6 remains the objective execution evidence. Local validation is not claimed.

## Stop / escalation conditions

No escalation condition was triggered. The Sprint required no canonical contract, cross-context provider ownership, public Deploy semantic, L3/L4, destructive migration or production orchestration change.

## Explicit non-goals preserved

Atomic multi-writer active-pointer semantics (Sprint 2), production load balancer/traffic rollback, process/fleet supervision, production SecretResolver, migration fleet coordination, Observe publication, broad Runtime work, cross-context PostgreSQL consolidation or full production-readiness claims.
