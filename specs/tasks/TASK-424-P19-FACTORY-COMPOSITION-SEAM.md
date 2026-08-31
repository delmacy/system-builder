---
id: TASK-424
title: Establish deterministic factory composition seam
status: ready
priority: 424
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-PACKAGE-01-CONSOLIDATED-PREALPHA.md
  - project_docs/execution_planning/P19-FACTORY-COMPOSITION-01.md
  - project_docs/19-pre-alpha-productization/WBS.md
  - packages/contracts/factory-boundary/**
  - packages/assembly/**
  - packages/catalog/**
allowed_paths:
  - packages/assembly/**
  - packages/catalog/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
  - specs/tasks/TASK-424-P19-FACTORY-COMPOSITION-SEAM.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/postgres/**
  - packages/contracts/decision-boundary/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Establish the smallest deterministic composition seam that consumes the canonical WBS 19.1.1 journey contract and invokes existing public catalog/assembly behavior without creating a new bounded context or command/API surface.

# Required change
Introduce only the additive integration needed to pass canonical identity/provenance from the factory-journey contract into existing composition-capable module APIs. Preserve existing package ownership and fail closed when required predecessor identity is absent or incompatible.

# Acceptance criteria
- composition starts from the canonical factory-journey identity/provenance envelope;
- existing public APIs are reused rather than duplicated;
- no hand-authored downstream artifact identity is accepted as authoritative input;
- missing/incompatible predecessor identity fails closed;
- no runtime, persistence, publication or deployment side effect is introduced;
- declared validations pass.

# Escalation
Stop for a new bounded context, public topology change, destructive contract replacement or undeclared L4.
