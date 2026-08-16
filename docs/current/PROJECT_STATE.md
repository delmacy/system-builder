# Project State

Date: 2026-08-16

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine: integrated through TASK-008.
- P1-PACKAGE-01 construction and Integration & Technical Debt Review: merged.
- P2-PACKAGE-01 construction and Integration & Technical Debt Review: merged through PR #161.
- P3-PACKAGE-01: merged through PR #162.
- P3-ARTIFACT-01: merged through PR #163.
- P3-RUNTIME-SERVICE-01: implemented on `sprint/P3-RUNTIME-SERVICE-01`; TASK CI green through TASK-069; closure-head CI pending on PR #164.
- GitHub Actions: deterministic integration gate.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Integrated main proof

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> verified ArtifactPayload -> PublishedRelease -> EnvironmentProfile -> local Deploy -> autonomous RuntimeHealth -> DeploymentRecord`

Only merged work in `main` is published product truth.

## Sprint-branch extension

`P3-RUNTIME-SERVICE-01` adds:

`verified ArtifactPayload + EnvironmentProfile -> local Deploy -> persistent generated Runtime -> RuntimeStarted -> HTTP RuntimeHealth UP while alive -> clean SIGTERM -> DeploymentRecord`

Runtime persistent mode is explicitly requested by Deploy on an ephemeral loopback port. The generated process remains independent of Builder/Observe during ordinary startup/health. Artifact verification still occurs before materialization, and secret values remain outside immutable evidence.

Controlled failures cover missing required bindings, startup timeout, health failure and artifact corruption without false success.

## P3 package progress

1. `P3-ARTIFACT-01` — MERGED / PR #163;
2. `P3-RUNTIME-SERVICE-01` — TASK_CI_PASS / FINAL_CI_PENDING / PR #164;
3. `P3-SECRET-STATE-01` — forecast; eligible only after PR #164 merge and repository revalidation;
4. Integration & Technical Debt Review — after all three construction Sprints.

## Truth

Persistent Runtime/HTTP health behavior remains branch-only until PR #164 is reviewed and merged. Do not execute the next Sprint before that merge is present in `main`.
