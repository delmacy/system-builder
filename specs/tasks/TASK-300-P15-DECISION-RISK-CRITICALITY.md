---
id: TASK-300
title: Define explicit decision risk and criticality semantics
status: ready
priority: 300
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-299
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-CONTRACT-01.md
  - project_docs/15-deterministic-human-probabilistic-boundary/WBS.md
  - packages/contracts/decision-boundary/**
allowed_paths:
  - packages/contracts/decision-boundary/**
  - specs/contracts/**
  - tests/product/**
  - specs/tasks/TASK-300-P15-DECISION-RISK-CRITICALITY.md
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
Define bounded, explicit risk/criticality metadata for decision classification without turning risk into authorization policy.
# Context
WBS 15.1.3 requires criteria for risk/criticality. TASK-299 provides deterministic metadata normalization.
# Current behavior
No reusable decision-boundary contract exposes a stable risk/criticality dimension tied to the decision descriptor.
# Required change
Add a small enumerated risk/criticality vocabulary and deterministic validation rules suitable for later enforcement decisions while remaining descriptive rather than authoritative.
# Inputs / contracts
TASK-298/299 decision-boundary contract and WBS 15.1.3.
# Outputs / contracts
Explicit validated risk/criticality descriptor or fields with stable canonical ordering/normalization.
# Acceptance criteria
Unknown risk/criticality values fail explicitly; absence behavior is intentional and documented; risk metadata alone cannot grant/deny authority; deterministic/human/probabilistic category remains orthogonal and preserved.
# Non-goals
No policy engine, no automatic business-risk inference, no provider/model call, no user-role changes.
# Evidence expected
Contract fixtures covering all supported values, invalid values and category combinations plus repository verification.
# Escalation
Stop only if implementation would require introducing new authorization policy or an undeclared L4 decision architecture.
