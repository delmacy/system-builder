---
id: TASK-550
title: Prove generated experience Construction A semantics
status: ready
priority: 550
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-549
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-547-G2-GENERATED-EXPERIENCE-PROJECTION-CURRENTNESS.md
  - specs/tasks/TASK-548-G2-GENERATED-EXPERIENCE-VISIBILITY-AUTHORITY.md
  - specs/tasks/TASK-549-G2-GENERATED-EXPERIENCE-STATE-LINEAGE.md
  - packages/contracts/generated-experience/**
allowed_paths:
  - tests/product/g2-generated-experience-construction-a-proof.test.ts
  - specs/tasks/TASK-550-G2-GENERATED-EXPERIENCE-CONSTRUCTION-A-PROOF.md
forbidden_paths:
  - packages/db/**
  - packages/runtime-core/**
  - apps/**
  - .github/workflows/**
max_files: 2
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Close the first G2-WBS-15 Construction A Sprint with integrated Product Proof across TASK-547..549 without introducing new semantic ownership.

# Context
TASK-547..549 materialize the complete first G2-WBS-15 semantic slice: projection/currentness, visibility/authority/action separation, and unresolved-state/provenance lineage.

# Current behavior
The individual predecessor contracts are intended to be independently proven, but Construction A is not closed until their invariants are exercised together without creating a stronger generated source of truth.

# Required change
Add only deterministic integrated Product Proof that composes the already-owned TASK-547..549 semantics. Do not add new production contracts or semantic owners from this proof task.

# Inputs / contracts
TASK-547 projection/currentness contracts, TASK-548 visibility/authority/action eligibility contracts, and TASK-549 unresolved-state/lineage contracts.

# Outputs / contracts
A deterministic integrated Product Proof for the first G2-WBS-15 Construction A slice, explicitly separated from Production Readiness evidence.

# Acceptance criteria
- proves `projection != source truth` across identity, revision and currentness;
- proves `visibility != authority != action eligibility`;
- proves stale/PARTIAL/UNKNOWN/INCONCLUSIVE/CONFLICTED states are non-strengthening and remain representable;
- proves source/evidence/revision lineage survives regeneration and historical projections remain distinct;
- proves existing UI behavior remains backward/coexistence compatible at the contract boundary;
- makes no AI-mediated-assistance or Production Readiness claim.

# Non-goals
New contracts beyond TASK-547..549, AI/model providers, apps/UI implementation, persistence, operator surfaces or Production Readiness.

# Evidence expected
Deterministic integrated Product Proof across TASK-547..549 plus exact-head repository validation, without claiming provider realization or Production Readiness.

# Escalation
Return to Sprint Review for any missing semantic owner, unresolved compatibility issue or requirement outside TASK-547..549; do not turn this proof task into implementation overflow.
