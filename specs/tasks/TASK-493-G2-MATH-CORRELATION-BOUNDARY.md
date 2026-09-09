---
id: TASK-493
title: Define correlation and evidence association without causal authority
status: verification
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

# Context
TASK-492 establishes owner-preserving derivation lineage over exact evaluation outcomes. WP-03 also requires explicit association/correlation semantics while maintaining the package invariant `correlation != causation` and leaving causality research-only.

# Current behavior
The mathematical semantics substrate has no Construction B association/correlation descriptor that pins participant revisions and evidence while structurally excluding causal roles, intervention claims or authority transfer. Ad hoc interpretation would risk turning analytical association into domain authority.

# Inputs / contracts
- exact TASK-492 derived or source analytical value references and their historical revisions;
- preserved source owner, currentness, locality, evidence and uncertainty qualification;
- explicit analytical revision/evidence describing the bounded association/correlation observation.

# Outputs / contracts
- additive association/correlation descriptors with exact participant/source revisions;
- deterministic normalization that preserves declared participant order/identity semantics;
- a public shape in which causal labels, interventions, authority transfer and actuation rights are unavailable.

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

# Evidence expected
- positive proof for deterministic association/correlation normalization with exact participant and evidence revisions;
- adversarial proof that causal labels/intervention/authority claims, revision substitution and evidence/locality strengthening are rejected or structurally unavailable;
- declared validation commands pass on the exact authoritative TASK head.

# Non-goals
Causal inference, causal graphs, interventions, policy decisions, authorization/trust, physical actuation, AI/provider execution.

# Escalation
Stop if any requirement needs causal authority, intervention semantics, domain decision ownership or unmaterialized research findings.
