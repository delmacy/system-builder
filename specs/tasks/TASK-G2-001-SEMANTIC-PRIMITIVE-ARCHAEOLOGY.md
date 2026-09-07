---
id: TASK-G2-001
title: Reconcile existing semantic identity and revision primitives
status: committed
priority: 1001
milestone: G2-WP-01
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-PLANNING-MATERIALIZATION-01.md
  - project_docs/execution_planning/G2-SEMANTIC-IDENTITY-REVISION-CONTRACT-01.md
  - packages/contracts/**
  - tests/product/**
allowed_paths:
  - packages/contracts/**
  - tests/product/**
  - specs/tasks/TASK-G2-001-SEMANTIC-PRIMITIVE-ARCHAEOLOGY.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Reconcile fresh-main contract truth before introducing Generation 2 semantic constitution primitives, reusing compatible identity/revision/evidence/currentness concepts and adding only bounded characterization/compatibility guards needed by Construction A.

# Required change
Inspect existing public contracts and product proofs for semantic identity, process revision, provenance/evidence, ownership/currentness/locality concepts. Where an existing primitive already satisfies a G2 requirement, reuse it and add a characterization proof rather than duplicate it. Introduce no new public semantic abstraction unless a concrete missing primitive is proven and remains within the existing contract boundary.

# Acceptance criteria
- existing reusable primitives are exercised through their real public entrypoints;
- duplicate canonical identity/revision owners are not created;
- provider/external/Git identifiers are not promoted to semantic authority;
- any compatibility guard proves deterministic identity/revision behavior and failure on invalid canonical inputs;
- no Runtime -> Builder dependency or product side effect is introduced;
- declared validations pass.

# Negative/adversarial cases
Stale/superseded revision forms, malformed identity, provider/external identifier presented without canonical identity, and unsupported/unknown fields must not be silently promoted to authoritative semantic truth.

# Non-goals
No federated graph composition, domain authorization, workflow behavior, provider binding, data migration, deployment, physical actuation, or broad contract redesign.

# Escalation
Stop if satisfying the objective requires a new L4 owner/boundary or contradicts an accepted existing public contract.