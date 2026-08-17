# P6-DURABLE-CATALOG-01 — Durable Software Catalog Provider

Status: COMMITTED / NOT_STARTED
Package: `P6-PACKAGE-01`
Base SHA: `5806de40087ad36d8b6556d1cd4a7446b9db13c7` (P6 package plan merged through PR #178)
Branch: `sprint/P6-DURABLE-CATALOG-01`

## Goal

Move the current Software Catalog from process-lifetime storage to a replaceable durable storage boundary with a PostgreSQL reference provider, while preserving every currently integrated public Catalog and Assembly semantic and extending the P5 proof across provider/process reconstruction.

## Predecessor gate

PASS:

- P5 Catalog constraints/dependency requirements are merged and regression-proven;
- P5 Assembly transitive graph/diagnostics are merged and regression-proven;
- P5 package review closed bounded dependency-solving debt and ranked durable Factory/Release providers first;
- P6-PACKAGE-01 planning merged through PR #178 at `5806de40087ad36d8b6556d1cd4a7446b9db13c7`;
- Deterministic CI #280 passed on the package-plan head;
- current CI already provisions PostgreSQL 17.6 through `SYSTEM_BUILDER_TEST_POSTGRES_URL`;
- no predecessor contract or architecture change is required for the bounded Sprint goal.

## Authority

WBS 05 authorizes Software Catalog registration, contracts/versions/dependencies, provider-neutral resolution and Catalog governance. TD-P4-01 and TD-P5-04 identify process-local Catalog persistence as high-leverage debt.

This Sprint authorizes only a Catalog-internal persistence boundary, a replaceable PostgreSQL reference provider and integration evidence. It does not authorize richer Catalog constraint/provider-selection policy, Assembly semantic changes, canonical shared-contract extraction, Release/ArtifactStore persistence, Deploy/Runtime work or any L4 change.

ADR-0002 and ADR-0007 remain controlling and unchanged. PostgreSQL is a reference implementation detail of the Factory-side Catalog, not a Runtime dependency or canonical architecture requirement.

## Committed TASK set

1. `TASK-091` — establish internal Software Catalog persistence boundary.
2. `TASK-092` — implement PostgreSQL reference Catalog provider.
3. `TASK-093` — prove restart-safe Catalog -> Assembly integration.

Dependency order:

`TASK-091 -> TASK-092 -> TASK-093`

No TASK has been executed by Sprint materialization.

## Growing integration proof

Predecessor:

`SystemDefinition -> normalized/constrained SoftwareCatalogRegistry -> deterministic transitive AssemblyPlan`

Sprint exit:

`register normalized catalog records -> durable provider persistence -> reconstruct provider/process -> deterministic list/resolution equivalent -> actual transitive AssemblyPlan equivalent`

Repository-wide final verification must also preserve the existing downstream Compiler/Release/Deploy/PostgreSQL autonomous-Runtime regressions even though those modules are forbidden implementation scope.

## Public semantic invariants

Execution must preserve:

- exported current Catalog record/request/result data semantics;
- normalization of capability/provider/version/dependency/compatibility tokens;
- `catalogIdentity` behavior;
- duplicate identity rejection behavior;
- deterministic `list()` ordering and snapshots;
- `resolveCatalogCandidates` exact/minimum/compatibility behavior and deterministic candidate order;
- current Catalog diagnostics/failure behavior;
- all current Assembly API, graph, diagnostic and deterministic BOM semantics.

Additive provider implementation details may exist under the Catalog package, but consumers must not need PostgreSQL-specific knowledge to use current Catalog semantics.

## Validation

Per TASK, run the validations declared in its spec when execution is authorized.

Sprint final validation:

- `npm run verify`
- GitHub Deterministic CI with PostgreSQL 17.6 as objective final evidence.

Local execution must not be claimed unless actually observed.

## Stop / escalation conditions

Stop rather than broaden the Sprint if implementation requires:

- modifying `packages/assembly/**`;
- modifying canonical `packages/contracts/**`;
- changing existing public Catalog shapes, identity, resolution or diagnostics;
- making PostgreSQL a required public Catalog/Factory contract;
- destructive/irreversible migration semantics;
- Release, ArtifactStore, Deploy, Runtime or SecretResolver product changes;
- an L3 contract extraction not explicitly authorized by the TASK;
- any L4 Builder/Runtime, Release/Environment/Deployment or suite-boundary change.

## Successor boundary

`P6-DURABLE-RELEASE-ARTIFACT-01`, `P6-DURABLE-FACTORY-E2E-01` and P6 Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED.

Do not materialize or execute a successor automatically.
