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
- P5-ASSEMBLY-GRAPH-01: TASK-085/086/087 implemented on `sprint/P5-ASSEMBLY-GRAPH-01`; CI #260/#261/#262 PASS; PR #175 in Sprint Review preparation.
- GitHub Actions: deterministic integration gate with actual PostgreSQL service execution.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Integrated main proof

`SystemDefinition root capability -> Catalog structured dependency requirements + bounded constraints -> root-only AssemblyPlan predecessor -> ValidationEvidence -> Compiler-derived migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> SecretResolver -> PostgreSQL -> autonomous Runtime -> persisted state across redeploy`

Only merged work in `main` is published product truth. The transitive Assembly graph implementation currently exists only on the Sprint branch.

## Active Sprint result

`P5-ASSEMBLY-GRAPH-01` achieved its branch goal:

`SystemDefinition root capability -> constrained Catalog candidate -> structured dependency requirements -> transitive dependency closure -> deterministic conflict/cycle validation -> deterministic AssemblyPlan BOM -> ValidationEvidence -> Compiler predecessor path`

The branch preserves Catalog exact/minimum semantics, actual downstream Validation/Compiler behavior and the complete P4 PostgreSQL/autonomous-runtime regression.

## Current gate

Require final closure-head Deterministic CI PASS on PR #175, then stop at Sprint Review. Do not merge automatically.

`P5-MATERIALIZER-REGISTRY-01` remains FORECAST and is not materialized or authorized for execution.
