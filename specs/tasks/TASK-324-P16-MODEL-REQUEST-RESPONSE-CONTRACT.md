---
id: TASK-324
title: Define provider-neutral model request and response contract
status: completed
priority: 324
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-01.md
  - project_docs/execution_planning/P16-PROVIDER-ABSTRACTION-CONTRACT-01.md
  - project_docs/16-ai-gateway/WBS.md
  - project_docs/16-ai-gateway/scope/README.md
  - packages/contracts/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-324-P16-MODEL-REQUEST-RESPONSE-CONTRACT.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - project_docs/17-*/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define the canonical provider-neutral model request/response contract required by WBS 16.1.1 without embedding provider identity, credentials, routing policy or business authority.

# Context
PRE-M16 contract conformance is closed. M16 starts with provider abstraction so AI access remains replaceable and does not become part of the business ontology.

# Current behavior
The repository has decision-boundary contracts and provider-unavailability evidence but no canonical M16 model request/response envelope owned by the AI Gateway contract boundary.

# Inputs / contracts
- M16 AI Gateway WBS/scope;
- existing deterministic/human/probabilistic decision-boundary contracts;
- repository contract conventions under `packages/contracts/**`.

# Outputs / contracts
- additive provider-neutral request and response TypeScript contracts under `packages/contracts/ai-gateway/**`;
- public exports consistent with repository contract conventions;
- focused positive/negative product tests.

# Required change
Create a minimal common request/response envelope with explicit versioning/identity fields necessary for deterministic validation, while excluding provider ID, endpoint, credential, quota/routing policy and authorization semantics from the core envelope.

# Acceptance criteria
- request/response shapes are provider-neutral and additive;
- provider-specific identity/configuration is not required by the central contract;
- no field implies `authorized`, `approved` or human authority;
- invalid structural inputs fail explicitly in tests where validation helpers are introduced;
- no network/provider call is implemented;
- declared validations pass.

# Non-goals
No adapter implementation, routing, budget/quota, fallback policy, secrets, remote invocation, prompt business logic or WBS 16.2/16.3 behavior.

# Evidence expected
Contract tests proving provider-neutral shape and absence of provider-specific/authority semantics.

# Escalation
Stop if the contract requires changing Builder/Runtime topology, existing decision-authority semantics or any other L4 architecture boundary.
