# Current Execution Milestone — M8 P7 Package Planning

## Goal

Establish the next rolling-wave package from the fully integrated P6 baseline, selecting the highest-leverage bounded deployment-lifecycle proof without prematurely implementing production infrastructure.

## Integrated baseline

P6 construction and mandatory Integration & Technical Debt Review merged through PR #182 at `3dfe567f4af539819a7ae96b524f0060f85b9825`.

## Planned package

`P7-PACKAGE-01 — Durable Deployment Lifecycle`

Probable construction order:
1. `P7-DURABLE-DEPLOYMENT-STATE-01` — durable DeploymentRecord/active-version authority;
2. `P7-DEPLOYMENT-ROLLBACK-01` — bounded acceptance/rollback semantics;
3. `P7-DURABLE-DEPLOYMENT-E2E-01` — package-level upgrade/recovery integration proof.

Only Sprint 1 is eligible for commitment after this package plan merges and `main` is reconstructed. Sprints 2/3 remain forecast.

## Architecture constraints

- preserve ADR-0002 Runtime autonomy;
- preserve ADR-0007 Release/Environment/Deployment separation;
- keep PostgreSQL provider-specific details internal to Deploy reference providers;
- do not claim production TLS/traffic/fleet/supervision behavior;
- no canonical contract or L4 change without explicit escalation.

## Current gate

Run deterministic CI for package planning, merge the plan if green, reconstruct `main`, then materialize only `P7-DURABLE-DEPLOYMENT-STATE-01` and its committed TASKs.