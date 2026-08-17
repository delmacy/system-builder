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
- P5-MATERIALIZER-REGISTRY-01: TASK-088/089/090 implemented on `sprint/P5-MATERIALIZER-REGISTRY-01`; CI #264/#266/#268 PASS; PR #176 in Sprint Review preparation.
- GitHub Actions: deterministic integration gate with actual PostgreSQL service execution.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Integrated main proof

`SystemDefinition root capability -> Catalog bounded constraints + structured dependency requirements -> deterministic transitive AssemblyPlan BOM / graph diagnostics -> ValidationEvidence -> Compiler-derived migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> SecretResolver -> PostgreSQL -> autonomous Runtime -> persisted state across redeploy`

Only merged work in `main` is published product truth. The deterministic Compiler materializer registry currently exists only on the Sprint branch.

## Active Sprint result

`P5-MATERIALIZER-REGISTRY-01` achieved its branch goal:

`SystemDefinition capability -> Catalog constrained provider -> transitive AssemblyPlan BOM -> ValidationEvidence -> exact materializer registry lookup -> existing state.counter materialization -> deterministic migration/runtime assets -> ReleaseArtifact`

The branch preserves exact `state.counter` migration/runtime semantics, symbolic secret boundaries, unsupported-provider failure behavior and the complete P4 PostgreSQL/autonomous-runtime regression.

## Current gate

Require final closure-head Deterministic CI PASS on PR #176, then stop at Sprint Review. Do not merge automatically.

The mandatory `P5-PACKAGE-01` Integration & Technical Debt Review remains FORECAST / MANDATORY and has not been materialized or executed.
