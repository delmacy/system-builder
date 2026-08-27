---
id: TASK-373
title: Integrate knowledge enforcement into representative catalog admission
status: completed
priority: 373
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-02.md
  - project_docs/execution_planning/P17-KNOWLEDGE-ENFORCEMENT-INTEGRATION-01.md
  - packages/catalog/**
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - packages/catalog/**
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-373-P17-CATALOG-KNOWLEDGE-ENFORCEMENT-INTEGRATION.md
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
Integrate the existing P17 enforcement decision into a bounded representative catalog admission path without changing existing software-catalog identity/resolution semantics.

# Context
WBS 17.2.1 requires catalogs to fail closed for unauthorized knowledge use. Construction A supplies enforcement and eligibility contracts but no catalog consumer.

# Current behavior
`packages/catalog/**` has no P17 knowledge-enforcement consumption.

# Inputs / contracts
- TASK-367..372 knowledge enforcement/composition outputs;
- existing catalog APIs and storage semantics.

# Outputs / contracts
A bounded catalog-facing knowledge admission helper/projection that consumes existing enforcement truth and preserves payload-minimal references.

# Required change
Add an additive catalog integration seam that admits a knowledge reference only when existing enforcement/eligibility truth is compatible; denied, isolated, malformed or permission-missing state must fail closed. Do not reinterpret `eligible` as promotion approval.

# Acceptance criteria
- unauthorized proprietary/personal/trade-secret admission fails closed;
- admitted state carries references only, not payload/content;
- existing catalog registration/resolution behavior remains backward-compatible;
- no automatic promotion/reuse authority is minted;
- declared validations pass.

# Non-goals
No WBS 17.3, anonymization/generalization, catalog schema migration or Decision Boundary changes.

# Evidence expected
Product tests using real exported catalog + knowledge-boundary APIs for positive and negative admission cases.

# Escalation
Stop if integration requires changing existing catalog identity/storage schema or authority semantics.
