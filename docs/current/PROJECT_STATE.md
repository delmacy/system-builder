# Project State

Date: 2026-08-16

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine: integrated through TASK-008.
- P1-PACKAGE-01 construction and Integration & Technical Debt Review: merged.
- P2-PACKAGE-01 construction and Integration & Technical Debt Review: merged through PR #161.
- P3-PACKAGE-01: merged through PR #162.
- P3-ARTIFACT-01: implemented on `sprint/P3-ARTIFACT-01`; TASK CI green through TASK-066; closure-head CI pending on PR #163.
- GitHub Actions: deterministic integration gate.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Integrated main proof

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> runnable ReleaseArtifact -> PublishedRelease -> canonical EnvironmentProfile -> local Deploy -> autonomous RuntimeHealth -> DeploymentRecord`

Only merged work in `main` is published product truth.

## Sprint-branch extension

`P3-ARTIFACT-01` adds:

`ReleaseArtifact -> artifact publication -> retrieval -> independent payload integrity verification -> PublishedRelease -> local Deploy -> RuntimeHealth -> DeploymentRecord`

Actual Compiler output is published through a provider-neutral payload repository. Verification independently recomputes generated-file hashes, exact manifest coverage and aggregate artifact identity before Deploy materialization. Local Deploy no longer accepts caller-supplied generated files as its activation source.

Controlled corruption is rejected before runtime activation, while Builder/Observe independence and external secret separation remain intact.

## P3 package progress

1. `P3-ARTIFACT-01` — TASK_CI_PASS / FINAL_CI_PENDING / PR #163;
2. `P3-RUNTIME-SERVICE-01` — forecast; blocked until Sprint Review/merge plus new instruction;
3. `P3-SECRET-STATE-01` — forecast;
4. Integration & Technical Debt Review — after all three construction Sprints.

## Truth

The artifact-delivery behavior above remains branch-only until PR #163 is reviewed and merged. Do not advance to another Sprint from this branch.
