---
id: TASK-082
title: Define structured Catalog dependency requirements
status: ready
priority: 390
milestone: M6
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
  - project_docs/execution_planning/P5-PACKAGE-01.md
  - project_docs/execution_planning/P5-CATALOG-CONSTRAINTS-01.md
  - project_docs/execution_planning/P4-PACKAGE-01.integration-debt-review.md
  - project_docs/05-catalog/WBS.md
  - project_docs/06-assembly/WBS.md
  - packages/catalog/index.ts
  - packages/assembly/index.ts
  - tests/product/catalog-resolution.test.ts
  - tests/product/assembly.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-082-CATALOG-DEPENDENCY-REQUIREMENTS.md
allowed_paths:
  - packages/catalog/index.ts
  - tests/product/catalog-resolution.test.ts
  - specs/tasks/TASK-082-CATALOG-DEPENDENCY-REQUIREMENTS.md
forbidden_paths:
  - packages/assembly/**
  - packages/compiler/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/contracts/**
  - apps/**
  - tooling/agent-harness/**
  - docs/adr/**
  - .github/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Define the minimum structured software dependency requirement needed for deterministic Catalog composition planning without pulling transitive Assembly graph logic into this Sprint.

# Context

Catalog currently stores `dependencies` as opaque strings while WBS 5.2.2 and 6.1.2 require explicit versions/constraints/dependencies. P5 selects Factory composition hardening before durable provider persistence.

# Current behavior

`SoftwareCatalogRecord.dependencies` is a sorted string array. Candidate resolution supports capability, optional exact version and compatibility filters.

# Required change

Add a bounded structured dependency requirement representation in Catalog with deterministic normalization/snapshot semantics. Preserve the existing legacy `dependencies` string behavior so current Assembly callers and predecessor tests remain valid until P5-ASSEMBLY-GRAPH-01 explicitly consumes structured requirements.

The structured requirement must be able to carry capability plus optional bounded version constraint and compatibility requirements. Do not implement transitive resolution here.

# Inputs / contracts

Catalog internal API, WBS 05/06, current Assembly consumer shape, P5 package authority and ADR-0002/0007.

# Outputs / contracts

An internal Catalog structured dependency requirement and normalized record representation. No canonical `packages/contracts/**` change.

# Acceptance criteria

- dependency requirement has deterministic capability identity;
- optional version constraint is represented structurally rather than encoded in an opaque string;
- optional compatibility requirements are normalized deterministically;
- equivalent requirement input ordering produces identical normalized output;
- invalid/blank tokens fail explicitly;
- existing legacy `dependencies` behavior remains unchanged for current Assembly callers;
- existing Catalog resolution behavior remains green;
- no Assembly, Compiler, Release or persistence implementation is changed.

# Non-goals

Version-constraint candidate matching, transitive dependency closure, cycles/conflicts, materializer registry, durable Catalog persistence, production deployment.

# Evidence expected

Focused Catalog product tests for normalization, immutability/order independence, invalid input and predecessor compatibility, plus repository-wide verify.

# Escalation

Stop if the requirement cannot be introduced without modifying canonical contracts, Assembly implementation or an L4 boundary.
