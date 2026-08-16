# P2-LOCAL-DEPLOY-01 Sprint Report

Status: `IMPLEMENTED_ON_SPRINT_BRANCH / TASK_CI_PASS / FINAL_CI_PENDING`
Base: `e1f3d82317a8176691309159f36e95f90c096c87`
Branch: `sprint/P2-LOCAL-DEPLOY-01`
PR: #160

## Goal

Extend the runnable autonomous Runtime proof behind the Deploy bounded context and prove the full local vertical through actual RuntimeHealth and canonical DeploymentRecord evidence.

## TASK results

- TASK-061 — local-process Deploy adapter — `780b5b5e86c98ec915848f74422c29accef20659` — CI #199 PASS.
- TASK-062 — observed health/failure to DeploymentRecord — `006d75d10ccb9b5ccfd8501c9c0e3d407e657faf` — CI #200 PASS.
- TASK-063 — full autonomous local E2E — `933159a609f1fa28655b9addc519714ce0baeac1` — CI #201 PASS.

## Integrated proof

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> runnable ReleaseArtifact -> PublishedRelease -> EnvironmentProfile -> local Deploy -> autonomous RuntimeHealth -> DeploymentRecord`

The full E2E uses actual Catalog, Assembly, Validation, Compiler, Release and Deploy APIs. Deploy materializes the Compiler-generated `runtime-entry.mjs`, supplies the EnvironmentProfile externally, starts the Node Runtime, observes health and emits deterministic deployment evidence. Two equivalent successful runs preserve AssemblyPlan, ValidationEvidence, ReleaseArtifact, PublishedRelease and DeploymentRecord identities.

Controlled negative evidence proves a missing required binding activates the generated Runtime, fails explicitly, and produces a failed DeploymentRecord rather than false success. Preflight incompatibility remains diagnostic-only before activation.

## Validation and deviations

- CI #198 FAIL during TASK-061: local adapter referenced `manifest.files`, but the Deploy-side ReleaseArtifact projection intentionally exposes only `runtimeVersion` in its manifest type.
- Correction stayed inside TASK-061 scope: entrypoint presence is established from the actual Compiler `generatedFiles` bundle instead of broadening the Deploy projection/public contract. TASK-061 was rewritten as one implementation commit.
- CI #199 PASS — corrected TASK-061.
- CI #200 PASS — TASK-062.
- CI #201 PASS — TASK-063.
- Final repository verification on closure head: pending.

No public contract, accepted ADR, forbidden product path or Builder/Runtime boundary changed.

## Discoveries / residual debt

1. **Artifact payload retrieval boundary:** the local adapter currently receives Compiler `generatedFiles` alongside immutable ReleaseArtifact metadata. A production deploy path will need an artifact storage/retrieval/materialization boundary rather than direct in-memory handoff.
2. **Runtime lifecycle:** the current generated Runtime is deliberately a one-shot startup/health bootstrap, not a persistent service supervisor or generated business application.
3. **Secret resolution:** canonical EnvironmentProfile continues to carry symbolic references only. Resolution of actual secret values remains external and is not implemented by this Sprint.
4. Production Docker/Vercel/on-prem adapters, PostgreSQL provisioning, traffic switching and rollback remain out of scope.

## Decision gate

After final Sprint CI passes, P2-LOCAL-DEPLOY-01 is ready for Sprint Review. After merge, repository policy requires the P2-PACKAGE-01 Integration & Technical Debt Review before creating a successor package.
