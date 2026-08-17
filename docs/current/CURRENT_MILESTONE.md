# Current Execution Milestone — M8 P7 Deployment Rollback Sprint

## Goal

Execute the second P7 construction Sprint by adding bounded acceptance/activation semantics so a failed candidate deployment cannot replace the last known-good active deployment, while emitting deterministic rollback/retention evidence without claiming production traffic control.

## Integrated baseline

P7-DURABLE-DEPLOYMENT-STATE-01 merged through PR #184 at `fafc07c0c3a3f8661f50fbad30aa091bbea83731`.

## Active Sprint

`P7-DEPLOYMENT-ROLLBACK-01 — Bounded Deployment Acceptance & Rollback`

Branch: `sprint/P7-DEPLOYMENT-ROLLBACK-01`
Status: `COMMITTED / READY_FOR_TASK-104`.

Committed order:
1. TASK-104 — activation/retention decision API;
2. TASK-105 — actual Deploy acceptance-failure proof;
3. TASK-106 — durable PostgreSQL reconstruction proof.

## Expected proof

`active durable deployment A -> candidate B -> acceptance failure -> A remains authoritative active version + deterministic failure/rollback evidence`

## Constraints

- preserve ADR-0002 Runtime autonomy;
- preserve ADR-0007 Release/Environment/Deployment separation;
- no canonical contract or L4 change;
- no production traffic switching, TLS, fleet/supervision or secret-manager work;
- PostgreSQL remains a replaceable Deploy reference provider.

## Current gate

Execute TASK-104 first and require its declared validations before TASK-105.

P7-DURABLE-DEPLOYMENT-E2E-01 and the P7 package review remain FORECAST / NOT_MATERIALIZED.
