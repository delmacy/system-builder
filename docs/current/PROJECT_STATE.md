# Project State

Date: 2026-08-16

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine: integrated through TASK-008.
- P1/P2/P3 construction packages and mandatory package reviews: merged through PR #166.
- P4 construction and mandatory Integration & Technical Debt Review: merged through PR #172.
- P5-PACKAGE-01 package plan: merged through PR #173 at `e1a1cfa00ae64180746c07a8b2e304f4d2990db9`.
- P5-CATALOG-CONSTRAINTS-01 implementation: TASK-082/083/084 completed on `sprint/P5-CATALOG-CONSTRAINTS-01`; TASK CI #253/#254/#255 PASS; PR #174 in Sprint Review preparation.
- GitHub Actions: deterministic integration gate with actual PostgreSQL service execution.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Integrated main proof

`SystemDefinition state.counter -> Catalog -> AssemblyPlan -> ValidationEvidence -> Compiler-derived migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> SecretResolver -> PostgreSQL -> autonomous Runtime -> persisted state across redeploy`

Only merged work in `main` is published product truth. The P5 Catalog constraint implementation currently exists only on the Sprint branch.

## Active Sprint result

`P5-CATALOG-CONSTRAINTS-01` achieved its branch goal:

`Catalog records -> structured dependency requirements -> deterministic constrained candidates / explicit unsatisfied diagnostic`

The branch preserves legacy exact Catalog resolution, unchanged Catalog->Assembly integration and the complete P4 PostgreSQL predecessor proof.

## Current gate

Require final closure-head Deterministic CI PASS on PR #174, then stop at Sprint Review. Do not merge automatically.

`P5-ASSEMBLY-GRAPH-01` remains FORECAST and is not materialized or authorized for execution.
