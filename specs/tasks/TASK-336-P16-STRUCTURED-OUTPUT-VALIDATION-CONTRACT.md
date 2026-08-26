---
id: TASK-336
title: Define structured output schema validation boundary
status: ready
priority: 336
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-334
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-02.md
  - project_docs/execution_planning/P16-AI-EXECUTION-GOVERNANCE-CONTRACT-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-336-P16-STRUCTURED-OUTPUT-VALIDATION-CONTRACT.md
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
Define the provider-neutral structured-output schema validation boundary required by WBS 16.2.2.

# Context
Structured AI outputs must be checked against an explicit schema contract before downstream use, independent of provider implementation details.

# Current behavior
The AI Gateway contract boundary does not expose a canonical structured-output validation request/result contract.

# Inputs / contracts
- TASK-334 governance policy descriptor;
- integrated model response contract from WBS 16.1.

# Outputs / contracts
- explicit schema reference/descriptor boundary for structured-output validation;
- deterministic validation result shape distinguishing valid/invalid/schema-invalid states;
- focused product tests.

# Required change
Introduce fail-closed validation contracts and pure deterministic validation helpers for the explicitly supported schema boundary without provider/network/secret lookup or hidden coercion/defaults.

# Acceptance criteria
- validation uses an explicit schema boundary;
- malformed schema or output fails explicitly;
- no output coercion or hidden defaults are introduced;
- result does not imply authorization/approval;
- provider identity is absent from central contracts;
- declared validations pass.

# Non-goals
No prompt generation, provider-specific structured-output API, remote schema registry, WBS 16.3 data boundary, or runtime/compiler change.

# Evidence expected
Product tests for valid output, schema mismatch, malformed schema and predecessor model-response compatibility.

# Escalation
Stop if implementation requires a remote schema registry, architecture boundary change or WBS 16.3 behavior.
