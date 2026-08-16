# P2-PACKAGE-01 — First Autonomous Local Runtime

Status: PROPOSED / READY_FOR_REVIEW

## Package Goal

Move from the deterministic dry-run factory chain proven by P1 into the first locally runnable autonomous client-system slice, while hardening the public boundaries that the runtime/deploy path will depend on.

Target package proof:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> runnable ReleaseArtifact -> PublishedRelease -> canonical EnvironmentProfile -> local DeploymentRecord -> autonomous Runtime health`

The Runtime must start and operate for the bounded proof without calling System Builder during ordinary operation.

## Authority and source

This package is derived from the merged P1-PACKAGE-01 Integration & Technical Debt Review and the existing WBS/ADRs.

Primary review drivers:

- TD-P1-01 — executable outputs lack canonical JSON-schema conformance tests;
- TD-P1-06 — EnvironmentProfile is not yet a canonical shared contract;
- TD-P1-02 — canonicalization/hash logic is duplicated;
- planned gap — Compiler emits a synthetic artifact rather than a runnable autonomous client system;
- planned gap — Deploy is dry-run only and no autonomous Runtime has been started from ReleaseArtifact.

P1 also records Catalog/Assembly dependency solving as HIGH before production-grade component graphs. This remains backlog/forecast debt unless required by the bounded runtime slice; it must not silently expand an active Sprint.

## Baseline

- P1-PACKAGE-01 construction and Integration & Technical Debt Review are merged to `main`.
- Executable chain is available through deterministic DeploymentRecord dry-run.
- ADR-0002 requires Builder/Runtime separation and runtime autonomy.
- Compiler WBS requires server/client/runtime builds, environment schema without secrets, hashes and reproducibility.
- Deploy WBS requires Environment modeling, compatibility checks, deployment, health/acceptance evidence and DeploymentRecord.
- Autonomous Runtime WBS requires external configuration and proof of startup/operation with Builder unavailable.

## Sprint sequence

### P2-BOUNDARY-01 — Executable Boundary Hardening

Status: FORECAST until explicitly committed.

Candidate TASKs:

- TASK-055 — canonical schema-conformance harness for executable factory outputs;
- TASK-056 — canonical EnvironmentProfile / environment-binding contract;
- TASK-057 — shared deterministic canonicalization/hash utility with regression vectors.

Exit proof:

Actual outputs emitted by Assembly, Validation, Compiler, Release and Deploy validate against canonical public contracts; Deploy consumes a canonical EnvironmentProfile boundary; deterministic identities remain reproducible after shared canonicalization.

Growing proof:

Retain the P1 full-vertical regression and add contract-conformance assertions around its emitted artifacts.

### P2-RUNTIME-01 — Runnable Artifact and Autonomous Runtime Bootstrap

Status: FORECAST. Revalidate only after P2-BOUNDARY-01 merges.

Candidate TASKs:

- TASK-058 — minimal autonomous Runtime bootstrap/package boundary;
- TASK-059 — Compiler materializes a runnable Node runtime package inside ReleaseArtifact;
- TASK-060 — external configuration + autonomous startup/health proof with Builder unavailable.

Exit proof:

The Compiler creates a reproducible runnable runtime package, and the generated runtime can start from ReleaseArtifact plus external environment/configuration without requiring System Builder connectivity.

Growing proof:

`... -> ReleaseArtifact -> runtime materialization -> autonomous process startup -> health PASS`

This Sprint does not claim full generated business functionality; it proves the runtime-bearing artifact, configuration boundary and autonomy invariant first.

### P2-LOCAL-DEPLOY-01 — Local Deployment Adapter and Runtime E2E

Status: FORECAST. Revalidate only after P2-RUNTIME-01 merges.

Candidate TASKs:

- TASK-061 — local-process Deploy adapter using PublishedRelease + canonical EnvironmentProfile;
- TASK-062 — local deployment health/acceptance/failure cleanup and operational record;
- TASK-063 — full autonomous local E2E from SystemDefinition through running Runtime.

Exit proof:

A synthetic client system is compiled, published, deployed to a local process, receives external configuration/secret references outside immutable release content, passes health/acceptance checks, emits DeploymentRecord, and remains runnable for the proof with Builder unavailable.

Growing proof:

`SystemDefinition -> Catalog -> Assembly -> Validation -> Compiler -> Release -> Environment binding -> local Deploy -> autonomous Runtime`

The first adapter is intentionally local-process/test-oriented. Docker, Vercel, PostgreSQL provisioning and production traffic switching remain separate follow-up work unless later Sprint evidence makes one necessary.

## Integration & Technical Debt Review

After the third construction Sprint:

- run repository-wide regression;
- execute the autonomous local vertical at least twice and compare deterministic artifact identities;
- prove runtime startup/health without Builder availability;
- verify secret values are absent from immutable ReleaseArtifact/PublishedRelease content;
- revalidate Runtime/Builder separation, Environment contract and Deploy boundaries;
- reassess TD-P1-03 Catalog/Assembly dependency solving and persistence readiness;
- classify new runtime/deploy debt and choose the successor package from integrated evidence.

## Dependency order

`P2-BOUNDARY-01 -> P2-RUNTIME-01 -> P2-LOCAL-DEPLOY-01 -> Integration & Technical Debt Review`

Candidate TASK order:

`TASK-055 -> TASK-056 -> TASK-057 -> TASK-058 -> TASK-059 -> TASK-060 -> TASK-061 -> TASK-062 -> TASK-063`

Before each Sprint becomes COMMITTED, re-read the repository, inspect predecessor outputs, revalidate TASK readiness/paths/contracts, and freeze that Sprint manifest.

## Package rules

- Package planning is rolling-wave; only an explicitly started Sprint becomes COMMITTED.
- Each implementation TASK must include positive, negative/failure and predecessor-integration tests when applicable.
- One distinct commit per TASK inside the Sprint branch.
- Every construction Sprint extends the real integration proof rather than hand-authoring outputs that already have executable producers.
- L3 shared-contract work requires explicit Sprint authority/review; any L4 discovery stops for ADR rather than silently changing architecture.
- `main` remains published truth after merge.
- AgentFactory Supervisor/runtime remains frozen and is not a package gate.
