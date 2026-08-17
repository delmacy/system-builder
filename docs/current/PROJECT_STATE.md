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
- P6-DURABLE-RELEASE-ARTIFACT-01 merged through PR #180 at `632a3bb294de442f8b8bdea2bdc96e0d9a84955d`.
- Durable Catalog, PublishedRelease and ArtifactPayload reconstruction are now integrated while public Catalog/Assembly/Release/ArtifactStore semantics remain preserved.
- GitHub Actions remains the objective deterministic integration gate with PostgreSQL 17.6 service evidence.
- AgentFactory Supervisor/runtime remains frozen non-blocking infrastructure track.

## Integrated main proof

`durable Software Catalog -> deterministic transitive AssemblyPlan -> ValidationEvidence -> exact Compiler materializer lookup -> ReleaseArtifact -> durable PublishedRelease + verified ArtifactPayload -> existing Deploy -> autonomous Runtime -> persisted state across redeploy`

Durability has been proven for Catalog and, separately, for Release/Artifact provider reconstruction. The remaining P6 construction proof is to execute the complete Factory-to-Deploy/Runtime chain across those durable provider reconstruction boundaries in one integrated evidence path.

## Active Sprint

`P6-DURABLE-FACTORY-E2E-01 — Durable Factory-to-Runtime Integration`

Base: `632a3bb294de442f8b8bdea2bdc96e0d9a84955d`

Branch: `sprint/P6-DURABLE-FACTORY-E2E-01`

Status: `COMMITTED / NOT_STARTED`.

Committed TASK set:
1. TASK-098 — prove durable Catalog through reconstructed Release/Artifact into existing Deploy;
2. TASK-099 — prove the reconstructed durable Factory output executes through existing local Deployment into autonomous persisted Runtime;
3. TASK-100 — close package construction evidence with deterministic/failure/autonomy regression proof.

## Architecture boundary

This Sprint is integration/evidence work. Existing Catalog, Assembly, Validation, Compiler, ReleaseRegistry, ArtifactPayloadRepository, Deploy and Runtime semantics are frozen. PostgreSQL remains replaceable reference infrastructure. Release remains secret-free; Environment/secret references remain external; Runtime must remain autonomous from Builder/Factory availability.

## Current gate

Materialization only. No implementation TASK has been executed by this materialization action. Execute TASK-098 -> TASK-099 -> TASK-100 only after a new explicit instruction.

The P6 Integration & Technical Debt Review remains FORECAST / MANDATORY / NOT_MATERIALIZED and must not be started until this third construction Sprint is reviewed and merged.
