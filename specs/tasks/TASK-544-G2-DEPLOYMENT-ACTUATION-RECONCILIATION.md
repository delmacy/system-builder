---
id: TASK-544
title: Define deployment actuation outcome and ambiguous mutation reconciliation
status: completed
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
TASK-543 owns canonical deployment intent plus desired/observed/effective generation semantics and is integrated by PR #754. TASK-544 was integrated by PR #758 after bounded semantic hardening that preserved independent observed/effective currentness and prevented obsolete-generation replay.

# Current behavior
The KEEP baseline can initiate local deployment/runtime work and retain durable deployment truth, while the generalized G2-WBS-14 contract now expresses provider-neutral actuation outcomes and an explicit policy for ambiguous unsafe mutation.

# Required change
Completed by PR #758. Provider-neutral actuation outcome semantics preserve applied/not-applied/partial/unknown distinctions, keep provider acknowledgement separate from effective runtime truth, preserve independent observed/effective currentness, and require reconciliation before retry when an unsafe mutation outcome is unknown. Qualified retry evidence must prove both current generations remain older than the still-current desired generation; evidence that a later generation is observed or effective never authorizes replay of an obsolete actuation.

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

# Evidence
PR #758 exact head `6af5158cb91f80ebf08c84d3552b2dc4238a5d11` passed Deterministic CI #1777 and Heavy Product Tests #1368/#1369. Merge Candidate CI #7 was green against the then-current main before merge. PR #758 merged as `6de7a01be4b073a231f001beb298a95bf5ecf64d`.

# Escalation
Further semantics belong to TASK-545 or Sprint Review; do not introduce provider-specific adapters, persistence, distributed topology/traffic ownership, runtime-core mutation or Production Readiness scope here.
