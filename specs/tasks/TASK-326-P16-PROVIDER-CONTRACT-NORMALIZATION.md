---
id: TASK-326
title: Add deterministic AI Gateway contract validation and normalization
status: committed
priority: 326
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-325
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-01.md
  - project_docs/execution_planning/P16-PROVIDER-ABSTRACTION-CONTRACT-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-326-P16-PROVIDER-CONTRACT-NORMALIZATION.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Provide deterministic fail-closed validation/normalization for the provider-neutral request/response and capability/limit contracts from TASK-324/325.

# Context
Provider replaceability requires canonical data handling independent of adapter/provider implementation details.

# Current behavior
The new M16 contract shapes require deterministic validation and canonical normalization before real adapter integration can be proven safely.

# Inputs / contracts
- TASK-324 request/response contracts;
- TASK-325 capability/limit descriptors.

# Outputs / contracts
- pure validation/normalization helpers under `packages/contracts/ai-gateway/**`;
- focused tests for valid, invalid and canonical-equivalent inputs.

# Required change
Implement deterministic parsing/normalization with no provider/network/secret lookups, hidden defaults, routing decisions or authority inference.

# Acceptance criteria
- structurally invalid inputs fail explicitly;
- equivalent inputs normalize deterministically where ordering/canonicalization applies;
- no hidden provider defaults are injected;
- no network, secrets, storage or authorization dependency exists;
- declared validations pass.

# Non-goals
No adapter invocation, provider registry, routing/fallback policy, pricing/budget logic or WBS 16.2/16.3 behavior.

# Evidence expected
Product tests proving fail-closed parsing and deterministic normalization over TASK-324/325 contracts.

# Escalation
Stop if validation requires external provider state or changing architecture outside the materialized contract boundary.
