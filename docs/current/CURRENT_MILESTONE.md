# Current Execution Milestone — M7 P6 Durable Catalog Sprint

## Goal

Materialize and execute, when explicitly authorized, the first P6 construction Sprint that moves Software Catalog state from process-lifetime storage to a replaceable durable provider without changing public Catalog or Assembly semantics.

## Integrated baseline

P6-PACKAGE-01 planning merged through PR #178 at:

`5806de40087ad36d8b6556d1cd4a7446b9db13c7`

Package direction remains justified by:
- TD-P4-01 durable Catalog/Release/Artifact providers — CARRIED / HIGH;
- TD-P5-04 persistence lag behind composition semantics — HIGH;
- current `SoftwareCatalogRegistry` process-local Map storage;
- WBS 05 provider-neutral Catalog authority;
- existing deterministic P5 Catalog/Assembly behavior that must not drift.

## Active Sprint

`P6-DURABLE-CATALOG-01 — Durable Software Catalog Provider`

Branch: `sprint/P6-DURABLE-CATALOG-01`

Status: `COMMITTED / NOT_STARTED`.

Committed order:
1. TASK-091 — establish internal Catalog persistence boundary;
2. TASK-092 — implement PostgreSQL reference Catalog provider;
3. TASK-093 — prove restart-safe Catalog resolution through actual Assembly integration.

## Expected growing proof

`register normalized catalog records -> persist -> reconstruct provider/process -> deterministic list/resolution identical -> actual transitive AssemblyPlan remains identical`

The repository-wide predecessor Runtime/PostgreSQL regressions remain mandatory final verification, but this Sprint does not change Runtime, Deploy, Release or ArtifactStore.

## Architecture constraints

- preserve current exported Catalog data shapes and resolution behavior;
- preserve `catalogIdentity`, duplicate rejection and deterministic ordering semantics;
- preserve exact/minimum/compatibility behavior;
- no source change under `packages/assembly/**`;
- PostgreSQL remains a reference implementation behind the Catalog boundary;
- no canonical `packages/contracts/**` change;
- no richer constraint/provider-selection policy;
- ADR-0002 and ADR-0007 remain controlling and unchanged.

## Current gate

Materialization only. No TASK is executed by this commit. A new explicit instruction is required to execute TASK-091..093.

All later P6 construction Sprints and the package review remain FORECAST / NOT_MATERIALIZED.
