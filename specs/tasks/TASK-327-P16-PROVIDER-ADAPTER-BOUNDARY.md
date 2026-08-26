---
id: TASK-327
title: Define replaceable provider adapter boundary
status: ready
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
Define the replaceable adapter boundary required by WBS 16.1.2 while keeping provider identity/configuration outside central request semantics.

# Context
TASK-324..326 establish provider-neutral envelopes and deterministic validation. The next boundary is an adapter contract that consumes those canonical inputs without leaking provider-specific IDs into core contracts.

# Current behavior
No M16 adapter interface is yet canonically owned by the AI Gateway contract boundary.

# Inputs / contracts
- normalized request/response and capability/limit contracts from TASK-324..326.

# Outputs / contracts
- additive provider adapter interface/types under `packages/contracts/ai-gateway/**`;
- focused contract tests using fake in-memory adapters only.

# Required change
Define an adapter boundary that can be implemented by different providers while keeping provider configuration opaque/outside the canonical request and without introducing registry, remote invocation or credentials.

# Acceptance criteria
- two adapter implementations can satisfy the same interface in tests;
- provider-specific IDs/config are not required in the canonical request envelope;
- adapter result maps to the canonical response contract;
- no routing/selection policy or authority semantics are introduced;
- declared validations pass.

# Non-goals
No real provider SDK, network call, provider registry, credential lifecycle, routing/budget/fallback policy or WBS 16.2/16.3 behavior.

# Evidence expected
In-memory product tests proving replaceable adapter conformance against the same canonical request/response contract.

# Escalation
Stop if a real adapter requires new topology/secret architecture or any undeclared L4 decision.
