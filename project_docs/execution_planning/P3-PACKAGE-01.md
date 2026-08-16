# P3-PACKAGE-01 — Artifact Delivery and Persistent Runtime

Status: READY_FOR_PACKAGE_REVIEW
Base: `82841fba853a1b68602ba0c28dc2d0ddfbf9f8b1` (PR #161 merged)

## Package Goal

Harden the post-Compiler artifact delivery path and evolve the bounded one-shot autonomous Runtime into a persistent, externally configured client service without weakening Builder/Runtime or Release/Environment/Deployment separation.

Target package proof:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile -> secret references resolved externally -> local Deploy -> persistent autonomous Runtime -> HTTP health -> bounded stateful runtime action -> DeploymentRecord`

## Derivation authority

This package is derived from the merged `P2-PACKAGE-01` Integration & Technical Debt Review and the canonical WBS.

Highest-priority inputs:

- TD-P2-01 artifact payload retrieval/materialization boundary;
- TD-P2-02 independent generated payload integrity verification;
- TD-P2-03 persistent Runtime lifecycle/health surface;
- TD-P2-04 external secret-resolution boundary;
- WBS 9.3 distribution, 10.1 environment resolution and 13.1/13.3 autonomous Runtime operation.

TD-P2-05 Catalog/Assembly dependency solving remains high priority but is not pulled into this package unless a committed Sprint proves it necessary for the bounded runtime proof.

## Forecast construction Sprints

### 1. P3-ARTIFACT-01 — Verified Artifact Payload Boundary

Goal: replace direct in-memory Compiler `generatedFiles` handoff at Deploy with a provider-neutral artifact payload publication/retrieval boundary that independently verifies content integrity before activation.

Candidate TASKs:

- TASK-064 — define bounded artifact payload repository/retrieval contract and reference implementation;
- TASK-065 — verify per-file hashes and aggregate ReleaseArtifact identity on retrieval/materialization;
- TASK-066 — integrate Release -> artifact publication/retrieval -> local Deploy using actual Compiler output.

Expected exit proof:

`ReleaseArtifact -> PublishedRelease -> artifact publication -> retrieval -> integrity verification -> Deploy materialization`

Authority notes: likely L3 shared contract work; committed Sprint must explicitly authorize it. Any change to Release/Environment/Deployment architecture is L4 and requires ADR.

### 2. P3-RUNTIME-SERVICE-01 — Persistent Autonomous Runtime

Goal: evolve Compiler output from one-shot health bootstrap into a persistent autonomous process with a real health surface while remaining independent of Builder/Observe availability.

Candidate TASKs:

- TASK-067 — persistent runtime lifecycle boundary in `runtime-core`;
- TASK-068 — Compiler emits persistent Runtime entrypoint with HTTP health endpoint;
- TASK-069 — Deploy starts, observes and terminates the persistent generated Runtime with positive/failure/autonomy evidence.

Expected exit proof:

`verified ArtifactPayload + EnvironmentProfile -> Deploy -> persistent generated Runtime -> HTTP health UP -> controlled shutdown/failure evidence`

### 3. P3-SECRET-STATE-01 — External Secret Resolution and First Stateful Runtime Slice

Goal: define replaceable secret resolution outside immutable release content and prove the first small stateful Runtime behavior without introducing production infrastructure adapters.

Candidate TASKs:

- TASK-070 — define secret resolver boundary and explicit non-persistence/leakage rules;
- TASK-071 — bind resolved runtime-only values to one bounded stateful Runtime capability;
- TASK-072 — extend the full autonomous E2E through verified artifact retrieval, persistent health and the bounded stateful action while proving resolved secrets remain absent from immutable/evidence content.

Expected exit proof:

`PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret refs -> external SecretResolver -> persistent Runtime -> bounded stateful action -> DeploymentRecord`, with no resolved secret in immutable ReleaseArtifact/PublishedRelease/DeploymentRecord evidence.

Authority notes: secret resolver/public runtime binding is likely L3; production database provisioning, migrations, auth and broad business behavior remain non-goals.

## Growing E2E proof

The package must preserve the existing integrated chain and extend it incrementally. Tests must invoke actual executable producers where they exist and must not hand-author downstream artifacts.

Required package-level evidence by the end of the third Sprint:

1. artifact payload retrieved through a provider-neutral boundary;
2. corrupted/substituted payload rejected before runtime activation;
3. generated Runtime remains running and exposes health independently of Builder/Observe;
4. controlled runtime failure produces failure evidence rather than false success;
5. symbolic secret references remain durable while resolved values are runtime-only;
6. at least one bounded stateful runtime action succeeds through the generated persistent Runtime;
7. deterministic identities remain stable where contract semantics require determinism.

## Explicit non-goals

- Docker/Vercel/on-prem production deployment adapters;
- PostgreSQL provisioning/migration orchestration;
- production traffic switching, upgrade or rollback implementation;
- broad generated entities/workflows/auth/UI behavior;
- Observe/Support implementation;
- production-grade Catalog/Assembly dependency graph solving unless required by an explicit successor gate;
- replacing the accepted Builder/Runtime or Release/Environment/Deployment architecture.

## Dependency order

`P2 package review merged -> P3-ARTIFACT-01 -> P3-RUNTIME-SERVICE-01 -> P3-SECRET-STATE-01 -> Integration & Technical Debt Review`

Candidate TASK order:

`TASK-064 -> TASK-065 -> TASK-066 -> TASK-067 -> TASK-068 -> TASK-069 -> TASK-070 -> TASK-071 -> TASK-072`

## Package rules

- this document is rolling-wave forecast, not construction authorization;
- only the first Sprint may become committed after this package is reviewed/merged and repository state is re-read;
- candidate TASKs must be materialized/revalidated when their Sprint becomes committed;
- every implementation TASK must declare positive, negative/failure and predecessor-integration evidence where applicable;
- one distinct commit per committed TASK inside its Sprint branch;
- every construction Sprint extends the real integrated proof;
- L3 shared-contract work requires explicit Sprint authority/review;
- L4 discoveries stop for ADR;
- `npm run verify` remains the default final repository validation unless a Sprint declares stricter validation;
- AgentFactory remains frozen/non-blocking unless repository authority reactivates it.

## Review gate

Stop after this package plan is committed, CI-validated and opened for review. Do not create or execute `P3-ARTIFACT-01` until the package plan is merged and a new execution instruction is received.
