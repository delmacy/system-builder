---
id: TASK-327
title: Define replaceable provider adapter boundary
status: completed
priority: 327
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-326
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-327-P16-PROVIDER-ADAPTER-BOUNDARY.md
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
Define the replaceable provider adapter boundary required by WBS 16.1.2 while keeping provider identity/configuration outside core request semantics.

# Context
The canonical request/response and capability contracts exist after TASK-324..326. The next boundary must allow provider-specific implementations to satisfy the same neutral contract without creating routing, credential or authority semantics.

# Current behavior
Provider-neutral envelopes and capability descriptors are defined, but there is not yet a public adapter interface proving replaceability at the contract boundary.

# Inputs / contracts
- canonical `ModelRequest` and `ModelResponse` contracts;
- deterministic validation/normalization from TASK-326;
- WBS 16.1.2 provider-replaceability requirement.

# Outputs / contracts
- additive provider adapter interface/types under `packages/contracts/ai-gateway/**`;
- focused fake/in-memory implementation tests only.

# Required change
Introduce the smallest provider-neutral adapter contract needed for a caller to submit a canonical model request and receive a canonical model response. Provider-specific configuration remains an implementation concern and must not appear in the request contract. Do not introduce registry, routing, network invocation or credential management.

# Acceptance criteria
- two adapter implementations satisfy the same interface in focused tests;
- provider IDs/configuration are not required in the canonical request;
- adapter result maps to the canonical response contract;
- no routing/selection or authority semantics are introduced;
- declared validations pass.

# Non-goals
No real provider SDK/network call, provider registry, credential lifecycle, routing/budget/fallback policy or WBS 16.2/16.3 behavior.

# Evidence expected
Product proof with two fake/in-memory adapters demonstrating replaceability against the same request contract while keeping provider-specific configuration outside request semantics.

# Escalation
Stop if a real adapter boundary requires provider topology/secret architecture or an undeclared L4 boundary change.
