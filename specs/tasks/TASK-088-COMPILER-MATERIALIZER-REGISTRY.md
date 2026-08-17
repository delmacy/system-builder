---
id: TASK-088
title: Establish deterministic Compiler materializer registry
status: ready
priority: 396
milestone: M6
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P5-PACKAGE-01.md
  - project_docs/execution_planning/P5-MATERIALIZER-REGISTRY-01.md
  - project_docs/execution_planning/P5-ASSEMBLY-GRAPH-01.report.md
  - project_docs/execution_planning/P4-PACKAGE-01.integration-debt-review.md
  - project_docs/08-compiler/WBS.md
  - packages/compiler/runtime-capabilities.ts
  - packages/compiler/index.ts
  - tests/product/compiler.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-088-COMPILER-MATERIALIZER-REGISTRY.md
allowed_paths:
  - packages/compiler/runtime-capabilities.ts
  - tests/product/compiler.test.ts
  - specs/tasks/TASK-088-COMPILER-MATERIALIZER-REGISTRY.md
forbidden_paths:
  - packages/catalog/**
  - packages/assembly/**
  - packages/contracts/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/deploy/**
  - packages/runtime-core/**
  - apps/**
  - tooling/agent-harness/**
  - docs/adr/**
  - .github/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Introduce a bounded deterministic Compiler materializer registry/lookup mechanism keyed by exact capability/provider/version identity, without changing current production materialization behavior yet.

# Context

The integrated Factory now produces deterministic transitive AssemblyPlan components with exact capability/provider/version identity. Compiler materialization remains centralized in `runtime-capabilities.ts` around one hard-coded `state.counter` identity. P4 TD-P4-07 identified this shape as a scaling risk before additional generated Runtime capabilities.

# Current behavior

`materializeAssemblyRuntimeCapabilities` filters for `state.counter`, validates exactly one selected component, compares its provider/version against hard-coded constants and directly invokes the state-counter materializer. There is no reusable registration/lookup abstraction and no duplicate materializer-identity policy.

# Required change

Add an internal deterministic registry/lookup boundary in `packages/compiler/runtime-capabilities.ts` for materializers keyed by exact `(capability, provider, version)` identity.

The registry must:

- normalize/validate non-empty identity tokens;
- reject duplicate exact identities deterministically;
- produce the same lookup result independent of registration order;
- distinguish no registered materializer from an exact registered identity;
- remain internal to Compiler and avoid public/canonical contract changes.

TASK-088 should establish the mechanism and focused tests. TASK-089 owns migrating the production `state.counter` path onto it.

# Inputs / contracts

Current Compiler internal assembly component shape, WBS 08 deterministic materialization responsibilities, P5 package/Sprint authority, ADR-0002/0007 and the Master Blueprint.

# Outputs / contracts

An internal exact-identity materializer registry/lookup API with deterministic duplicate/unsupported behavior. No canonical schema or external module contract changes.

# Acceptance criteria

- exact capability/provider/version registration and lookup are deterministic;
- equivalent registration ordering yields equivalent lookup/materializer ordering behavior;
- duplicate identity registration fails explicitly;
- unknown exact identity returns an explicit no-match result or scoped deterministic error suitable for TASK-089 consumption;
- current Compiler product tests remain green;
- no state.counter output semantics are intentionally changed in this TASK;
- no Catalog, Assembly, Runtime, Deploy or canonical contract change occurs.

# Non-goals

Migrating `state.counter` to the registry, adding a second production capability, provider scoring, version ranges, dynamic plugins, durable providers, public extension contracts.

# Evidence expected

Focused positive/order-independent/duplicate/no-match Compiler product tests plus repository-wide verification.

# Escalation

Stop if a deterministic registry cannot be introduced without changing canonical contracts, Catalog/Assembly semantics or an L4 boundary.
