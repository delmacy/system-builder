---
id: TASK-096
title: Implement PostgreSQL reference ArtifactPayloadRepository
status: completed
priority: 404
milestone: M7
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-095
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P6-PACKAGE-01.md
  - project_docs/execution_planning/P6-DURABLE-RELEASE-ARTIFACT-01.md
  - project_docs/09-release/WBS.md
  - packages/artifact-store/index.ts
  - tests/product/artifact-store.test.ts
  - packages/catalog/postgres.ts
  - specs/tasks/TASK-064-ARTIFACT-PAYLOAD-REPOSITORY.md
  - specs/tasks/TASK-065-ARTIFACT-PAYLOAD-INTEGRITY.md
  - specs/tasks/TASK-066-ARTIFACT-DELIVERY-DEPLOY-E2E.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-096-POSTGRES-ARTIFACT-PAYLOAD-REPOSITORY.md
allowed_paths:
  - packages/artifact-store/postgres.ts
  - tests/product/artifact-store-postgres.test.ts
  - specs/tasks/TASK-096-POSTGRES-ARTIFACT-PAYLOAD-REPOSITORY.md
forbidden_paths:
  - packages/artifact-store/index.ts
  - packages/release/**
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
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Implement one replaceable PostgreSQL-backed concrete `ArtifactPayloadRepository` using the already-public provider-neutral ArtifactStore interfaces, preserving all current immutable publication and verification semantics.

# Context

ArtifactStore already exposes provider-neutral Reader/Writer/VerifiedReader/Repository interfaces and an in-memory implementation that defines the current publication and integrity behavior. This TASK adds only a PostgreSQL concrete provider behind those unchanged interfaces. WBS 09 durable publication and ADR-0007 Release/Environment separation remain controlling; no new integrity policy or public storage contract is authorized.

# Current behavior

ArtifactStore already exposes `ArtifactPayloadReader`, `ArtifactPayloadWriter`, `VerifiedArtifactPayloadReader` and their composite `ArtifactPayloadRepository`. Only `InMemoryArtifactPayloadRepository` is concrete; payloads disappear with process lifetime.

# Required change

Add a PostgreSQL reference implementation in a separate ArtifactStore-owned module without modifying `packages/artifact-store/index.ts`. The implementation must conform to existing interfaces and reuse existing public in-memory behavior as a semantic oracle/composition mechanism where useful rather than duplicate or redefine integrity policy.

# Inputs / contracts

Current ArtifactPayload types/interfaces; publication normalization; idempotent identical publication; conflict rejection; missing behavior; per-file hash, manifest and aggregate hash verification; Compiler-produced ReleaseArtifact verification fixtures; CI PostgreSQL service.

# Outputs / contracts

PostgreSQL concrete ArtifactPayloadRepository and focused durable product evidence. Existing ArtifactStore public interface/verification implementation remains unchanged.

# Acceptance criteria

- provider implements current `ArtifactPayloadRepository` without changing its interface;
- complete artifact payload file path/content/contentHash data persists and reloads across provider reconstruction;
- deterministic file ordering/snapshots remain equivalent;
- identical publication across reconstruction remains idempotent;
- conflicting publication remains `ARTIFACT_PAYLOAD_CONFLICT:<hash>` fail-closed behavior;
- missing artifact remains explicit;
- `getVerified()` preserves current per-file, manifest and aggregate hash validation semantics against actual Compiler output;
- provider schema initialization is idempotent for bounded tests;
- connection failures are sanitized and do not leak credential material;
- no Release, Compiler, Deploy, Runtime or canonical-contract source changes;
- declared validations pass.

# Non-goals

Changing ArtifactPayloadRepository contracts, production object storage/S3, compression/chunking, production TLS/pooling, release metadata persistence, Deploy/Runtime changes or new integrity policy.

# Evidence expected

Actual PostgreSQL 17.6 tests proving publish -> reconstruct -> get/getVerified, idempotence, conflict and corruption/failure behavior while predecessor artifact-store tests remain green.

# Escalation

Stop if implementation requires changing `packages/artifact-store/index.ts`, canonical contracts, Release/Compiler/Deploy/Runtime source, CI workflow, or redefining artifact identity/verification semantics.
