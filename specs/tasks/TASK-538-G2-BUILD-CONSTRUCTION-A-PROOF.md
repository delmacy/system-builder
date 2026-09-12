---
id: TASK-538
title: Prove integrated G2-WP-09 Construction A build semantics
status: blocked
priority: 538
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-537
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-09-REPRODUCIBLE-BUILD-ARTIFACT-SUPPLY-AUTONOMOUS-DEPLOYMENT.md
  - packages/contracts/build-reproducibility/**
allowed_paths:
  - tests/product/g2-build-construction-a-proof.test.ts
  - specs/tasks/TASK-538-G2-BUILD-CONSTRUCTION-A-PROOF.md
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
Close Construction A with integrated Product Proof across TASK-535..537 without introducing new semantic ownership.

# Context
TASK-538 is proof-only. It composes the already-owned build dependency/material identity, runner/toolchain/input qualification and reproducibility/cache/residual-drainage semantics.

# Current behavior
Individual Construction A contracts are not sufficient package evidence until their interaction is proved across identity, revision, provenance, currentness, provider/locality qualification, PARTIAL/UNKNOWN and residual drainage boundaries.

# Inputs / contracts
- integrated outputs of TASK-535, TASK-536 and TASK-537;
- closed predecessor identity/evidence/trust/provider/finite-flow semantics.

# Outputs / contracts
Integrated deterministic Product Proof only; no new semantic contract owner.

# Required change
Add proof that composes Construction A semantics across fresh/stale/current/partial/unknown and provider/runner substitution cases.

# Acceptance criteria
- declared/resolved/fetched lineage survives runner/provider substitution;
- build success and cache hit cannot masquerade as reproducibility evidence;
- runner/toolchain/input/currentness qualification is preserved;
- PARTIAL/UNKNOWN remain non-strengthening;
- residual runner/cache populations cannot be declared drained without qualified evidence;
- Product Proof does not claim Production Readiness.

# Negative/adversarial proof
Exercise provider-ID/material collisions, stale runner/toolchain evidence, cache ambiguity, missing population/currentness and UNKNOWN cases without creating new semantics.

# Evidence expected
One deterministic integrated Product Proof on the exact TASK head plus repository validation green.

# Escalation
Any semantic gap discovered here returns as bounded rework to TASK-535..537 or Sprint Review; do not fix it by inventing new ownership in this proof TASK.

# Non-goals
New contracts, artifact/release semantics, deployment/runtime, concrete providers or Production Readiness.