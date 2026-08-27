---
id: TASK-365
title: Integrate assisted classification references without authority escalation
status: completed
priority: 365
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-364
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01.md
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/decision-boundary/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-365-P17-ASSISTED-KNOWLEDGE-EVIDENCE-INTEGRATION.md
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
Integrate assisted classification references through the representative evidence path while preserving proposal-only semantics until verified human decision.

# Context
Construction A plus TASK-362 make assisted proposal data non-authoritative and final authority human-decision only.

# Current behavior
Proposal and final classification are normalized independently but not consumed together through a representative evidence path.

# Inputs / contracts
- TASK-363/364 projection path;
- corrected assisted KnowledgeClassificationDecision and proposal reference;
- Decision Boundary and Evidence & Provenance reference semantics.

# Outputs / contracts
Deterministic assisted-path projection preserving proposalRef as traceability and final verified human decision as authority.

# Required change
Compose the representative projection so proposal/confidence/model context cannot satisfy authority and final human-decision evidence remains mandatory.

# Acceptance criteria
- proposalRef is traceability only;
- proposal-only or probabilistic/deterministic substitution fails closed;
- decisionActorRef remains equal to verified authorityRef;
- no sensitive payload/provider/secret material;
- manual path remains compatible;
- declared validations pass.

# Non-goals
No automatic authority, WBS 17.2 enforcement, WBS 17.3 promotion/anonymization or provider execution.

# Evidence expected
Positive assisted path and negative proposal-only/category-substitution tests.

# Escalation
Stop if satisfying this requires weakening human authority or changing Decision Boundary public contract.
