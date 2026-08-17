# P6-DURABLE-CATALOG-01 — Durable Software Catalog Provider

Status: SPRINT_REVIEW_PREPARATION / IMPLEMENTATION_CI_PASS
Package: `P6-PACKAGE-01`
Base SHA: `5806de40087ad36d8b6556d1cd4a7446b9db13c7` (P6 package plan merged through PR #178)
Branch: `sprint/P6-DURABLE-CATALOG-01`
PR: #179

## Goal

Move the current Software Catalog from process-lifetime storage to a replaceable durable storage boundary with a PostgreSQL reference provider, while preserving every currently integrated public Catalog and Assembly semantic and extending the P5 proof across provider/process reconstruction.

## Predecessor gate

PASS:

- P5 Catalog constraints/dependency requirements and Assembly transitive graph/diagnostics are integrated and regression-proven;
- P6-PACKAGE-01 planning merged through PR #178 at `5806de40087ad36d8b6556d1cd4a7446b9db13c7`;
- Deterministic CI #280 passed on package planning;
- no predecessor contract or architecture change was required for this Sprint.

## Authority

WBS 05 authorizes provider-neutral Software Catalog registration, resolution and governance. TD-P4-01 and TD-P5-04 identify process-local persistence as active durability debt.

This Sprint authorizes only a Catalog-internal persistence boundary, a replaceable PostgreSQL reference provider and integration evidence. ADR-0002 and ADR-0007 remain controlling and unchanged. PostgreSQL is a Factory-side reference implementation detail, not a Runtime dependency or canonical architecture requirement.

## TASK results

1. `TASK-091` — PASS at `9e04c25cf47d3a5afff56a446a96ba6ca78edcbd`; CI #281 PASS.
2. `TASK-092` — PASS at `09019e5f2ed050065a0f7a785f7a3204ba33ec1c`; CI #284 PASS.
3. `TASK-093` — PASS at `dcb19f799db131148593b75ddb893e5f4e149d0b`; CI #285 PASS.

Dependency order preserved:

`TASK-091 -> TASK-092 -> TASK-093`

## Achieved proof

`register normalized catalog records -> durable PostgreSQL persistence -> reconstruct provider/process -> deterministic Catalog resolution equivalent -> actual transitive AssemblyPlan equivalent`

The implementation preserves current Catalog identity, duplicate, ordering, exact/minimum/compatibility and diagnostics semantics; preserves all Assembly source/semantics; keeps the default in-memory path; reconstructs normalized structured dependency records from PostgreSQL; and keeps connection material outside Catalog records and Assembly evidence.

## Validation

- TASK-091: Deterministic CI #281 PASS.
- TASK-092: initial intermediate CI #282 failed on bounded TypeScript narrowing only; authoritative replacement TASK commit passed Deterministic CI #284.
- TASK-093: Deterministic CI #285 PASS.
- CI #285 repository verification: PostgreSQL 17.6 healthy; 309 unit PASS; 117 product PASS; 94 task specs validated; architecture gates/build PASS; durable Catalog reconstruction/Assembly evidence PASS; predecessor PostgreSQL redeploy and Runtime autonomy regressions PASS.
- final closure-head Deterministic CI is required before Sprint Review readiness.
- local execution is not claimed.

## Architecture disposition

No new ADR required. No canonical contract, Assembly source/semantic, Release/ArtifactStore, Deploy, Runtime-core or Builder/Runtime boundary was changed. PostgreSQL remains replaceable/internal to the Catalog reference provider.

## Review boundary

After closure-head Deterministic CI PASS, mark PR #179 ready for Sprint Review and stop.

`P6-DURABLE-RELEASE-ARTIFACT-01`, `P6-DURABLE-FACTORY-E2E-01` and the mandatory P6 Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED and must not be started without new explicit instruction after this Sprint is reviewed/merged and main is reconstructed.
