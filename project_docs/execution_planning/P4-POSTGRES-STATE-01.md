# P4-POSTGRES-STATE-01 — PostgreSQL Durable Runtime State

Status: REVIEW_READY / FINAL_CI_REQUIRED
Package: `P4-PACKAGE-01 — Durable Stateful Runtime and Capability Materialization`
Base: `b0b3e4c9fcbb21e0fc944a12ca16636b0dd82ae2` (P4-MIGRATION-STATE-01 merged through PR #168)
Branch: `sprint/P4-POSTGRES-STATE-01`
PR: #169

## Sprint Goal

Implement the first bounded PostgreSQL-backed Runtime state path, apply verified Compiler-generated migrations before Runtime activation, and prove state survives a clean Runtime restart/redeploy using actual PostgreSQL in deterministic CI.

Achieved proof:

`verified ArtifactPayload -> migration preflight -> SecretResolver -> PostgreSQL migration apply -> persistent autonomous Runtime -> state 1 -> 2 -> clean shutdown -> redeploy -> migration skip -> state 3 -> 4`

## Committed TASK results

1. `TASK-076` — bounded PostgreSQL Runtime state adapter — `2507e051b1b9ad19bf04b504c9b304c14c474fe4` — CI #238 PASS;
2. `TASK-077` — verified/idempotent Deploy migration application — `8ebb798da1770701279f1998d273f412f92b2241` — CI #239 PASS;
3. `TASK-078` — actual PostgreSQL restart/redeploy persistence E2E — `53464e70f12b91f0419f6567eba7ec0126fd94c2` — CI #240 PASS.

Dependency chain completed:

`TASK-075 -> TASK-076 -> TASK-077 -> TASK-078`

## Evidence

- generated Runtime remains autonomous from Builder/Observe and uses external database connectivity only at execution;
- Deploy migration application occurs after preflight/secret resolution and before materialization/activation;
- migration identity/hash ledger supports apply/skip and rejects hash drift;
- actual `postgres:17.6-alpine` service was healthy in CI #240;
- PostgreSQL E2E executed rather than skipped: 86 product tests PASS / 0 SKIPPED;
- first deployment reached persisted value 2, second clean deployment reached value 4;
- same migration identity with changed content hash failed before activation;
- resolved connection value remained outside immutable/runtime response/deployment evidence asserted by the E2E.

## Architecture constraints preserved

- ADR-0002 Builder/Runtime separation;
- ADR-0007 Release/Environment/Deployment separation;
- no canonical public schema expansion;
- PostgreSQL remains replaceable bounded provider behavior;
- no production database provisioning/supervision/traffic/rollback scope entered.

## Validation history

- CI #237 FAIL — TASK-076 lint only; corrected within TASK scope and commit rewritten;
- CI #238 PASS — TASK-076;
- CI #239 PASS — TASK-077;
- CI #240 PASS — TASK-078 implementation head + actual PostgreSQL E2E;
- closure-head CI: required before final review readiness.

Detailed report: `project_docs/execution_planning/P4-POSTGRES-STATE-01.report.md`.

## Successor gate

`P4-CAPABILITY-RUNTIME-01` / TASK-079..081 remains FORECAST / NOT AUTHORIZED. Do not start it unless PR #169 merges, repository authority is re-read and a new explicit instruction authorizes the successor.
