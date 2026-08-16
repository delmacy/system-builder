# Project State

Date: 2026-08-16

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine: integrated through TASK-008.
- P1/P2/P3 construction packages and mandatory package reviews: merged through PR #166.
- P4-PACKAGE-01 package plan: merged through PR #167.
- P4-MIGRATION-STATE-01: merged through PR #168.
- P4-POSTGRES-STATE-01: merged through PR #169 at `349231aa982048f2ce4507432032e3d32c160339`.
- P4-CAPABILITY-RUNTIME-01: COMMITTED on `sprint/P4-CAPABILITY-RUNTIME-01` with TASK-079 -> TASK-080 -> TASK-081.
- GitHub Actions: deterministic integration gate with actual PostgreSQL service execution.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Integrated main proof

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> migration preflight -> SecretResolver -> PostgreSQL migration apply -> autonomous generated Runtime -> persisted state 1 -> 2 -> clean redeploy -> migration skip -> persisted state 3 -> 4`

PR #169 preserved ADR-0002/ADR-0007, canonical contracts and secret non-leakage while proving PostgreSQL-backed state persistence.

## Active Sprint target

P4-CAPABILITY-RUNTIME-01 must extend the integrated proof to:

`SystemDefinition state.counter capability -> Catalog selected provider -> AssemblyPlan -> ValidationEvidence -> Compiler-derived capability implementation -> generated migration/runtime assets -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> Deploy -> PostgreSQL Runtime -> durable action -> clean redeploy -> persisted result`

The selected capability, not caller/hard-coded proof behavior, must determine whether the state action exists.

## Current gate

Execute only TASK-079..081 in dependency order under `project_docs/execution_planning/P4-CAPABILITY-RUNTIME-01.md`, validate each TASK and the final Sprint head, open one PR and stop at Sprint Review. Do not start the package Integration & Technical Debt Review without a new instruction.
