---
id: TASK-362
title: Define payload-minimal knowledge classification reference projection
status: ready
priority: 362
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
  - specs/tasks/TASK-362-P17-KNOWLEDGE-REFERENCE-PROJECTION.md
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
Define the portable payload-minimal projection that representative evidence-facing consumers can use to carry WBS 17.1 classification references.

# Context
Construction A defines canonical classification/use/decision/evidence contracts but no consumer-facing projection boundary.

# Current behavior
Consumers would need to understand the full classification bundle or invent their own projection, which leaves the Package integration proof incomplete.

# Inputs / contracts
- KnowledgeClassificationBundle and existing payload-minimal classification evidence semantics;
- Evidence & Provenance reference semantics.

# Outputs / contracts
A provider-neutral deterministic reference projection containing only stable classification/owner/purpose/use and decision/proposal/evidence references required by representative consumers.

# Required change
Add a narrowly additive normalized projection/helper in `knowledge-boundary` and focused tests proving canonicalization and exact-shape fail-closed behavior.

# Acceptance criteria
- projection is versioned/provider-neutral and deterministic;
- no sensitive payload, provider, endpoint, credential, secret or promotion-authority field can be carried;
- unknown/missing/mismatched fields fail closed;
- manual and assisted decision references remain distinguishable;
- predecessor Construction A APIs remain backward-compatible;
- declared validations pass.

# Non-goals
No WBS 17.2 enforcement, WBS 17.3 promotion/anonymization, consumer wiring outside declared contracts, or automatic reuse authority.

# Evidence expected
Focused product tests over exported APIs.

# Escalation
Stop if the projection requires a new bounded-context/module boundary or modification of Evidence & Provenance public semantics.
