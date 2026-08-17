# P7-DURABLE-DEPLOYMENT-E2E-01 — Durable Deployment Lifecycle E2E

Status: COMMITTED
Base SHA: `991c6cff2f2e7fc332b4534091ad6afafce14106`
Branch: `sprint/P7-DURABLE-DEPLOYMENT-E2E-01`
Package: `P7-PACKAGE-01`
Milestone: M8

## Sprint Goal

Join the existing durable Factory, durable Deploy activation/rollback authority and autonomous Runtime in one package-level executable proof, covering a successful initial activation, a successful upgrade and a bounded failed-candidate recovery without production-only infrastructure claims.

## Predecessor gate

`P7-DEPLOYMENT-ROLLBACK-01` merged through PR #185 at `991c6cff2f2e7fc332b4534091ad6afafce14106` after closure Deterministic CI #319 PASS.

## Committed TASKs

1. `TASK-107` — prove durable Factory output reaches durable Deploy activation A and autonomous Runtime.
2. `TASK-108` — extend the same proof through successful version B activation and Runtime continuity.
3. `TASK-109` — extend through failed candidate C, PostgreSQL reconstruction, retained B authority and Runtime continuity.

Dependency order: `TASK-107 -> TASK-108 -> TASK-109`.

## Growing integration proof

Expected exit proof:

`durable Factory output -> durable Deploy activation A -> autonomous Runtime -> successful B activation -> failed candidate C -> reconstruct deployment authority -> B remains active + Runtime continuity`

## Final validation

- each TASK: `npm run test:product`, `npm run verify`;
- Sprint closure: `npm run verify`;
- GitHub Actions PostgreSQL 17.6 is the objective remote integration gate.

## Stop / escalation conditions

Stop on any required canonical contract/ADR/L4 change, provider/storage schema/interface change, production traffic/supervision requirement, forbidden path need, destructive migration, or unresolved repository-authority conflict.

## Explicit non-goals

Production load balancer/traffic switching, zero-downtime orchestration, fleet supervisor, production SecretResolver, PostgreSQL transport hardening, broad Runtime feature expansion, canonical contract changes, or P7 package review work.