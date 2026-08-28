---
id: TASK-385
title: Integrate promotion review truth into representative catalog pre-admission
status: ready
priority: 385
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-03.md
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-INTEGRATION-01.md
  - packages/catalog/**
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - packages/catalog/**
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-385-P17-CATALOG-KNOWLEDGE-PROMOTION-PREADMISSION.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Integrate canonical WBS 17.3 candidate/transformation/genericity truth into a bounded representative catalog pre-admission path without granting promotion or reuse authority.

# Context
Construction A established the canonical promotion candidate, permitted transformation and genericity evidence contracts from real WBS 17.1 -> 17.2 predecessor truth, but the representative catalog path does not consume them.

# Current behavior
Catalog behavior has WBS 17.2 enforcement admission but no WBS 17.3 promotion review/pre-admission seam.

# Inputs / contracts
- TASK-379..384 promotion candidate/transformation/genericity contracts and canonical evaluators;
- closed WBS 17.1 classification/use-policy and WBS 17.2 enforcement/eligibility truth;
- existing additive catalog APIs.

# Outputs / contracts
A payload-minimal catalog-facing pre-admission result that derives from canonical WBS 17.3 evaluators and represents review readiness only, never approval.

# Required change
Add an additive catalog pre-admission helper that evaluates the canonical predecessor chain internally, fails closed for denied/ineligible or malformed predecessor state, permitted-transformation/genericity failures and payload/content injection, and exposes only stable references/status needed by the next promotion-decision gate.

# Acceptance criteria
- predecessor truth is evaluated through canonical WBS 17.1 -> 17.2 -> 17.3 APIs, not caller-injected validators;
- denied/ineligible or invalid transformation/genericity state fails closed;
- output is payload-minimal and cannot be interpreted as promotion/reuse approval;
- existing catalog registration/resolution and WBS 17.2 admission remain backward-compatible;
- declared validations pass.

# Non-goals
No final promotion decision, Decision Boundary change, catalog schema/storage migration, raw payload/content carriage or L4 architecture.

# Evidence expected
Product tests using real exported WBS 17 evaluators with positive and negative pre-admission cases.

# Escalation
Stop if the catalog pre-admission seam cannot remain additive or requires changing final authority semantics.