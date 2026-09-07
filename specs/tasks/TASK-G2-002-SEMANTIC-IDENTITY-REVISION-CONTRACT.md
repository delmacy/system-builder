---
id: TASK-G2-002
title: Define stable semantic identity revision and currentness contract
status: committed
priority: 1002
milestone: G2-WP-01
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-G2-001]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-PLANNING-MATERIALIZATION-01.md
  - project_docs/execution_planning/G2-SEMANTIC-IDENTITY-REVISION-CONTRACT-01.md
  - packages/contracts/**
allowed_paths:
  - packages/contracts/**
  - tests/product/**
  - specs/tasks/TASK-G2-002-SEMANTIC-IDENTITY-REVISION-CONTRACT.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define the minimal provider-neutral Generation 2 contract for stable semantic identity, immutable revision identity, semantic owner, evidence/provenance references and population/locality-qualified currentness.

# Acceptance criteria
- canonical semantic identity is independent of provider/external/Git identity;
- revision identity is immutable and historically addressable;
- owner is explicit and cannot be inferred from an AI/provider observation;
- currentness includes explicit locality/population/revision qualification and represents `PARTIAL` and `UNKNOWN` without coercion;
- invalid/missing canonical owner, revision, evidence/currentness qualification fails canonically;
- serialization/normalization is deterministic where promised;
- predecessor primitives are reused rather than shadowed;
- declared validations pass.

# Negative/adversarial cases
Provider ID reuse, stale/superseded revision, malformed revision, missing owner/evidence, unknown locality/population and extra state must not create stronger truth.

# Non-goals
No graph federation, workflow/execution semantics, domain authorization, provider qualification mechanics, data migration, AI authority, or physical actuation.

# Escalation
Stop for undeclared L4 boundary or incompatible replacement of an accepted existing canonical owner.