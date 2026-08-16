# P2-LOCAL-DEPLOY-01 — Local Deployment Adapter and Runtime E2E

Status: COMMITTED
Package: `P2-PACKAGE-01`
Base SHA: `e1f3d82317a8176691309159f36e95f90c096c87`
Branch: `sprint/P2-LOCAL-DEPLOY-01`

## Goal

Use the runnable ReleaseArtifact and canonical EnvironmentProfile to perform the first real local-process deployment proof and extend the package E2E through a running autonomous Runtime and canonical DeploymentRecord evidence.

## Predecessor gate

`P2-RUNTIME-01` merged through PR #159. Its integrated outputs establish:

- actual Compiler output contains deterministic `runtime-entry.mjs`;
- Runtime starts from externally supplied EnvironmentProfile;
- startup/health does not require Builder or Observe;
- release content remains free of supplied secret values.

## Committed TASKs

1. `TASK-061` — Local-process Deploy adapter for runnable release artifacts;
2. `TASK-062` — operational DeploymentRecord from observed local runtime health/failure;
3. `TASK-063` — full autonomous local E2E through actual factory/release/deploy APIs.

Dependency order:

`TASK-060 -> TASK-061 -> TASK-062 -> TASK-063`

## Growing integration proof

Sprint entry proof:

`ReleaseArtifact -> generated runtime-entry.mjs -> external EnvironmentProfile -> autonomous RuntimeHealth PASS`

Sprint exit proof:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> runnable ReleaseArtifact -> PublishedRelease -> EnvironmentProfile -> local Deploy -> autonomous Runtime health -> DeploymentRecord`

The E2E must invoke actual module producers rather than hand-authoring downstream artifacts when executable producers exist.

## Validation

Per TASK:

- `npm run test:product`
- `npm run verify`

Final Sprint validation:

- `npm run verify`
- GitHub Deterministic CI on the final Sprint head.

## Explicit non-goals

- Docker/Vercel/on-prem production adapters;
- PostgreSQL provisioning or production migration orchestration;
- traffic switching/load balancing;
- full generated domain UI/workflow behavior;
- Observe/Support implementation;
- production-grade Catalog/Assembly dependency solving.

## Stop / escalation conditions

Stop for human decision if execution requires:

- a public-contract or L4 architecture change not already authorized by accepted ADRs;
- a path forbidden by the active TASK;
- resolved secret values embedded in immutable release/deployment evidence;
- production deployment/process-management semantics outside this bounded local proof;
- weakening Builder/Runtime autonomy or Release/Environment separation.

## Review boundary

After TASK-063 and final CI, produce `P2-LOCAL-DEPLOY-01.report.md`, update current-state docs on the Sprint branch, open/ready the single Sprint PR and stop for Sprint Review. Do not begin the package Integration & Technical Debt Review without new authorization.
