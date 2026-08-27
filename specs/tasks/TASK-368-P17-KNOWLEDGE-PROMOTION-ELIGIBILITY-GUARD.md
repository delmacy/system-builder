---
id: TASK-368
title: Define knowledge promotion eligibility guard
status: ready
priority: 368
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-367
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-02.md
  - project_docs/execution_planning/P17-KNOWLEDGE-ENFORCEMENT-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - packages/contracts/knowledge-boundary/index.ts
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-368-P17-KNOWLEDGE-PROMOTION-ELIGIBILITY-GUARD.md
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
Define the fail-closed eligibility guard required by WBS 17.2.2 before any knowledge can enter a promotion boundary.

# Context
WBS 17.2 must prevent unauthorized proprietary content from being promoted. WBS 17.3 owns anonymization/generalization/review and is not yet executable.

# Current behavior
No canonical pre-promotion eligibility contract exists.

# Inputs / contracts
- TASK-367 enforcement disposition;
- closed WBS 17.1 classification/use restrictions.

# Outputs / contracts
- additive promotion-eligibility guard result;
- negative proof for unauthorized proprietary/personal/trade-secret cases.

# Required change
Represent explicit eligible/ineligible disposition with traceable reasons/references, defaulting fail-closed when required authority/purpose/restriction evidence is missing or incompatible.

# Acceptance criteria
- proprietary knowledge without explicit compatible permission is ineligible;
- personal/trade-secret state does not become promotable by inference;
- absent/unknown restrictions fail closed;
- no anonymized/generalized artifact is created;
- declared validations pass.

# Non-goals
No WBS 17.3 promotion execution, anonymization, genericity review or catalog publication.

# Evidence expected
Positive/negative product tests proving pre-promotion eligibility only.

# Escalation
Stop if implementation would create promotion workflow behavior or weaken M15/WBS 17.1 authority.
