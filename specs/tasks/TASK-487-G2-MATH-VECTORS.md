---
id: TASK-487
title: Define vector basis order and dimension semantics
status: ready
priority: 487
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-486
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-03-MATHEMATICAL-SEMANTICS.md
  - project_docs/execution_planning/G2-MATH-SEMANTIC-FOUNDATION-01.md
  - specs/tasks/TASK-486-G2-MATH-PRECISION-TIME.md
  - packages/contracts/mathematical-semantics/**
allowed_paths:
  - packages/contracts/mathematical-semantics/**
  - tests/product/g2-mathematical-semantics*.test.ts
  - specs/tasks/TASK-487-G2-MATH-VECTORS.md
  - project_docs/execution_planning/G2-MATH-SEMANTIC-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/elicitation-knowledge-base/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Represent vector values with explicit basis, order and dimension so coordinate meaning cannot be silently lost.

# Context
TASK-486 establishes precision and temporal qualification over the source-preserving analytical value chain. This TASK adds only structural vector semantics.

# Current behavior
The mathematical-semantics boundary has no explicit vector basis identity/revision, coordinate ordering or dimension validation.

# Required change
Define the minimum portable vector contract and validation needed to bind coordinates to an explicit basis/order/dimension while carrying unit/precision/temporal qualification from predecessor TASKs where applicable.

# Inputs / contracts
Consume the analytical identity/source lineage from TASK-484 and the unit, precision and temporal qualification produced by TASK-485/486.

# Outputs / contracts
Produce additive vector basis/order/dimension contracts and deterministic validation inside `packages/contracts/mathematical-semantics/**` with focused proof.

# Acceptance criteria
- vector dimension is explicit and matches coordinate count;
- basis identity/revision and coordinate order are explicit when semantically material;
- reordering/resizing requires an explicit qualified transform and cannot occur silently;
- scalar and vector identities cannot collapse by shape convenience;
- unit, precision and temporal qualification are preserved per declared vector semantics;
- Fleet/global aggregation cannot be interpreted as strengthening local/Station vector truth.

# Negative/adversarial proof
Reject coordinate reorder, dimension mismatch, basis substitution, scalarization and locality strengthening without an explicit owner-qualified transform.

# Non-goals
Geometry engines, linear algebra providers, physical actuation, aggregation ownership, runtime evaluation.

# Evidence expected
Focused vector product proof plus every validation command declared in frontmatter on the authoritative TASK head.

# Escalation
Stop if implementation needs aggregation/domain ownership, a linear-algebra provider/runtime service, physical actuation, predecessor mutation or architecture beyond this contract family.
