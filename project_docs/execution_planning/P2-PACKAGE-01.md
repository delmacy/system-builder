# P2-PACKAGE-01 — First Autonomous Local Runtime

Status: ACTIVE / THIRD SPRINT READY_FOR_REVIEW

## Package Goal

Move from the deterministic dry-run factory chain proven by P1 into the first locally runnable autonomous client-system slice, while hardening the public boundaries that the runtime/deploy path depends on.

Target package proof:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> runnable ReleaseArtifact -> PublishedRelease -> canonical EnvironmentProfile -> local Deploy -> autonomous Runtime health -> DeploymentRecord`

The Runtime must start and operate for the bounded proof without calling System Builder during ordinary startup/health.

## Integrated progress

- `P2-BOUNDARY-01` — MERGED through PR #158.
- `P2-RUNTIME-01` — MERGED through PR #159.
- `P2-LOCAL-DEPLOY-01` — CI_PASS / READY_FOR_REVIEW on PR #160; closure head `483adcbd233dbd13f30d1a29929652b6a72e4058` passed CI #202.
- Integration & Technical Debt Review — required after PR #160 Sprint Review/merge; not started.

## Construction results

### P2-BOUNDARY-01

Canonical executable-output conformance, EnvironmentProfile and shared deterministic hashing are integrated.

### P2-RUNTIME-01

Compiler emits deterministic `runtime-entry.mjs`; actual Compiler output starts from external EnvironmentProfile and reports RuntimeHealth without Builder/Observe availability.

### P2-LOCAL-DEPLOY-01

Committed TASKs:

- TASK-061 — local-process Deploy adapter using actual Compiler generated files;
- TASK-062 — actual runtime health/failure to deterministic DeploymentRecord;
- TASK-063 — full autonomous local E2E through actual Catalog/Assembly/Validation/Compiler/Release/Deploy APIs.

Sprint-branch exit proof:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> runnable ReleaseArtifact -> PublishedRelease -> EnvironmentProfile -> local Deploy -> autonomous RuntimeHealth -> DeploymentRecord`

## Integration & Technical Debt Review gate

After the third construction Sprint is merged:

- run/review repository-wide regression;
- execute the autonomous local vertical at least twice and compare deterministic artifact/deployment identities;
- prove runtime startup/health without Builder availability;
- verify resolved secret values are absent from immutable ReleaseArtifact/PublishedRelease/DeploymentRecord content;
- revalidate Runtime/Builder and Release/Environment/Deployment boundaries;
- assess the newly exposed artifact payload retrieval/materialization boundary;
- assess the one-shot Runtime lifecycle versus the next persistent-runtime increment;
- reassess Catalog/Assembly dependency solving and persistence readiness;
- classify debt and choose the successor package from integrated evidence.

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
- AgentFactory Supervisor/runtime remains frozen and is not a package gate.
