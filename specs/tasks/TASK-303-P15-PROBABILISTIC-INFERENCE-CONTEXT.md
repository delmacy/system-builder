---
id: TASK-303
title: Define explicit probabilistic confidence and model context
status: ready
priority: 303
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-302
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-CONTRACT-01.md
  - packages/contracts/decision-boundary/**
  - packages/contracts/evidence-provenance/index.ts
allowed_paths:
  - packages/contracts/decision-boundary/**
  - specs/contracts/**
  - tests/product/**
  - specs/tasks/TASK-303-P15-PROBABILISTIC-INFERENCE-CONTEXT.md
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
Define explicit, bounded and provider-neutral confidence/model context for probabilistic decisions.
# Context
WBS 15.2.3 requires recording confidence/model context whenever inference is used. Existing provenance confidence semantics are evidence, not a canonical decision-inference context.
# Current behavior
No reusable decision-boundary contract requires probabilistic decisions to carry explicit inference context.
# Required change
Add strict probabilistic context metadata with normalized confidence and non-secret model/context identifiers sufficient for audit/verification, while avoiding provider coupling and hidden defaults.
# Inputs / contracts
TASK-298..302 decision-boundary contract and existing provider-neutral evidence conventions.
# Outputs / contracts
Validated probabilistic inference-context descriptor integrated with category validation.
# Acceptance criteria
Probabilistic descriptors require explicit bounded confidence and model/context metadata defined by the contract; malformed/out-of-range confidence fails; deterministic/human categories cannot silently acquire probabilistic context; no secret, credential, endpoint or provider resource locator is required.
# Non-goals
No model registry, remote inference call, provider adapter, prompt storage, telemetry mandate or authorization implication.
# Evidence expected
Positive/negative contract fixtures and repository verification.
# Escalation
Stop only if satisfying WBS 15.2.3 requires a provider-specific or L4 topology not materialized here.
