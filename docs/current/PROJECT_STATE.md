# Project State

Date: 2026-08-16

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine: integrated through TASK-008.
- P1-PACKAGE-01 construction and Integration & Technical Debt Review: merged.
- P2-PACKAGE-01: ACTIVE.
- P2-BOUNDARY-01: merged through PR #158.
- P2-RUNTIME-01: merged through PR #159.
- P2-LOCAL-DEPLOY-01: CI_PASS / READY_FOR_REVIEW on PR #160.
- GitHub Actions: deterministic integration gate.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Integrated main proof

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> runnable ReleaseArtifact -> generated runtime-entry.mjs -> external EnvironmentProfile -> autonomous Node RuntimeHealth PASS`

The Runtime proof in `main` uses actual Compiler output and succeeds without Builder/Observe availability during startup/health.

## Sprint-branch extension

`P2-LOCAL-DEPLOY-01` adds on `sprint/P2-LOCAL-DEPLOY-01`:

`PublishedRelease + EnvironmentProfile -> local Deploy materialization/start -> RuntimeHealth -> DeploymentRecord`

The full Sprint E2E connects actual Catalog/Assembly/Validation/Compiler/Release/Deploy APIs and preserves deterministic identities across repeated successful runs. Closure head `483adcbd233dbd13f30d1a29929652b6a72e4058` passed Deterministic CI #202.

## Active package progress

1. `P2-BOUNDARY-01` — MERGED;
2. `P2-RUNTIME-01` — MERGED;
3. `P2-LOCAL-DEPLOY-01` — CI_PASS / READY_FOR_REVIEW;
4. Integration & Technical Debt Review — next gate only after Sprint Review/merge.

## Truth

Only merged work in `main` is published product truth. Local Deploy and DeploymentRecord behavior described above remains branch-only until PR #160 is reviewed and merged.
