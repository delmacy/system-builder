---
id: TASK-367
title: Define canonical knowledge enforcement disposition
status: ready
priority: 367
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-02.md
  - project_docs/execution_planning/P17-KNOWLEDGE-ENFORCEMENT-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - project_docs/17-knowledge-boundary/scope/README.md
  - packages/contracts/knowledge-boundary/index.ts
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-367-P17-KNOWLEDGE-ENFORCEMENT-DISPOSITION.md
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
Define the canonical deterministic enforcement disposition for WBS 17.2.

# Context
WBS 17.1 now supplies canonical classification, ownership and purpose/use restrictions. WBS 17.2 needs an explicit enforcement result rather than consumer-specific inference.

# Current behavior
No dedicated contract represents allow/deny/isolate disposition derived from canonical knowledge policy state.

# Inputs / contracts
- closed WBS 17.1 Knowledge Boundary contracts;
- WBS 17.2.1–17.2.3.

# Outputs / contracts
- additive provider-neutral enforcement disposition contract;
- deterministic positive/negative product proof.

# Required change
Define a versioned, fail-closed enforcement disposition that records explicit decision inputs/references and cannot infer reuse/promotion authority from payload, source name or provider metadata.

# Acceptance criteria
- dispositions are explicit and deterministically normalized;
- unknown/extra/ambiguous state fails closed;
- no sensitive payload, provider ID or credential is carried;
- no Decision Boundary authority semantics are changed;
- declared validations pass.

# Non-goals
No catalog/telemetry/AI Gateway wiring, anonymization/generalization or promotion workflow.

# Evidence expected
Positive/negative product tests for canonical enforcement disposition.

# Escalation
Stop if implementation requires Decision Boundary public-contract change, WBS 17.3 behavior or undeclared architecture change.
