---
id: TASK-366
title: Prove representative knowledge classification consumer integration
status: ready
priority: 366
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-365
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-01.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01.md
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/decision-boundary/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01.report.md
  - specs/tasks/TASK-366-P17-KNOWLEDGE-INTEGRATION-GROWING-PROOF.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Close Construction B with an integrated representative consumer proof and Sprint Report.

# Context
TASK-363..365 establish projection and manual/assisted evidence-facing consumption while preserving corrected human authority.

# Current behavior
Individual integration helpers will exist, but Sprint closure requires one coherent end-to-end proof.

# Inputs / contracts
- TASK-363..365 exported Knowledge Boundary integration helpers;
- existing Decision Boundary and Evidence & Provenance contracts.

# Outputs / contracts
- integrated product proof;
- `P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01.report.md` with commits, gates, findings and Construction C disposition.

# Required change
Exercise manual and assisted representative paths, invalid/mismatched cases, purpose/use restrictions and payload-minimal traceability through real exported APIs.

# Acceptance criteria
- manual and assisted paths succeed with explicit class/owner/purpose/use references;
- proposal-only assisted input cannot substitute for verified human decision;
- invalid restrictions cannot become implicit permission;
- sensitive payload/provider/secret/promotion-authority material is absent/rejected;
- predecessor Decision Boundary and Evidence & Provenance behavior remains compatible;
- WBS 17.2/17.3 behavior remains absent;
- Sprint Report records evidence-based Construction C disposition;
- declared validations pass.

# Non-goals
No new production contract in this TASK, no enforcement, promotion, anonymization, provider execution or automatic reuse authority.

# Evidence expected
One integrated product test plus Sprint Report tied to TASK-363..366.

# Escalation
Stop if integrated proof exposes a missing WBS 17.1 capability that cannot be corrected inside materialized scope.
