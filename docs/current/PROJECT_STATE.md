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
- Durable Catalog PostgreSQL reconstruction now extends the integrated Factory proof without changing Catalog/Assembly semantics.
- GitHub Actions remains the objective deterministic integration gate with PostgreSQL 17.6 service evidence.
- AgentFactory Supervisor/runtime remains frozen non-blocking infrastructure track.

## Integrated main proof

`durable Software Catalog -> deterministic transitive AssemblyPlan -> ValidationEvidence -> exact Compiler materializer lookup -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> SecretResolver -> PostgreSQL -> autonomous Runtime -> persisted state across redeploy`

## Active Sprint

`P6-DURABLE-RELEASE-ARTIFACT-01 — Durable Release and Artifact Providers`

Base: `b6b96120dbb19b00f78b6965cb9590a680f2056f`

Branch: `sprint/P6-DURABLE-RELEASE-ARTIFACT-01`

Status: `COMMITTED / NOT_STARTED`.

Committed TASK set:
1. TASK-094 — internal Release persistence boundary;
2. TASK-095 — PostgreSQL reference Release provider;
3. TASK-096 — PostgreSQL reference ArtifactPayloadRepository;
4. TASK-097 — restart-safe durable Release + Artifact integration evidence.

## Architecture boundary

The Sprint must preserve current PublishedRelease identity/provenance/lifecycle/duplicate behavior and current ArtifactPayload publication/idempotence/conflict/hash/manifest verification semantics. PostgreSQL is a replaceable Factory-side reference provider, never Release/Artifact public contract material and never a Runtime dependency. Release remains secret-free and Environment/Deployment remain separate.

## Current gate

Materialization only. No implementation TASK has been executed by this materialization action. Execute TASK-094 -> TASK-095 -> TASK-096 -> TASK-097 only after a new explicit instruction.

`P6-DURABLE-FACTORY-E2E-01` and the P6 Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED.
