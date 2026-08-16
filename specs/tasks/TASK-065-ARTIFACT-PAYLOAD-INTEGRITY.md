---
id: TASK-065
title: Verify artifact payload integrity independently on retrieval
status: ready
priority: 381
milestone: M4
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-064
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P3-PACKAGE-01.md
  - project_docs/execution_planning/P3-ARTIFACT-01.md
  - project_docs/execution_planning/P2-PACKAGE-01.integration-debt-review.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - project_docs/09-release/WBS.md
  - packages/deterministic/index.ts
  - packages/compiler/index.ts
  - packages/artifact-store/index.ts
  - tests/product/artifact-store.test.ts
  - specs/tasks/TASK-065-ARTIFACT-PAYLOAD-INTEGRITY.md
allowed_paths:
  - packages/artifact-store/index.ts
  - tests/product/artifact-store.test.ts
  - specs/tasks/TASK-065-ARTIFACT-PAYLOAD-INTEGRITY.md
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

Close TD-P2-02 by independently verifying retrieved generated-file bytes and recomputing the aggregate ReleaseArtifact identity before any payload can be considered activatable.

# Context

Compiler already hashes each generated file and derives the immutable ReleaseArtifact identity from canonical artifact metadata plus the ordered file-hash list. The P2 review identified that Deploy trusted caller-supplied generated files without independently reproducing those checks.

# Current behavior

TASK-064 provides publication/retrieval by artifact hash and immutable snapshots, but stored payload content is not yet independently checked against per-file hashes, manifest coverage or the canonical aggregate ReleaseArtifact identity.

# Required change

Extend the artifact payload boundary so retrieval for activation requires the canonical ReleaseArtifact metadata. Recompute every generated file `contentHash` from file content, require exact manifest path coverage with no duplicate/extra/missing paths, then recompute the aggregate artifact identity using the same canonical payload semantics as Compiler. Return a verified immutable payload only when all checks pass.

# Inputs / contracts

Shared deterministic hashing utilities, actual Compiler ReleaseArtifact semantics, TASK-064 repository boundary.

# Outputs / contracts

Verified artifact payload result suitable for pre-activation Deploy consumption.

# Acceptance criteria

- valid actual Compiler output verifies successfully;
- modified file content with stale `contentHash` is rejected;
- substituted `contentHash`, missing/extra/duplicate path or manifest mismatch is rejected;
- recomputed aggregate hash must equal ReleaseArtifact `artifactHash`;
- verification is independent of caller assertions and does not mutate inputs;
- tests use actual Compiler output for positive and corruption cases;
- declared validations pass.

# Non-goals

Changing Compiler artifact semantics, signing/PKI, remote transport security, production object storage, Deploy activation or Runtime changes.

# Evidence expected

Focused tests using actual Compiler output for successful verification and corrupted/substituted payload rejection, plus GitHub Deterministic CI.

# Escalation

Stop if independent verification cannot reproduce the Compiler artifact identity without changing a forbidden Compiler/public schema path.
