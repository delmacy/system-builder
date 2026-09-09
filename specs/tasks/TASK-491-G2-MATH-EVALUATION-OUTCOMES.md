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

# Non-goals
Runtime execution/retry orchestration, workflow error handling, persistence, UI, provider/AI execution, derivation semantics, causal inference.

# Escalation
Stop if satisfying the outcome contract requires runtime orchestration, authority strengthening, predecessor mutation or implicit defaults.
