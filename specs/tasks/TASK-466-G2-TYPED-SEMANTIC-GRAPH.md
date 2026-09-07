---
id: TASK-466
title: Define owner-preserving typed semantic graph
status: ready
priority: 466
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-465
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-SEMANTIC-CONSTITUTION.md
  - project_docs/execution_planning/G2-SEMANTIC-CONTRACT-FOUNDATION-01.md
  - specs/tasks/TASK-463-G2-SEMANTIC-IDENTITY.md
  - specs/tasks/TASK-464-G2-REVISION-VECTOR.md
  - specs/tasks/TASK-465-G2-CURRENTNESS-TEMPORAL.md
allowed_paths:
  - packages/contracts/semantic-substrate/**
  - tests/product/g2-semantic-substrate*.test.ts
  - specs/tasks/TASK-466-G2-TYPED-SEMANTIC-GRAPH.md
  - project_docs/execution_planning/G2-SEMANTIC-CONTRACT-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/catalog/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define the deterministic typed semantic graph structures that compose owner-qualified references without creating a universal semantic owner.

# Context
C0 adopts the Typed Semantic Graph as an architecture-level semantic IR, not a graph database or universal entity schema. Cross-capability references are directional references to foreign owner truth.

# Current behavior
Current main has explicit domain lineage and ordered journey relations, but no reusable typed semantic-node/relation contract with owner/revision qualification.

# Required change
Define portable semantic node and directional relation shapes using TASK-463..465 primitives. Validation must preserve endpoint owner/kind/revision qualification, deterministic ordering and explicit relation kinds. Bounded metadata may be carried only without erasing semantic kind, owner or relation type.

# Inputs / contracts
Owner-qualified identity, revision-vector and temporal/currentness primitives from predecessor TASKs.

# Outputs / contracts
Typed node/relation/graph structural contracts, deterministic normalization/validation and focused product tests.

# Acceptance criteria
- every cross-capability node/ref exposes semantic owner and kind;
- relation direction and kind are explicit;
- endpoint owner/kind/revision mismatch fails closed;
- unknown/invalid relation kind fails closed rather than degrading to generic linkage;
- graph normalization is deterministic and duplicate ambiguous edges are rejected or deterministically qualified;
- generic metadata cannot replace semantic kind/owner/relation type;
- no graph operation can silently redefine a foreign owner's predicate/lifecycle;
- declared validations pass.

# Non-goals
Graph database/storage, workflow control flow, authorization graph, causal inference, automatic architecture reconciliation or domain schema modeling.

# Evidence expected
Deterministic product tests across multiple semantic owners, plus adversarial owner/type/revision mismatch and metadata-erasure attempts.

# Escalation
Stop if graph validation requires a universal domain registry/evaluator, reverse dependencies into domain owners or a new runtime topology.