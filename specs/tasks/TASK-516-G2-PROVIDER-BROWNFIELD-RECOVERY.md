---
id: TASK-516
title: Harden provider Brownfield recovery on currentness degradation
status: ready
priority: 516
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-515
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-06-PROVIDER-BROWNFIELD-PHYSICAL-PERIPHERAL.md
  - packages/contracts/provider/**
  - packages/contracts/brownfield/**
  - packages/contracts/locality/**
allowed_paths:
  - packages/contracts/provider/**
  - packages/contracts/brownfield/**
  - packages/contracts/locality/**
  - tests/product/g2-provider-recovery*.test.ts
  - tests/product/g2-brownfield-recovery*.test.ts
  - specs/tasks/TASK-516-G2-PROVIDER-BROWNFIELD-RECOVERY.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 8
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Harden the already-integrated provider/Brownfield contracts so loss of currentness or authoritative qualification enters explicit reconciliation rather than silently retaining or manufacturing authority.

# Context
Construction A proves static and integrated invariants. Construction B is required by the rolling-wave cadence and uses fresh-main evidence to exercise the recovery boundary when previously-current provider or Brownfield evidence becomes STALE, UNKNOWN, conflicting, or revision-mismatched.

# Required change
Define the minimum provider-neutral recovery/reconciliation semantics needed to preserve owner/revision/currentness/locality and canonical authority while evidence degrades. Recovery must be retry-safe only after authoritative reconciliation; it must not infer support, canonical identity, or global truth from prior success.

# Acceptance criteria
- CURRENT -> STALE/UNKNOWN cannot retain authority-sensitive SUPPORTED/ASSIMILATE effects without reconciliation;
- revision or locality mismatch cannot be repaired by inference or historical success;
- AI/discovery/observed evidence remains non-authoritative;
- PARTIAL/UNKNOWN/INCONCLUSIVE remain conservative during recovery;
- reconciliation outcome is explicit and retry occurs only from current authoritative evidence;
- no new runtime, persistence, vendor adapter or Production Readiness ownership is introduced.

# Negative/adversarial proof
Exercise stale-after-success, UNKNOWN-after-success, revision drift, locality drift, conflicting evidence, inferred recovery and retry-before-reconcile.

# Evidence expected
Core/heavy Product Proof plus task/architecture/typecheck/verify gates demonstrate deterministic conservative recovery on the exact head.

# Non-goals
Concrete provider adapters, device control, DB changes, deployment, Production Readiness, or WP-07+ behavior.