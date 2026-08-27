---
id: TASK-377
title: Close Construction B knowledge enforcement integration proof
status: ready
priority: 377
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-376
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-02.md
  - project_docs/execution_planning/P17-KNOWLEDGE-ENFORCEMENT-INTEGRATION-01.md
  - project_docs/17-knowledge-boundary/WBS.md
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/P17-KNOWLEDGE-ENFORCEMENT-INTEGRATION-01.report.md
  - specs/tasks/TASK-377-P17-KNOWLEDGE-ENFORCEMENT-INTEGRATION-GROWING-PROOF.md
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
Close Construction B with an integrated growing proof and Sprint Report.

# Context
The Sprint exit must prove representative consumer integration and Package Goal progress, not isolated helpers.

# Current behavior
TASK-373..376 will provide consumer integration/proofs but no final Construction B exit report.

# Inputs / contracts
- TASK-373..376 outputs;
- closed WBS 17.1 authority truth;
- Construction A enforcement contracts.

# Outputs / contracts
Integrated product proof and `P17-KNOWLEDGE-ENFORCEMENT-INTEGRATION-01.report.md`.

# Required change
Exercise catalog, observe and AI Gateway representative paths plus pre-promotion/bypass negatives; record commits, gates, deviations and residual work. Determine only a recommendation for Construction C, subject to post-merge fresh-main revalidation.

# Acceptance criteria
- growing proof uses actual exported APIs;
- unauthorized knowledge fails closed across representative paths;
- payload-minimal references remain explicit;
- no WBS 17.3 is executed;
- Sprint Report records Construction C as evidence-gated, not automatically materialized;
- declared validations pass.

# Non-goals
No Package Review, Documentation & Closure or successor WBS 17.3 behavior.

# Evidence expected
Integrated product test plus Sprint Report.

# Escalation
Stop if Package Goal cannot be reached without undeclared L4 or WBS 17.3 execution.
