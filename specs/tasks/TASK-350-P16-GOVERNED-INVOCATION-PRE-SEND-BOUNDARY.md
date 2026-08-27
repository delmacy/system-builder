---
id: TASK-350
title: Enforce pre-send boundary in governed invocation
status: completed
priority: 350
milestone: M16
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-03.md
  - project_docs/execution_planning/P16-AI-SECURITY-OBSERVATION-INTEGRATION-01.md
  - project_docs/16-ai-gateway/WBS.md
  - project_docs/16-ai-gateway/scope/README.md
  - packages/contracts/ai-gateway/index.ts
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-350-P16-GOVERNED-INVOCATION-PRE-SEND-BOUNDARY.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/observe/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Apply the existing WBS 16.3 pre-send data/knowledge boundary to the canonical governed invocation path before any provider adapter is invoked.

# Context
Construction A defined the explicit outbound boundary/evaluator. Fresh-main revalidation proved `invokeGovernedModelProvider` does not yet apply it.

# Current behavior
Governed invocation now composes the existing pre-send boundary evaluator before adapter invocation when the WBS 16.3 boundary envelope is supplied, while preserving predecessor callers that have not yet opted into the additive boundary input.

# Inputs / contracts
- existing governed invocation API and ModelRequest normalization;
- Construction A data/knowledge boundary descriptor and evaluator;
- WBS 16.1/16.2 predecessor contracts.

# Outputs / contracts
- governed invocation fails closed before adapter invocation when supplied outbound data is undeclared/disallowed or malformed;
- allowed data reaches the existing adapter with predecessor semantics preserved;
- the explicit pre-send boundary evaluation is returned alongside the governed invocation result when present.

# Required change
Compose the existing boundary evaluator into governed invocation before provider invocation. Reuse existing contracts; do not create a registry, topology or new authority semantics.

# Acceptance criteria
- boundary evaluation occurs before adapter invocation;
- rejected boundary prevents adapter execution and returns explicit failure;
- allowed path preserves canonical request/governance behavior;
- positive, negative and predecessor-integration proof exists;
- declared validations pass.

# Non-goals
No secret lifecycle, provider registry/topology, billing authority, Runtime Audit Trail replacement, hidden fallback or WBS beyond 16.3.

# Evidence expected
Focused product proof of pre-send enforcement and no adapter call on rejection.

# Escalation
Stop if the only viable solution requires a new module boundary or other undeclared L4 change.
