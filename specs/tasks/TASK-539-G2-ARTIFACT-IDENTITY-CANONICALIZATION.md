---
id: TASK-539
title: Define canonical artifact identity and build-output adoption semantics
status: ready
priority: 539
milestone: G2
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-538
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-09-REPRODUCIBLE-BUILD-ARTIFACT-SUPPLY-AUTONOMOUS-DEPLOYMENT.md
  - packages/contracts/build-reproducibility/**
allowed_paths:
  - packages/contracts/artifact-supply/**
  - tests/product/g2-artifact-identity-proof.test.ts
  - specs/tasks/TASK-539-G2-ARTIFACT-IDENTITY-CANONICALIZATION.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define provider-neutral canonical artifact identity and adoption from qualified build output without collapsing build output into canonical artifact or release.

# Context
G2-WBS-12 is integrated. G2-WBS-13 is now the dependency-safe owner for artifact/release/SBOM/provenance lifecycle semantics.

# Inputs / contracts
- TASK-535..538 build material identity, execution qualification and reproducibility evidence;
- closed identity/revision/evidence/provider/locality semantics.

# Outputs / contracts
A revisioned artifact-supply contract that keeps build output identity, canonical artifact identity and release identity distinct and traceable.

# Acceptance criteria
- build output != canonical artifact != release;
- artifact identity is revisioned and linked to qualified build/material provenance;
- provider/registry IDs, mutable tags or acknowledgements cannot become canonical authority by themselves;
- locality/currentness and evidence state remain explicit;
- PARTIAL/UNKNOWN never strengthens adoption;
- unsafe mutating UNKNOWN routes to reconcile-before-retry where applicable;
- Product Proof covers provider-ID/tag collisions, stale evidence and ambiguous adoption.

# Escalation
Return to Sprint Review rather than adding concrete registry/provider realization, persistence or deployment/runtime ownership.

# Non-goals
SBOM/provenance attestation closure, release-channel lifecycle, deployment/runtime, concrete registries/providers, DB, apps/UI or Production Readiness.
