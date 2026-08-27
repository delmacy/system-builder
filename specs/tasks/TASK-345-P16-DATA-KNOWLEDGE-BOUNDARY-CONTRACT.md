---
id: TASK-345
title: Define AI data and knowledge boundary descriptor
status: planned
priority: 345
milestone: M16
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-03.md
  - project_docs/execution_planning/P16-AI-SECURITY-OBSERVATION-CONTRACT-01.md
  - project_docs/16-ai-gateway/WBS.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-345-P16-DATA-KNOWLEDGE-BOUNDARY-CONTRACT.md
forbidden_paths:
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
Define a versioned provider-neutral descriptor for the data/knowledge boundary that must be satisfied before AI Gateway transmission.
# Context
WBS 16.3.1 requires an explicit pre-send boundary while WBS 16.1/16.2 contracts are already closed.
# Current behavior
No canonical AI Gateway contract expresses allowed knowledge/data classes and references for pre-send enforcement.
# Inputs / contracts
Integrated AI Gateway request/governance contracts and WBS 16.3.1 authority.
# Outputs / contracts
Versioned boundary descriptor, deterministic normalization and focused tests.
# Required change
Add an explicit descriptor that identifies allowed data/knowledge classes and references without embedding business prompt logic, provider identity, secrets or authorization.
# Acceptance criteria
Provider-neutral and versioned; malformed/unknown fields fail closed; deterministic normalization; no secret/provider lookup; predecessor contracts remain compatible; validations pass.
# Non-goals
No invocation wiring, secret lifecycle, telemetry backend, provider registry or authority semantics.
# Evidence expected
Positive/negative product tests for explicit boundary normalization and predecessor compatibility.
# Escalation
Stop if implementation requires L4 boundaries, provider topology, credential lifecycle or scope beyond WBS 16.3.