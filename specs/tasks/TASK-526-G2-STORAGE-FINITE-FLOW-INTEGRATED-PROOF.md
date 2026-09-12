---
id: TASK-526
title: Prove integrated storage identity provider-copy lifecycle and finite-flow semantics
status: blocked
priority: 526
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-525
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-07-DURABLE-EXECUTION-STORAGE-FINITE-FLOW.md
  - packages/contracts/storage/**
  - packages/contracts/finite-flow/**
allowed_paths:
  - tests/product/g2-storage-finite-flow-integrated-proof.test.ts
  - specs/tasks/TASK-526-G2-STORAGE-FINITE-FLOW-INTEGRATED-PROOF.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 2
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Close Construction B with integrated Product Proof across TASK-523..525 without introducing new semantic ownership.

# Required change
Add only integrated Product Proof for canonical object identity, provider-copy transfer/availability, disposition/residual copies and finite-flow composition.

# Acceptance criteria
- provider key/hash/copy never becomes canonical object identity;
- ACK never strengthens durable/integrity-qualified availability without evidence;
- dedup preserves authority/lifecycle distinctions;
- PARTIAL/UNKNOWN remains non-strengthening;
- disposition preserves residual-copy visibility and qualified population;
- transfer/replay/disposition remain finitely drainable only under explicit units/population/time assumptions.

# Non-goals
New contracts, vendor adapters, persistence, messaging, deployment or Production Readiness.