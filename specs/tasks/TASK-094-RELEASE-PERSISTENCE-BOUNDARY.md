---
id: TASK-094
title: Establish internal Release persistence boundary
status: completed
priority: 402
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
  - project_docs/execution_planning/P6-DURABLE-RELEASE-ARTIFACT-01.md
  - project_docs/09-release/WBS.md
  - packages/release/index.ts
  - tests/product/release.test.ts
  - specs/tasks/TASK-052-IMMUTABLE-RELEASE-REGISTRY.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-094-RELEASE-PERSISTENCE-BOUNDARY.md
allowed_paths:
  - packages/release/index.ts
  - packages/release/storage.ts
  - tests/product/release.test.ts
  - specs/tasks/TASK-094-RELEASE-PERSISTENCE-BOUNDARY.md
forbidden_paths:
  - packages/artifact-store/**
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
max_files: 4
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Introduce a replaceable persistence/storage boundary inside the Release bounded context so `ReleaseRegistry` no longer requires direct ownership of one process-local Map, while preserving all current public Release behavior and the default in-memory path.

# Context

TASK-052 established the current immutable in-memory ReleaseRegistry behavior. P6-DURABLE-RELEASE-ARTIFACT-01 is authorized to move only the storage ownership behind a Release-owned seam while preserving the existing PublishedRelease shape, identity, lifecycle, provenance and diagnostics under WBS 09 and ADR-0007.

# Current behavior

`ReleaseRegistry` owns a private Map keyed by release identity. It publishes immutable `PublishedRelease` records, rejects duplicate identities, retrieves equivalent snapshots and persists lifecycle transitions only for the lifetime of the process.

# Required change

Factor an internal Release-owned storage abstraction for PublishedRelease records and wire `ReleaseRegistry` through it. Keep a default in-memory implementation with behavior equivalent to the predecessor.

Do not add PostgreSQL in this TASK and do not redefine Release identity, lifecycle or public data shapes.

# Inputs / contracts

Current `PublishedRelease`, `PublishedReleaseStatus`, ReleaseArtifact input, duplicate behavior, retrieval snapshots, `published -> deprecated -> archived` lifecycle, WBS 09 and ADR-0007.

# Outputs / contracts

Release-internal persistence seam plus default in-memory implementation. No ArtifactStore, Compiler, Deploy, Runtime or canonical-contract change.

# Acceptance criteria

- ReleaseRegistry storage ownership is behind a replaceable Release-internal boundary;
- default constructor/call shapes remain compatible;
- publication output remains structurally equivalent and frozen;
- release identity and `RELEASE_DUPLICATE_IDENTITY:<releaseId@version>` behavior remain unchanged;
- `get()` behavior remains equivalent;
- lifecycle transitions and invalid-transition/not-found diagnostics remain unchanged;
- artifact hash and validation evidence provenance remain unchanged;
- no secret/environment value is introduced;
- no PostgreSQL/dependency/downstream change is introduced;
- declared validations pass.

# Non-goals

PostgreSQL persistence, artifact payload persistence, richer release lifecycle, promotion channels, production registry APIs, Deploy/Runtime changes or canonical contract extraction.

# Evidence expected

Existing Release tests plus focused replaceable in-memory storage tests covering publish/get/duplicate/lifecycle equivalence and repository-wide verification.

# Escalation

Stop if preserving current behavior requires changing public PublishedRelease shapes, lifecycle policy, canonical contracts, ArtifactStore/Compiler/Deploy/Runtime source, package dependencies or an L4 boundary.
