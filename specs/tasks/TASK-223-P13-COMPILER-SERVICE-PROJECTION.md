---
id: TASK-223
title: Project Construction B descriptors into the deterministic Compiler runtime model
status: completed
priority: 223
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-221
  - TASK-222
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-SERVICES-BINDINGS-01.md
  - packages/contracts/system-definition/system-definition.schema.json
  - packages/contracts/environment-profile/environment-profile.schema.json
  - packages/compiler/runtime-projection.ts
allowed_paths:
  - packages/compiler/runtime-projection.ts
  - tests/product/compiler-runtime*.test.ts
  - specs/tasks/TASK-223-P13-COMPILER-SERVICE-PROJECTION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/runtime-core/**
  - packages/deploy/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Extend `CompilerSystemDefinitionRuntimeProjection` only with the normalized deterministic jobs/events/files/integrations descriptors authorized by TASK-221/222.

# Context
Construction A established deterministic projection for entities/actions/processes. Construction B must extend that same public Compiler boundary with only the accepted L3 descriptors and reference/classification metadata, preserving order independence and fail-closed reference validation.

# Current behavior
`CompilerSystemDefinitionRuntimeProjection` currently carries entities, actions and processes only. It therefore cannot carry explicit Construction B service descriptors into generated Runtime materialization.

# Required change
Carry and deterministically sort the new descriptors. Validate explicit action references, binding references and descriptor uniqueness. Reject unknown action targets, unknown environment requirement references, incompatible requirement kinds and malformed relative integration paths. Do not resolve any binding value.

# Inputs / contracts
TASK-221 SystemDefinition descriptors; TASK-222 EnvironmentProfile classification metadata; current runtime projection normalizer; Construction B Sprint manifest and accepted change control.

# Outputs / contracts
Backward-compatible deterministic Compiler runtime projection for jobs/events/files/integrations plus focused product tests. No public contract implementation beyond TASK-221/222.

# Acceptance criteria
- deterministic normalization is order-independent;
- explicit references are validated and fail closed;
- historical projections without B descriptors remain valid;
- no value resolution or provider selection occurs;
- existing entities/actions/processes behavior is unchanged.

# Non-goals
Runtime execution; Deploy resolution; provider-specific projection; new compiler/runtime boundary or topology.

# Evidence expected
Focused Compiler product tests for positive projection, equivalent-input determinism, duplicate/unknown/incompatible reference rejection and historical regression compatibility; declared validations green.

# Escalation
Stop if projection requires a new compiler/runtime boundary, another contract family or semantics outside the accepted L3 envelope.
