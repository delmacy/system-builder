---
id: TASK-328
title: Prove provider-neutral replaceability at the adapter boundary
status: completed
priority: 328
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-327
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-01.md
  - project_docs/execution_planning/P16-PROVIDER-ABSTRACTION-CONTRACT-01.md
  - packages/contracts/ai-gateway/**
  - project_docs/16-ai-gateway/scope/README.md
allowed_paths:
  - tests/product/**
  - specs/tasks/TASK-328-P16-PROVIDER-REPLACEABILITY-PROOF.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - project_docs/17-*/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove the WBS 16.1 provider-replaceability property using the real contracts produced by TASK-324..327.

# Context
The AI Gateway scope requires that changing provider not require changing central business contracts and that provider abstraction remain explicit rather than hidden in prompts or provider-specific request shapes.

# Current behavior
TASK-324..327 will establish the contract and adapter boundary. This TASK supplies integrated evidence rather than new product semantics.

# Inputs / contracts
- canonical AI Gateway request/response contracts;
- capability/limit descriptors;
- deterministic normalization helpers;
- replaceable adapter boundary.

# Outputs / contracts
- product proof showing two distinct in-memory provider adapters consume the same canonical request contract and produce canonical responses without altering business/authority semantics.

# Required change
Add focused product-level evidence exercising real AI Gateway contract APIs and two representative adapter implementations/fakes whose provider-specific metadata stays outside the canonical request/response envelope.

# Acceptance criteria
- the same canonical request is accepted through two adapter implementations;
- adapter-specific metadata/config does not change central request semantics;
- capability mismatch or invalid contract cases fail explicitly;
- no authority meaning is fabricated;
- no provider SDK, network call or secret is required;
- declared validations pass.

# Non-goals
No production provider adapter, routing policy, budget/quota, fallback governance, credential handling or WBS 16.2/16.3 implementation.

# Evidence expected
Product tests proving replaceability and negative contract behavior through real contract/adapter interfaces.

# Escalation
Stop if the proof exposes a product gap requiring scope outside WBS 16.1 or an undeclared architecture decision.
