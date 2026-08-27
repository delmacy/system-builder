---
id: TASK-374
title: Integrate payload-minimal knowledge enforcement into observe path
status: ready
priority: 374
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-373
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-02.md
  - project_docs/execution_planning/P17-KNOWLEDGE-ENFORCEMENT-INTEGRATION-01.md
  - packages/observe/**
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - packages/observe/**
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-374-P17-OBSERVE-KNOWLEDGE-ENFORCEMENT-INTEGRATION.md
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
Integrate P17 enforcement references into a representative observe/telemetry-facing path without exporting sensitive payload.

# Context
WBS 17.2.1 and 17.2.3 require telemetry isolation and reference preservation without payload leakage.

# Current behavior
`packages/observe/**` does not consume the P17 enforcement/reference envelope.

# Inputs / contracts
- TASK-369 payload-minimal reference envelope;
- TASK-370 enforcement composition;
- existing observe metadata/publish/evidence semantics.

# Outputs / contracts
A bounded observe-facing projection/consumption seam for enforcement status and stable references.

# Required change
Compose existing observe APIs with the payload-minimal enforcement envelope so denied/isolate state cannot be represented as unrestricted reuse and payload/content/provider/credential material is rejected.

# Acceptance criteria
- observe-facing output contains only allowed enforcement/reference metadata;
- sensitive payload/content injection fails closed;
- human authority/reference identity is not weakened or replaced;
- no promotion approval is inferred;
- declared validations pass.

# Non-goals
No telemetry backend/topology redesign, WBS 17.3 or Runtime Audit Trail replacement.

# Evidence expected
Product tests of real observe-facing exported API composition with allow/deny/isolate and payload-injection cases.

# Escalation
Stop if existing observe public semantics must be destructively changed.
