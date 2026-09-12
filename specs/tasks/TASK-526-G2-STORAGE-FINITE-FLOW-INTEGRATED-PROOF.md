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

# Context
TASK-526 is the Construction B closure proof. It composes only the authoritative outputs of TASK-523, TASK-524 and TASK-525 with the existing finite-flow boundary and must not create a new storage/runtime/provider semantic owner.

# Current behavior
Individual Construction B contracts are not sufficient for closure until one integrated proof demonstrates canonical identity, provider-copy lifecycle, transfer/availability, disposition/residual visibility and finite-flow behavior together across adversarial and recovery cases.

# Required change
Add only integrated Product Proof for canonical object identity, provider-copy transfer/availability, disposition/residual copies and finite-flow composition.

# Inputs / contracts
Exact integrated outputs of TASK-523, TASK-524 and TASK-525 under the pinned G2-WP-07 authority, together with the already-integrated Construction A finite-flow semantics they consume.

# Outputs / contracts
Integrated Product Proof only under `tests/product/g2-storage-finite-flow-integrated-proof.test.ts` plus this TASK status update. No new contract, provider implementation or semantic owner.

# Acceptance criteria
- provider key/hash/copy never becomes canonical object identity;
- ACK never strengthens durable/integrity-qualified availability without evidence;
- dedup preserves authority/lifecycle distinctions;
- PARTIAL/UNKNOWN remains non-strengthening;
- disposition preserves residual-copy visibility and qualified population;
- transfer/replay/disposition remain finitely drainable only under explicit units/population/time assumptions.

# Negative/adversarial proof
Cover provider identity collapse, ACK-only availability, stale/PARTIAL/UNKNOWN evidence, dedup authority collapse, deletion with residual copies, population/currentness mismatch, telemetry gaps and transfer/replay/disposition that cannot demonstrate finite drainage.

# Evidence expected
One integrated Product Proof file exercising positive, negative, adversarial and recovery composition plus every validation declared in this TASK on the exact implementation head.

# Escalation
If the integrated proof reveals a missing semantic capability required by Construction B, stop and surface that bounded gap; do not hide it in test fixtures or introduce a new contract within TASK-526.

# Non-goals
New contracts, vendor adapters, persistence, messaging, deployment or Production Readiness.
