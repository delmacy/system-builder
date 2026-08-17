---
id: TASK-091
title: Establish internal Software Catalog persistence boundary
status: ready
priority: 399
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
  - project_docs/execution_planning/P6-DURABLE-CATALOG-01.md
  - project_docs/05-catalog/WBS.md
  - packages/catalog/index.ts
  - tests/product/catalog-registry.test.ts
  - tests/product/catalog-resolution.test.ts
  - specs/tasks/TASK-046-SOFTWARE-CATALOG-REGISTRY.md
  - specs/tasks/TASK-047-CATALOG-RESOLUTION.md
  - specs/tasks/TASK-082-CATALOG-DEPENDENCY-REQUIREMENTS.md
  - specs/tasks/TASK-083-CATALOG-VERSION-CONSTRAINTS.md
  - specs/tasks/TASK-084-CATALOG-CONSTRAINT-EVIDENCE.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-091-CATALOG-PERSISTENCE-BOUNDARY.md
allowed_paths:
  - packages/catalog/index.ts
  - packages/catalog/storage.ts
  - tests/product/catalog-registry.test.ts
  - tests/product/catalog-resolution.test.ts
  - specs/tasks/TASK-091-CATALOG-PERSISTENCE-BOUNDARY.md
forbidden_paths:
  - packages/assembly/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/deploy/**
  - packages/runtime-core/**
  - apps/**
  - tooling/agent-harness/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 5
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Introduce a replaceable persistence/storage boundary inside the Software Catalog bounded context so current registry semantics no longer require direct ownership of one process-local Map, while preserving the complete existing public behavior and keeping the default in-memory path compatible.

# Context

P5 made Catalog resolution and Assembly composition deterministic enough that process-local Catalog persistence is now a high-leverage limitation. The current `SoftwareCatalogRegistry` owns its Map directly, normalizes input on registration, rejects duplicate exact identities, returns deterministic snapshots and feeds `resolveCatalogCandidates`.

This TASK creates only the internal seam required by the P6 durable provider. It must not implement PostgreSQL yet and must not redesign Catalog policy.

# Current behavior

`SoftwareCatalogRegistry` stores normalized `SoftwareCatalogRecord` values in a private in-memory Map keyed by `catalogIdentity`. Registration, duplicate rejection, deterministic listing and resolution all depend on that process-local storage.

# Required change

Factor a Catalog-internal storage/repository abstraction that can back the existing registry semantics without exposing provider-specific concerns to Catalog consumers. Preserve the current in-memory behavior as the default/reference predecessor path.

The public call shapes and observable semantics used by existing Catalog and Assembly consumers must remain unchanged. Any additive internal types/functions must remain owned by the Catalog package and must not become a canonical cross-context contract.

# Inputs / contracts

Current `SoftwareCatalogRecord` normalization/identity semantics, `SoftwareCatalogRegistry`, `resolveCatalogCandidates`, P5 structured dependency requirements, exact/minimum version constraints, compatibility filtering, deterministic ordering and WBS 05 provider-neutral Catalog authority.

# Outputs / contracts

Catalog-internal persistence seam plus an in-memory implementation/wiring that preserves current public Catalog behavior exactly. No Assembly, canonical contract, PostgreSQL or downstream module change.

# Acceptance criteria

- registry storage ownership is behind a replaceable Catalog-internal boundary rather than hard-coded direct Map access;
- default in-memory registration/list behavior remains byte/structure-equivalent for accepted records;
- capability/provider/version normalization and current `catalogIdentity` behavior remain unchanged;
- duplicate identity registration produces the same existing `CATALOG_DUPLICATE_IDENTITY:<identity>` behavior;
- deterministic `list()` order and frozen/snapshot behavior remain unchanged;
- `resolveCatalogCandidates` exact/minimum/compatibility and diagnostics remain unchanged for the same inputs;
- structured dependencies and compatibility maps round-trip through the internal boundary without semantic drift;
- no PostgreSQL implementation or external package dependency is introduced;
- no Assembly source, canonical contract or downstream module changes are introduced;
- declared validations pass.

# Non-goals

PostgreSQL persistence, migration/schema management, concurrency/fleet semantics, richer version constraints, provider scoring, Release/Artifact persistence, Runtime/Deploy changes or shared capability-contract extraction.

# Evidence expected

Existing Catalog registry/resolution product tests plus focused tests proving the replaceable in-memory seam preserves duplicate, ordering, structured dependency and resolution behavior; final repository verification.

# Escalation

Stop if preserving current behavior requires changing public Catalog shapes/diagnostics, modifying Assembly, extracting a shared canonical contract, adding a database dependency, or changing an L4 boundary.
