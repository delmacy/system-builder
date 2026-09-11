---
id: TASK-512
title: Protect external identity reuse rebinding and coexistence lineage
status: verification
priority: 512
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-511
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-06-PROVIDER-BROWNFIELD-PHYSICAL-PERIPHERAL.md
  - packages/contracts/data-schema/**
allowed_paths:
  - packages/contracts/brownfield/**
  - packages/contracts/provider/**
  - tests/product/g2-brownfield*.test.ts
  - specs/tasks/TASK-512-G2-EXTERNAL-IDENTITY-COEXISTENCE.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 7
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Prevent external identifier reuse/rebinding from silently changing canonical identity or resurrecting stale authority during Brownfield coexistence.

# Context
TASK-512 builds on evidence-first assimilation and WP-05 source-of-truth/fencing semantics to keep external identifiers historically qualified during coexistence.

# Current behavior
No G2 Brownfield contract currently proves that reused or rebound provider identifiers cannot reconnect stale authority or hide residual bindings.

# Inputs / contracts
TASK-511 evidence semantics, provider/scope/revision/epoch identity, WP-05 source-of-truth, fencing, coexistence and residual-drainage contracts.

# Outputs / contracts
Explicit external binding/rebinding lineage with evidence qualification, canonical source references and visible residual populations.

# Required change
Model external identity bindings with provider/scope/revision/epoch lineage, explicit rebinding qualification, coexistence state and source-of-truth references compatible with WP-05 fencing/residual drainage semantics.

# Acceptance criteria
- external IDs are not globally canonical identities;
- reuse/rebinding is explicit and evidence-qualified;
- stale bindings cannot resurrect authority after fencing/cutover;
- coexistence preserves one canonical truth per scope/epoch;
- residual bindings/populations remain visible until drained/reconciled.

# Negative/adversarial proof
Reject ID reuse=>same entity, stale binding=>authority, two canonical truths and hidden residual binding cohorts.

# Evidence expected
Product Proof demonstrates valid rebinding/coexistence and rejects ID reuse strengthening, stale authority resurrection, dual canonical truth and hidden residual cohorts; exact-head validation passes.

# Escalation
Escalate if correctness requires concrete migration or vendor behavior outside materialized contracts; preserve historical ambiguity and residual visibility rather than reconnecting identity.

# Non-goals
Concrete data migration, vendor adapter implementation or Production Readiness.
