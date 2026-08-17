# P7-DEPLOYMENT-ROLLBACK-01 — Bounded Deployment Acceptance & Rollback

Status: COMMITTED / READY
Base SHA: `fafc07c0c3a3f8661f50fbad30aa091bbea83731`
Branch: `sprint/P7-DEPLOYMENT-ROLLBACK-01`
Package: `P7-PACKAGE-01`
Milestone: M8

## Sprint Goal

Add bounded acceptance/activation semantics on top of the durable deployment state from Sprint 1 so failed candidate deployments remain explicit history while the previous successful deployment remains authoritative active state, with deterministic rollback/retention evidence and no production traffic-management claim.

## Predecessor gate

P7-DURABLE-DEPLOYMENT-STATE-01 merged through PR #184 after closure-head Deterministic CI #313 PASS.

## Committed TASKs

1. `TASK-104` — implement bounded activation/retention decision semantics.
2. `TASK-105` — prove actual existing Deploy acceptance failure retains the prior active deployment.
3. `TASK-106` — prove the failed-attempt/retention decision is deterministic across PostgreSQL provider reconstruction.

Dependency order: `TASK-104 -> TASK-105 -> TASK-106`.

## Growing integration proof

Sprint 1 baseline:

`successful DeploymentRecord -> durable Deploy state -> provider/process reconstruction -> equivalent history + active release/version observation`

Sprint exit proof:

`active durable deployment A -> candidate B -> acceptance failure -> A remains authoritative active version + deterministic failure/rollback evidence`.

## Final validation

`npm run verify`

GitHub Actions with PostgreSQL 17.6 is the objective remote integration gate.

## Stop / escalation conditions

Stop and escalate if any TASK requires:
- `packages/contracts/**` change or another canonical shared contract;
- ADR/L4 architecture change;
- production traffic switching/load balancer/fleet supervisor semantics;
- destructive migration;
- modifying a path forbidden by the active TASK;
- weakening secret handling or Runtime autonomy.

## Explicit non-goals

Production routing, zero-downtime orchestration, process supervisor/fleet coordination, TLS/SCRAM/pooling hardening, production SecretResolver implementation, generated Runtime feature expansion, or P7 Sprint 3 work.
