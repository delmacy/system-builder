---
id: TASK-451
title: Prove reference process through project and publish
status: completed
priority: 451
milestone: M19
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-450
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-REFERENCE-PRODUCT-PROCESS-01.md
  - packages/assembly/**
  - packages/compiler/**
  - packages/release/**
  - scripts/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - packages/assembly/**
  - packages/compiler/**
  - packages/release/**
  - project_docs/execution_planning/P19-REFERENCE-PRODUCT-PROCESS-01.md
  - specs/tasks/TASK-451-P19-REFERENCE-PROCESS-PUBLISH.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - apps/**
max_files: 10
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Carry the frozen representative process through the existing generated-project/compiler path and canonical Release publication with exact immutable lineage.

# Context
TASK-450 freezes the representative process/version/project baseline. This successor must prove that exact baseline reaches the already-authoritative assembly/Compiler/Release path without synthetic identity stitching or downstream scope expansion.

# Current behavior
Assembly/factory, Compiler artifact verification and Release publication primitives already exist and are used by integrated P19 proofs. Construction 7 needs a focused composition proving the representative baseline traverses those owners unchanged before Deploy is involved.

# Required change
Compose existing assembly/factory, Compiler and Release APIs. Prefer proof-only changes when current primitives already support the journey; product code may change only boundedly inside an existing owner to close a demonstrated integration gap.

# Inputs / contracts
TASK-450 canonical baseline identity/provenance, existing assembly/factory project outputs, Compiler immutable artifact contracts and Release publication/verification APIs.

# Outputs / contracts
Focused evidence binding the representative process/project lineage to verified Compiler payload and canonical PublishedRelease/ReleaseArtifact identities; no new public contract, schema, identity owner or runtime behavior.

# Acceptance criteria
- exact baseline process/version identity reaches generated project and Compiler payload;
- per-file and aggregate artifact identity/hashes are verified before publication;
- PublishedRelease/ReleaseArtifact refs derive from canonical owners, not synthetic fixture stitching;
- repeated equivalent execution is deterministic/idempotent under existing semantics;
- stale/substituted process, project or artifact evidence fails closed before publication or next unsafe side effect;
- no EnvironmentProfile/secret/runtime-state data enters immutable release artifacts.

# Non-goals
Deploy/runtime activation, Observe publication, new Release schema, new identity scheme or WBS 19.3.2+.

# Evidence expected
Focused product proof covering happy-path publication, deterministic/idempotent repetition, stale/substituted identity or artifact rejection and protected/runtime-state non-disclosure, plus declared validations and exact-head CI gates.

# Execution evidence
- Extended `tests/product/p19-reference-process-baseline.test.ts` so the TASK-450 canonical baseline feeds the existing Compiler without a synthetic downstream identity seam.
- Published the exact Compiler file set through `InMemoryArtifactPayloadRepository`, verified per-file and aggregate identity through `getVerified`, and only then published through the canonical `ReleaseRegistry`.
- Proved deterministic repeated compilation, idempotent identical artifact-payload publication and existing duplicate Release identity rejection semantics.
- Proved stale validation/project evidence is rejected by Compiler before publication and substituted file content is rejected by artifact verification before Release publication.
- Verified immutable Compiler/Release evidence contains no `EnvironmentProfile`, reference environment identity or protected-value reference.
- No Deploy/Runtime/Observe behavior, public contract, identity authority, application path or WBS 19.3.2+ scope was added.

# Escalation
Stop if publication of the representative baseline requires a new public contract, identity authority, topology or behavior outside existing Assembly/Compiler/Release owners.
