---
id: TASK-406
title: Enforce human process-change authority in evolution integration
status: materialized
priority: 406
milestone: M18
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-405
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-02.md
  - project_docs/execution_planning/P18-PROCESS-SEMANTIC-CHANGE-INTEGRATION-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/support-evolution/**
  - packages/contracts/process-change/**
  - packages/contracts/decision-boundary/**
allowed_paths:
  - packages/support-evolution/**
  - tests/product/**
  - specs/tasks/TASK-406-P18-SEMANTIC-CHANGE-EVOLUTION-HUMAN-AUTHORITY.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/contracts/process-versioning/**
  - packages/contracts/process-change/**
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Require canonical human process-change approve/reject authority at the Support/Evolution consumer seam while preserving classification/model/PR/Git as non-authoritative evidence.

# Required change
Extend the integration seam to consume the existing public process-change decision validator and canonical `human-decision` authority. The exact `authorityRef` must match the validated human decision. Approved/rejected outcome must be derived from that canonical decision, not caller flags or classification.

# Acceptance criteria
- only canonical human-decision authority can back approved/rejected business outcome;
- authorityRef mismatch fails closed;
- deterministic/probabilistic/model output, PR/ADR approval, Git identity and caller booleans cannot substitute for human process-change authority;
- rejected outcome cannot be caller-promoted to approved;
- Decision Boundary files are unchanged;
- declared validations pass.

# Non-goals
No Decision Boundary contract change, no engineering approval redesign, no WBS 18.3 semantics.

# Escalation
Stop if existing public contracts cannot enforce human authority without modifying Decision Boundary semantics.
