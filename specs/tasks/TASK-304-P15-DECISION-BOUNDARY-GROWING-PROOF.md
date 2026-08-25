---
id: TASK-304
title: Prove integrated decision-boundary foundation behavior
status: completed
priority: 304
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-303
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-CONTRACT-01.md
  - packages/contracts/decision-boundary/**
  - docs/adr/ADR-0010-durable-human-approval.md
allowed_paths:
  - packages/contracts/decision-boundary/**
  - tests/product/**
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-CONTRACT-01.report.md
  - specs/tasks/TASK-304-P15-DECISION-BOUNDARY-GROWING-PROOF.md
forbidden_paths:
  - .github/**
  - docs/adr/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove the complete Construction A decision-boundary foundation as one deterministic growing product proof.
# Context
TASK-298..303 establish taxonomy, normalization, risk/criticality, deterministic-invariant guard, human-authority reservation and probabilistic inference context.
# Current behavior
The individual capabilities are not yet certified together as the bounded foundation required before enforcement propagation.
# Required change
Add an integrated proof that exercises representative deterministic, human-reserved and probabilistic decision descriptors through normalization and guard evaluation, including negative/failure cases and backward-compatible explicit absence behavior.
# Inputs / contracts
All preceding P15 Construction A outputs and ADR-0010 boundary constraints.
# Outputs / contracts
A deterministic product-level proof and Sprint report evidence showing the foundation is ready for fresh-main propagation planning.
# Acceptance criteria
The proof demonstrates all three categories, explicit risk/criticality, probabilistic confidence/model context, rejection of ungated probabilistic control over deterministic invariants, rejection of inference substitution for human authority, explicit invalid/unknown handling and no provider/network/secret dependency.
# Non-goals
No Construction B propagation, no remote model execution, no policy engine, no authorization redesign, no WBS 15.3 verification suite.
# Evidence expected
Integrated product test plus Construction A report and repository verification.
# Escalation
Stop only if the integrated proof reveals a Package Goal prerequisite outside materialized Construction A scope; record it for fresh-main revalidation rather than broadening the Sprint.
