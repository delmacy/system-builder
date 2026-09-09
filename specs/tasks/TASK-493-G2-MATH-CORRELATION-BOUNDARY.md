---
id: TASK-493
title: Define correlation and evidence association without causal authority
status: ready
priority: 493
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-492
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-MATH-EVALUATION-DERIVATION-01.md
  - specs/tasks/TASK-492-G2-MATH-DERIVATION-LINEAGE.md
  - packages/contracts/mathematical-semantics/**
allowed_paths:
  - packages/contracts/mathematical-semantics/**
  - tests/product/g2-mathematical-semantics*.test.ts
  - specs/tasks/TASK-493-G2-MATH-CORRELATION-BOUNDARY.md
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
Provide explicit analytical evidence-association/correlation semantics while making causal interpretation and authority structurally unavailable.

# Required change
Add only bounded association/correlation descriptors that pin participating value/source revisions and analytical revision/evidence. Allowed semantics must not expose causal labels, intervention claims, authority transfer or actuation rights.

# Acceptance criteria
- association/correlation participants and revisions are explicit;
- evidence/uncertainty qualification is preserved conservatively;
- source owners/currentness/locality are preserved;
- no causal role, causal strength, intervention or authority field is admitted;
- correlation cannot authorize a downstream business/domain decision by itself;
- deterministic normalization preserves participant order/identity semantics declared by the contract.

# Negative/adversarial proof
Reject causal-label promotion, authority claims, source revision substitution, unknown evidence strengthening and locality strengthening.

# Non-goals
Causal inference, causal graphs, interventions, policy decisions, authorization/trust, physical actuation, AI/provider execution.

# Escalation
Stop if any requirement needs causal authority, intervention semantics, domain decision ownership or unmaterialized research findings.
