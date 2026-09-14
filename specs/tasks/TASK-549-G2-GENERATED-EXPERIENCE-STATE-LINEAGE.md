---
id: TASK-549
title: Preserve uncertain conflicted state and generated artifact lineage
status: completed
priority: 549
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-548
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-547-G2-GENERATED-EXPERIENCE-PROJECTION-CURRENTNESS.md
  - specs/tasks/TASK-548-G2-GENERATED-EXPERIENCE-VISIBILITY-AUTHORITY.md
  - packages/contracts/generated-experience/**
allowed_paths:
  - packages/contracts/generated-experience/**
  - tests/product/g2-generated-experience-lineage-proof.test.ts
  - specs/tasks/TASK-549-G2-GENERATED-EXPERIENCE-STATE-LINEAGE.md
forbidden_paths:
  - packages/db/**
  - packages/runtime-core/**
  - apps/**
  - .github/workflows/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Make stale, PARTIAL, UNKNOWN, INCONCLUSIVE and CONFLICTED truth explicitly representable while preserving source/evidence/revision lineage for generated artifacts.

# Context
TASK-547 and TASK-548 establish projection/currentness and visibility/authority boundaries. This task closes the remaining Construction A semantic gap by preventing generated summaries or artifacts from flattening unresolved truth or losing provenance across regeneration.

# Current behavior
No bounded generated-experience contract currently requires unresolved/conflicted states and source/evidence/revision lineage to survive projection, rendering and regeneration as first-class evidence.

# Required change
Add only the bounded representation/lineage semantics needed for generated experience to carry unresolved states and provenance without forced normalization or canonicalization.

# Inputs / contracts
TASK-547 projection identity/currentness, TASK-548 visibility/authority separation, and existing canonical evidence/provenance/revision semantics.

# Outputs / contracts
Generated-experience state and lineage semantics that preserve uncertain/conflicted evidence and historical projection provenance, plus deterministic Product Proof.

# Acceptance criteria
- stale/PARTIAL/UNKNOWN/INCONCLUSIVE/CONFLICTED remain first-class and distinguishable;
- summaries/projections preserve negation, contradiction and unresolved evidence rather than flattening them;
- generated artifact lineage identifies source/evidence revisions and generation/projection revision;
- user acceptance/rendering does not automatically canonicalize generated content;
- historical projections remain addressable after regeneration;
- deterministic Product Proof covers contradictory sources, unresolved evidence, lineage break and regeneration history.

# Non-goals
AI inference semantics, prompt/model provenance, governance disposition workflow, persistence or Production Readiness.

# Evidence expected
Deterministic Product Proof for unresolved/conflicted state preservation, provenance continuity and immutable historical regeneration lineage, plus exact-head repository validation.

# Escalation
If lineage requires new persistence, governance disposition, AI inference or canonical evidence ownership, stop and return the finding to Sprint Review rather than broadening TASK-549.
