---
id: TASK-341
title: Integrate governance through the provider-neutral invocation seam
status: ready
priority: 341
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-340
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-02.md
  - project_docs/execution_planning/P16-AI-EXECUTION-GOVERNANCE-INTEGRATION-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-341-P16-GOVERNED-INVOCATION-SEAM.md
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
Add a governed invocation seam that composes the existing `ModelProviderAdapter` invocation with explicit WBS 16.2 governance evaluation and structured-output validation.

# Context
Construction A and TASK-340 provide the contracts/evaluator; the residual Package Goal gap is that `invokeModelProvider` itself does not exercise them.

# Current behavior
`invokeModelProvider` normalizes request/response and checks request identity only.

# Inputs / contracts
- existing `ModelProviderAdapter` and `invokeModelProvider` behavior;
- normalized governance composition;
- explicit capability descriptor and evaluation inputs from TASK-340.

# Outputs / contracts
A provider-neutral governed invocation result that includes normalized response, governance evaluation and structured-output validation state.

# Required change
Compose existing APIs rather than replacing them. Evaluate governance before invocation where possible, fail closed for ineligible policy/limits, invoke only through the existing adapter boundary, then validate the normalized response output against the explicit schema.

# Acceptance criteria
- ineligible governance prevents adapter invocation;
- eligible governance invokes through `ModelProviderAdapter` only;
- request/response identity checks remain intact;
- structured output is explicitly validated after response normalization;
- no hidden fallback, provider selection, network topology or authority fabrication is introduced;
- predecessor `invokeModelProvider` remains backward-compatible;
- declared validations pass.

# Non-goals
No provider registry, provider ranking, mandatory remote transport, credentials, WBS 16.3, Runtime/compiler change or policy-engine replacement.

# Evidence expected
Product tests with a fake provider-neutral adapter proving eligible invocation, no invocation when ineligible, malformed response failure and structured-output validation.

# Escalation
Stop if integration requires changing architecture boundaries or provider-specific state.
