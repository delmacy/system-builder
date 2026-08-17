# P8-ATOMIC-DEPLOYMENT-AUTHORITY-01 — Atomic Multi-Writer Deployment Authority

Status: COMMITTED / PRE_CODE
Base SHA: `209e192ec56599a05f6972e347f5b70989165c54`
Branch: `sprint/P8-ATOMIC-DEPLOYMENT-AUTHORITY-01`
Package: `P8-PACKAGE-01`
Milestone: M9

## Sprint Goal

Make DeploymentRecord persistence and active-version promotion concurrency-safe across multiple Deploy writers by adding an explicit atomic activation operation to the Deploy storage boundary, implementing it transactionally in PostgreSQL and proving deterministic stale-writer rejection plus reconstruction.

## Predecessor gate

`P8-DEPLOY-POSTGRES-TRANSPORT-01` merged through PR #189 at `209e192ec56599a05f6972e347f5b70989165c54` after final Deterministic CI #333 PASS and human Sprint Review acceptance.

## Committed TASKs

1. `TASK-113` — extend the Deploy storage/API boundary with an explicit async atomic activation operation while preserving existing synchronous APIs.
2. `TASK-114` — implement PostgreSQL transactional compare-and-set activation behind that boundary using the authenticated transaction-capable substrate from Sprint 1.
3. `TASK-115` — prove two-writer contention, stale rejection, no torn record/active state and provider/process reconstruction.

Dependency order: `TASK-113 -> TASK-114 -> TASK-115`.

## Growing integration proof

Predecessor proof:

`authenticated PostgreSQL reference connection -> existing Deploy storage boundary -> durable DeploymentRecord/active observation -> provider/process reconstruction -> equivalent state with no credential leakage`

Sprint exit proof:

`active A -> concurrent/stale activation attempts -> one authoritative CAS transition -> stale writer rejected without overwrite -> no torn record/active state -> provider/process reconstruction -> same authoritative active deployment`

## Change level / authority

TASK-113 introduces an additive exported Deploy-module API needed to make multi-writer authority real. This is an explicit L3 module API change authorized by this committed Sprint/package goal. It does not change `packages/contracts/**`, the Builder/Runtime boundary, Release/Environment/Deployment semantics or any L4 architecture decision.

## Scope boundary

PostgreSQL remains a Deploy-owned replaceable provider detail. No shared cross-context PostgreSQL transport, production traffic switching, fleet supervision, SecretResolver, Observe publication or Runtime feature expansion is authorized.

## Final validation

`npm run verify`

GitHub Deterministic CI is the objective validation evidence.

## Stop / escalation conditions

Stop if implementation requires:
- `packages/contracts/**` changes;
- cross-context PostgreSQL ownership/consolidation;
- a destructive migration;
- Builder/Runtime or Release/Environment/Deployment architecture changes;
- production traffic/fleet/supervisor scope;
- weakening security/governance or removing predecessor APIs.

## Explicit non-goals

Sprint 3 package E2E, production orchestration, positive TLS certificate policy, pooling/retry/observability hardening, migration-fleet coordination, Observe publication or full production-readiness claims.
