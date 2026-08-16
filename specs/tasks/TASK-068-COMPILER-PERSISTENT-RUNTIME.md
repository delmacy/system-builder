---
id: TASK-068
title: Compile persistent autonomous Runtime entrypoint
status: ready
priority: 384
milestone: M4
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-067
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P3-PACKAGE-01.md
  - project_docs/execution_planning/P3-RUNTIME-SERVICE-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - project_docs/08-compiler/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/runtime-core/index.ts
  - packages/compiler/index.ts
  - tests/product/compiler.test.ts
  - specs/tasks/TASK-068-COMPILER-PERSISTENT-RUNTIME.md
allowed_paths:
  - packages/compiler/index.ts
  - tests/product/compiler.test.ts
  - specs/tasks/TASK-068-COMPILER-PERSISTENT-RUNTIME.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/runtime-core/**
  - packages/release/**
  - packages/deploy/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Make actual Compiler output emit the persistent Runtime entrypoint defined by TASK-067 while preserving deterministic ReleaseArtifact identity semantics.

# Context

Compiler currently renders `runtime-entry.mjs` through the one-shot runtime-core renderer and includes that file hash in the aggregate ReleaseArtifact identity. TASK-067 adds the persistent renderer without changing Compiler semantics.

# Current behavior

`compileSyntheticRelease` emits four deterministic generated files, including a one-shot `runtime-entry.mjs`, and computes the ReleaseArtifact hash from canonical metadata plus ordered file hashes.

# Required change

Switch Compiler generation of `runtime-entry.mjs` to the TASK-067 persistent renderer. Keep generated-file ordering, content hashing, manifest semantics, environment schema handling and aggregate artifact hashing unchanged. Extend Compiler tests to prove deterministic output contains the persistent health/lifecycle surface and remains free of embedded secret values.

# Inputs / contracts

TASK-067 persistent renderer and existing Compiler ReleaseArtifact/hash semantics.

# Outputs / contracts

Actual Compiler ReleaseArtifact containing a deterministic persistent `runtime-entry.mjs` with unchanged artifact schema.

# Acceptance criteria

- actual Compiler output uses the persistent renderer;
- equivalent input order produces byte-identical generated files and artifact identity;
- runtime entrypoint includes HTTP health/lifecycle behavior and does not include Builder/Observe hard dependency;
- ReleaseArtifact schema and file list remain unchanged;
- secret values remain absent from generated immutable content;
- existing validation/failure behavior remains intact;
- declared validations pass.

# Non-goals

Changing ReleaseArtifact schema, adding new generated files, Deploy process management, SecretResolver/stateful actions or production networking configuration.

# Evidence expected

Compiler product tests on actual generated Runtime source and deterministic ReleaseArtifact identity, plus GitHub Deterministic CI.

# Escalation

Stop if persistence requires changing ReleaseArtifact/public contracts, artifact-store semantics or accepted architecture.
