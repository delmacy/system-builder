---
id: TASK-427
title: Compose compiler release and deployment identities without side effects
status: blocked
priority: 427
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-426
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-FACTORY-COMPOSITION-01.md
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/contracts/factory-boundary/**
allowed_paths:
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
  - specs/tasks/TASK-427-P19-FACTORY-COMPOSITION-DOWNSTREAM.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/postgres/**
  - packages/contracts/decision-boundary/**
max_files: 12
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Compose compiler, release and deployment-record identities from the exact validated predecessor chain through existing public APIs, without publication, deployment execution or runtime launch.

# Required change
Feed canonical ValidationEvidence/assembly lineage into existing compiler/release/deploy deterministic surfaces and propagate exact artifact/version/provenance identity through ReleaseArtifact, PublishedRelease-compatible evidence and DeploymentRecord-compatible evidence without side effects.

# Acceptance criteria
- downstream identities derive from exact validated predecessor identity;
- compiler/release/deploy public behavior is reused rather than duplicated;
- missing/stale/incompatible/lineage-broken predecessors fail closed;
- no publication, environment mutation, deployment execution or runtime launch occurs;
- declared validations pass.

# Escalation
Stop if WBS 19.1.2 requires deployment side effects, runtime topology changes, a new bounded context or undeclared L4.
