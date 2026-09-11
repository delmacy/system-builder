---
id: TASK-519
title: Define durable execution identity and producing-revision pinning
status: verification
priority: 519
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-07-DURABLE-EXECUTION-STORAGE-FINITE-FLOW.md
  - packages/contracts/**
allowed_paths:
  - packages/contracts/workflow/**
  - tests/product/g2-durable-execution*.test.ts
  - specs/tasks/TASK-519-G2-DURABLE-EXECUTION-REVISION.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define provider-neutral durable execution identity/state/journal semantics with explicit producing-revision pinning.

# Context
WP-07 begins from canonically closed WP-01..06 and owns G2-WBS-06/08/11. This TASK establishes only the durable execution semantic foundation required by Construction A.

# Current behavior
The repository lacked a G2 contract proving that in-flight execution remains bound to the semantic revision that produced it rather than being silently reinterpreted by latest revision.

# Required change
Represent execution identity, producing revision, state/journal lineage and conservative partial/unknown state so that acceptance, processing and convergence remain distinct.

# Inputs / contracts
Pinned G2 authority; WP-01 identity/revision semantics; WP-04 authority/trust; WP-05 canonical persistence/coexistence semantics; existing workflow/public contracts where present.

# Outputs / contracts
A durable execution contract and Product Proof for identity, producing-revision pinning, journal lineage and conservative state transitions.

# Acceptance criteria
- in-flight work retains producing revision;
- latest revision cannot silently reinterpret existing execution;
- `accepted != processed != converged` remains explicit;
- PARTIAL/UNKNOWN cannot strengthen completion/convergence;
- journal/state evidence retains execution and revision lineage.

# Negative/adversarial proof
Reject latest-revision reinterpretation, accepted=>converged, missing journal evidence=>completed and UNKNOWN=>successful strengthening.

# Evidence expected
Positive and adversarial Product Proof plus all declared validations on the exact TASK head.

# Escalation
Escalate only if satisfying these invariants requires scope outside allowed_paths or contradicts pinned G2 authority.

# Non-goals
Persistence implementation, concrete workflow engine, external-effect retry, storage providers, messaging, deployment or Production Readiness.
