---
id: TASK-299
title: Normalize and validate category-specific decision metadata
status: ready
priority: 299
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-298
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-CONTRACT-01.md
  - specs/tasks/TASK-298-P15-DECISION-CATEGORY-CONTRACT.md
  - packages/contracts/evidence-provenance/index.ts
allowed_paths:
  - packages/contracts/decision-boundary/**
  - specs/contracts/**
  - tests/product/**
  - specs/tasks/TASK-299-P15-DECISION-METADATA-NORMALIZATION.md
forbidden_paths:
  - .github/**
  - docs/adr/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define deterministic normalization and validation rules for metadata required by each decision category.
# Context
WBS 15.1.2 requires category-specific metadata; TASK-298 establishes only the category vocabulary/base descriptor.
# Current behavior
There is no canonical product rule deciding which metadata is valid or required for deterministic, human-reserved or probabilistic decision descriptors.
# Required change
Add strict normalization/validation that accepts only explicit category-appropriate fields, rejects ambiguous/unknown data and produces stable normalized output.
# Inputs / contracts
TASK-298 decision category contract and existing deterministic contract-validation conventions.
# Outputs / contracts
Deterministic category-metadata validator/normalizer with explicit diagnostics.
# Acceptance criteria
Equivalent explicit inputs normalize identically; unknown fields/invalid combinations fail; human-reserved metadata cannot be represented as probabilistic evidence; no defaults fabricate authority, confidence or model context.
# Non-goals
No risk classifier yet, no provider call, no authorization grant, no persistence layer.
# Evidence expected
Positive/negative normalization fixtures and repository verification.
# Escalation
Stop only if satisfying the task requires broadening the contract beyond WBS 15.1.2 or changing architecture/human-approval semantics.
