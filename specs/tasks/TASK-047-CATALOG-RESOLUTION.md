---
id: TASK-047
title: Implement provider-neutral Catalog resolution
status: ready
priority: 220
milestone: M2
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-046
context_paths:
  - AGENTS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - project_docs/05-catalog/WBS.md
  - project_docs/execution_planning/P1-VERTICAL-01.md
  - packages/catalog/**
  - packages/contracts/system-definition/**
  - specs/tasks/TASK-047-CATALOG-RESOLUTION.md
allowed_paths:
  - packages/catalog/**
  - tests/product/catalog-resolution.test.ts
  - specs/tasks/TASK-047-CATALOG-RESOLUTION.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - tooling/agent-harness/**
max_files: 6
validation:
  - npm run verify
---

# Objective

Resolve eligible Software Catalog candidates for requested capabilities with stable ordering and explicit diagnostics.

# Context

WBS 5.2.3 requires provider-neutral resolution/lookup. The first vertical slice needs deterministic candidate selection input before Assembly can produce a BOM.

# Current behavior

TASK-046 provides registration but no query/resolution behavior.

# Required change

Add resolution over capability id plus optional version/compatibility constraints. Return candidates in a deterministic order independent of insertion order and return explicit missing/incompatible diagnostics.

# Inputs / contracts

Software Catalog registry records and SystemDefinition capability requests.

# Outputs / contracts

Deterministic candidate-resolution result consumed by Assembly.

# Acceptance criteria

- identical catalog contents yield identical ordered candidates regardless of registration order.
- unknown capability returns an explicit missing-capability diagnostic.
- incompatible constraints return an explicit incompatibility diagnostic.
- no provider is preferred by hard-coded vendor identity.
- positive and negative product tests pass.

# Non-goals

Transitive dependency solving, optimizer/scoring, network discovery, package installation or catalog persistence.

# Evidence expected

Determinism and failure-case product tests plus repository-wide verification.

# Escalation

Stop if resolution needs a new public contract or provider-specific selection rule not defined by repository authority.
