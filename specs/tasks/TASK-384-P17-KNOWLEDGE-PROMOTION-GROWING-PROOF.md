---
id: TASK-384
title: Prove promotion control contract chain and close Construction A
status: ready
priority: 384
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-383]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-03.md
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - packages/contracts/knowledge-boundary/index.ts
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-CONTRACT-01.report.md
  - specs/tasks/TASK-384-P17-KNOWLEDGE-PROMOTION-GROWING-PROOF.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Produce the integrated Construction A growing proof and Sprint Report for WBS 17.3 contracts.

# Context
Construction A must prove the full contract chain before any consumer-integration Construction B can be considered.

# Current behavior
TASK-379..383 will provide isolated contracts/composition but require one representative integrated proof.

# Inputs / contracts
Closed WBS 17.1/17.2 truth plus TASK-379..383 outputs.

# Outputs / contracts
Product-level integrated proof and `P17-KNOWLEDGE-PROMOTION-CONTRACT-01.report.md`.

# Required change
Exercise candidate -> permitted transformation -> genericity evidence -> human-authoritative promotion/rejection composition, including fail-closed negative paths and predecessor compatibility.

# Acceptance criteria
- proves promotion and rejection recording with canonical human authority;
- proves transformation/genericity/eligibility cannot independently authorize promotion;
- proves mismatch/unknown/sensitive-payload attempts fail closed;
- Sprint Report records commits, validations, deviations and residual work;
- repository-wide verification passes.

# Non-goals
No Construction B consumer wiring, promotion execution, WBS expansion or Decision Boundary change.

# Evidence expected
Integrated deterministic product proof plus Sprint Report.

# Escalation
Stop if the Package Goal requires undeclared L4 or changing canonical authority semantics.