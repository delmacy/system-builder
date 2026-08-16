# P2-LOCAL-DEPLOY-01 — Local Deployment Adapter and Runtime E2E

Status: TASK_CI_PASS / FINAL_CI_PENDING
Package: `P2-PACKAGE-01`
Base SHA: `e1f3d82317a8176691309159f36e95f90c096c87`
Branch: `sprint/P2-LOCAL-DEPLOY-01`
PR: #160

## Goal

Use the runnable ReleaseArtifact and canonical EnvironmentProfile to perform the first real local-process deployment proof and extend the package E2E through a running autonomous Runtime and canonical DeploymentRecord evidence.

## Predecessor gate

`P2-RUNTIME-01` merged through PR #159. Its integrated outputs establish deterministic `runtime-entry.mjs`, external EnvironmentProfile startup and Builder/Observe-independent RuntimeHealth.

## Committed TASKs and results

1. `TASK-061` — Local-process Deploy adapter — `780b5b5e86c98ec915848f74422c29accef20659` — CI #199 PASS;
2. `TASK-062` — operational DeploymentRecord from observed health/failure — `006d75d10ccb9b5ccfd8501c9c0e3d407e657faf` — CI #200 PASS;
3. `TASK-063` — full autonomous local E2E — `933159a609f1fa28655b9addc519714ce0baeac1` — CI #201 PASS.

Dependency order:

`TASK-060 -> TASK-061 -> TASK-062 -> TASK-063`

## Exit proof achieved on Sprint branch

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> runnable ReleaseArtifact -> PublishedRelease -> EnvironmentProfile -> local Deploy -> autonomous Runtime health -> DeploymentRecord`

The E2E invokes actual module producers. Deploy, not the test, materializes and starts the generated runtime process.

## Validation

Per-TASK GitHub Deterministic CI is green through TASK-063. Final closure-head `npm run verify` via GitHub CI is pending.

## Explicit non-goals retained

- Docker/Vercel/on-prem production adapters;
- PostgreSQL provisioning or production migration orchestration;
- traffic switching/load balancing;
- full generated domain UI/workflow behavior;
- Observe/Support implementation;
- production-grade Catalog/Assembly dependency solving.

## Discoveries for package review

- production Deploy will need an artifact payload retrieval/materialization boundary; current local proof receives Compiler generated files directly alongside ReleaseArtifact metadata;
- generated Runtime remains a bounded one-shot startup/health proof rather than a persistent service;
- secret resolution remains external to immutable release content and canonical EnvironmentProfile references.

## Review boundary

After final CI, produce final evidence in the Sprint Report and stop for Sprint Review. Do not begin the P2 Integration & Technical Debt Review until this Sprint is merged and the user explicitly authorizes that review.
