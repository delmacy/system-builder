---
id: TASK-064
title: Define artifact payload repository and retrieval boundary
status: completed
priority: 380
milestone: M4
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-063
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P3-PACKAGE-01.md
  - project_docs/execution_planning/P3-ARTIFACT-01.md
  - project_docs/execution_planning/P2-PACKAGE-01.integration-debt-review.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - project_docs/09-release/WBS.md
  - packages/compiler/index.ts
  - packages/release/index.ts
  - specs/tasks/TASK-064-ARTIFACT-PAYLOAD-REPOSITORY.md
allowed_paths:
  - packages/artifact-store/index.ts
  - tests/product/artifact-store.test.ts
  - specs/tasks/TASK-064-ARTIFACT-PAYLOAD-REPOSITORY.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/runtime-core/**
  - tooling/agent-harness/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Define a provider-neutral artifact payload publication/retrieval boundary and an in-memory reference implementation keyed by immutable ReleaseArtifact identity.

# Context

The merged P2 review records TD-P2-01: Deploy currently receives Compiler-generated files directly and no durable/provider-neutral boundary resolves immutable artifact identity to payload bytes. Release WBS 9.3 requires artifact publication through abstract registry/storage while ADR-0007 keeps Release separate from Environment and Deployment.

# Current behavior

Compiler returns a ReleaseArtifact plus generated files in memory. Release publishes immutable artifact metadata, but there is no artifact payload reader/writer abstraction between that output and Deploy.

# Required change

Add `packages/artifact-store/index.ts` with immutable public TypeScript types for generated artifact files/payloads, a minimal reader/writer abstraction, and an in-memory implementation. Publication accepts a ReleaseArtifact identity plus generated files, snapshots/freezes content, prevents conflicting overwrite of an existing artifact identity, and retrieval returns immutable copies without exposing mutable internal state.

# Inputs / contracts

Actual Compiler `GeneratedFile`/ReleaseArtifact shape, Release WBS 9.3, merged TD-P2-01, ADR-0007.

# Outputs / contracts

Provider-neutral TypeScript artifact payload reader/writer boundary plus in-memory reference implementation. This is authorized L3 shared-contract work within the Sprint; it does not alter Release/Environment/Deployment architecture.

# Acceptance criteria

- publish/retrieve round-trip is deterministic by artifact hash;
- duplicate identical publication is idempotent or explicitly deterministic;
- conflicting publication under the same artifact hash is rejected;
- missing artifact retrieval fails explicitly;
- callers cannot mutate stored content through returned objects;
- no provider-specific storage API or production persistence is introduced;
- tests cover positive publication/retrieval and negative duplicate/missing behavior;
- declared validations pass.

# Non-goals

Integrity verification beyond structural publication rules (TASK-065), Deploy integration (TASK-066), object storage, filesystem persistence, network registry, secrets, Runtime lifecycle or production adapters.

# Evidence expected

Focused artifact-store positive/negative tests plus repository-wide GitHub Deterministic CI evidence.

# Escalation

Stop if the boundary requires a change to canonical ReleaseArtifact/PublishedRelease schemas or accepted Release/Environment/Deployment architecture.

# Result

Implemented immutable provider-neutral reader/writer types and in-memory reference repository with deterministic ordering, idempotent identical publication, conflict rejection and explicit missing-artifact failure. Initial CI attempts exposed only bounded task-contract formatting defects; product code passed lint and typecheck before the catalog parser gate.
