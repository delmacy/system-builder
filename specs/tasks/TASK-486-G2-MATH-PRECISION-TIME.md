---
id: TASK-486
title: Define precision rounding and temporal-window semantics
status: ready
priority: 486
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-485
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-03-MATHEMATICAL-SEMANTICS.md
  - project_docs/execution_planning/G2-MATH-SEMANTIC-FOUNDATION-01.md
  - specs/tasks/TASK-485-G2-MATH-UNITS-DIMENSIONS.md
  - packages/contracts/mathematical-semantics/**
allowed_paths:
  - packages/contracts/mathematical-semantics/**
  - tests/product/g2-mathematical-semantics*.test.ts
  - specs/tasks/TASK-486-G2-MATH-PRECISION-TIME.md
  - project_docs/execution_planning/G2-MATH-SEMANTIC-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/elicitation-knowledge-base/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Make numeric precision/rounding and temporal observation windows explicit and deterministic.

# Required change
Define bounded portable contracts for precision/scale, rounding policy and temporal windows/anchors applicable to analytical values without inventing domain-specific clocks or runtime scheduling.

# Acceptance criteria
- precision/scale and rounding mode are explicit when material;
- no host-language/default rounding becomes semantic authority;
- temporal window includes explicit boundary/anchor semantics sufficient to distinguish materially different windows;
- instant, interval/window and unknown temporal context remain distinct;
- unit/dimension lineage from TASK-485 remains preserved;
- historical producing revision cannot be replaced by current policy.

# Negative/adversarial proof
Reject implicit rounding, materially ambiguous window bounds, stale/latest policy substitution and temporal-context omission where required.

# Non-goals
Schedulers, workflow timers, persistence, time-series storage, SLA/SLO ownership, vector semantics.
