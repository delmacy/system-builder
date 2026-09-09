---
id: TASK-492
title: Preserve owner and revision lineage across analytical derivations and transforms
status: ready
priority: 492
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-491
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-MATH-EVALUATION-DERIVATION-01.md
  - specs/tasks/TASK-491-G2-MATH-EVALUATION-OUTCOMES.md
  - packages/contracts/mathematical-semantics/**
allowed_paths:
  - packages/contracts/mathematical-semantics/**
  - tests/product/g2-mathematical-semantics*.test.ts
  - specs/tasks/TASK-492-G2-MATH-DERIVATION-LINEAGE.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/elicitation-knowledge-base/**
max_files: 7
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define analytical derivation/transform lineage that records what analytical revision produced a value while preserving the source-domain owner and historical source revisions.

# Required change
Add additive derivation/transform descriptors and bindings that pin transform identity/revision, parent analytical/value references and producing revision, and carry source owner/evidence/currentness/locality without reassignment or strengthening.

# Acceptance criteria
- transform/derivation identity and exact revision are explicit;
- every derived value retains parent/source lineage and historical producing revisions;
- analytical mechanics do not replace source-domain owner;
- currentness/evidence/locality cannot be silently strengthened;
- unresolved/error/uncertain parents cannot be promoted to stronger output authority;
- equivalent valid lineage normalizes deterministically.

# Negative/adversarial proof
Reject source-owner substitution, latest-revision substitution, dropped parent lineage, Local-to-Station/Fleet strengthening, unresolved-to-resolved strengthening and cycles/duplicate parent ambiguity where represented.

# Non-goals
Graph execution engine, scheduling, persistence, provider/AI execution, domain ownership, causal derivation, physical actuation.

# Escalation
Stop if a transform requires source ownership transfer, causal authority, runtime graph execution, persistence or predecessor mutation.
