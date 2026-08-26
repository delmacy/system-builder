---
id: TASK-332
title: Prove provider replaceability through the invocation seam
status: completed
priority: 332
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-331
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-01.md
  - project_docs/execution_planning/P16-PROVIDER-ABSTRACTION-INTEGRATION-01.md
  - packages/contracts/ai-gateway/**
  - tests/product/**
allowed_paths:
  - tests/product/**
  - packages/contracts/ai-gateway/**
  - specs/tasks/TASK-332-P16-PROVIDER-INTEGRATION-REPLACEABILITY-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/observe/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove that two interchangeable adapters can traverse the same canonical invocation seam without changing central request semantics and that provider failure cannot alter deterministic or human authority semantics.

# Context
Construction A proved replaceability at the contract boundary. TASK-330/331 create the real invocation seam and fail-closed validation needed to extend that proof through representative integration behavior.

# Current behavior
The repository has contract-level replaceability evidence, but no integrated seam-level proof using multiple injected adapters and failure cases.

# Inputs / contracts
- TASK-330 invocation seam;
- TASK-331 fail-closed response validation;
- ModelProviderAdapter and canonical request/response contracts;
- existing deterministic/human/probabilistic decision-boundary invariants from M15.

# Outputs / contracts
- product proof with at least two logically equivalent adapters using the same canonical request;
- evidence that adapter/provider-specific metadata remains external to central request/response semantics;
- evidence that failure does not fabricate deterministic or human authority outcomes.

# Required change
Add integrated product tests through the real invocation seam using interchangeable in-memory adapters. Cover success equivalence, provider-specific implementation differences that do not leak into central contracts, and explicit provider failure.

# Acceptance criteria
- replacing adapter does not require changing ModelRequest fields or business input;
- equivalent adapters produce canonical responses accepted by the same seam;
- provider-specific metadata/config is not required in central request/response contracts;
- failure remains explicit and does not fabricate fallback, approval or authorization;
- declared validations pass.

# Non-goals
No real external provider, network calls, registry, routing, fallback, budget/quota, credentials, cost/provenance or WBS 16.2/16.3 behavior.

# Evidence expected
Integrated product test proving replaceability and authority/deterministic-path preservation.

# Escalation
Stop if replaceability can only be demonstrated by adding provider identity to central contracts or introducing WBS 16.2/16.3 policy.
