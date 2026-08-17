# P6-DURABLE-CATALOG-01 — Sprint Report

## Result

Sprint Goal satisfied on `sprint/P6-DURABLE-CATALOG-01`. Software Catalog storage is now behind a replaceable Catalog-owned boundary, a PostgreSQL 17.6 reference provider persists and reconstructs normalized Catalog records, and reconstructed durable records drive the unchanged Catalog resolution and actual transitive Assembly path deterministically.

## TASK results

| TASK | Result | Commit | Validation |
| --- | --- | --- | --- |
| TASK-091 | PASS | `9e04c25cf47d3a5afff56a446a96ba6ca78edcbd` | Deterministic CI #281 PASS |
| TASK-092 | PASS | `09019e5f2ed050065a0f7a785f7a3204ba33ec1c` | Deterministic CI #284 PASS |
| TASK-093 | PASS | `dcb19f799db131148593b75ddb893e5f4e149d0b` | Deterministic CI #285 PASS |

Dependency order was preserved: `TASK-091 -> TASK-092 -> TASK-093`.

Each implementation TASK is represented by exactly one authoritative commit in final Sprint branch history.

## Delivered proof

`normalized Catalog registration -> durable PostgreSQL persistence -> provider/process reconstruction -> equivalent deterministic Catalog resolution -> actual transitive AssemblyPlan`

Evidence includes:

- current `SoftwareCatalogRegistry` public call shape remains compatible;
- default in-memory behavior is preserved behind `CatalogRecordStorage`;
- normalized capability/provider/version/dependencies/dependencyRequirements/compatibility survive durable reload;
- `catalogIdentity`, duplicate rejection, deterministic list ordering and frozen snapshots remain preserved;
- PostgreSQL schema initialization is bounded/idempotent for the reference lifecycle;
- provider failure diagnostics are sanitized and do not echo connection credentials;
- reconstructed durable Catalog resolution matches the in-memory semantic control;
- structured minimum/exact/compatibility requirements survive reconstruction and reach actual Assembly transitive closure;
- equivalent ordering produces the same AssemblyPlan/BOM;
- unresolved transitive dependency after reconstruction remains explicit/fail-closed;
- PostgreSQL connection material does not enter Catalog records or AssemblyPlan;
- existing downstream Compiler/Release/Deploy/PostgreSQL autonomous-Runtime regressions remain green.

## Objective validation

TASK-093 Deterministic CI #285 executed repository `npm run verify` with PostgreSQL 17.6 healthy:

- unit tests: 309 PASS / 0 FAIL / 0 SKIPPED;
- product tests: 117 PASS / 0 FAIL / 0 SKIPPED;
- task catalog: 94 specifications validated;
- architecture gates: PASS;
- build: PASS;
- durable Catalog PostgreSQL reconstruction: PASS;
- durable Catalog -> actual Assembly integration: PASS;
- predecessor capability-driven PostgreSQL clean-redeploy: PASS;
- predecessor PostgreSQL migration/state redeploy: PASS;
- secret non-leakage and autonomous Runtime regressions: PASS.

Local execution is not claimed. GitHub Actions is the objective validation evidence.

## Delivery note

An initial TASK-092 head (`c266825ebfc5a226b3b6eb72afb1cbc63bb52f74`) failed CI #282 only on TypeScript narrowing of PostgreSQL row columns. The correction remained inside TASK-092 allowed scope. Before reopening the task gate, branch history was re-anchored to TASK-091 and replaced by the authoritative TASK-092 commit `09019e5f...`; the failed intermediate commit is not in final Sprint branch history. No semantic or scope expansion occurred.

The single Sprint PR was opened as draft after TASK-091 because repository CI is `pull_request`-triggered. The same PR remains the sole Sprint PR and is promoted to Sprint Review only after final closure-head CI.

## Architecture / scope disposition

- Catalog-internal replaceable persistence boundary: YES;
- PostgreSQL reference provider internal to Catalog: YES;
- public Catalog semantics changed: NO;
- Assembly source/semantics changed: NO;
- canonical `packages/contracts/**` changed: NO;
- Release/ArtifactStore/Deploy/Runtime product changed: NO;
- PostgreSQL made a required public architecture dependency: NO;
- ADR-0002 preserved: YES;
- ADR-0007 preserved: YES;
- L4 architecture change: NO.

## Residual work

`P6-DURABLE-RELEASE-ARTIFACT-01`, `P6-DURABLE-FACTORY-E2E-01` and the mandatory P6 Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED. They are not authorized by this Sprint closure.

## Review gate

- Sprint Goal: PASS
- committed TASKs implemented: YES
- TASK CI gates: PASS (#281, #284, #285)
- final closure-head `npm run verify`: REQUIRED before Ready for Sprint Review
- Sprint PR: #179
- successor Sprint materialized/executed: NO
- decision: PENDING FINAL CLOSURE CI / SPRINT REVIEW
