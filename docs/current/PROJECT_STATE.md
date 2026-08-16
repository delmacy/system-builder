# Project State

Date: 2026-08-16

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine: integrated through TASK-008.
- P1/P2/P3 construction packages and mandatory package reviews: merged through PR #166.
- P4 construction and mandatory Integration & Technical Debt Review: merged through PR #172.
- P5-PACKAGE-01 package plan: merged through PR #173 at `e1a1cfa00ae64180746c07a8b2e304f4d2990db9`.
- `P5-CATALOG-CONSTRAINTS-01`: COMMITTED on `sprint/P5-CATALOG-CONSTRAINTS-01` with TASK-082 -> TASK-083 -> TASK-084.
- `P5-ASSEMBLY-GRAPH-01`, `P5-MATERIALIZER-REGISTRY-01` and the package review remain FORECAST.
- GitHub Actions: deterministic integration gate with actual PostgreSQL service execution.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Integrated main proof

`SystemDefinition state.counter -> Catalog selected reference provider -> AssemblyPlan -> ValidationEvidence -> Compiler-derived migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret ref -> SecretResolver -> Deploy migration apply -> PostgreSQL-backed autonomous Runtime -> persisted state 1 -> 2 -> clean redeploy -> migration skip -> persisted state 3 -> 4`

P4 review disposition: construction PASS; architecture/boundaries PASS WITH DEBT; critical rollback blocker NONE.

## Active Sprint target

`P5-CATALOG-CONSTRAINTS-01 — Structured Dependency and Version Constraints`

Target proof:

`Catalog records -> structured dependency requirements -> deterministic constrained candidates / explicit unsatisfied diagnostic`

The Sprint must preserve current exact Catalog resolution, current Catalog->Assembly integration and the complete P4 predecessor regression.

## Architecture boundary

This Sprint authorizes bounded L3 internal Catalog API changes for structured dependency requirements and exact/minimum version constraints. It does not authorize canonical `packages/contracts/**` changes, transitive Assembly graph solving, durable providers or any L4 architecture change.

## Current gate

Execute only TASK-082..084 in dependency order under `project_docs/execution_planning/P5-CATALOG-CONSTRAINTS-01.md`.

Do not materialize or execute `P5-ASSEMBLY-GRAPH-01` before this Sprint completes, merges and a new explicit instruction revalidates current `main`.
