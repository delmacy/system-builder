---
id: TASK-270
title: Add optional evidence classification and confidence semantics
status: ready
priority: 270
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-269]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-CONTRACT-01.md
  - project_docs/14-evidence-provenance/WBS.md
allowed_paths:
  - packages/contracts/**
  - tests/product/**
  - specs/tasks/TASK-270-P14-EVIDENCE-CLASSIFICATION-CONFIDENCE.md
forbidden_paths:
  - .github/**
  - packages/runtime-core/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Add bounded optional classification/confidence semantics required by WBS 14.1.3.

# Context
Classification/confidence is evidence metadata only and must not imply authorization, correctness or execution authority. It must be representable without forcing probabilistic scoring where none exists.

# Required change
Define optional classification labels and optional confidence representation with explicit provenance/version semantics and deterministic validation.

# Acceptance criteria
- classification and confidence are independently optional;
- absence remains valid and does not imply a default confidence;
- confidence validation is explicit and deterministic;
- metadata cannot authorize or suppress behavior by itself;
- no vendor-specific scoring model is required.

# Non-goals
AI model ranking, policy execution, authorization or automated truth adjudication.

# Evidence expected
Positive/negative tests including absent metadata and invalid confidence cases.

# Escalation
Stop if semantics require project-wide policy for truth/risk classification not already authorized.
