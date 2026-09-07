---
id: TASK-464
title: Define immutable sparse revision qualification
status: ready
priority: 464
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-463
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-SEMANTIC-CONSTITUTION.md
  - project_docs/execution_planning/G2-SEMANTIC-CONTRACT-FOUNDATION-01.md
  - specs/tasks/TASK-463-G2-SEMANTIC-IDENTITY.md
  - packages/contracts/process-versioning/**
allowed_paths:
  - packages/contracts/semantic-substrate/**
  - tests/product/g2-semantic-substrate*.test.ts
  - specs/tasks/TASK-464-G2-REVISION-VECTOR.md
  - project_docs/execution_planning/G2-SEMANTIC-CONTRACT-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/process-versioning/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Add sparse owner-qualified revision qualification without replacing existing domain versioning contracts.

# Context
G2 requires independently evolving revision dimensions and immutable producing history. Existing process/artifact versions remain valid bounded predecessors and must not be rewritten.

# Current behavior
Current contracts primarily carry scalar/domain-specific revisions. No reusable sparse `RevisionVector` exists.

# Required change
Define `DefinitionRevisionRef`, a deterministic sparse `RevisionVector` keyed by explicit owner/dimension identity, and the minimum structural correction/supersession lineage required to preserve historical producing revision references. Normalize ordering deterministically and reject duplicate/conflicting dimensions.

# Inputs / contracts
TASK-463 semantic identity primitives and existing process-versioning semantics as compatibility precedent.

# Outputs / contracts
Portable revision-vector and revision-lineage structures with deterministic validation and focused tests.

# Acceptance criteria
- producing revision vectors are immutable historical facts;
- vector dimensions are explicit, sparse and deterministically ordered;
- duplicate/conflicting dimensions fail closed;
- definition revision is distinct from definition identity and occurrence identity;
- supersession/correction creates lineage rather than rewriting prior revision;
- equal version strings under different owners/dimensions do not imply compatibility;
- existing process-versioning contracts remain untouched;
- declared validations pass.

# Non-goals
Compatibility policy decisions, migration/cutover, currentness evaluation, workflow pinning, schema migration or domain lifecycle ownership.

# Evidence expected
Product tests for sparse ordering, duplicate/conflict rejection, immutable historical references and owner/dimension distinction.

# Escalation
Stop if satisfying this task requires modifying existing process-versioning authority or inventing a global compatibility policy.