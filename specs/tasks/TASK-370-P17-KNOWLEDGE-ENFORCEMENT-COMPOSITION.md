---
id: TASK-370
title: Compose enforcement with canonical classification and use policy
status: completed
priority: 370
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-367
  - TASK-368
  - TASK-369
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-02.md
  - project_docs/execution_planning/P17-KNOWLEDGE-ENFORCEMENT-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - packages/contracts/knowledge-boundary/index.ts
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-370-P17-KNOWLEDGE-ENFORCEMENT-COMPOSITION.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/decision-boundary/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Compose TASK-367..369 with the closed WBS 17.1 contracts into one deterministic enforcement evaluation.

# Context
The package must consume canonical classification/use truth rather than duplicate policy semantics in each future consumer.

# Current behavior
The predecessor contracts exist but no canonical enforcement composition consumes them together.

# Inputs / contracts
- WBS 17.1 canonical classification, ownership, purpose/use restriction and human decision references;
- TASK-367 enforcement disposition;
- TASK-368 eligibility guard;
- TASK-369 reference envelope.

# Outputs / contracts
- deterministic enforcement evaluation/composition;
- fail-closed proof for incompatible references and missing restrictions.

# Required change
Normalize and compose predecessor inputs once, preserve human-authority provenance, derive only the bounded enforcement/eligibility result authorized by WBS 17.2, and reject inconsistent references.

# Acceptance criteria
- composition uses real exported WBS 17.1 contracts;
- incompatible/missing decision or restriction references fail closed;
- deterministic/probabilistic actors cannot replace human classification authority;
- no WBS 17.3 behavior is introduced;
- declared validations pass.

# Non-goals
No consumer wiring, anonymization/generalization or publication.

# Evidence expected
Integrated positive/negative product tests using actual predecessor APIs.

# Escalation
Stop if composition requires changing the Decision Boundary public contract or architecture topology.
