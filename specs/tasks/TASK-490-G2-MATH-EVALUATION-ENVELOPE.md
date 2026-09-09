---
id: TASK-490
title: Define revision-pinned rule and expression evaluation envelopes
status: verification
priority: 490
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-489
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-03-MATHEMATICAL-SEMANTICS.md
  - project_docs/execution_planning/G2-MATH-EVALUATION-DERIVATION-01.md
  - packages/contracts/mathematical-semantics/**
allowed_paths:
  - packages/contracts/mathematical-semantics/**
  - tests/product/g2-mathematical-semantics*.test.ts
  - specs/tasks/TASK-490-G2-MATH-EVALUATION-ENVELOPE.md
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
Define the minimum deterministic public envelope for evaluating a revision-pinned rule or expression against explicit Construction A analytical inputs.

# Context
Construction A is review-closed and supplies revisioned analytical definitions and typed bindings together with unit/dimension, precision, temporal, vector/locality and uncertainty/evidence qualification. This first Construction B TASK consumes that substrate without mutating predecessor contracts.

# Current behavior
No Construction B evaluation-envelope contract exists yet. The repository therefore has no portable deterministic request shape that pins an exact analytical definition revision and explicit inputs while structurally refusing implicit latest-revision selection or missing-value defaults.

# Inputs / contracts
- review-closed `packages/contracts/mathematical-semantics/**` Construction A public contracts;
- exact analytical definition identity and historical revision;
- explicit bound analytical values with their source/value/producing revisions and existing currentness/locality/qualification metadata.

# Outputs / contracts
- additive evaluation request/envelope contracts under `packages/contracts/mathematical-semantics/**`;
- deterministic normalization for exact definition/revision and explicit input bindings;
- focused Product Proof under the declared test boundary showing predecessor lineage is preserved without runtime evaluation behavior.

# Required change
Add additive contracts/normalization for an evaluation request that pins analytical definition identity and revision, declares input bindings explicitly and carries source lineage/currentness/locality without silently resolving a latest revision or inventing missing values.

# Acceptance criteria
- evaluation request pins definition identity and exact revision;
- every bound value preserves its Construction A source/value/producing revision lineage;
- missing or unknown inputs remain explicit and cannot be defaulted to zero/false/empty;
- equivalent valid envelopes normalize deterministically;
- historical revisions cannot be replaced with current/latest revisions;
- no evaluator runtime, persistence or provider behavior is introduced.

# Negative/adversarial proof
Reject malformed or substituted definition revisions, duplicate/ambiguous bindings, owner/revision strengthening, missing-input defaulting and implicit latest-resolution behavior.

# Evidence expected
- focused positive proof for equivalent valid envelope normalization and exact historical revision pinning;
- adversarial proof for malformed/substituted revisions, duplicate bindings, missing-input defaulting and owner/currentness/locality strengthening attempts;
- declared validation commands pass on the exact authoritative TASK head.

# Non-goals
Evaluation-result policy, derivation/transform lineage, correlation semantics, AI/provider execution, causal inference, runtime engine, persistence, UI.

# Escalation
Stop if the contract requires predecessor mutation, runtime/provider/persistence ownership, implicit latest resolution or any unmaterialized scope.
