---
id: TASK-383
title: Compose promotion control with closed knowledge boundary predecessors
status: ready
priority: 383
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-379, TASK-380, TASK-381, TASK-382]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-03.md
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-CONTRACT-01.md
  - packages/contracts/knowledge-boundary/index.ts
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-383-P17-KNOWLEDGE-PROMOTION-COMPOSITION.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Compose WBS 17.3 contracts deterministically with the closed WBS 17.1 classification/use-policy and WBS 17.2 enforcement/eligibility truth.

# Context
The package needs one canonical fail-closed composition rather than independent consumer inference.

# Current behavior
No WBS 17.3 aggregate verifies predecessor/candidate/transformation/evidence/decision reference coherence end-to-end.

# Inputs / contracts
Closed WBS 17.1/17.2 contracts and TASK-379..382 outputs.

# Outputs / contracts
Deterministic provider-neutral promotion-control aggregate/normalizer.

# Required change
Compose the chain and reject mismatched refs, ineligible/denied predecessor state, incomplete genericity evidence or non-human final authority.

# Acceptance criteria
- full reference chain is coherent and normalized;
- invalid/unknown/mismatched state fails closed;
- eligibility/transformation/testing remains non-authoritative;
- no sensitive payload or Decision Boundary contract change;
- declared validations pass.

# Non-goals
No consumer wiring or promotion execution.

# Evidence expected
End-to-end contract-level positive/negative composition tests.

# Escalation
Stop for undeclared L4, Decision Boundary public-contract change or sensitive payload requirement.