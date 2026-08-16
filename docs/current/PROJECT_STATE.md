# Project State

Date: 2026-08-16

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine: integrated through TASK-008.
- P1/P2/P3 construction packages and mandatory package reviews: merged through PR #166.
- P4-PACKAGE-01 package plan: merged through PR #167.
- P4-MIGRATION-STATE-01: merged through PR #168 at `b0b3e4c9fcbb21e0fc944a12ca16636b0dd82ae2`.
- P4-POSTGRES-STATE-01: implemented on `sprint/P4-POSTGRES-STATE-01`, PR #169 pending Sprint Review.
- GitHub Actions: deterministic integration gate; Sprint branch additionally proves actual PostgreSQL service execution.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Integrated main proof

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret refs -> external SecretResolver -> local Deploy -> persistent Runtime -> HTTP RuntimeHealth -> counter.increment 1 -> 2 -> clean shutdown -> DeploymentRecord`

P4-MIGRATION-STATE-01 integrated extension:

`AssemblyPlan bounded capability -> Compiler -> migration/runtime assets -> ReleaseArtifact -> verified ArtifactPayload -> Deploy migration preflight`

Only merged work in `main` is published product truth.

## Sprint branch proof pending review

PR #169 extends the proof on its branch to:

`verified ArtifactPayload -> migration preflight -> SecretResolver -> PostgreSQL migration apply -> autonomous Runtime -> persisted state 1 -> 2 -> clean redeploy -> migration skip -> persisted state 3 -> 4`

CI #240 objectively ran the PostgreSQL E2E with 0 skipped product tests. Canonical contracts were not broadened and ADR-0002/ADR-0007 remain controlling.

## Current gate

Run final closure-head Deterministic CI for P4-POSTGRES-STATE-01, then stop at PR #169 Sprint Review. Do not start `P4-CAPABILITY-RUNTIME-01` without PR #169 merge plus a new explicit instruction.
