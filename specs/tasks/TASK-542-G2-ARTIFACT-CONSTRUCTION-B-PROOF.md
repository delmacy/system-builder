---
id: TASK-542
title: Prove integrated G2-WP-09 Construction B artifact and release semantics
status: verification
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

# Context
TASK-542 is proof-only. TASK-541 is integrated by PR #747, so its predecessor gate is satisfied.

# Current behavior
TASK-539..541 semantic owners are integrated; TASK-542 now supplies the integrated Construction B Product Proof for the first G2-WBS-13 sprint.

# Required change
Add one deterministic integrated Product Proof that composes TASK-539..541 semantics without adding a new contract owner.

# Inputs / contracts
- integrated outputs of TASK-539, TASK-540 and TASK-541;
- closed identity/revision/evidence/provider/coexistence/population/currentness semantics.

# Outputs / contracts
Integrated deterministic Product Proof only; no new semantic contract ownership.

# Acceptance criteria
- build output, canonical artifact, release and deployed/effective runtime remain distinct;
- artifact identity and provenance survive provider/registry substitution;
- signature/attestation does not masquerade as trust/admission;
- release coexistence/residual cohorts require qualified population/currentness evidence before drainage;
- PARTIAL/UNKNOWN remain non-strengthening;
- Product Proof does not claim Production Readiness or G2-WBS-14 runtime realization.

# Evidence expected
One deterministic integrated Product Proof on the exact TASK head plus repository validation green.

# Escalation
Semantic gaps return as bounded rework to TASK-539..541 or Sprint Review; do not invent new owners in this proof TASK.

# Non-goals
New contracts, deployment/runtime, concrete providers, DB, apps/UI or Production Readiness.
