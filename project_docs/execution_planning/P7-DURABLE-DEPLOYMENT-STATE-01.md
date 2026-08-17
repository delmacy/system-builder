# P7-DURABLE-DEPLOYMENT-STATE-01 — Durable Deployment State Authority

Status: COMMITTED / IMPLEMENTATION_PENDING
Package: `P7-PACKAGE-01`
Base SHA: `ee17702742a07e78f70f05f653e60445ddd72167` (P7 package plan merged through PR #183)
Branch: `sprint/P7-DURABLE-DEPLOYMENT-STATE-01`
PR: PENDING

## Goal

Move existing `DeploymentRecord` history and active-version observation behind a Deploy-owned replaceable persistence boundary, add a bounded PostgreSQL reference provider, and prove deterministic provider/process reconstruction without changing existing dry-run/local deployment production semantics or canonical contracts.

## Predecessor gate

PASS:

- P6 durable Factory-to-Runtime package and mandatory review are integrated;
- P7-PACKAGE-01 planning merged through PR #183 at `ee17702742a07e78f70f05f653e60445ddd72167`;
- package-planning Deterministic CI #306 passed;
- WBS 10.3.1/10.3.2 identifies deployment record history and active-version visibility as the next bounded Deploy gap.

## Authority

WBS 10.3.1/10.3.2, ADR-0002, ADR-0007 and P7-PACKAGE-01.

This Sprint authorizes only Deploy-internal state ownership, a PostgreSQL reference provider and focused integration evidence. It does not authorize canonical contract changes, production traffic/TLS/supervision, SecretResolver production providers, migration fleet coordination or broad rollback orchestration.

## Committed TASKs

1. `TASK-101` — establish Deploy-owned DeploymentRecord/active-version storage boundary.
2. `TASK-102` — implement bounded PostgreSQL deployment-state provider.
3. `TASK-103` — prove durable DeploymentRecord/active-version reconstruction from existing Deploy output.

Dependency order:

`TASK-101 -> TASK-102 -> TASK-103`

## Exit proof

`existing successful DeploymentRecord -> Deploy-owned persistence -> PostgreSQL durability -> provider/process reconstruction -> equivalent record + active release/version observation`

Negative evidence must show failed deployment evidence does not become active, invalid provider inputs fail closed without leaking credentials, and persisted evidence contains no resolved secret value.

## Validation

Each TASK: `npm run test:product` and `npm run verify` through objective GitHub Deterministic CI. Final Sprint closure requires repository-wide Deterministic CI on the closure head.

## Architecture boundary

- no `packages/contracts/**` change;
- no Release/Environment semantics change;
- PostgreSQL remains a replaceable Deploy reference-provider detail;
- Runtime autonomy from Builder/Factory remains unchanged;
- no L4 change or new ADR expected.

## Review boundary

After all TASKs pass, generate the Sprint Report, update current state, require final closure-head Deterministic CI, mark the single Sprint PR Ready for Review and stop.

`P7-DEPLOYMENT-ROLLBACK-01`, `P7-DURABLE-DEPLOYMENT-E2E-01` and the mandatory P7 Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED.