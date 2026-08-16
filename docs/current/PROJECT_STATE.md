# Project State

Date: 2026-08-16

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine: integrated through TASK-008.
- P1/P2/P3 construction packages and mandatory package reviews: merged through PR #166.
- P4-PACKAGE-01 package plan: merged through PR #167.
- P4-MIGRATION-STATE-01: merged through PR #168 at `b0b3e4c9fcbb21e0fc944a12ca16636b0dd82ae2`.
- P4-POSTGRES-STATE-01: committed on `sprint/P4-POSTGRES-STATE-01`; TASK-076..078 revalidated from the actual merged predecessor outputs.
- GitHub Actions: deterministic integration gate.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Integrated main proof

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret refs -> external SecretResolver -> local Deploy -> persistent Runtime -> HTTP RuntimeHealth -> counter.increment 1 -> 2 -> clean shutdown -> DeploymentRecord`

P4-MIGRATION-STATE-01 additionally proves:

`AssemblyPlan bounded capability -> Compiler -> migration/runtime assets -> ReleaseArtifact -> verified ArtifactPayload -> Deploy migration preflight`

Only merged work in `main` is published product truth.

## Current construction goal

Extend the verified migration preflight into the first bounded PostgreSQL-backed Runtime state path:

`verified ArtifactPayload -> migration preflight -> SecretResolver -> PostgreSQL migration apply -> autonomous Runtime -> persisted state -> clean redeploy -> prior state retained`

## Architecture state

ADR-0002 Builder/Runtime autonomy and ADR-0007 Release/Environment/Deployment separation remain controlling. `RuntimeStateRequirement` stays bounded/internal. PostgreSQL is the initial replaceable provider and may not broaden canonical public schemas or introduce Builder/Observe runtime dependencies.

## Current gate

Execute only `P4-POSTGRES-STATE-01` TASK-076 -> TASK-077 -> TASK-078, validate each TASK and final Sprint head, then stop at Sprint Review. Do not start `P4-CAPABILITY-RUNTIME-01` without this Sprint merge plus a new explicit instruction.
