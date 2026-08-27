---
id: TASK-369
title: Define payload-minimal enforcement reference envelope
status: completed
priority: 369
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-367
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-02.md
  - project_docs/execution_planning/P17-KNOWLEDGE-ENFORCEMENT-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - packages/contracts/knowledge-boundary/reference-projection.ts
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-369-P17-KNOWLEDGE-ENFORCEMENT-REFERENCE.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define the payload-minimal enforcement reference envelope required by WBS 17.2.3.

# Context
Enforcement consumers need portable references to classification/policy decisions without transporting sensitive source content.

# Current behavior
WBS 17.1 has payload-minimal classification projection, but no enforcement-specific reference envelope exists.

# Inputs / contracts
- TASK-367 enforcement disposition;
- existing WBS 17.1 reference projection.

# Outputs / contracts
- additive enforcement reference envelope;
- rejection proof for embedded sensitive payload fields.

# Required change
Carry only canonical identifiers, classification/use-policy references and enforcement disposition references required by consumers; reject unknown content-bearing fields fail-closed.

# Acceptance criteria
- envelope contains references/metadata only;
- sensitive payload/content fields are rejected;
- canonical ordering/normalization is deterministic;
- predecessor reference projection remains compatible;
- declared validations pass.

# Non-goals
No storage transport, provider credential carriage or consumer wiring.

# Evidence expected
Positive/negative product tests for payload-minimal reference behavior.

# Escalation
Stop if a consumer requires raw sensitive payload to satisfy this contract.
