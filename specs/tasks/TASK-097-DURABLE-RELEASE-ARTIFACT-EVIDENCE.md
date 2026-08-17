---
id: TASK-097
title: Prove restart-safe durable Release and Artifact integration
status: completed
priority: 405
milestone: M7
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-096
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P6-PACKAGE-01.md
  - project_docs/execution_planning/P6-DURABLE-RELEASE-ARTIFACT-01.md
  - project_docs/09-release/WBS.md
  - packages/release/index.ts
  - packages/release/storage.ts
  - packages/release/postgres.ts
  - packages/artifact-store/index.ts
  - packages/artifact-store/postgres.ts
  - packages/compiler/index.ts
  - tests/product/release-postgres.test.ts
  - tests/product/artifact-store-postgres.test.ts
  - tests/product/factory-e2e.test.ts
  - specs/tasks/TASK-051-FACTORY-RELEASE-ARTIFACT-E2E.md
  - specs/tasks/TASK-052-IMMUTABLE-RELEASE-REGISTRY.md
  - specs/tasks/TASK-066-ARTIFACT-DELIVERY-DEPLOY-E2E.md
  - specs/tasks/TASK-094-RELEASE-PERSISTENCE-BOUNDARY.md
  - specs/tasks/TASK-095-POSTGRES-RELEASE-PROVIDER.md
  - specs/tasks/TASK-096-POSTGRES-ARTIFACT-PAYLOAD-REPOSITORY.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-097-DURABLE-RELEASE-ARTIFACT-EVIDENCE.md
allowed_paths:
  - packages/release/storage.ts
  - packages/release/postgres.ts
  - packages/artifact-store/postgres.ts
  - tests/product/release-postgres.test.ts
  - tests/product/artifact-store-postgres.test.ts
  - tests/product/factory-e2e.test.ts
  - specs/tasks/TASK-097-DURABLE-RELEASE-ARTIFACT-EVIDENCE.md
forbidden_paths:
  - packages/release/index.ts
  - packages/artifact-store/index.ts
  - packages/compiler/**
  - packages/deploy/**
  - packages/runtime-core/**
  - packages/catalog/**
  - packages/assembly/**
  - packages/contracts/**
  - apps/**
  - tooling/agent-harness/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 7
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Close P6-DURABLE-RELEASE-ARTIFACT-01 with integrated evidence that actual deterministic Compiler output can be published through durable PublishedRelease and ArtifactPayload providers, both providers can be reconstructed against the same PostgreSQL database, and unchanged Release/ArtifactStore semantics still retrieve and verify the same artifact identity.

# Context

TASK-094 introduces the Release persistence seam, TASK-095 makes PublishedRelease durable and TASK-096 provides a durable implementation of the existing ArtifactPayloadRepository contract. The remaining Sprint proof must show those two durable boundaries cooperate without creating a parallel Release or integrity path and without reaching into Deploy/Runtime scope reserved for the forecast successor.

# Current behavior

After TASK-096, Release and Artifact payloads can each survive provider reconstruction independently. The Sprint still needs a combined proof using actual Compiler output, persisted release metadata and persisted artifact files, followed by provider/process-style reconstruction and current verification behavior.

# Required change

Extend product evidence to compile a deterministic ReleaseArtifact through the existing Compiler API, publish its files through the durable ArtifactPayloadRepository, publish corresponding metadata through the durable ReleaseRegistry storage, reconstruct both providers, retrieve the PublishedRelease and call the existing ArtifactPayloadRepository verification path against the actual Compiler artifact.

Production corrections are allowed only inside the already-authorized internal Release/Artifact provider files when necessary to satisfy TASK-094..096 semantics. Public Release, ArtifactStore and Compiler source are forbidden.

# Inputs / contracts

TASK-094/095 durable Release boundary/provider; TASK-096 durable ArtifactPayloadRepository; current ReleaseRegistry publish/get/transition behavior; current ArtifactPayloadRepository publish/get/getVerified behavior; actual deterministic Compiler ReleaseArtifact output; ADR-0007 Release/Environment separation.

# Outputs / contracts

Restart-safe evidence for `Compiler ReleaseArtifact -> durable PublishedRelease + ArtifactPayload -> provider reconstruction -> equivalent PublishedRelease retrieval/lifecycle -> verified ArtifactPayload retrieval`, without Deploy/Runtime activation or public contract changes.

# Acceptance criteria

- actual Compiler output supplies artifact identity/files used by the integrated durable proof;
- PublishedRelease metadata and ArtifactPayload files are persisted before provider reconstruction;
- both providers are reconstructed from the same PostgreSQL service rather than reusing original process-local instances;
- reconstructed PublishedRelease metadata is equivalent to the originally published immutable release record;
- reconstructed lifecycle state can advance only through the existing valid transitions and persists when reloaded;
- reconstructed ArtifactPayload returns the same deterministic file set and `getVerified()` succeeds against the actual Compiler artifact;
- duplicate/conflicting publication remains fail-closed after reconstruction;
- missing/tampered artifact evidence still fails explicitly through existing semantics;
- connection strings, credentials, secret values and environment values do not enter PublishedRelease, ArtifactPayload or verification evidence;
- no Deploy or Runtime activation is added; that broader restart-safe Factory-to-Deploy proof remains successor scope;
- no `packages/release/index.ts`, `packages/artifact-store/index.ts`, Compiler, Deploy, Runtime, Catalog, Assembly or canonical contract source is changed;
- declared validations pass.

# Non-goals

Complete durable Factory-to-Deploy E2E, production release promotion APIs, production database transport hardening, object storage, secret resolution, Runtime breadth or deployment supervision.

# Evidence expected

Focused combined PostgreSQL integration evidence using actual Compiler output plus repository-wide verification proving all predecessor Catalog/Assembly/Compiler/Release/Artifact/Deploy/Runtime regressions remain green.

# Escalation

Stop if combined durability requires changing public Release/ArtifactStore semantics, Compiler/Deploy/Runtime source, canonical contracts, secret persistence, CI workflow configuration or an L4 boundary.
