---
id: TASK-477
title: Define multidimensional EKB coverage and stage sufficiency
status: ready
priority: 477
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-476
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-02-ELICITATION-KNOWLEDGE-BASE.md
  - project_docs/execution_planning/G2-EKB-CONTRACT-FOUNDATION-01.md
  - packages/contracts/elicitation-knowledge-base/**
  - packages/contracts/semantic-substrate/**
allowed_paths:
  - packages/contracts/elicitation-knowledge-base/**
  - tests/product/g2-elicitation-knowledge-base*.test.ts
  - specs/tasks/TASK-477-G2-EKB-COVERAGE-SUFFICIENCY.md
  - project_docs/execution_planning/G2-EKB-CONTRACT-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/knowledge-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Represent C1 elicitation coverage dimensionally and define stage-specific sufficiency that fails closed on unresolved critical obligations rather than collapsing progress into a scalar score.

# Required change
Add deterministic structural coverage records using the C1 coverage states and explicit dimension/object/capability/revision qualification. Add stage-specific sufficiency evaluation for `SUFFICIENT_FOR_ABSTRACTION`, `SUFFICIENT_FOR_CANDIDATE_ARCHITECTURE`, `SUFFICIENT_FOR_IMPLEMENTATION`, and `SUFFICIENT_FOR_PUBLISH_OPERATION`, preserving explicit blocker reasons and evidence/currentness references.

# Acceptance criteria
- coverage states remain `UNTOUCHED | DISCOVERING | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NOT_APPLICABLE | DEFERRED`;
- coverage is qualified by applicable dimension, object/capability and revision rather than a universal percentage;
- one applicable HIGH/CRITICAL unresolved, conflicted, blocked or evidence-unqualified obligation prevents false sufficiency PASS;
- earlier-stage sufficiency cannot imply a later-stage PASS;
- `NOT_APPLICABLE` requires rationale/applicability context;
- stale/superseded evidence can reopen affected current coverage without rewriting historical resolved evidence;
- Production Readiness Coverage is not implemented or inferred as equivalent to elicitation sufficiency.

# Negative/adversarial proof
Reject `95% complete` masking a critical blocked dimension, stage promotion, unjustified N/A, stale-evidence PASS and scalar aggregation as authority.

# Non-goals
Production Readiness implementation, UI dashboards, persistence, analytics/scoring, provider or operational health semantics.

# Escalation
Stop if implementation requires a universal quality/readiness score, domain policy authority or Production Readiness ownership.