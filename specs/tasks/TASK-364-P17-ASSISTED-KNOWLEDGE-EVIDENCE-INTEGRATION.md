---
id: TASK-364
title: Integrate assisted classification references without authority escalation
status: ready
priority: 364
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-363
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01.md
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/decision-boundary/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-364-P17-ASSISTED-KNOWLEDGE-EVIDENCE-INTEGRATION.md
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
Integrate assisted classification references through the representative evidence-facing path while preserving proposal-only semantics until explicit human decision.

# Context
Construction A established assisted proposals as non-authoritative. Construction B must prove that this remains true through consumer projection.

# Current behavior
The assisted proposal and final classification decision are normalized independently but not yet proven through one representative consumer path.

# Inputs / contracts
- TASK-362/363 projection path;
- assisted KnowledgeClassificationDecision and proposal reference;
- Decision Boundary / Evidence & Provenance reference semantics.

# Outputs / contracts
Deterministic assisted-path projection/consumption proof that carries proposalRef only as traceability and still requires the explicit final human decision reference.

# Required change
Compose the representative projection so assisted paths preserve proposalRef plus final decision evidence without allowing proposal/confidence/model context to satisfy authority.

# Acceptance criteria
- proposalRef remains traceability only;
- absence of final human decision fails closed;
- probabilistic confidence/model/context references cannot become authorization;
- sensitive payload/provider/secret material remains absent;
- manual path remains compatible;
- declared validations pass.

# Non-goals
No automatic classification authority, WBS 17.2 enforcement, WBS 17.3 promotion/anonymization or provider execution.

# Evidence expected
Positive assisted path plus negative proposal-only/mismatched-reference product tests.

# Escalation
Stop if satisfying the task requires weakening human authority or changing Decision Boundary architecture.
