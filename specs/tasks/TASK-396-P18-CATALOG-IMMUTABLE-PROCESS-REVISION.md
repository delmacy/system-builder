---
id: TASK-396
title: Enforce immutable published process revisions in representative catalog consumer
status: completed
priority: 396
milestone: M18
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-395
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PROCESS-VERSION-IDENTITY-INTEGRATION-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/catalog/**
  - packages/contracts/process-versioning/**
allowed_paths:
  - packages/catalog/**
  - tests/product/**
  - specs/tasks/TASK-396-P18-CATALOG-IMMUTABLE-PROCESS-REVISION.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Make the representative catalog consumer honor canonical immutable published-revision semantics.

# Context
TASK-395 introduces the bounded catalog admission seam. WBS 18.1.2 requires published process revisions to be immutable while exact replay may remain deterministic/idempotent.

# Current behavior
The canonical contract exposes `guardImmutablePublishedRevision`, but the representative catalog consumer has not yet proven that repeated admission uses that authority rather than a weaker local overwrite rule.

# Inputs / contracts
- TASK-395 canonical catalog admission seam;
- `guardImmutablePublishedRevision` and canonical publication evidence from `packages/contracts/process-versioning/**`;
- WBS 18.1.2 and P18 Package exclusions.

# Outputs / contracts
Representative-consumer immutable-publication behavior with deterministic idempotent replay and fail-closed conflicting overwrite rejection, without persistence/topology redesign.

# Required change
Extend the TASK-395 seam so exact re-admission of identical publication evidence is idempotent while any conflicting overwrite for the same canonical revision identity fails closed through the canonical immutable-publication guard.

# Acceptance criteria
- identical replay is deterministic/idempotent;
- immutableContentRef, predecessor, revision number or artifact/revision identity conflicts are rejected;
- consumer code does not reimplement a weaker immutability rule;
- no mutable storage migration or semantic-diff policy is introduced;
- existing catalog behavior remains backward-compatible;
- declared validations pass.

# Non-goals
No WBS 18.2 classification/approval, WBS 18.3 lineage, storage migration, Git business authority or Decision Boundary change.

# Evidence expected
Positive first-admission/idempotent-replay tests and conflicting-overwrite negatives, then exact-head Deterministic CI and Heavy Product Tests before TASK-397.

# Escalation
Stop if compliance requires storage/topology redesign or authority beyond existing WBS 18.1 contracts.
