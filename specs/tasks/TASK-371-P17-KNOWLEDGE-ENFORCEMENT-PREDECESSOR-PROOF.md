---
id: TASK-371
title: Prove predecessor authority compatibility for enforcement
status: completed
priority: 371
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-370
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-02.md
  - project_docs/execution_planning/P17-KNOWLEDGE-ENFORCEMENT-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - packages/contracts/decision-boundary/**
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - tests/product/**
  - packages/contracts/knowledge-boundary/**
  - specs/tasks/TASK-371-P17-KNOWLEDGE-ENFORCEMENT-PREDECESSOR-PROOF.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove that WBS 17.2 enforcement preserves M15 human-decision authority and all closed WBS 17.1 classification semantics.

# Context
Enforcement must consume authority; it must never mint or launder authority.

# Current behavior
No package-level predecessor compatibility proof exists for the new enforcement surface.

# Inputs / contracts
- TASK-370 canonical enforcement composition;
- M15 Decision Boundary public API as read-only context;
- closed WBS 17.1 contracts.

# Outputs / contracts
- product proof only, plus bounded knowledge-boundary adjustments if necessary within existing semantics.

# Required change
Prove manual/assisted classifications preserve canonical `human-decision`, assisted proposal remains non-authoritative, and enforcement cannot turn deterministic/probabilistic metadata into reuse/promotion authority.

# Acceptance criteria
- human authority is preserved end-to-end;
- substitution/laundering attempts fail closed;
- existing Decision Boundary contract is unchanged;
- predecessor-compatible historical paths remain valid;
- declared validations pass.

# Non-goals
No Decision Boundary edits, WBS 17.3 behavior or real consumer integration.

# Evidence expected
Product tests covering positive human path and negative deterministic/probabilistic substitution.

# Escalation
Stop if proof exposes a predecessor defect requiring Decision Boundary public-contract change.
