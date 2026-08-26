---
id: TASK-330
title: Add canonical provider invocation seam
status: ready
priority: 330
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-01.md
  - project_docs/execution_planning/P16-PROVIDER-ABSTRACTION-INTEGRATION-01.md
  - project_docs/16-ai-gateway/WBS.md
  - project_docs/16-ai-gateway/scope/README.md
  - packages/contracts/ai-gateway/index.ts
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-330-P16-CANONICAL-PROVIDER-INVOCATION-SEAM.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/observe/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Add the minimal real AI Gateway invocation seam that accepts the canonical ModelRequest and invokes a supplied ModelProviderAdapter without leaking provider identity/configuration into the request contract.

# Context
Construction A defined and proved ModelRequest, ModelResponse, normalization and ModelProviderAdapter. Construction B must now exercise that abstraction through a representative invocation path inside the existing AI Gateway bounded context, without creating a new module boundary.

# Current behavior
The contract package exposes the canonical types and adapter interface, but callers have no canonical invocation seam that composes request normalization with adapter invocation.

# Inputs / contracts
- `ModelRequest` and `normalizeModelRequest`;
- `ModelResponse` and `normalizeModelResponse`;
- `ModelProviderAdapter`;
- WBS 16.1.1–16.1.3 and P16 Package boundaries.

# Outputs / contracts
- one provider-neutral invocation API inside the existing `packages/contracts/ai-gateway` bounded context;
- focused product proof that normalized canonical requests reach an injected adapter unchanged in business semantics;
- no provider ID/configuration added to ModelRequest/ModelResponse.

# Required change
Implement a minimal invocation helper/seam using the existing adapter contract. Normalize the incoming request before invocation and return only canonical response data. Keep adapter selection/injection external; do not add registry, routing, budget, fallback, credentials or network topology.

# Acceptance criteria
- canonical request normalization occurs before adapter invocation;
- adapter is supplied explicitly by the caller and remains replaceable;
- central request/response fields remain provider-neutral and backward-compatible;
- positive and malformed-request tests exist;
- no WBS 16.2/16.3 semantics are introduced;
- declared validations pass.

# Non-goals
No provider implementation, registry, routing, fallback policy, budget/quota, secrets, remote transport, observation/cost recording or authority change.

# Evidence expected
Focused product tests proving the canonical invocation path and provider-neutral shape.

# Escalation
Stop if the only viable implementation requires a new suite/module boundary, public topology decision, credentials lifecycle or another L4 architecture change.