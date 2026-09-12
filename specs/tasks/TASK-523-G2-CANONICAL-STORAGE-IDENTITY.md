---
id: TASK-523
title: Define canonical document media identity and provider-copy separation
status: verification
priority: 523
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-522
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-07-DURABLE-EXECUTION-STORAGE-FINITE-FLOW.md
  - packages/contracts/finite-flow/**
allowed_paths:
  - packages/contracts/storage/**
  - tests/product/g2-storage-identity*.test.ts
  - specs/tasks/TASK-523-G2-CANONICAL-STORAGE-IDENTITY.md
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
Define canonical document/media/object identity independently from provider key, hash, copy identity or transport attempt.

# Context
Construction B begins from integrated Construction A and composes WP-05 canonical/coexistence semantics, WP-06 provider qualification, and TASK-521 finite-flow evidence without introducing a concrete storage-provider owner.

# Current behavior
The repository has no authoritative storage contract that separates canonical document/media/object identity from provider keys, hashes, provider-copy identity and transport attempts while preserving currentness, source-of-truth and residual-copy state.

# Required change
Add a storage identity contract plus Product Proof establishing canonical identity, typed provider-copy references, revision/currentness and coexistence semantics.

# Inputs / contracts
Pinned Generation 2 authority, the integrated G2-WP-07 Construction A boundary, WP-05 canonical/coexistence semantics, WP-06 provider qualification semantics, and TASK-521 finite-flow semantics only where copy populations or transfer/drainage context are referenced.

# Outputs / contracts
A provider-neutral storage identity contract under `packages/contracts/storage/**` plus Product Proof under the declared test path. No persistence, runtime binding, network behavior or concrete provider adapter is produced.

# Acceptance criteria
- canonical identity never derives authority from provider key/hash/copy;
- multiple provider copies may coexist for one canonical object without collapsing lifecycle;
- hash equality may support integrity/dedup evidence but cannot merge authority or identity;
- stale/PARTIAL/UNKNOWN provider-copy evidence cannot strengthen canonical availability;
- source-of-truth and residual-copy state remain explicit.

# Negative/adversarial proof
Cover provider-key or hash equality across distinct canonical identities, multiple copies for one canonical object, stale/currentness mismatch, PARTIAL/UNKNOWN provider evidence, and attempts to infer source-of-truth or availability from a provider copy alone.

# Evidence expected
Product Proof for positive, negative and adversarial identity/coexistence cases plus every validation declared in this TASK on the exact implementation head.

# Escalation
If canonical identity, authority/currentness or coexistence cannot be represented without a missing predecessor capability, stop and surface that bounded gap; do not infer identity from provider artifacts or absorb TASK-524+ semantics early.

# Non-goals
Concrete vendor adapters, persistence/DB, upload execution, messaging, deployment or Production Readiness.
