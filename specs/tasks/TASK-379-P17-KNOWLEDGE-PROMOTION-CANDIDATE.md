---
id: TASK-379
title: Define payload-minimal knowledge promotion candidate descriptor
status: completed
priority: 379
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-03.md
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - project_docs/17-knowledge-boundary/scope/README.md
  - packages/contracts/knowledge-boundary/index.ts
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-379-P17-KNOWLEDGE-PROMOTION-CANDIDATE.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define a canonical payload-minimal promotion candidate descriptor for WBS 17.3.

# Context
Closed WBS 17.2 can establish bounded eligibility without granting approval. WBS 17.3 needs an explicit candidate identity/reference before transformation or review.

# Current behavior
No dedicated WBS 17.3 candidate contract exists.

# Inputs / contracts
Closed WBS 17.1 classification/use policy and WBS 17.2 enforcement/eligibility references.

# Outputs / contracts
Versioned provider-neutral candidate descriptor with deterministic normalization.

# Required change
Represent candidate identity plus predecessor decision/reference linkage without carrying raw sensitive payload or inferring promotion authority.

# Acceptance criteria
- deterministic normalization and fail-closed unknown/extra state;
- predecessor refs are explicit and payload-minimal;
- no candidate field means approval/promotion;
- no Decision Boundary contract change;
- declared validations pass.

# Non-goals
No anonymization algorithm, genericity review or promotion execution.

# Evidence expected
Positive/negative product tests and predecessor-integration proof.

# Escalation
Stop for sensitive payload carriage, Decision Boundary public-contract change or undeclared architecture change.
