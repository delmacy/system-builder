# P6-DURABLE-RELEASE-ARTIFACT-01 — Durable Release and Artifact Providers

Status: SPRINT_REVIEW_PREPARATION / IMPLEMENTATION_CI_PASS
Package: `P6-PACKAGE-01`
Base SHA: `b6b96120dbb19b00f78b6965cb9590a680f2056f` (P6-DURABLE-CATALOG-01 merged through PR #179)
Branch: `sprint/P6-DURABLE-RELEASE-ARTIFACT-01`
PR: #180

## Goal

Move PublishedRelease metadata and ArtifactPayload content from process-lifetime storage to replaceable durable provider boundaries with PostgreSQL reference implementations, while preserving every currently integrated Release/ArtifactStore semantic and extending P6 durability proof across provider/process reconstruction.

## Predecessor gate

PASS:

- P6-DURABLE-CATALOG-01 merged through PR #179 at `b6b96120dbb19b00f78b6965cb9590a680f2056f`;
- durable Catalog reconstruction and unchanged Assembly integration are integrated;
- WBS 09.3.1 authorizes abstract registry/storage publication;
- no predecessor contract or architecture change was required for this Sprint.

## Authority

WBS 09 authorizes Release identity/provenance/lifecycle plus publication through abstract registry/storage. ADR-0002 and ADR-0007 remain controlling and unchanged.

This Sprint authorizes only Release-owned persistence seam/provider work, ArtifactStore provider implementation behind existing interfaces, and restart-safe integration evidence. PostgreSQL is a Factory-side reference implementation detail, not Runtime dependency or canonical architecture requirement.

## TASK results

1. `TASK-094` — PASS at `e553939c5e07bd69c7307e3167f04a2730f9318d`; Deterministic CI #289 PASS.
2. `TASK-095` — PASS at `1a43c6541d5925c91295f968301fa186afdb1ec4`; Deterministic CI #290 PASS.
3. `TASK-096` — PASS at `5b8f11fa4207e9f64f4ddd7bc543f295931d12bf`; Deterministic CI #291 PASS.
4. `TASK-097` — PASS at `498295188982dbf83e275227646bf2ff9d0e1621`; Deterministic CI #292 PASS.

Dependency order preserved:

`TASK-094 -> TASK-095 -> TASK-096 -> TASK-097`

## Frozen predecessor semantics preserved

Release:
- `PublishedRelease` shape unchanged;
- release identity remains `releaseId@version` behavior;
- duplicate publication remains fail-closed;
- `published -> deprecated -> archived` remains the current lifecycle path;
- retrieval returns immutable/equivalent snapshots;
- artifact hash and ValidationEvidence references remain release provenance;
- no secrets/environment values enter Release.

ArtifactStore:
- `ArtifactPayloadRepository` Reader/Writer/VerifiedReader interfaces unchanged;
- publish normalization/sorting unchanged;
- identical publication remains idempotent;
- conflicting overwrite remains explicit/fail-closed;
- missing artifact behavior remains explicit;
- per-file content hash, manifest paths and aggregate artifact hash verification remain unchanged;
- verified retrieval remains derived from actual ReleaseArtifact identity.

## Achieved growing proof

`durable Catalog predecessor -> actual Compiler ReleaseArtifact -> durable PublishedRelease + ArtifactPayload publication -> reconstruct providers/process -> equivalent release metadata/lifecycle -> verified ArtifactPayload retrieval`

TASK-097 uses actual Compiler output, actual ReleaseRegistry behavior and the existing ArtifactPayloadRepository verification path; it does not introduce a parallel verification path or activate Deploy/Runtime.

## Validation

- TASK-094: Deterministic CI #289 PASS.
- TASK-095: Deterministic CI #290 PASS.
- TASK-096: Deterministic CI #291 PASS.
- TASK-097: Deterministic CI #292 PASS.
- CI #292 repository verification: PostgreSQL 17.6 healthy; 309 unit PASS; 124 product PASS; 98 task specs validated; architecture gates/build PASS; durable Release/Artifact reconstruction PASS; predecessor Catalog/Assembly/PostgreSQL redeploy/Runtime-autonomy regressions PASS.
- final closure-head Deterministic CI is required before Sprint Review readiness.
- local execution is not claimed.

## Architecture disposition

No new ADR required. No canonical contract, Compiler, Deploy, Runtime, Catalog, Assembly or Builder/Runtime boundary was changed. PostgreSQL remains replaceable/internal to Factory-side reference providers.

## Technical-debt handling

Production TLS/SCRAM/password lifecycle/pooling/concurrency/observability remain outside this Sprint. Any transport duplication or operational-hardening findings remain candidates for the mandatory P6 Integration & Technical Debt Review; they are not promoted into the closed Sprint and do not alter the forecast sequence.

## Review boundary

After closure-head Deterministic CI PASS, mark PR #180 ready for Sprint Review and stop.

`P6-DURABLE-FACTORY-E2E-01` and the mandatory P6 Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED and must not be started without the existing predecessor gates and a new explicit instruction.
