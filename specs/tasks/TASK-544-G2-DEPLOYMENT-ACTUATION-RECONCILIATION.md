---
id: TASK-544
title: Define deployment actuation outcome and ambiguous mutation reconciliation
status: verification
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

# Context
TASK-543 owns canonical deployment intent plus desired/observed/effective generation semantics and is integrated by PR #754. This TASK adds only the actuation-result and reconciliation seam required between canonical intent and later runtime-convergence evidence.

# Current behavior
The KEEP baseline can initiate local deployment/runtime work and retain durable deployment truth, but the generalized G2-WBS-14 contract does not yet express provider-neutral actuation outcomes or an explicit policy for ambiguous unsafe mutation.

# Required change
Add provider-neutral actuation outcome semantics that preserve applied/not-applied/partial/unknown distinctions, keep provider acknowledgement separate from effective runtime truth, preserve independent observed/effective currentness, and require reconciliation before retry when an unsafe mutation outcome is unknown. Qualified retry evidence must prove both current generations remain older than the still-current desired generation; evidence that a later generation is observed or effective must never authorize replay of an obsolete actuation.

# Inputs / contracts
- canonical deployment intent and independent observed/effective generation/currentness semantics from TASK-543;
- existing DeploymentRecord/local Deploy behavior as KEEP baseline;
- evidence semantics in which PARTIAL/UNKNOWN/INCONCLUSIVE never strengthen authority or convergence.

# Outputs / contracts
A revisioned deployment-actuation contract that records non-strengthening mutation outcomes, reconciliation requirements and retry eligibility without creating provider-specific authority or claiming effective runtime state.

# Acceptance criteria
- provider ACK never proves effective/converged runtime;
- mutation outcomes preserve APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN or equivalent non-strengthening distinctions;
- unsafe UNKNOWN requires reconcile-before-retry;
- observed and effective currentness remain independently qualified;
- retries cannot duplicate authority, replay an obsolete desired generation, or advance effective generation without qualified observation;
- rollback actuation is distinct from release rollback eligibility;
- deterministic proof covers timeout-after-apply, partial actuation, stale ACK, independently stale/unknown currentness, later-generation evidence and duplicate retry.

# Non-goals
Concrete providers, remote orchestration implementation, persistence, traffic management, runtime-core changes or Production Readiness.

# Evidence expected
Focused deterministic Product Proof for ambiguous actuation/reconciliation behavior plus exact-head repository validation; provider acknowledgement alone must never be accepted as effectiveness evidence.

# Escalation
Return to Sprint Review rather than introducing provider-specific adapters, persistence, distributed topology/traffic ownership, runtime-core mutation or Production Readiness scope.
