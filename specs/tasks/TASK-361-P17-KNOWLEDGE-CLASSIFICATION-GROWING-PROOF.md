---
id: TASK-361
title: Prove integrated knowledge classification contract boundary
status: ready
priority: 361
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-360
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-01.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01.md
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/decision-boundary/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01.report.md
  - specs/tasks/TASK-361-P17-KNOWLEDGE-CLASSIFICATION-GROWING-PROOF.md
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
Close Construction A with a growing integrated proof across TASK-355..360 and a Sprint Report.

# Context
Construction A must prove WBS 17.1 contracts coherently before any consumer integration Sprint is promoted.

# Current behavior
Individual contract proofs will exist, but Sprint closure requires one integrated proof of class/owner/purpose/manual-assisted/evidence semantics.

# Inputs / contracts
- TASK-355..360 exported Knowledge Boundary contracts;
- existing Decision Boundary and Evidence & Provenance semantics.

# Outputs / contracts
- integrated product proof;
- `P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01.report.md`.

# Required change
Exercise manual and assisted classification paths, invalid/fail-closed cases, purpose restrictions, payload-minimal evidence projection and predecessor compatibility through real exported APIs.

# Acceptance criteria
- all four knowledge classes are covered;
- assisted proposal cannot substitute for human decision;
- absence/invalid restrictions cannot become implicit permission;
- sensitive payload/provider/secret material is absent from projections;
- WBS 17.2/17.3 behavior remains absent;
- Sprint Report records commits, gates, deviations/discoveries and Construction B disposition;
- declared validations pass.

# Non-goals
No new production contract in this TASK, no enforcement, promotion, anonymization or consumer wiring.

# Evidence expected
One integrated product test plus Sprint Report tied to TASK-355..361.

# Escalation
Stop if integrated proof exposes a missing WBS 17.1 capability that cannot be corrected inside materialized TASK scope.
