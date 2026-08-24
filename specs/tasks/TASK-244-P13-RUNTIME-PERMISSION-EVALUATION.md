---
id: TASK-244
title: Evaluate deterministic Runtime permissions with auditable allow deny decisions
status: ready
priority: 244
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-243]
context_paths:
  - packages/runtime-core/**
  - project_docs/27-identity-organization-authorization/WBS.md
allowed_paths:
  - packages/runtime-core/**
  - tests/product/runtime*.test.ts
  - specs/tasks/TASK-244-P13-RUNTIME-PERMISSION-EVALUATION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/compiler/**
max_files: 12
validation: [npm run test:product, npm run check:tasks, npm run verify]
---
# Objective
Evaluate declared role/resource/actions against resolved actor authority and return deterministic auditable allow/deny outcomes.

# Acceptance criteria
Default deny; exact declared action/resource matching; no wildcard/permissive fallback unless explicitly represented by current contract; decision evidence contains references/reasons but no secrets.
