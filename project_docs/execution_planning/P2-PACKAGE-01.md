# P2-PACKAGE-01 — First Autonomous Local Runtime

Status: ACTIVE

## Package Goal

Move from the deterministic dry-run factory chain proven by P1 into the first locally runnable autonomous client-system slice, while hardening the public boundaries that the runtime/deploy path will depend on.

Target package proof:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> runnable ReleaseArtifact -> PublishedRelease -> canonical EnvironmentProfile -> local DeploymentRecord -> autonomous Runtime health`

The Runtime must start and operate for the bounded proof without calling System Builder during ordinary operation.

## Integrated progress

- `P2-BOUNDARY-01` — MERGED through PR #158. Canonical schema conformance, EnvironmentProfile and shared deterministic hashing are integrated.
- `P2-RUNTIME-01` — COMMITTED on `sprint/P2-RUNTIME-01` from `7062ef1a42811875b7543bbaca04a19cd3fe8ed8`.
- `P2-LOCAL-DEPLOY-01` — FORECAST until P2-RUNTIME-01 merges.
- Integration & Technical Debt Review — required after the third construction Sprint.

## Authority and source

This package is derived from the merged P1-PACKAGE-01 Integration & Technical Debt Review and existing WBS/ADRs.

Primary drivers:

- output/schema conformance — addressed by P2-BOUNDARY-01;
- canonical EnvironmentProfile — addressed by P2-BOUNDARY-01;
- shared deterministic hashing — addressed by P2-BOUNDARY-01;
- planned gap — Compiler output must become runnable;
- planned gap — autonomous Runtime startup/health must be proven before real local Deploy automation.

Catalog/Assembly production-grade dependency solving remains backlog unless required by a bounded runtime proof; it must not silently expand an active Sprint.

## Current Sprint — P2-RUNTIME-01

Committed TASKs:

- TASK-058 — minimal autonomous Runtime bootstrap/package boundary;
- TASK-059 — Compiler materializes a deterministic runnable Node runtime package;
- TASK-060 — actual Compiler-output startup/health proof with Builder unavailable.

Exit proof:

`ReleaseArtifact -> runtime materialization -> external EnvironmentProfile -> autonomous process startup -> health PASS`

This Sprint proves Runtime packaging and autonomy, not full generated business functionality.

## Forecast Sprint — P2-LOCAL-DEPLOY-01

Candidate TASKs remain:

- TASK-061 — local-process Deploy adapter using PublishedRelease + canonical EnvironmentProfile;
- TASK-062 — local deployment health/acceptance/failure cleanup and operational record;
- TASK-063 — full autonomous local E2E from SystemDefinition through running Runtime.

The first adapter is intentionally local-process/test-oriented. Docker, Vercel, PostgreSQL provisioning and production traffic switching remain follow-up work unless later evidence makes one necessary.

## Integration & Technical Debt Review

After the third construction Sprint:

- run repository-wide regression;
- execute the autonomous local vertical at least twice and compare deterministic artifact identities;
- prove runtime startup/health without Builder availability;
- verify secret values are absent from immutable ReleaseArtifact/PublishedRelease content;
- revalidate Runtime/Builder separation, Environment contract and Deploy boundaries;
- reassess Catalog/Assembly dependency solving and persistence readiness;
- classify new runtime/deploy debt and choose the successor package from integrated evidence.

## Dependency order

`P2-BOUNDARY-01 -> P2-RUNTIME-01 -> P2-LOCAL-DEPLOY-01 -> Integration & Technical Debt Review`

Candidate TASK order:

`TASK-055 -> TASK-056 -> TASK-057 -> TASK-058 -> TASK-059 -> TASK-060 -> TASK-061 -> TASK-062 -> TASK-063`

## Package rules

- Only an explicitly started Sprint becomes COMMITTED.
- Each implementation TASK includes positive, negative/failure and predecessor-integration tests when applicable.
- One distinct commit per TASK inside the Sprint branch.
- Every construction Sprint extends the real integration proof rather than hand-authoring outputs with executable producers.
- L3 shared-contract work requires explicit Sprint authority/review; any L4 discovery stops for ADR.
- `main` remains published truth after merge.
- AgentFactory Supervisor/runtime remains frozen and is not a package gate.
