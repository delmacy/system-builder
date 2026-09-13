---
id: TASK-542
title: Prove integrated G2-WP-09 Construction B artifact and release semantics
status: blocked
priority: 542
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-541
context_paths:
  - AGENTS.md
  - packages/contracts/artifact-supply/**
allowed_paths:
  - tests/product/g2-artifact-construction-b-proof.test.ts
  - specs/tasks/TASK-542-G2-ARTIFACT-CONSTRUCTION-B-PROOF.md
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
Close the first G2-WBS-13 Construction B Sprint with integrated Product Proof across TASK-539..541 without creating new semantic ownership.

# Acceptance criteria
- build output, canonical artifact, release and deployed/effective runtime remain distinct;
- artifact identity and provenance survive provider/registry substitution;
- signature/attestation does not masquerade as trust/admission;
- release coexistence/residual cohorts require qualified population/currentness evidence before drainage;
- PARTIAL/UNKNOWN remain non-strengthening;
- Product Proof does not claim Production Readiness or G2-WBS-14 runtime realization.

# Escalation
Semantic gaps return as bounded rework to TASK-539..541 or Sprint Review; do not invent new owners in this proof TASK.

# Non-goals
New contracts, deployment/runtime, concrete providers, DB, apps/UI or Production Readiness.
