# P2-PACKAGE-01 — First Autonomous Local Runtime

Status: CONSTRUCTION_COMPLETE / INTEGRATION_REVIEW_IN_PROGRESS

## Package Goal

Move from the deterministic dry-run factory chain proven by P1 into the first locally runnable autonomous client-system slice, while hardening the public boundaries that the runtime/deploy path depends on.

Target package proof:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> runnable ReleaseArtifact -> PublishedRelease -> canonical EnvironmentProfile -> local Deploy -> autonomous Runtime health -> DeploymentRecord`

The Runtime must start and operate for the bounded proof without calling System Builder during ordinary startup/health.

## Integrated progress

- `P2-BOUNDARY-01` — MERGED through PR #158.
- `P2-RUNTIME-01` — MERGED through PR #159.
- `P2-LOCAL-DEPLOY-01` — MERGED through PR #160.
- Integration & Technical Debt Review — IN_PROGRESS on `review/P2-PACKAGE-01-integration-debt` from main `7609b97c86eebca168002f2db7c71277ea0e5d55`.

## Construction results

### P2-BOUNDARY-01

Canonical executable-output conformance, EnvironmentProfile and shared deterministic hashing are integrated.

### P2-RUNTIME-01

Compiler emits deterministic `runtime-entry.mjs`; actual Compiler output starts from external EnvironmentProfile and reports RuntimeHealth without Builder/Observe availability.

### P2-LOCAL-DEPLOY-01

Deploy materializes actual Compiler-generated files, starts the Runtime locally, observes RuntimeHealth/failure and emits deterministic DeploymentRecord evidence through actual factory/release/deploy APIs.

Integrated exit proof:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> runnable ReleaseArtifact -> PublishedRelease -> EnvironmentProfile -> local Deploy -> autonomous RuntimeHealth -> DeploymentRecord`

## Integration & Technical Debt Review gate

The mandatory review is now active and must:

- run/review repository-wide regression;
- execute/review the autonomous local vertical at least twice and compare deterministic artifact/deployment identities;
- prove runtime startup/health without Builder availability;
- verify resolved secret values are absent from immutable ReleaseArtifact/PublishedRelease/DeploymentRecord content;
- revalidate Runtime/Builder and Release/Environment/Deployment boundaries;
- assess artifact payload retrieval/materialization and integrity verification;
- assess the one-shot Runtime lifecycle versus the next persistent-runtime increment;
- assess external secret resolution;
- reassess Catalog/Assembly dependency solving and persistence readiness;
- classify debt and recommend the successor package from integrated evidence.

## Dependency order

`P2-BOUNDARY-01 -> P2-RUNTIME-01 -> P2-LOCAL-DEPLOY-01 -> Integration & Technical Debt Review`

TASK order:

`TASK-055 -> TASK-056 -> TASK-057 -> TASK-058 -> TASK-059 -> TASK-060 -> TASK-061 -> TASK-062 -> TASK-063`

## Package rules

- each implementation TASK has positive, negative/failure and predecessor-integration evidence where applicable;
- one distinct implementation commit per TASK inside the Sprint branch;
- every construction Sprint extends the real integration proof rather than hand-authoring outputs with executable producers;
- L3 shared-contract work requires explicit Sprint authority/review; any L4 discovery stops for ADR;
- `main` remains published truth after merge;
- no successor package is committed until this Integration & Technical Debt Review is merged;
- AgentFactory Supervisor/runtime remains frozen and is not a package gate.
