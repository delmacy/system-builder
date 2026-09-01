---
id: TASK-451
title: Prove reference process through project and publish
status: blocked
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

# Required change
Compose existing assembly/factory, Compiler and Release APIs. Prefer proof-only changes when current primitives already support the journey; product code may change only boundedly inside an existing owner to close a demonstrated integration gap.

# Acceptance criteria
- exact baseline process/version identity reaches generated project and Compiler payload;
- per-file and aggregate artifact identity/hashes are verified before publication;
- PublishedRelease/ReleaseArtifact refs derive from canonical owners, not synthetic fixture stitching;
- repeated equivalent execution is deterministic/idempotent under existing semantics;
- stale/substituted process, project or artifact evidence fails closed before publication or next unsafe side effect;
- no EnvironmentProfile/secret/runtime-state data enters immutable release artifacts.

# Non-goals
Deploy/runtime activation, Observe publication, new Release schema, new identity scheme or WBS 19.3.2+.
