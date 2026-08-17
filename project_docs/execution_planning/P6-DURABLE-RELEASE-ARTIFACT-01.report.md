# P6-DURABLE-RELEASE-ARTIFACT-01 — Sprint Report

## Result

Sprint Goal satisfied on `sprint/P6-DURABLE-RELEASE-ARTIFACT-01`. PublishedRelease metadata and ArtifactPayload content now have replaceable PostgreSQL 17.6 reference providers that survive provider/process reconstruction while preserving the existing ReleaseRegistry and ArtifactPayloadRepository semantics.

## TASK results

| TASK | Result | Commit | Validation |
| --- | --- | --- | --- |
| TASK-094 | PASS | `e553939c5e07bd69c7307e3167f04a2730f9318d` | Deterministic CI #289 PASS |
| TASK-095 | PASS | `1a43c6541d5925c91295f968301fa186afdb1ec4` | Deterministic CI #290 PASS |
| TASK-096 | PASS | `5b8f11fa4207e9f64f4ddd7bc543f295931d12bf` | Deterministic CI #291 PASS |
| TASK-097 | PASS | `498295188982dbf83e275227646bf2ff9d0e1621` | Deterministic CI #292 PASS |

Dependency order was preserved: `TASK-094 -> TASK-095 -> TASK-096 -> TASK-097`.

Each implementation TASK is represented by exactly one authoritative commit in final Sprint branch history.

## Delivered proof

`actual Compiler ReleaseArtifact -> durable PublishedRelease + ArtifactPayload -> provider/process reconstruction -> equivalent release metadata/lifecycle -> verified ArtifactPayload retrieval`

Evidence includes:

- `ReleaseRegistry` storage ownership is behind a Release-owned `ReleaseRecordStorage` boundary;
- default in-memory Release behavior remains available;
- PostgreSQL Release provider reconstructs releaseId/version/artifactRef/artifactHash/validationEvidenceRef/publishedAt/status;
- duplicate release identity remains fail-closed after reconstruction;
- lifecycle remains `published -> deprecated -> archived` and persisted state survives reconstruction;
- PostgreSQL ArtifactPayload provider implements the existing `ArtifactPayloadRepository` contract without changing its public interface;
- immutable snapshots, deterministic file ordering, identical-publication idempotence, conflicting-publication failure and missing-artifact behavior remain preserved;
- `getVerified()` continues to use the existing per-file, manifest and aggregate-hash verification policy;
- actual Compiler output is persisted through both durable providers and verified after reconstructing both providers;
- connection strings/credentials do not enter PublishedRelease, ArtifactPayload or verification evidence;
- no Compiler, Deploy, Runtime, Catalog, Assembly or canonical-contract source was changed;
- predecessor durable Catalog/Assembly, Deploy, PostgreSQL redeploy and autonomous Runtime regressions remain green.

## Objective validation

TASK-097 Deterministic CI #292 executed repository `npm run verify` with PostgreSQL 17.6 healthy:

- unit tests: 309 PASS / 0 FAIL / 0 SKIPPED;
- product tests: 124 PASS / 0 FAIL / 0 SKIPPED;
- task catalog: 98 specifications validated;
- architecture gates: PASS;
- build: PASS;
- durable Release PostgreSQL reconstruction/lifecycle: PASS;
- durable ArtifactPayload reconstruction/verification: PASS;
- combined actual-Compiler durable Release + Artifact reconstruction: PASS;
- predecessor durable Catalog -> Assembly integration: PASS;
- predecessor PostgreSQL migration/state redeploy: PASS;
- secret non-leakage and autonomous Runtime regressions: PASS.

Local execution is not claimed. GitHub Actions is the objective validation evidence.

## Delivery note

The single Sprint PR is #180. It was opened as draft because repository Deterministic CI is `pull_request`-triggered and the same PR has carried the sequential TASK gates.

During the first TASK gate, CI identified missing mandatory `# Context` sections in the materialized TASK specs. The materialization baseline was normalized before advancing dependent TASKs, and the final authoritative branch history preserves one implementation commit per TASK. No product scope expansion resulted.

## Architecture / scope disposition

- Release-owned replaceable persistence boundary: YES;
- PostgreSQL reference Release provider: YES;
- PostgreSQL reference ArtifactPayloadRepository: YES;
- public ReleaseRegistry semantics changed: NO;
- public ArtifactPayloadRepository interface/verification semantics changed: NO;
- Compiler/Deploy/Runtime/Catalog/Assembly source changed: NO;
- canonical `packages/contracts/**` changed: NO;
- PostgreSQL made a required Runtime/public architecture dependency: NO;
- ADR-0002 preserved: YES;
- ADR-0007 preserved: YES;
- L4 architecture change: NO.

## Technical-debt handling

No adjacent debt is promoted into this closed Sprint. Production PostgreSQL TLS/SCRAM/password lifecycle/pooling/concurrency/observability remain outside this Sprint and stay subject to the package-level Integration & Technical Debt Review. Duplication of bounded PostgreSQL transport mechanics across current reference providers is recorded as a review candidate, not as successor authorization or a schedule change.

## Review gate

- Sprint Goal: PASS
- committed TASKs implemented: YES
- TASK CI gates: PASS (#289, #290, #291, #292)
- final closure-head `npm run verify`: REQUIRED before Ready for Sprint Review
- Sprint PR: #180
- successor Sprint materialized/executed: NO
- package review executed: NO
- decision: PENDING FINAL CLOSURE CI / SPRINT REVIEW
