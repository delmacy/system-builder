---
id: TASK-543
title: Define canonical deployment intent and desired observed effective generation semantics
status: ready
priority: 543
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-542
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-09-REPRODUCIBLE-BUILD-ARTIFACT-SUPPLY-AUTONOMOUS-DEPLOYMENT.md
  - project_docs/execution_planning/G2-WP09-CONSTRUCTION-B-SPRINT-REVIEW-01.report.md
  - packages/deploy/**
  - packages/contracts/artifact-supply/**
allowed_paths:
  - packages/contracts/deployment-runtime/**
  - tests/product/g2-deployment-generation-proof.test.ts
  - specs/tasks/TASK-543-G2-DEPLOYMENT-GENERATION-SEMANTICS.md
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
Define provider-neutral canonical deployment intent and desired/observed/effective generation semantics without collapsing release, deployment, observed runtime or effective runtime into one state.

# Context
Construction B / G2-WBS-13 is integrated and PASS. The Sprint Review promoted G2-WBS-14 because deployment/runtime effectiveness remains a distinct semantic owner.

# Current behavior
The repository has a strong KEEP baseline for DeploymentRecord identity/history, environment references, release admission and local runtime realization, but no generalized desired/observed/effective generation model.

# Required change
Add only the provider-neutral deployment/runtime contract needed to represent canonical deployment/environment identity plus desired, observed and effective generation/currentness as distinct evidence-bearing states.

# Inputs / contracts
- canonical release identity/adoption from TASK-539..541;
- existing DeploymentRecord and EnvironmentProfile behavior as KEEP baseline;
- closed evidence/currentness/provider/locality semantics.

# Outputs / contracts
A revisioned deployment-runtime semantic contract that keeps release identity, deployment intent, provider realization, observed runtime and effective/converged runtime distinct and traceable.

# Acceptance criteria
- `release != deployment != observed runtime != effective/converged runtime`;
- deployment/environment identity is canonical and distinct from provider/process/resource IDs;
- desired, observed and effective generations/currentness are explicit and cannot be inferred from provider acknowledgement;
- stale/PARTIAL/UNKNOWN/INCONCLUSIVE evidence never strengthens convergence;
- provider substitution cannot rewrite canonical deployment identity;
- existing single-host Deploy behavior remains compatible and is not replaced;
- deterministic Product Proof covers generation mismatch, stale observation and provider-ID collision.

# Evidence expected
Focused deterministic Product Proof plus exact-head repository validation, without claiming Production Readiness.

# Escalation
Return to Sprint Review rather than adding concrete deployment providers, persistence, topology/traffic infrastructure or runtime-core ownership.

# Non-goals
Provider actuation/retry policy, residual cohort drainage, concrete Kubernetes/cloud/serverless providers, DB, apps/UI, runtime-core rewrite or Production Readiness.
