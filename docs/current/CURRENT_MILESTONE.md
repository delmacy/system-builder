# Current Execution Milestone — M7 P6 Durable Release/Artifact Sprint

## Goal

Materialize and, when explicitly authorized, execute the second P6 construction Sprint that moves PublishedRelease and ArtifactPayload state from process-lifetime storage to replaceable durable providers without changing current Release, ArtifactStore, Deploy or Runtime semantics.

## Integrated baseline

P6-DURABLE-CATALOG-01 merged through PR #179 at:

`b6b96120dbb19b00f78b6965cb9590a680f2056f`

Predecessor proof:

`normalized Catalog registration -> durable PostgreSQL persistence -> provider/process reconstruction -> equivalent deterministic Catalog resolution -> actual transitive AssemblyPlan`

## Active Sprint

`P6-DURABLE-RELEASE-ARTIFACT-01 — Durable Release and Artifact Providers`

Branch: `sprint/P6-DURABLE-RELEASE-ARTIFACT-01`

Status: `COMMITTED / NOT_STARTED`.

Committed order:
1. TASK-094 — establish internal Release persistence boundary;
2. TASK-095 — implement PostgreSQL reference Release provider;
3. TASK-096 — implement PostgreSQL reference ArtifactPayloadRepository;
4. TASK-097 — prove restart-safe durable Release + Artifact integration.

## Expected growing proof

`durable Catalog predecessor -> deterministic Factory artifact -> publish durable PublishedRelease + ArtifactPayload -> reconstruct provider/process -> equivalent release retrieval/lifecycle + verified artifact retrieval`

## Architecture constraints

- preserve current `PublishedRelease` shape and ReleaseRegistry observable semantics;
- preserve release identity, duplicate rejection, lifecycle transitions and immutable snapshots;
- preserve ArtifactPayloadRepository interfaces and publication/idempotence/conflict semantics;
- preserve per-file, manifest and aggregate hash verification behavior;
- secrets and environment values remain outside Release and Artifact payload metadata;
- PostgreSQL remains replaceable Factory-side implementation detail;
- no Deploy, Runtime, Compiler, Catalog, Assembly or canonical-contract source change;
- ADR-0002 and ADR-0007 remain controlling and unchanged.

## Current gate

Materialization only. No TASK is executed by this commit. A new explicit instruction is required to execute TASK-094..097.

`P6-DURABLE-FACTORY-E2E-01` and the package review remain FORECAST / NOT_MATERIALIZED.
