---
id: TASK-349
title: Prove Construction A security and observation contracts together
status: planned
priority: 349
milestone: M16
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-348]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-03.md
  - project_docs/execution_planning/P16-AI-SECURITY-OBSERVATION-CONTRACT-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/P16-AI-SECURITY-OBSERVATION-CONTRACT-01.report.md
  - specs/tasks/TASK-349-P16-SECURITY-OBSERVATION-GROWING-PROOF.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Create the Construction A growing proof across data/knowledge boundary, secret-reference portability and usage observation contracts.
# Context
TASK-345..348 establish the bounded WBS 16.3 contract surface; this TASK proves them together before Sprint Review.
# Current behavior
Individual contracts do not yet have one integrated Construction A proof and Sprint Report.
# Inputs / contracts
Outputs of TASK-345..348 and integrated WBS 16.1/16.2 contracts.
# Outputs / contracts
Growing product proof and Sprint Report with exact traceability.
# Required change
Add proof-only coverage showing denied/invalid boundary cases fail closed, secret material is absent/rejected, observations are permission-aware, and predecessor contracts remain compatible.
# Acceptance criteria
Integrated positive/negative proof; no product behavior added; Sprint Report records TASK commits/gates; validations pass.
# Non-goals
No Construction B implementation, invocation wiring, credential lifecycle, telemetry backend or new architecture.
# Evidence expected
Growing product test and report sufficient for exact-head Sprint Review and fresh-main Construction B decision.
# Escalation
Stop if proof exposes a functional gap requiring changes outside committed Construction A scope.