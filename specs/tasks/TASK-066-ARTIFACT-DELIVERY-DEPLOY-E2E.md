---
id: TASK-066
title: Integrate verified artifact retrieval into local Deploy E2E
status: completed
priority: 382
milestone: M4
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-065
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P3-PACKAGE-01.md
  - project_docs/execution_planning/P3-ARTIFACT-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - project_docs/09-release/WBS.md
  - project_docs/10-deploy/WBS.md
  - packages/artifact-store/index.ts
  - packages/compiler/index.ts
  - packages/release/index.ts
  - packages/deploy/local-process.ts
  - packages/deploy/local-deployment.ts
  - tests/product/local-process-deploy.test.ts
  - tests/product/local-deployment.test.ts
  - tests/product/full-autonomous-local-e2e.test.ts
  - specs/tasks/TASK-066-ARTIFACT-DELIVERY-DEPLOY-E2E.md
allowed_paths:
  - packages/deploy/local-process.ts
  - packages/deploy/local-deployment.ts
  - tests/product/local-process-deploy.test.ts
  - tests/product/local-deployment.test.ts
  - tests/product/full-autonomous-local-e2e.test.ts
  - specs/tasks/TASK-066-ARTIFACT-DELIVERY-DEPLOY-E2E.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/release/**
  - packages/runtime-core/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
max_files: 6
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Replace direct Compiler `generatedFiles` input at local Deploy with retrieval of a previously published, independently verified artifact payload and extend the existing full autonomous local E2E through that boundary.

# Context

P2 proved the full local vertical through actual Compiler, Release and Deploy APIs, but the Deploy adapter still accepts the Compiler file bundle directly. TASK-064 introduces the provider-neutral payload boundary and TASK-065 makes retrieval independently verifiable before activation.

# Current behavior

`runLocalProcessDeployment` and `executeLocalDeployment` accept a raw `generatedFiles` array from the caller, validate only release/runtime/path preflight, materialize those files directly and then start Node.

# Required change

Update local Deploy APIs to consume an artifact payload reader rather than caller-supplied generated files. Before creating a temporary directory or starting Node, retrieve by PublishedRelease/ReleaseArtifact identity and require TASK-065 verified payload success. Preserve existing release/environment compatibility checks, runtime execution, cleanup and DeploymentRecord behavior.

Update existing local Deploy and full autonomous E2E tests so actual Compiler output is first published through the artifact repository, then Release is published, then Deploy retrieves/verifies/materializes it. Add corruption evidence proving a substituted payload is rejected before activation.

# Inputs / contracts

TASK-065 verified artifact reader semantics, actual Compiler output, PublishedRelease/ReleaseArtifact, EnvironmentProfile, ADR-0002 and ADR-0007.

# Outputs / contracts

Local Deploy activation path sourced only from independently verified artifact payload retrieval, plus extended integrated E2E evidence.

# Acceptance criteria

- actual Compiler output flows through artifact publication/retrieval before local materialization;
- local Deploy no longer accepts raw `generatedFiles` as its activation source;
- verified valid payload starts the actual generated Runtime and preserves current health/DeploymentRecord behavior;
- corrupted/substituted payload is rejected before runtime activation/materialization;
- full autonomous local E2E uses actual Catalog/Assembly/Validation/Compiler/Release/artifact/Deploy producers;
- Builder/Observe independence and secret-separation evidence remain intact;
- no Release/Environment/Deployment contract or architecture change is introduced;
- declared validations and final Sprint verification pass.

# Non-goals

Persistent Runtime, HTTP health, SecretResolver, production storage/adapters, database provisioning, traffic switching, Catalog/Assembly solving or public schema changes.

# Evidence expected

Focused local Deploy tests and the full autonomous local E2E using actual artifact publication/retrieval, including pre-activation corruption rejection, plus GitHub Deterministic CI.

# Escalation

Stop if integration requires modifying ReleaseArtifact/PublishedRelease/EnvironmentProfile public schemas, accepted ADR boundaries, artifact-store implementation from TASK-065, or any forbidden path.

# Result

Local Deploy now consumes a verified artifact payload reader instead of caller-supplied generated files. Actual Compiler output is published before Release/Deploy activation, corruption is rejected before materialization, and the full autonomous local vertical crosses the new artifact boundary while retaining Builder/Observe independence and secret-separation evidence.
