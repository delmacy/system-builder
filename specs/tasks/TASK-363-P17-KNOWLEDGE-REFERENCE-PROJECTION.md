---
id: TASK-363
title: Define payload-minimal knowledge classification reference projection
status: ready
priority: 363
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-01.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01.md
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-363-P17-KNOWLEDGE-REFERENCE-PROJECTION.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/ai-gateway/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define a portable payload-minimal projection for evidence-facing consumers of corrected WBS 17.1 classification state.

# Context
Construction A plus TASK-362 define canonical classification and verified human authority, but no representative consumer projection exists.

# Current behavior
Consumers would need the full classification bundle or invent a projection.

# Inputs / contracts
- corrected KnowledgeClassificationDecision and bundle contracts;
- existing Evidence & Provenance reference semantics.

# Outputs / contracts
A versioned provider-neutral deterministic reference projection carrying only stable class, owner, purpose/use and decision/proposal/evidence references.

# Required change
Add a narrowly additive normalized projection/helper in `knowledge-boundary` with exact-shape fail-closed behavior.

# Acceptance criteria
- deterministic and provider-neutral;
- no sensitive payload/provider/secret/promotion-authority fields;
- invalid/unknown/mismatched inputs fail closed;
- manual and assisted references remain distinguishable;
- human authority remains sourced only from corrected Decision Boundary verification;
- declared validations pass.

# Non-goals
No WBS 17.2 enforcement, WBS 17.3 promotion/anonymization, automatic reuse authority or Decision Boundary contract change.

# Evidence expected
Focused product tests over exported APIs.

# Escalation
Stop if this requires Evidence & Provenance semantic redesign or undeclared L4.
