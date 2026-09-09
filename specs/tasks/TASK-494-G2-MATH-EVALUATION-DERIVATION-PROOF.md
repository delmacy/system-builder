---
id: TASK-494
title: Prove integrated evaluation derivation and non-causality semantics
status: verification
priority: 494
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-493
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-MATH-EVALUATION-DERIVATION-01.md
  - specs/tasks/TASK-490-G2-MATH-EVALUATION-ENVELOPE.md
  - specs/tasks/TASK-491-G2-MATH-EVALUATION-OUTCOMES.md
  - specs/tasks/TASK-492-G2-MATH-DERIVATION-LINEAGE.md
  - specs/tasks/TASK-493-G2-MATH-CORRELATION-BOUNDARY.md
  - packages/contracts/mathematical-semantics/**
allowed_paths:
  - packages/contracts/mathematical-semantics/**
  - tests/product/g2-mathematical-semantics*.test.ts
  - specs/tasks/TASK-494-G2-MATH-EVALUATION-DERIVATION-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/elicitation-knowledge-base/**
max_files: 9
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Close Construction B with integrated adversarial Product Proof across TASK-490..493 and the real review-closed Construction A substrate.

# Context
TASK-490..493 form the bounded Construction B contract chain over the already reviewed Construction A mathematical substrate. The Sprint exit requires one integrated adversarial proof that verifies the chain as a whole without importing runtime, provider, causal-authority or Production Readiness scope.

# Current behavior
Before this TASK, each Construction B capability can be proven locally but there is no integrated proof demonstrating end-to-end preservation of exact revisions, disposition, source ownership/currentness/locality and non-causality across evaluation, outcomes, derivation and association semantics.

# Inputs / contracts
- the real review-closed Construction A contracts under `packages/contracts/mathematical-semantics/**`;
- exact public outputs of TASK-490, TASK-491, TASK-492 and TASK-493;
- the Construction B Sprint invariants and preserved exclusions.

# Outputs / contracts
- focused integrated/adversarial Product Proof under the declared test boundary;
- only bounded contract hardening under the existing mathematical-semantics path if required by the proof;
- explicit evidence that Product Proof does not claim Production Readiness and that predecessor Construction A contracts remain unchanged.

# Required change
Add focused integration/adversarial proof and only bounded contract hardening required to prove evaluation request/outcome, derivation lineage and correlation-without-causation as one deterministic contract family.

# Acceptance criteria
- a revision-pinned evaluation envelope preserves exact definition/input/source revisions;
- resolved/unresolved/error dispositions remain distinct end-to-end;
- `UNKNOWN/PARTIAL/INCONCLUSIVE` and missing evidence never become false precision or defaults;
- derivations retain source owner, parent lineage, producing revision, currentness and locality;
- association/correlation cannot be promoted to causality or decision authority;
- predecessor Construction A contracts remain unchanged;
- deterministic normalization is stable for equivalent valid inputs;
- Product Proof explicitly does not claim Production Readiness.

# Negative/adversarial proof
Exercise latest-revision substitution, missing-input defaulting, unresolved/error masking, source-owner/currentness/locality strengthening, dropped lineage and causal/authority promotion.

# Evidence expected
- integrated positive proof traversing the exact TASK-490..493 contract family over real Construction A values;
- adversarial proof for latest-revision substitution, missing defaults, disposition masking, owner/currentness/locality strengthening, dropped lineage and causal/authority promotion;
- repository diff evidence that Construction A predecessor files remain unchanged;
- declared validation commands pass on the exact authoritative TASK head.

# Non-goals
Construction C, runtime engine, persistence, UI, provider/AI execution, provider qualification, workflow, causal inference, physical actuation, Production Readiness.

# Escalation
Stop if integrated proof requires predecessor mutation, causal authority, runtime/provider/persistence behavior, domain adoption or any unmaterialized scope.
