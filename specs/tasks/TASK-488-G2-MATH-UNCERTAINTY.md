---
id: TASK-488
title: Define uncertainty and conservative analytical value qualification
status: ready
priority: 488
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-487
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-03-MATHEMATICAL-SEMANTICS.md
  - project_docs/execution_planning/G2-MATH-SEMANTIC-FOUNDATION-01.md
  - specs/tasks/TASK-487-G2-MATH-VECTORS.md
  - packages/contracts/mathematical-semantics/**
  - packages/contracts/elicitation-knowledge-base/**
allowed_paths:
  - packages/contracts/mathematical-semantics/**
  - tests/product/g2-mathematical-semantics*.test.ts
  - specs/tasks/TASK-488-G2-MATH-UNCERTAINTY.md
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
Preserve uncertainty and epistemic incompleteness through analytical values without coercing them into false precision or authority.

# Required change
Define minimal analytical value qualification for `KNOWN`, `PARTIAL`, `UNKNOWN` and `INCONCLUSIVE` (or a justified conservative equivalent), explicit uncertainty/evidence references where known, and rules that prevent analytical mechanics from strengthening source epistemic state.

# Acceptance criteria
- UNKNOWN/PARTIAL/INCONCLUSIVE remain distinguishable from precise known values;
- absence of evidence is not converted to zero/false/default;
- uncertainty metadata is explicit and source/evidence qualified where present;
- analytical values preserve source owner, revision, locality and producing analytical revision;
- a transform cannot claim stronger epistemic status than its qualified inputs without an explicit owner-governed disposition outside this package;
- correlation/evidence association cannot be labeled causal authority.

# Negative/adversarial proof
Reject unknown-to-zero, partial-to-complete, confidence-to-authority, evidence omission and correlation-to-causation promotion.

# Non-goals
Statistical inference engines, AI confidence policy, causal inference, business decision authority, persistence.
