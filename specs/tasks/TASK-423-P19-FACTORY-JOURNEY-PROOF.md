---
id: TASK-423
title: Prove canonical factory journey contract end to end
status: blocked
priority: 423
milestone: M19
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-422
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-PACKAGE-01-CONSOLIDATED-PREALPHA.md
  - project_docs/execution_planning/P19-FACTORY-JOURNEY-CONTRACT-01.md
  - project_docs/19-pre-alpha-productization/WBS.md
  - packages/contracts/factory-boundary/**
  - packages/contracts/process-versioning/**
  - tests/product/**
allowed_paths:
  - tests/product/**
  - packages/contracts/factory-boundary/**
  - specs/tasks/TASK-423-P19-FACTORY-JOURNEY-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/contracts/decision-boundary/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Close Construction 1 with growing product evidence for the exact WBS 19.1.1 journey contract over integrated predecessor identities.

# Required change
Add focused product proof that composes canonical approved/versioned process identity through analysis/definition and the existing factory-boundary artifact stages to deployment identity, plus bypass-resistant negative cases.

# Acceptance criteria
- one deterministic canonical full journey is proven from exact predecessor identities;
- proof consumes real public contracts rather than hand-authored parallel identity models;
- negative coverage includes missing, stale, duplicate, reordered, substituted and lineage-broken stages;
- model/Git/PR/classification metadata cannot satisfy business-authority or canonical identity requirements;
- no runtime/deploy side effect is required by the proof;
- declared validations pass.

# Non-goals
No WBS 19.1.2 composition engine, WBS 19.1.3 command/API, operator bootstrap, runtime launch or dogfood.

# Escalation
Stop if proof requires successor-sprint implementation, topology change or undeclared L4.