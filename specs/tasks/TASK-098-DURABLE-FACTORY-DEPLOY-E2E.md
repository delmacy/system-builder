---
id: TASK-098
title: Prove durable Factory reconstruction through existing Deploy
status: completed
priority: 406
milestone: M7
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P6-PACKAGE-01.md
  - project_docs/execution_planning/P6-DURABLE-FACTORY-E2E-01.md
  - packages/catalog/index.ts
  - packages/catalog/postgres.ts
  - packages/assembly/index.ts
  - packages/validation/index.ts
  - packages/compiler/index.ts
  - packages/release/index.ts
  - packages/release/postgres.ts
  - packages/artifact-store/index.ts
  - packages/artifact-store/postgres.ts
  - packages/deploy/index.ts
  - tests/product/catalog-postgres.test.ts
  - tests/product/factory-e2e.test.ts
  - tests/product/release-postgres.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-098-DURABLE-FACTORY-DEPLOY-E2E.md
allowed_paths:
  - tests/product/durable-factory-e2e.test.ts
  - specs/tasks/TASK-098-DURABLE-FACTORY-DEPLOY-E2E.md
forbidden_paths:
  - packages/**
  - apps/**
  - tooling/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Prove in one actual-module path that durable Catalog state can be reconstructed before Assembly/Validation/Compiler, the resulting ReleaseArtifact can be published into durable Release/Artifact providers, those providers can be reconstructed, and the reconstructed PublishedRelease/verified ArtifactPayload can drive the existing Deploy API with unchanged semantics.

# Context

P6 Sprint 1 proved restart-safe Catalog resolution/Assembly. P6 Sprint 2 proved restart-safe PublishedRelease and ArtifactPayload reconstruction from actual Compiler output. This TASK joins those integrated predecessor proofs and extends them through existing Deploy without changing any production source.

# Current behavior

The repository proves the durable boundaries separately and proves the process-local Factory-to-Deploy path separately. It does not yet contain one test that crosses both durable reconstruction boundaries before invoking Deploy.

# Required change

Add focused product evidence using actual `PostgresCatalogRecordStorage`, `SoftwareCatalogRegistry`, `resolveCatalogCandidates`, `assembleSystemDefinition`, `validateTraceability`, `compileSyntheticRelease`, `PostgresReleaseRecordStorage`, `PostgresArtifactPayloadRepository`, and existing Deploy API. Reconstruct Catalog before Assembly and reconstruct Release/Artifact providers before Deploy.

# Inputs / contracts

Current Catalog/Assembly/Validation/Compiler/Release/ArtifactStore/Deploy APIs; `SYSTEM_BUILDER_TEST_POSTGRES_URL`; ADR-0002; ADR-0007; P6 predecessor proofs.

# Outputs / contracts

Test evidence only. No product or contract change.

# Acceptance criteria

- test uses actual PostgreSQL-backed Catalog provider and reconstructs it before resolution/Assembly;
- Assembly, Validation and Compiler use actual module APIs;
- actual Compiler files/artifact are persisted through durable Release and Artifact providers;
- Release and Artifact providers are reconstructed before retrieval/verification;
- `getVerified()` succeeds against the actual Compiler artifact after reconstruction;
- existing Deploy accepts reconstructed PublishedRelease + ReleaseArtifact + external Environment bindings and produces deterministic successful DeploymentRecord;
- repeated construction with equivalent persisted inputs yields equivalent AssemblyPlan, ReleaseArtifact and DeploymentRecord identities where timestamps/inputs are held constant;
- connection strings, credentials and secret values do not appear in Release, ArtifactPayload or DeploymentRecord evidence;
- negative evidence proves artifact mismatch or missing environment binding remains fail-closed through existing Deploy diagnostics;
- no production source is modified;
- declared validations pass.

# Non-goals

Local process Runtime execution, Runtime state redeploy, production database hardening, new Deploy behavior, new contracts or provider redesign.

# Evidence expected

Actual PostgreSQL 17.6 product test spanning durable Catalog reconstruction through existing Deploy, with positive deterministic and negative fail-closed cases.

# Escalation

Stop if the joined proof requires any production-source/public-contract change, CI workflow change, secret persistence or altered Deploy semantics.
