---
id: TASK-355
title: Define canonical knowledge class and ownership descriptor
status: ready
priority: 355
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-01.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - project_docs/17-knowledge-boundary/scope/README.md
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-355-P17-KNOWLEDGE-CLASS-OWNERSHIP-CONTRACT.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/ai-gateway/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define the canonical provider-neutral knowledge classification and ownership descriptor for WBS 17.1.1.

# Context
Knowledge Boundary requires explicit classification before later enforcement/promotion stages can reason safely about reuse.

# Current behavior
No dedicated canonical contract represents the four scope-defined knowledge classes and explicit ownership information.

# Inputs / contracts
- WBS 17.1.1;
- Knowledge Boundary scope classes: generic, client-proprietary, personal, trade-secret.

# Outputs / contracts
- additive `packages/contracts/knowledge-boundary/**` contract;
- deterministic focused product proof.

# Required change
Define explicit class and ownership fields with versioned, fail-closed validation. Ownership must be represented explicitly and never inferred from source names or payload content.

# Acceptance criteria
- exactly the four authorized knowledge classes are accepted;
- ownership is explicit and normalized;
- unknown/extra/ambiguous fields fail closed;
- no sensitive payload, provider ID, approval or promotion authority is carried;
- declared validations pass.

# Non-goals
No use-policy evaluation, assisted classification, enforcement, anonymization or promotion.

# Evidence expected
Positive/negative product tests for class and ownership descriptors.

# Escalation
Stop if implementation requires WBS 17.2/17.3 behavior or undeclared architecture change.
