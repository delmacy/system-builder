# Project State

Date: 2026-08-16

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine: integrated through TASK-008.
- P1/P2/P3 construction packages and mandatory package reviews: merged through PR #166.
- P4-PACKAGE-01 package plan: merged through PR #167 at `5f628b7c72f9e9fc0db799e0bd97b2d1997b1572`.
- P4-MIGRATION-STATE-01: TASK-073..075 implemented on `sprint/P4-MIGRATION-STATE-01`; implementation-head CI #235 PASS; closure-head CI pending for PR #168 Sprint Review.
- GitHub Actions: deterministic integration gate.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Integrated main proof

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret refs -> external SecretResolver -> local Deploy -> persistent Runtime -> HTTP RuntimeHealth -> counter.increment 1 -> 2 -> clean shutdown -> DeploymentRecord`

Only merged work in `main` is published product truth. P4-MIGRATION-STATE-01 remains proposed integration until PR #168 merges.

## Sprint-branch proof under review

`AssemblyPlan bounded capability -> Compiler -> migration/runtime assets -> ReleaseArtifact -> verified ArtifactPayload -> Deploy migration preflight`

The Sprint adds deterministic bounded Runtime state/migration metadata, Compiler-generated migration assets covered by existing ReleaseArtifact integrity, and fail-closed Deploy preflight before secret resolution/materialization. It does not execute migrations or connect PostgreSQL.

## Architecture state

ADR-0002 Builder/Runtime autonomy and ADR-0007 Release/Environment/Deployment separation remain preserved. Canonical `packages/contracts/**`, ReleaseArtifact, EnvironmentProfile and DeploymentRecord schemas were not broadened.

## Current gate

Require closure-head Deterministic CI PASS on PR #168, then stop at Sprint Review. `P4-POSTGRES-STATE-01` is forecast only and must not start without PR #168 merge plus a new explicit instruction and repository revalidation.
