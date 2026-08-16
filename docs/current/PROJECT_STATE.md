# Project State

Date: 2026-08-15

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine: integrated through TASK-008.
- Executable factory chain in `main`: through ReleaseArtifact after P1-VERTICAL-02.
- P1-VERTICAL-03 branch: Release registry, Deploy dry-run and full DeploymentRecord proof implemented with green task CI; awaiting Sprint Review/merge.
- GitHub Actions: deterministic integration gate.
- AgentFactory Supervisor/runtime: frozen non-blocking infrastructure track.

## Current branch proof

`SystemDefinition -> Software Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> DeploymentRecord`

## Package status

**P1-PACKAGE-01 — First Executable Vertical Slice**

- P1-VERTICAL-01 — merged.
- P1-VERTICAL-02 — merged.
- P1-VERTICAL-03 — `CI_PASS / READY_FOR_REVIEW` on its Sprint branch.
- Integration & Technical Debt Review — next only after P1-VERTICAL-03 merge and explicit authorization.

## Truth

Only work merged into `main` is published repository truth. P1-VERTICAL-03 remains branch-only until review/merge.
