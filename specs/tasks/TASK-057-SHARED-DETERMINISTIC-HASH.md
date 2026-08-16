---
id: TASK-057
title: Consolidate deterministic canonicalization and hashing
status: completed
priority: 330
milestone: M3
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-056
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P2-PACKAGE-01.md
  - project_docs/execution_planning/P2-BOUNDARY-01.md
  - project_docs/execution_planning/P1-PACKAGE-01.integration-debt-review.md
  - packages/assembly/index.ts
  - packages/validation/index.ts
  - packages/compiler/index.ts
  - packages/deploy/index.ts
  - tests/product/full-vertical-e2e.test.ts
  - specs/tasks/TASK-057-SHARED-DETERMINISTIC-HASH.md
allowed_paths:
  - packages/deterministic/**
  - packages/assembly/index.ts
  - packages/validation/index.ts
  - packages/compiler/index.ts
  - packages/deploy/index.ts
  - tests/product/deterministic.test.ts
  - tsconfig.json
  - specs/tasks/TASK-057-SHARED-DETERMINISTIC-HASH.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/catalog/**
  - packages/release/**
  - tooling/agent-harness/**
max_files: 8
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Replace duplicated stable-object canonicalization/SHA-256 helpers in Assembly, Validation, Compiler and Deploy with one small deterministic utility while preserving the identity semantics proven by P1.

# Authority

The committed Sprint authority covers the original bounded refactor. An explicit human scope authorization additionally permits the minimum `tsconfig.json` path mapping required by the repository architecture gate so the new shared package is consumed through `@system-builder/deterministic`. No other scope expansion is authorized.

# Context

P1 TD-P1-02 found the same canonical sort/stringify/hash logic copied across bounded modules. Divergent future fixes could make artifact identities incompatible. The shared utility must remain infrastructure-level and must not couple one bounded context to another.

# Current behavior

Assembly, Validation, Compiler and Deploy each recursively sort object keys, preserve array order, stringify canonically and create `sha256:<hex>` identifiers with local helpers. Compiler also hashes generated text directly.

# Required change

Create `packages/deterministic/` with focused canonical JSON and SHA-256 helpers, regression vectors and stable exported functions. Refactor the four modules to use the utility without changing their public APIs or intended hashes. Keep direct text hashing available for generated-file content where canonical object conversion is not appropriate. Configure only the minimum public package resolution needed for `@system-builder/deterministic`.

# Inputs / contracts

Current deterministic module implementations and existing P1 full-vertical repeatability proof.

# Outputs / contracts

Internal shared deterministic utility only; no public domain contract changes.

# Acceptance criteria

- shared canonicalization/hash utility has explicit regression vectors including nested objects/arrays;
- Assembly, Validation, Compiler and Deploy remove their duplicate canonical-object/hash implementations and import the shared utility;
- Compiler generated text hashing remains byte/text based;
- module public APIs and canonical contract shapes do not change;
- `@system-builder/deterministic` resolves through the minimum repository TypeScript mapping and satisfies the public-package architecture gate;
- existing product tests, including repeated full-vertical identity checks, remain green;
- repository-wide verification passes.

# Non-goals

Changing artifact identity algorithms, semantic ordering rules of domain lists, introducing a new serialization standard, changing contracts, or solving Catalog dependencies.

# Evidence expected

Deterministic regression test, unchanged integration behavior and GitHub Deterministic CI.

# Escalation

Stop if consolidation would intentionally change published artifact identity semantics or requires a public-contract/architecture change beyond the explicitly authorized public-resolution mapping.
