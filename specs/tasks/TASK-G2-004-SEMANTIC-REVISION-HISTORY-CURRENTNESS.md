---
id: TASK-G2-004
title: Resolve semantic revision history and qualified currentness deterministically
status: committed
priority: 1004
milestone: G2-WP-01
model_tier: strong
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-G2-002, TASK-G2-003]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-PLANNING-MATERIALIZATION-01.md
  - project_docs/execution_planning/G2-SEMANTIC-IDENTITY-REVISION-CONTRACT-01.md
  - packages/contracts/**
allowed_paths:
  - packages/contracts/**
  - tests/product/**
  - specs/tasks/TASK-G2-004-SEMANTIC-REVISION-HISTORY-CURRENTNESS.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Provide deterministic revision-history/currentness resolution over the committed semantic contract while retaining immutable historical addressability and explicit `PARTIAL/UNKNOWN` qualification.

# Acceptance criteria
- adding a successor revision never mutates or disconnects the predecessor revision;
- current/latest resolution is separate from historical lookup;
- stale/superseded revision is explicit rather than silently reinterpreted;
- locality/population differences may produce `PARTIAL`/`UNKNOWN` and cannot be collapsed to a stronger global state;
- duplicate/conflicting revision identities fail deterministically;
- resolution is side-effect free and deterministic;
- declared validations pass.

# Negative/adversarial cases
Out-of-order inputs, duplicate revision identity, missing predecessor, unknown locality, mixed population currentness and stale references are explicitly handled without authority inference.

# Non-goals
No persistence migration, source-of-truth cutover, provider polling, workflow retry or Fleet federation.

# Escalation
Stop if resolution requires mutable historical identity or a second lifecycle owner.