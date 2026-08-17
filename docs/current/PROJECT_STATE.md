# Project State

Date: 2026-08-16

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine: integrated through TASK-008.
- P1/P2/P3 construction packages and mandatory package reviews: merged through PR #166.
- P4 construction and mandatory Integration & Technical Debt Review: merged through PR #172.
- P5-PACKAGE-01 package plan: merged through PR #173.
- P5-CATALOG-CONSTRAINTS-01: merged through PR #174 at `9a6f2df82d1ffbc1c9c25f67d819e666e718d832`.
- P5-ASSEMBLY-GRAPH-01: merged through PR #175 at `c6858ed95faa48cc60361a5a86ddcc57d2b56ced`; TASK-085/086/087 and terminal CI #263 passed.
- P5-MATERIALIZER-REGISTRY-01: promoted to COMMITTED / NOT_STARTED on `sprint/P5-MATERIALIZER-REGISTRY-01` after post-merge reconstruction and readiness revalidation.
- GitHub Actions: deterministic integration gate with actual PostgreSQL service execution.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Integrated main proof

`SystemDefinition root capability -> Catalog bounded constraints + structured dependency requirements -> deterministic transitive AssemblyPlan BOM / graph diagnostics -> ValidationEvidence -> Compiler-derived migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> SecretResolver -> PostgreSQL -> autonomous Runtime -> persisted state across redeploy`

The integrated Compiler still materializes the reference `state.counter / system-builder.postgres-counter / 1.0.0` capability through narrow Compiler-local identity logic. No general materializer registry is integrated yet.

## Active Sprint

`P5-MATERIALIZER-REGISTRY-01 — Deterministic Compiler Materializer Registry`

Committed TASK order:
1. TASK-088;
2. TASK-089 after TASK-088 validation;
3. TASK-090 after TASK-089 validation.

Expected proof:

`SystemDefinition capability -> Catalog constrained provider -> transitive AssemblyPlan BOM -> ValidationEvidence -> exact materializer registry lookup -> existing state.counter materialization -> deterministic migration/runtime assets -> ReleaseArtifact`

## Current gate

Execute only `P5-MATERIALIZER-REGISTRY-01` when explicitly instructed. Do not materialize or execute the mandatory P5 package Integration & Technical Debt Review.
