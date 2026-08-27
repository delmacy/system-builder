---
id: TASK-359
title: Define assisted classification proposal boundary
status: ready
priority: 359
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-357
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-01.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01.md
  - packages/contracts/decision-boundary/**
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-359-P17-ASSISTED-CLASSIFICATION-PROPOSAL-BOUNDARY.md
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
Define a bounded assisted-classification proposal contract that can inform, but never replace, the explicit classification decision.

# Context
WBS 17.1.2 permits assisted classification while repository decision-boundary policy requires probabilistic outputs to remain non-authoritative.

# Current behavior
There is no Knowledge Boundary proposal shape separating assisted suggestion/confidence/context from the final classification decision.

# Inputs / contracts
- TASK-357 classification decision record;
- existing Decision Boundary probabilistic metadata semantics.

# Outputs / contracts
- provider-neutral assisted classification proposal contract;
- focused proof that proposal != decision.

# Required change
Represent proposed class, bounded confidence/model/context references and proposal evidence without provider credential/topology and without approval/authorization fields.

# Acceptance criteria
- proposal can be referenced by assisted classification decision but cannot itself satisfy the final decision record;
- confidence/context are explicit and bounded;
- provider IDs/credentials/approval/authorization fields are rejected;
- no model invocation is implemented;
- declared validations pass.

# Non-goals
No inference execution, automatic classification, promotion, enforcement or provider routing.

# Evidence expected
Tests showing proposal-only inputs cannot become final classification decisions.

# Escalation
Stop if assisted mode requires new architecture or weakening human-decision authority.
