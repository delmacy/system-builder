# P2-LOCAL-DEPLOY-01 — Local Deployment Adapter and Runtime E2E

Status: FORECAST
Package: `P2-PACKAGE-01`

## Goal

Use the runnable ReleaseArtifact and canonical EnvironmentProfile to perform the first real local-process deployment proof and extend the package E2E through a running autonomous Runtime.

## Candidate TASKs

### TASK-061 — Local-process Deploy adapter

Intent: implement a test/local adapter that materializes and starts the published runnable runtime without changing immutable release content.

Expected tests:
- valid PublishedRelease + EnvironmentProfile starts the expected runtime;
- incompatible runtime/environment fails before activation;
- secret/config bindings are supplied externally;
- adapter does not mutate PublishedRelease/ReleaseArtifact.

### TASK-062 — Health/acceptance/failure cleanup and operational record

Intent: extend local deployment execution to observable health/acceptance behavior and deterministic DeploymentRecord evidence.

Expected tests:
- successful startup produces succeeded DeploymentRecord;
- health/acceptance failure produces explicit failed evidence and cleans up the failed process;
- missing/invalid binding fails deterministically;
- no secret value is copied into immutable release metadata or DeploymentRecord evidence beyond permitted references.

### TASK-063 — Full autonomous local E2E

Intent: connect actual module APIs from SystemDefinition through local deployment and Runtime health.

Expected proof:
- execute the full successful vertical at least twice;
- compare deterministic factory/release identities across runs;
- start the generated client Runtime through the local Deploy adapter;
- prove Runtime startup/health while Builder is unavailable/not consulted;
- retain controlled negative paths.

## Dependency order

`TASK-060 -> TASK-061 -> TASK-062 -> TASK-063`

## Exit proof

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> runnable ReleaseArtifact -> PublishedRelease -> EnvironmentProfile -> local Deploy -> autonomous Runtime health -> DeploymentRecord`

## Explicit non-goals

- Docker/Vercel/on-prem production adapters;
- PostgreSQL provisioning or production migration orchestration;
- traffic switching/load balancing;
- full generated domain UI/workflow behavior;
- Observe/Support implementation.

These remain successor candidates unless required to satisfy the bounded Sprint goal.

## Commitment gate

This Sprint remains FORECAST until `P2-RUNTIME-01` is merged. Before commitment, inspect the actual runtime artifact/startup contract, materialize TASK-061..063 with complete path/validation metadata, and freeze `sprint/P2-LOCAL-DEPLOY-01` from synchronized `main`.
