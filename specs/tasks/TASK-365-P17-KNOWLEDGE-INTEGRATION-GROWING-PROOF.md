---
id: TASK-365
title: Prove representative knowledge classification consumer integration
status: ready
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
  - project_docs/execution_planning/P17-PACKAGE-01.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01.md
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/decision-boundary/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01.report.md
  - specs/tasks/TASK-365-P17-KNOWLEDGE-INTEGRATION-GROWING-PROOF.md
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
TASK-362..364 must demonstrate the Package integration boundary without drifting into WBS 17.2/17.3.

# Current behavior
Individual integration proofs will exist, but Sprint closure requires one coherent end-to-end proof of manual and assisted classification reference consumption.

# Inputs / contracts
- TASK-362..364 exported Knowledge Boundary integration helpers;
- existing Decision Boundary and Evidence & Provenance contracts.

# Outputs / contracts
- integrated product proof;
- `P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01.report.md` recording commits, gates, discoveries and Construction C disposition.

# Required change
Exercise manual and assisted representative evidence-facing paths, invalid/mismatched reference cases, purpose/use restrictions and payload-minimal traceability through real exported APIs.

# Acceptance criteria
- manual and assisted consumer paths both succeed with explicit class/owner/purpose/use references;
- proposal-only assisted input cannot substitute for final human classification decision;
- absent/invalid restrictions cannot become implicit permission;
- sensitive payload/provider/secret/promotion-authority material is absent/rejected;
- predecessor Decision Boundary and Evidence & Provenance behaviors remain compatible;
- WBS 17.2/17.3 behavior remains absent;
- Sprint Report records evidence-based Construction C disposition;
- declared validations pass.

# Non-goals
No new production contract in this TASK, no enforcement, promotion, anonymization, provider execution or automatic reuse authority.

# Evidence expected
One integrated product test plus Sprint Report tied to TASK-362..365.

# Escalation
Stop if integrated proof exposes a missing WBS 17.1 capability that cannot be corrected inside materialized TASK scope.
