---
id: TASK-535
title: Define build dependency and fetched-material identity with revision lineage
status: ready
priority: 535
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-09-REPRODUCIBLE-BUILD-ARTIFACT-SUPPLY-AUTONOMOUS-DEPLOYMENT.md
  - packages/contracts/**
allowed_paths:
  - packages/contracts/build-reproducibility/**
  - tests/product/g2-build-dependency-material*.test.ts
  - specs/tasks/TASK-535-G2-BUILD-DEPENDENCY-MATERIAL-IDENTITY.md
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
Define provider-neutral build dependency and fetched-material identity with explicit revision/provenance lineage.

# Context
G2-WP-09 Construction A begins the WBS-12 semantic core after WP-01/04/05/06/07 closure. It must distinguish what a build declares, resolves and actually fetches before any reproducibility claim can be authoritative.

# Current behavior
Existing factory/build surfaces do not provide a bounded canonical contract that prevents declared dependency, resolver result, fetched material and provider-local identifier from collapsing into one semantic identity.

# Inputs / contracts
- pinned G2-WP-09 planning authority and package invariants;
- semantic identity/revision/evidence from WP-01;
- trust qualification from WP-04 and provider qualification/currentness from WP-06;
- finite-flow/currentness evidence constraints from WP-07.

# Outputs / contracts
Provider-neutral contracts and Product Proof for build definition/revision, declared dependency, resolved dependency and fetched material identities with provenance/currentness lineage.

# Required change
Represent declaration, resolution and fetched material as distinct historically addressable facts; preserve producing build revision and evidence lineage; do not promote provider IDs, mutable tags or resolver acknowledgement to canonical material authority.

# Acceptance criteria
- declared != resolved != fetched is representable;
- build/material identities survive provider-local identifier churn;
- producing revision and provenance are explicit;
- mutable tag/provider identifier cannot reconnect unrelated history;
- PARTIAL/UNKNOWN/stale evidence cannot strengthen fetched-material currentness.

# Negative/adversarial proof
Reject declaration=>fetched equality, provider/tag equality=>canonical material identity, latest revision=>historical reinterpretation and missing provenance=>authoritative currentness.

# Evidence expected
Deterministic Product Proof covers positive identity/lineage and adversarial provider-ID/tag collision, historical revision and PARTIAL/UNKNOWN evidence cases on the exact TASK head.

# Escalation
Return to Sprint Review rather than broadening scope if the contract requires concrete CI/provider execution, artifact/release adoption, deployment/runtime realization or persistence.

# Non-goals
Toolchain/runner qualification, cache/reproducibility claim closure, artifact/release semantics, deployment, concrete providers or Production Readiness.