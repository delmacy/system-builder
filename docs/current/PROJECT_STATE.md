# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine integrated through TASK-008.
- P1/P2/P3 construction packages and mandatory package reviews merged through PR #166.
- P4 construction and mandatory Integration & Technical Debt Review merged through PR #172.
- P5 construction and mandatory Integration & Technical Debt Review merged through PR #177.
- P6-PACKAGE-01 planning merged through PR #178 at `5806de40087ad36d8b6556d1cd4a7446b9db13c7`.
- P6-DURABLE-CATALOG-01 merged through PR #179 at `b6b96120dbb19b00f78b6965cb9590a680f2056f`.
- P6-DURABLE-RELEASE-ARTIFACT-01 implementation is complete on PR #180 and awaiting final closure-head CI / Sprint Review.
- Durable Catalog, PublishedRelease and ArtifactPayload PostgreSQL reconstruction now extend the Factory proof while preserving public Catalog/Assembly/Release/ArtifactStore semantics.
- GitHub Actions remains the objective deterministic integration gate with PostgreSQL 17.6 service evidence.
- AgentFactory Supervisor/runtime remains frozen non-blocking infrastructure track.

## Growing integrated proof

Integrated predecessor on `main`:

`durable Software Catalog -> deterministic transitive AssemblyPlan -> ValidationEvidence -> exact Compiler materializer lookup -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> SecretResolver -> PostgreSQL -> autonomous Runtime -> persisted state across redeploy`

Sprint branch proof awaiting merge:

`durable Catalog predecessor -> actual Compiler ReleaseArtifact -> durable PublishedRelease + ArtifactPayload -> reconstruct providers/process -> equivalent release metadata/lifecycle -> verified ArtifactPayload retrieval`

## Active Sprint

`P6-DURABLE-RELEASE-ARTIFACT-01 — Durable Release and Artifact Providers`

Base: `b6b96120dbb19b00f78b6965cb9590a680f2056f`

Branch: `sprint/P6-DURABLE-RELEASE-ARTIFACT-01`

PR: #180

Status: `SPRINT_REVIEW_PREPARATION / IMPLEMENTATION_CI_PASS`.

TASK results:
1. TASK-094 — PASS at `e553939c5e07bd69c7307e3167f04a2730f9318d`; CI #289 PASS;
2. TASK-095 — PASS at `1a43c6541d5925c91295f968301fa186afdb1ec4`; CI #290 PASS;
3. TASK-096 — PASS at `5b8f11fa4207e9f64f4ddd7bc543f295931d12bf`; CI #291 PASS;
4. TASK-097 — PASS at `498295188982dbf83e275227646bf2ff9d0e1621`; CI #292 PASS.

## Architecture boundary

PublishedRelease identity/provenance/lifecycle/duplicate behavior and ArtifactPayload publication/idempotence/conflict/hash/manifest verification semantics remain unchanged. PostgreSQL remains a replaceable Factory-side reference provider, never Release/Artifact public contract material and never a Runtime dependency. Release remains secret-free and Environment/Deployment remain separate.

## Current gate

Create the Sprint closure commit containing report/state only, require final Deterministic CI PASS on that head, then mark PR #180 Ready for Sprint Review and stop.

Do not merge automatically at this gate. Do not materialize or execute `P6-DURABLE-FACTORY-E2E-01`. Do not execute the P6 Integration & Technical Debt Review.
