---
id: TASK-360
title: Define payload-minimal classification evidence projection
status: completed
priority: 360
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-358
  - TASK-359
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-01.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01.md
  - packages/contracts/evidence-provenance/**
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-360-P17-KNOWLEDGE-CLASSIFICATION-EVIDENCE-PROJECTION.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/evidence-provenance/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define a payload-minimal projection that links classification decisions to evidence/provenance references without carrying sensitive content.

# Context
Knowledge Boundary completion requires explaining why a classification exists while preventing classification metadata from becoming a sensitive payload channel.

# Current behavior
The new contracts lack one explicit projection for decision/evidence references suitable for later consumer integration.

# Inputs / contracts
- TASK-358 normalized classification contracts;
- TASK-359 assisted proposal boundary;
- existing Evidence & Provenance reference semantics.

# Outputs / contracts
- additive classification evidence/reference projection under `packages/contracts/knowledge-boundary/**`;
- focused product tests.

# Required change
Represent only stable decision/proposal/evidence reference identifiers and classification/purpose metadata needed for traceability; reject inline evidence payloads, secret values and provider-specific material.

# Acceptance criteria
- projection is deterministic and payload-minimal;
- evidence/proposal references are explicit;
- inline sensitive payload fields are rejected;
- missing evidence is not fabricated;
- no promotion/enforcement authority is introduced;
- declared validations pass.

# Non-goals
No evidence repository, payload fetch, anonymization, promotion or catalog enforcement.

# Evidence expected
Tests proving traceability references survive normalization without sensitive payload carriage.

# Escalation
Stop if satisfying traceability requires changing Evidence & Provenance architecture or storing payloads.
