---
id: TASK-402
title: Bind process semantic change approval to canonical human decision authority
status: ready
priority: 402
milestone: M18
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-401
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-02.md
  - project_docs/execution_planning/P18-PROCESS-SEMANTIC-CHANGE-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/contracts/process-change/**
  - packages/contracts/decision-boundary/index.ts
allowed_paths:
  - packages/contracts/process-change/**
  - tests/product/**
  - specs/tasks/TASK-402-P18-SEMANTIC-CHANGE-HUMAN-DECISION.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Complete WBS 18.2.3 approval/rejection evidence by composing the exact semantic-change rationale with existing canonical `human-decision` authority, without modifying Decision Boundary.

# Context
TASK-399 defines canonical semantic diff, TASK-400 explicit classification evidence and TASK-401 exact reason/evidence provenance. Approval remains a distinct human authority concern. Existing Decision Boundary already reserves human decisions through category `human-decision` and explicit `authorityRef`.

# Current behavior
The planned process-change surface has no canonical approve/reject record proving that an exact diff/classification/rationale was decided by a matching human authority reference.

# Inputs / contracts
Canonical TASK-401 rationale/evidence truth plus existing Decision Boundary descriptor/category metadata/evaluation APIs sufficient to prove `human-decision` and matching `authorityRef`.

# Outputs / contracts
A payload-minimal process semantic-change decision record with explicit `approved|rejected` outcome bound to artifact/from/to revision refs, diffRef, classificationRef, rationaleRef, decisionId and authorityRef.

# Required change
Add strict composition/normalization in `packages/contracts/process-change/**` that accepts only canonical semantic-change predecessor truth and canonical Decision Boundary human authority evidence. Require category `human-decision` and exact authorityRef match. Deterministic or probabilistic decisions, model output, classification labels, reason/evidence presence or Git identity must never substitute for approval authority.

# Acceptance criteria
- approve/reject outcome is explicit and payload-minimal;
- exact diff/classification/rationale/revision refs are preserved and mismatch fails closed;
- Decision Boundary descriptor must be canonical `human-decision` with matching authorityRef;
- deterministic/probabilistic category substitution is rejected;
- caller-supplied approval embedded in classification/rationale/evidence payload is rejected;
- Decision Boundary public contract is consumed but not modified;
- Git/PR/ADR engineering approval is not accepted as process-change business approval merely by reference shape;
- declared validations pass.

# Non-goals
No Decision Boundary modification, ADR-0010 reinterpretation, actor directory/authentication design, WBS 18.3 lineage, migration execution, persistence/topology redesign or L4.

# Evidence expected
Positive approve/reject composition plus authority mismatch, wrong category, forged predecessor reference, substituted classification/rationale, approval injection and Git/engineering-governance substitution negatives.

# Escalation
Stop if satisfying the task requires a new authority model, Decision Boundary contract change, identity/auth redesign or undeclared L4.
