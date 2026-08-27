---
id: TASK-357
title: Define manual and assisted classification decision record
status: ready
priority: 357
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-355
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-01.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - packages/contracts/decision-boundary/**
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-357-P17-KNOWLEDGE-CLASSIFICATION-DECISION.md
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
Define the explicit classification decision record for manual and assisted classification under WBS 17.1.2.

# Context
Assisted classification may use probabilistic suggestions, but Decision Boundary rules forbid probabilistic output from becoming authority by itself.

# Current behavior
No Knowledge Boundary decision record distinguishes manual decisions from assisted proposals plus human decisions.

# Inputs / contracts
- TASK-355 classification/ownership descriptor;
- existing Decision Boundary contracts and authority semantics.

# Outputs / contracts
- versioned classification decision record under `packages/contracts/knowledge-boundary/**`;
- deterministic proof for manual and assisted decision modes.

# Required change
Represent decision mode, selected classification, explicit decision actor/reference and optional proposal reference without treating a proposal as the final decision.

# Acceptance criteria
- manual and assisted modes are explicit;
- assisted mode requires an explicit human decision reference/actor independent of the proposal;
- probabilistic proposal data cannot itself mark a classification approved/authorized;
- invalid/unknown fields fail closed;
- no promotion authority is introduced;
- declared validations pass.

# Non-goals
No model invocation, inference implementation, promotion or enforcement.

# Evidence expected
Product tests proving assisted suggestion is non-authoritative until an explicit human decision is present.

# Escalation
Stop if implementation would weaken Decision Boundary authority semantics or require changing its public contract.
