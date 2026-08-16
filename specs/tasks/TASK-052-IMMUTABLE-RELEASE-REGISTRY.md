---
id: TASK-052
title: Implement immutable Release registry lifecycle
status: completed
priority: 270
milestone: M2
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-051
context_paths:
  - AGENTS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - project_docs/09-release/WBS.md
  - project_docs/execution_planning/P1-VERTICAL-03.md
  - packages/contracts/factory-boundary/**
  - specs/tasks/TASK-052-IMMUTABLE-RELEASE-REGISTRY.md
allowed_paths:
  - packages/release/**
  - tests/product/release.test.ts
  - specs/tasks/TASK-052-IMMUTABLE-RELEASE-REGISTRY.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - tooling/agent-harness/**
max_files: 7
validation:
  - npm run verify
---

# Objective

Register ReleaseArtifact as immutable versioned PublishedRelease records with deterministic lifecycle enforcement.

# Context

WBS 9.1-9.3 requires artifact identity/provenance, authorized lifecycle transitions and prevention of published revision overwrite.

# Current behavior

PublishedRelease exists as a contract but no executable registry/lifecycle implementation exists.

# Required change

Implement an in-memory reference Release registry that publishes validated artifacts, preserves provenance, rejects duplicate published identities and enforces the bounded lifecycle transitions needed by the vertical slice.

# Inputs / contracts

ReleaseArtifact, ValidationEvidence and PublishedRelease contracts.

# Outputs / contracts

Immutable PublishedRelease records and lifecycle results.

# Acceptance criteria

- a valid ReleaseArtifact can be published once with preserved provenance.
- an already-published release identity cannot be overwritten.
- invalid lifecycle transitions are rejected explicitly.
- retrieval returns immutable-equivalent metadata.
- positive and negative product tests pass.

# Non-goals

Remote artifact storage, signing service, production promotion workflow, package CDN or deployment execution.

# Evidence expected

Product tests plus repository-wide verification.

# Escalation

Stop if required lifecycle semantics conflict with accepted release/runtime ADRs or require a public-contract change.
