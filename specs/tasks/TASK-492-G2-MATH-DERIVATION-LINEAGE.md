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

# Context
TASK-490/491 establish exact evaluation requests and explicit outcomes over Construction A analytical values. Derived analytical values must now record their producing transform without allowing mathematical mechanics to replace source-domain ownership or strengthen source qualification.

# Current behavior
Construction A preserves analytical/source lineage for foundational values, but Construction B has no additive derivation/transform descriptor that binds parent values and exact transform revisions across a derived result. Without it, parent or historical provenance could be dropped or silently replaced.

# Inputs / contracts
- exact TASK-491 evaluation outcome and its TASK-490 definition/input lineage;
- Construction A analytical value/source owner, evidence/currentness, locality, uncertainty and historical producing revisions;
- explicit transform/derivation identity and revision plus represented parent references.

# Outputs / contracts
- additive owner-preserving derivation/transform descriptors and bindings;
- derived analytical lineage that pins exact transform and parent/source/producing revisions;
- deterministic normalization that preserves source-domain owner and refuses currentness/locality/authority strengthening.

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

# Evidence expected
- positive proof for deterministic derivation lineage across exact historical transform and parent revisions;
- adversarial proof for owner/revision substitution, dropped/duplicate parent lineage, cycles where representable and qualification/locality strengthening;
- declared validation commands pass on the exact authoritative TASK head.

# Non-goals
Graph execution engine, scheduling, persistence, provider/AI execution, domain ownership, causal derivation, physical actuation.

# Escalation
Stop if a transform requires source ownership transfer, causal authority, runtime graph execution, persistence or predecessor mutation.
