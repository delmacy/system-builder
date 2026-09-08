---
id: TASK-485
title: Define units and dimensional compatibility semantics
status: ready
priority: 485
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-484
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-03-MATHEMATICAL-SEMANTICS.md
  - project_docs/execution_planning/G2-MATH-SEMANTIC-FOUNDATION-01.md
  - specs/tasks/TASK-484-G2-MATH-IDENTITY-INPUTS.md
  - packages/contracts/mathematical-semantics/**
allowed_paths:
  - packages/contracts/mathematical-semantics/**
  - tests/product/g2-mathematical-semantics*.test.ts
  - specs/tasks/TASK-485-G2-MATH-UNITS-DIMENSIONS.md
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
Add explicit units and dimensional compatibility to the revisioned analytical substrate.

# Context
TASK-484 establishes analytical identity/revision and typed source bindings. This successor adds only unit and dimension semantics while preserving that source ownership and historical lineage.

# Current behavior
The new mathematical-semantics boundary has no materialized unit identity, dimensional signature or deterministic compatibility contract.

# Required change
Define the minimum deterministic contracts needed to represent unit identity/revision or portable unit reference, dimensional signature and value/unit binding, plus compatibility validation that fails closed on dimension mismatch or missing material unit semantics.

# Inputs / contracts
Consume TASK-484 analytical definition/input contracts and their exact source owner/revision lineage.

# Outputs / contracts
Produce additive unit/dimension references, value bindings and deterministic compatibility validation inside `packages/contracts/mathematical-semantics/**` with focused proof.

# Acceptance criteria
- unit and dimension are explicit rather than inferred from labels;
- compatible conversion cannot erase source unit, dimension or producing revision;
- incompatible dimensions are rejected deterministically;
- dimensionless is explicit and not equivalent to unknown unit;
- missing/unknown unit semantics remain unresolved rather than defaulting to a convenient unit;
- source owner/revision from TASK-484 remains preserved.

# Negative/adversarial proof
Reject label-based equivalence, incompatible-dimension arithmetic, unknown-unit coercion and conversion that loses lineage.

# Non-goals
Provider unit libraries, domain-specific formula catalog, runtime evaluator, persistence, precision/rounding policy.

# Evidence expected
Focused unit/dimension product proof plus every validation command declared in frontmatter on the authoritative TASK head.

# Escalation
Stop if unit compatibility requires provider-owned catalogs, predecessor mutation, domain ownership, runtime evaluation, or architecture beyond the materialized mathematical-semantics boundary.
