---
id: TASK-425
title: Compose process inputs through definition and capability resolution
status: blocked
priority: 425
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-424
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-FACTORY-COMPOSITION-01.md
  - packages/contracts/business-recipe/**
  - packages/contracts/process-versioning/**
  - packages/contracts/system-analysis/**
  - packages/contracts/system-definition/**
  - packages/catalog/**
  - packages/contracts/factory-boundary/**
allowed_paths:
  - packages/catalog/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
  - specs/tasks/TASK-425-P19-FACTORY-COMPOSITION-UPSTREAM.md
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
Compose canonical approved/versioned process input through the existing analysis/definition identities into capability resolution without manual downstream fixture stitching.

# Required change
Use the exact process, analysis and SystemDefinition identities already carried by the journey contract to drive existing public capability-resolution behavior. Reject stale, mismatched, missing or lineage-broken predecessors rather than substituting fixtures.

# Acceptance criteria
- exact canonical process and definition identity is propagated;
- capability resolution consumes existing public contracts/APIs;
- stale/missing/mismatched predecessors fail closed;
- no duplicate identity model or business-authority substitution is introduced;
- declared validations pass.

# Escalation
Stop if implementation requires Decision Boundary changes, a new topology or undeclared L4.
