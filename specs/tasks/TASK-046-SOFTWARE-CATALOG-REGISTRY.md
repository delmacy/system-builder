---
id: TASK-046
title: Implement minimal Software Catalog registry
status: ready
priority: 210
milestone: M2
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-045
context_paths:
  - AGENTS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - project_docs/05-catalog/WBS.md
  - project_docs/execution_planning/P1-VERTICAL-01.md
  - packages/contracts/system-definition/**
  - specs/tasks/TASK-046-SOFTWARE-CATALOG-REGISTRY.md
allowed_paths:
  - packages/catalog/**
  - tests/product/catalog-registry.test.ts
  - specs/tasks/TASK-046-SOFTWARE-CATALOG-REGISTRY.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - tooling/agent-harness/**
max_files: 6
validation:
  - npm run verify
---

# Objective

Implement a deterministic in-memory Software Catalog registry for versioned capability providers.

# Context

WBS 5.2 requires registration of capabilities, components, contracts, versions, dependencies and provider-neutral discovery. This TASK delivers the smallest software-side registry needed by the first vertical slice.

# Current behavior

SystemDefinition can request capabilities, but no executable catalog exists.

# Required change

Add a catalog module that registers immutable capability-provider records with provider id, version, capability id, dependency metadata and compatibility metadata. Reject duplicate identity collisions deterministically.

# Inputs / contracts

SystemDefinition capability identifiers and the Catalog WBS.

# Outputs / contracts

Internal Software Catalog registry API and deterministic registry records for later resolution.

# Acceptance criteria

- capability-provider records can be registered and listed deterministically.
- identity includes capability, provider and version.
- duplicate identity registration is rejected explicitly.
- registry behavior is provider-neutral.
- positive and duplicate-rejection product tests pass.

# Non-goals

Business Catalog, persistence, remote registry, package download, dependency solving or deprecation workflow.

# Evidence expected

Product tests plus repository-wide verification.

# Escalation

Stop if implementation requires a new public cross-module contract rather than an internal reference implementation over existing identifiers.
