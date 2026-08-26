---
id: TASK-321
title: Prove canonical SystemDefinition through Compiler consumers
status: ready
priority: 321
milestone: PRE-M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/PRE-M16-CONFORMANCE-INTEGRATION-01.md
  - packages/contracts/system-definition/**
  - packages/compiler/runtime-projection.ts
  - packages/compiler/runtime-model.ts
  - tests/product/compiler-runtime-identity-session.test.ts
  - tests/product/compiler-runtime-authority-model.test.ts
allowed_paths:
  - tests/product/**
  - specs/tasks/TASK-321-PRE-M16-COMPILER-CONSUMER-CONFORMANCE.md
forbidden_paths:
  - packages/compiler/**
  - packages/runtime/**
  - project_docs/16-ai-gateway/**
max_files: 4
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove through existing Compiler projection APIs that a canonical SystemDefinition carrying integrated identity/session and authority/generated-interaction descriptors remains consumable after TASK-317/318 schema hardening.

# Required change
Add focused product-level regression evidence invoking representative real Compiler projection APIs with a SystemDefinition-shaped input that includes the hardened extensions. Do not modify production Compiler or Runtime code unless the proof exposes a bounded compatibility defect requiring explicit change control.

# Acceptance criteria
- real Compiler projection APIs are invoked rather than mocked;
- representative identity/session and authority/generated-interaction descriptors survive or project according to existing semantics;
- canonical schema identity/import equality remains true;
- existing consumer behavior is unchanged;
- no provider, storage, secret or M16 behavior is introduced;
- declared validations pass.

# Non-goals
No Compiler feature work, Runtime feature work, schema redesign, M16 provider integration or unrelated refactor.

# Evidence expected
Focused product tests using the actual Compiler projection implementation plus repository verification.

# Escalation
Stop if compatibility requires production behavior changes outside the already-authorized PRE-M16 contract hardening or any L4 architecture decision.
