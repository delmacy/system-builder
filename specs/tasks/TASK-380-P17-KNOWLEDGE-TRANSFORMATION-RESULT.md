---
id: TASK-380
title: Define permitted anonymization and generalization result contract
status: completed
priority: 380
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-379]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-03.md
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-CONTRACT-01.md
  - specs/tasks/TASK-379-P17-KNOWLEDGE-PROMOTION-CANDIDATE.md
  - packages/contracts/knowledge-boundary/index.ts
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-380-P17-KNOWLEDGE-TRANSFORMATION-RESULT.md
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
Define the canonical result record for anonymization/generalization when policy permits it.

# Context
WBS 17.3.1 requires permitted transformation while preserving traceability and authority boundaries.

# Current behavior
No versioned transformation-result contract distinguishes a transformed candidate from an approved reusable asset.

# Inputs / contracts
Canonical TASK-379 promotion candidate and closed predecessor policy/enforcement references.

# Outputs / contracts
Deterministic transformation-result metadata describing method/category/status and source candidate reference without raw payload.

# Required change
Add a fail-closed provider-neutral record for permitted anonymization/generalization outcomes. The record is evidence only and cannot authorize promotion.

# Acceptance criteria
- transformation kind/status is explicit and normalized;
- unknown/mismatched candidate or policy state fails closed;
- no raw sensitive payload, provider credential or implicit approval;
- predecessor compatibility is tested;
- declared validations pass.

# Non-goals
No concrete anonymization engine or automatic reuse approval.

# Evidence expected
Positive/negative product tests showing transformation metadata remains non-authoritative.

# Escalation
Stop if a real transformation engine, Decision Boundary change or L4 topology change becomes necessary.
