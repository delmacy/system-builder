---
id: TASK-089
title: Route state.counter through deterministic materializer registry
status: ready
priority: 397
milestone: M6
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-088
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P5-PACKAGE-01.md
  - project_docs/execution_planning/P5-MATERIALIZER-REGISTRY-01.md
  - specs/tasks/TASK-088-COMPILER-MATERIALIZER-REGISTRY.md
  - project_docs/execution_planning/P4-PACKAGE-01.integration-debt-review.md
  - project_docs/08-compiler/WBS.md
  - packages/compiler/runtime-capabilities.ts
  - packages/compiler/index.ts
  - tests/product/compiler.test.ts
  - tests/product/capability-runtime-e2e.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-089-STATE-COUNTER-MATERIALIZER-REGISTRY.md
allowed_paths:
  - packages/compiler/runtime-capabilities.ts
  - packages/compiler/index.ts
  - tests/product/compiler.test.ts
  - tests/product/capability-runtime-e2e.test.ts
  - specs/tasks/TASK-089-STATE-COUNTER-MATERIALIZER-REGISTRY.md
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
max_files: 5
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Move the existing `state.counter / system-builder.postgres-counter / 1.0.0` reference-provider materialization through the deterministic registry established by TASK-088 while preserving current Compiler, migration, secret and Runtime behavior.

# Context

TASK-088 creates an internal exact-identity registry/lookup mechanism. The production Compiler path still needs to register and resolve the existing `state.counter` materializer through that mechanism without changing externally observable output.

# Current behavior

Before this TASK, the Compiler derives the `state.counter` RuntimeStateRequirement through hard-coded capability/provider/version branching in `runtime-capabilities.ts`. The selected reference provider generates symbolic `DATABASE_URL`, migration `migrations/001-state-counter.sql`, PostgreSQL-backed counter behavior and deterministic release assets; unsupported selected providers fail before successful artifact publication.

# Required change

Register the existing reference `state.counter` materializer under its exact capability/provider/version identity and make `materializeAssemblyRuntimeCapabilities` resolve selected materializable components through the registry rather than a direct one-provider switch.

Preserve:

- exact generated RuntimeStateRequirement semantics;
- symbolic `DATABASE_URL` secret-reference only;
- migration id/path/order/content;
- no-state behavior for unrelated capabilities;
- explicit failure for unsupported selected `state.counter` identities;
- duplicate state capability safeguards;
- deterministic output and ReleaseArtifact identity for equivalent input.

No second production Runtime capability should be added.

# Inputs / contracts

TASK-088 registry behavior, current Compiler assembly-plan component identity, existing `state.counter` tests/E2E, WBS 08, ADR-0002 and ADR-0007.

# Outputs / contracts

Existing state.counter materialization implemented through deterministic registry lookup, with preserved generated assets and failure semantics. No public contract change.

# Acceptance criteria

- reference `state.counter` exact identity resolves through the registry;
- generated migration/runtime assets preserve current expected content and symbolic environment binding;
- unrelated capabilities still materialize no state requirement;
- unsupported selected `state.counter` provider/version fails explicitly before successful compilation/publication;
- duplicate derived + explicit state requirement remains rejected;
- equivalent component order produces identical compilation output;
- P4 capability-driven PostgreSQL Runtime predecessor proof remains green;
- no Catalog, Assembly, canonical contract, Release, Deploy or Runtime-core change occurs.

# Non-goals

Second production capability, plugin loading, public materializer SDK, durable provider persistence, new secret/provider semantics, migration redesign.

# Evidence expected

Compiler product tests covering registered state.counter success/unsupported/duplicate/order independence plus capability-runtime predecessor regression and repository-wide verification.

# Escalation

Stop if preserving current state.counter behavior requires canonical contract changes, secret leakage, Runtime boundary changes or Catalog/Assembly semantic changes.
