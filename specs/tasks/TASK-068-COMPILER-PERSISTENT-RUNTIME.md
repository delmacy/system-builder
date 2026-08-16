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
  - tests/product/runtime-compiler.test.ts
  - tests/product/runtime-autonomy-e2e.test.ts
  - specs/tasks/TASK-068-COMPILER-PERSISTENT-RUNTIME.md
allowed_paths:
  - packages/compiler/index.ts
  - tests/product/compiler.test.ts
  - tests/product/runtime-compiler.test.ts
  - tests/product/runtime-autonomy-e2e.test.ts
  - specs/tasks/TASK-068-COMPILER-PERSISTENT-RUNTIME.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/runtime-core/**
  - packages/release/**
  - packages/deploy/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
max_files: 5
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Make actual Compiler output emit the persistent Runtime entrypoint defined by TASK-067 while preserving deterministic ReleaseArtifact identity semantics.

# Context

TASK-067 provides a persistent-capable renderer with predecessor-compatible one-shot behavior until Deploy explicitly requests service mode. Revalidation found two predecessor Compiler evidence files that encode the former one-shot implementation: the autonomy E2E assumes synchronous exit, and `runtime-compiler.test.ts` defines self-contained as containing no import at all. Persistent Runtime legitimately imports only the Node builtin `node:http`.

# Current behavior

`compileSyntheticRelease` emits four deterministic generated files and computes ReleaseArtifact identity from canonical metadata plus ordered file hashes. Predecessor tests assume either `spawnSync` one-shot execution or an import-free generated entrypoint.

# Required change

Switch Compiler generation of `runtime-entry.mjs` to the TASK-067 renderer without changing generated-file ordering, manifest, environment schema or aggregate artifact hashing. Update actual-Compiler autonomy evidence to explicitly request port `0`, observe RuntimeStarted, probe HTTP `/health` while alive and terminate cleanly. Update compiler materialization evidence to allow the deterministic Node builtin `node:http` import while continuing to reject external/Builder/Observe dependencies.

# Inputs / contracts

TASK-067 renderer and existing Compiler ReleaseArtifact/hash semantics.

# Outputs / contracts

Actual Compiler ReleaseArtifact containing deterministic persistent-capable Runtime source with unchanged artifact schema and updated predecessor integration evidence.

# Acceptance criteria

- actual Compiler output uses the TASK-067 renderer;
- equivalent inputs preserve byte-identical output and artifact identity;
- generated Runtime imports only the required Node builtin health-server dependency, not application/external packages;
- persistent source has no Builder/Observe dependency;
- actual-Compiler autonomy E2E requests persistent mode, observes health while alive and shuts down cleanly;
- missing required binding fails before listening;
- ReleaseArtifact schema/file list remain unchanged;
- secret values remain absent from immutable and health evidence;
- predecessor Deploy remains compatible until TASK-069 requests persistent mode;
- declared validations pass.

# Non-goals

Public schema changes, new generated files, Deploy process management, SecretResolver/stateful actions or production networking.

# Evidence expected

Compiler materialization/determinism tests and actual-Compiler persistent autonomy E2E plus GitHub Deterministic CI.

# Escalation

Stop if persistence requires a public contract or architecture change.
