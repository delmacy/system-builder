---
id: TASK-356
title: Define purpose and use restriction contract
status: ready
priority: 356
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
  - project_docs/17-knowledge-boundary/scope/README.md
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-356-P17-KNOWLEDGE-PURPOSE-USE-RESTRICTIONS.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/ai-gateway/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define portable purpose/use restriction metadata for WBS 17.1.3.

# Context
Classification alone is insufficient to explain why classified knowledge may be used or reused.

# Current behavior
There is no dedicated Knowledge Boundary contract for explicit allowed purposes and use restrictions.

# Inputs / contracts
- TASK-355 classification/ownership descriptor;
- WBS 17.1.3.

# Outputs / contracts
- additive purpose/use restriction contract under `packages/contracts/knowledge-boundary/**`;
- focused deterministic tests.

# Required change
Represent explicit purpose identifiers and restrictions with versioned fail-closed validation and deterministic normalization. Do not infer permission from missing data.

# Acceptance criteria
- purposes/restrictions are explicit and canonicalizable;
- duplicates/invalid/unknown shapes fail closed;
- absence does not become implicit reuse permission;
- no promotion/enforcement/provider/authority behavior is introduced;
- declared validations pass.

# Non-goals
No policy enforcement, promotion decision, anonymization or external lookup.

# Evidence expected
Positive/negative/canonical-equivalence product tests.

# Escalation
Stop if purpose rules require business policy not present in repository authority.
