---
id: TASK-544
title: Define deployment actuation outcome and ambiguous mutation reconciliation
status: blocked
priority: 544
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-543
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-543-G2-DEPLOYMENT-GENERATION-SEMANTICS.md
  - packages/contracts/deployment-runtime/**
allowed_paths:
  - packages/contracts/deployment-runtime/**
  - tests/product/g2-deployment-actuation-proof.test.ts
  - specs/tasks/TASK-544-G2-DEPLOYMENT-ACTUATION-RECONCILIATION.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
  - packages/deploy/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define provider-neutral deployment actuation outcome semantics that distinguish provider acknowledgement from effective truth and route ambiguous unsafe mutation through reconciliation before retry.

# Acceptance criteria
- provider ACK never proves effective/converged runtime;
- mutation outcomes preserve APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN or equivalent non-strengthening distinctions;
- unsafe UNKNOWN requires reconcile-before-retry;
- retries cannot duplicate authority or advance effective generation without qualified observation;
- rollback actuation is distinct from release rollback eligibility;
- deterministic proof covers timeout-after-apply, partial actuation, stale ACK and duplicate retry.

# Non-goals
Concrete providers, remote orchestration implementation, persistence, traffic management, runtime-core changes or Production Readiness.
