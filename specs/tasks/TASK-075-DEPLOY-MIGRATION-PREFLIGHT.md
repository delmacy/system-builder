---
id: TASK-075
title: Verify and order migration assets during Deploy preflight
status: ready
priority: 391
milestone: M5
model_tier: cheap
risk: medium
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-074
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P4-PACKAGE-01.md
  - project_docs/execution_planning/P4-MIGRATION-STATE-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/10-deploy/WBS.md
  - packages/artifact-store/index.ts
  - packages/deploy/local-process.ts
  - tests/product/local-process-deploy.test.ts
  - specs/tasks/TASK-074-COMPILER-MIGRATION-ASSETS.md
  - specs/tasks/TASK-075-DEPLOY-MIGRATION-PREFLIGHT.md
allowed_paths:
  - packages/deploy/migration-preflight.ts
  - packages/deploy/local-process.ts
  - tests/product/local-process-deploy.test.ts
  - specs/tasks/TASK-075-DEPLOY-MIGRATION-PREFLIGHT.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/runtime-core/**
  - packages/release/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
max_files: 4
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Extend the actual local Deploy path so verified ArtifactPayload migration evidence is discovered, cross-checked and deterministically ordered before any materialization/runtime activation, without applying migrations or opening database infrastructure.

# Context

TASK-074 makes Compiler-generated migration files part of ReleaseArtifact integrity. ArtifactStore already independently verifies file hashes, manifest coverage and aggregate artifact identity. Deploy must consume only that verified payload, then validate migration-manifest/file consistency before continuing.

# Current behavior

Local process Deploy retrieves an independently verified ArtifactPayload, validates generated paths, resolves runtime secrets, materializes files and activates the Runtime. It does not inspect migration metadata/assets. Existing predecessor artifacts contain no migration manifest or migration files and must remain valid.

# Required change

Add a Deploy-bounded migration preflight parser/validator and invoke it in `runLocalProcessDeployment` immediately after successful verified payload retrieval/path validation and before secret resolution/materialization. Preflight must preserve the predecessor case with no migration manifest/files as an empty result; require exact coverage between migration-manifest entries and `migrations/...` files; compare descriptor contentHash with the verified file; validate metadata shape and deterministic ordering; fail closed with `MIGRATION_PREFLIGHT_INVALID` before activation when malformed. Return successful preflight evidence with the local deployment result. Do not execute migration content.

# Inputs / contracts

Verified ArtifactPayload files from ArtifactStore, TASK-074 migration manifest/assets, ADR-0007, WBS 10.2.1 and current local Deploy lifecycle.

# Outputs / contracts

A bounded Deploy migration-preflight evidence object only. No canonical DeploymentRecord/Release/Environment schema changes.

# Acceptance criteria

- ArtifactPayload verification still occurs before migration preflight;
- no-migration predecessor artifact returns an empty successful preflight;
- migration assets are returned in deterministic order;
- missing manifest/file, unlisted migration file, duplicate metadata or contentHash mismatch fails before materialization/activation;
- malformed preflight diagnostics contain no migration source secret/runtime secret value;
- migration content is never executed in this Sprint;
- existing health/state/secret behavior remains green;
- declared validations pass.

# Non-goals

PostgreSQL connectivity, migration application/idempotency, production rollback/supervision, canonical DeploymentRecord changes or database provisioning.

# Evidence expected

Focused local Deploy tests using actual Compiler + ArtifactStore producer output, including positive ordered preflight, predecessor empty case, malformed verified-reader failure and pre-activation evidence, plus GitHub Deterministic CI.

# Escalation

Stop if preflight requires mutation/application of migration content or any canonical public schema change.
