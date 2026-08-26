---
id: TASK-338
title: Add deterministic governance normalization and predecessor integration proof
status: ready
priority: 338
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-335
  - TASK-336
  - TASK-337
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-02.md
  - project_docs/execution_planning/P16-AI-EXECUTION-GOVERNANCE-CONTRACT-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-338-P16-GOVERNANCE-NORMALIZATION-INTEGRATION-PROOF.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove deterministic normalization and compatibility across the execution-governance contracts from TASK-334..337 and the integrated WBS 16.1 contracts.

# Context
Construction A must leave one coherent provider-neutral contract surface rather than isolated shapes.

# Current behavior
The individual WBS 16.2 contracts are not yet proven together against predecessor request/response/capability semantics.

# Inputs / contracts
- TASK-334 governance policy descriptor;
- TASK-335 routing/budget/quota/fallback rules;
- TASK-336 structured-output validation boundary;
- TASK-337 execution metadata contract;
- integrated WBS 16.1 request/response/capability contracts.

# Outputs / contracts
- deterministic canonical normalization over the composed governance input;
- integrated product proof for valid, invalid and canonical-equivalent inputs;
- predecessor compatibility evidence.

# Required change
Compose/normalize the declared governance contracts without executing provider selection, remote fallback or hidden policy. Prove fail-closed behavior and absence of provider/network/secret/authority leakage.

# Acceptance criteria
- composed governance inputs normalize deterministically;
- invalid routing/budget/schema/metadata states fail explicitly;
- no provider identity, credentials, hidden defaults or authorization inference is introduced;
- predecessor WBS 16.1 contracts remain unchanged/compatible;
- declared validations pass.

# Non-goals
No invocation-seam governance integration, live routing/fallback, provider registry, WBS 16.3 behavior or runtime/compiler changes.

# Evidence expected
Growing product tests combining the new governance contracts with real predecessor contract APIs.

# Escalation
Stop if composition requires architecture changes, forbidden paths or live provider state.
