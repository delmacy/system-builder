---
id: TASK-491
title: Define deterministic resolved unresolved and error outcomes
status: ready
priority: 491
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-490
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-MATH-EVALUATION-DERIVATION-01.md
  - specs/tasks/TASK-490-G2-MATH-EVALUATION-ENVELOPE.md
  - packages/contracts/mathematical-semantics/**
allowed_paths:
  - packages/contracts/mathematical-semantics/**
  - tests/product/g2-mathematical-semantics*.test.ts
  - specs/tasks/TASK-491-G2-MATH-EVALUATION-OUTCOMES.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/elicitation-knowledge-base/**
max_files: 6
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Represent evaluation disposition explicitly and deterministically without allowing uncertainty, missing evidence or execution errors to masquerade as resolved values.

# Context
TASK-490 introduces the revision-pinned evaluation request/envelope over the review-closed Construction A substrate. TASK-491 adds only the result-disposition semantics needed to preserve uncertainty, evidence and lineage through an evaluation boundary.

# Current behavior
Before this TASK there is no Construction B public outcome contract distinguishing a successfully resolved analytical value from an unresolved evaluation or an execution/error disposition. Collapsing these states would create false precision or default authority.

# Inputs / contracts
- the exact TASK-490 evaluation envelope identity, definition revision and bound-input lineage;
- Construction A `KNOWN | PARTIAL | UNKNOWN | INCONCLUSIVE` qualification, evidence/currentness and locality semantics;
- any bounded explicit reason/evidence needed to explain unresolved or error disposition without runtime orchestration.

# Outputs / contracts
- additive mutually exclusive `RESOLVED | UNRESOLVED | ERROR` outcome contracts and deterministic normalization;
- resolved outputs that preserve exact definition/input/source/producing revisions and conservative qualification;
- explicit unresolved/error reason semantics that cannot masquerade as a value.

# Required change
Add outcome contracts for `RESOLVED`, `UNRESOLVED` and `ERROR`, with explicit reason/evidence semantics and conservative qualification compatible with Construction A `KNOWN/PARTIAL/UNKNOWN/INCONCLUSIVE` states.

# Acceptance criteria
- outcome kind is explicit and mutually exclusive;
- unresolved/missing evidence never becomes a resolved false/zero/default value;
- error is distinct from unresolved and from analytical uncertainty;
- resolved values retain definition/input/source/producing revisions;
- qualification cannot be strengthened by outcome normalization;
- equivalent valid outcomes normalize deterministically.

# Negative/adversarial proof
Reject unknown-to-resolved promotion, error-to-unresolved masking, missing-reason ambiguity, revision substitution and source/currentness/locality strengthening.

# Evidence expected
- positive proof for deterministic normalization of each explicit outcome kind while preserving predecessor lineage;
- adversarial proof that unknown/partial/inconclusive, unresolved and error dispositions cannot be coerced, masked or strengthened;
- declared validation commands pass on the exact authoritative TASK head.

# Non-goals
Runtime execution/retry orchestration, workflow error handling, persistence, UI, provider/AI execution, derivation semantics, causal inference.

# Escalation
Stop if satisfying the outcome contract requires runtime orchestration, authority strengthening, predecessor mutation or implicit defaults.
