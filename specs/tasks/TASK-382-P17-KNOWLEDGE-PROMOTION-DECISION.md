---
id: TASK-382
title: Define promotion or rejection decision provenance contract
status: completed
priority: 382
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-381]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-03.md
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - packages/contracts/knowledge-boundary/index.ts
  - packages/contracts/decision-boundary/index.ts
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-382-P17-KNOWLEDGE-PROMOTION-DECISION.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define durable promotion/rejection decision provenance for WBS 17.3.3 while preserving canonical M15 human authority.

# Context
Eligibility, transformation and genericity evidence are inputs only. Final promotion/rejection recording must not allow automated evidence to become authority.

# Current behavior
No WBS 17.3 decision record binds candidate/evidence provenance to an existing canonical human decision.

# Inputs / contracts
TASK-379..381 contracts and the existing public Decision Boundary verification contract.

# Outputs / contracts
Provider-neutral promotion/rejection decision record referencing canonical human authority plus predecessor evidence.

# Required change
Add deterministic normalization that accepts promotion/rejection only when tied to an existing `human-decision` authority input; deterministic/probabilistic categories, actor mismatch or evidence mismatch fail closed.

# Acceptance criteria
- final disposition is explicit promotion or rejection;
- canonical `human-decision` authority is verified through the existing Decision Boundary API without modifying it;
- automated evidence never grants authority;
- provenance references are complete and payload-minimal;
- declared validations pass.

# Non-goals
No Decision Boundary public-contract change, promotion execution or catalog publication.

# Evidence expected
Positive human-authority path and negative deterministic/probabilistic substitution/mismatch tests.

# Escalation
Stop if the existing Decision Boundary public API cannot support the required verification without L4/change-control.