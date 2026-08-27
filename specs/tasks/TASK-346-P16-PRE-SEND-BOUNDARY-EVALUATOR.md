---
id: TASK-346
title: Implement deterministic pre-send boundary evaluator
status: ready
priority: 346
milestone: M16
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-345]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-03.md
  - project_docs/execution_planning/P16-AI-SECURITY-OBSERVATION-CONTRACT-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-346-P16-PRE-SEND-BOUNDARY-EVALUATOR.md
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
Implement deterministic fail-closed evaluation of an outbound AI request against the canonical data/knowledge boundary before transmission.
# Context
TASK-345 defines the descriptor; WBS 16.3.1 requires enforcement before send.
# Current behavior
Governed invocation validates execution policy but has no canonical pre-send knowledge/data evaluation contract.
# Inputs / contracts
TASK-345 descriptor and integrated AI Gateway request/governance contracts.
# Outputs / contracts
Explicit allowed/rejected/invalid evaluation result with stable reasons and focused tests.
# Required change
Add a pure provider-neutral evaluator that rejects undeclared, mismatched or malformed boundary evidence before any provider adapter can be considered.
# Acceptance criteria
Allowed cases deterministic; undeclared/malformed cases fail closed; result fabricates no approval/authorization; no provider/network/secret lookup; validations pass.
# Non-goals
No adapter wiring, credential handling, telemetry backend or provider selection.
# Evidence expected
Product tests proving allowed, denied and invalid cases plus predecessor compatibility.
# Escalation
Stop if enforcement requires architecture changes, runtime topology or business-specific classification policy.