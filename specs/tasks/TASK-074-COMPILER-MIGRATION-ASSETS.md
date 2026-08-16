---
id: TASK-074
title: Materialize deterministic migration assets in Compiler output
status: ready
priority: 390
milestone: M5
model_tier: cheap
risk: medium
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-073
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P4-PACKAGE-01.md
  - project_docs/execution_planning/P4-MIGRATION-STATE-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/08-compiler/WBS.md
  - project_docs/10-deploy/WBS.md
  - packages/runtime-core/state-migrations.ts
  - packages/compiler/index.ts
  - tests/product/compiler.test.ts
  - specs/tasks/TASK-073-RUNTIME-STATE-MIGRATION-CONTRACT.md
  - specs/tasks/TASK-074-COMPILER-MIGRATION-ASSETS.md
allowed_paths:
  - packages/compiler/index.ts
  - tests/product/compiler.test.ts
  - specs/tasks/TASK-074-COMPILER-MIGRATION-ASSETS.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/release/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Make actual Compiler output carry deterministic migration assets and migration/state metadata for bounded Runtime state requirements defined by TASK-073.

# Context

Compiler currently emits assembly/environment/runtime files only. ReleaseArtifact integrity already covers all generated files, so migration files should enter that existing file-hash/aggregate-hash path rather than expanding the canonical artifact schema.

# Current behavior

`compileSyntheticRelease` emits only assembly-plan, environment-schema, runtime-entry and runtime-manifest files. It has no state requirement input, no migration manifest/source assets and no validation that a state connection binding is represented as a required `secret-reference` environment requirement.

# Required change

Allow `compileSyntheticRelease` to accept optional `stateRequirements`. Normalize them through the TASK-073 contract. For each migration emit its declared `migrations/...` source file plus a canonical `migration-manifest.json` containing capability/store/binding metadata and migration id/order/path/contentHash, never source secret values or EnvironmentProfile references. Require each state connection binding to be present in the Compiler environment schema as a required `secret-reference`. Reject generated path collisions. Preserve no-state predecessor output unchanged.

# Inputs / contracts

TASK-073 Runtime state metadata, current Compiler/ReleaseArtifact generation and ADR-0007 secret separation.

# Outputs / contracts

Generated migration assets covered by existing ReleaseArtifact manifest/file hashes/aggregate artifact identity. No ReleaseArtifact schema expansion.

# Acceptance criteria

- no-state compilation remains byte/identity compatible with predecessor behavior;
- equivalent reordered state/migration inputs generate identical output;
- migration SQL/source files appear in ReleaseArtifact manifest and are hashed;
- `migration-manifest.json` is deterministic and includes only symbolic binding name/kind plus hashes/metadata;
- missing/non-required/non-secret-reference connection binding fails closed;
- duplicate generated paths fail closed;
- migration content participates in artifact identity;
- resolved secret/reference values are not introduced;
- declared validations pass.

# Non-goals

Migration execution, PostgreSQL adapter, canonical Release schema changes, general capability materialization or dependency solving.

# Evidence expected

Compiler product tests for deterministic generation, predecessor compatibility, environment-binding failure and migration-content identity changes, plus GitHub Deterministic CI.

# Escalation

Stop if deterministic migration delivery requires changing canonical ReleaseArtifact/EnvironmentProfile contracts.
