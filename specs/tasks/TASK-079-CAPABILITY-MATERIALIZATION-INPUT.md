---
id: TASK-079
title: Derive bounded Runtime capability implementation from AssemblyPlan
status: ready
priority: 387
milestone: M5
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-078
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P4-PACKAGE-01.md
  - project_docs/execution_planning/P4-CAPABILITY-RUNTIME-01.md
  - project_docs/execution_planning/P4-POSTGRES-STATE-01.report.md
  - project_docs/05-catalog/WBS.md
  - project_docs/06-assembly/WBS.md
  - project_docs/08-compiler/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - packages/assembly/index.ts
  - packages/catalog/index.ts
  - packages/compiler/index.ts
  - packages/runtime-core/state-migrations.ts
  - specs/tasks/TASK-079-CAPABILITY-MATERIALIZATION-INPUT.md
allowed_paths:
  - packages/compiler/runtime-capabilities.ts
  - tests/product/runtime-capability-materialization.test.ts
  - specs/tasks/TASK-079-CAPABILITY-MATERIALIZATION-INPUT.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/catalog/**
  - packages/assembly/**
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/release/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
  - .github/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Create a deterministic Compiler-internal materialization boundary that derives the concrete bounded `state.counter` Runtime state requirement from an actual selected `AssemblyPlan` component, without changing shared/canonical contracts.

# Context

P4-POSTGRES-STATE-01 proved a durable PostgreSQL Runtime path, but the Compiler still receives state behavior through an optional caller-supplied `stateRequirements` input. The real AssemblyPlan already carries the selected capability/provider/version tuple produced by Catalog/Assembly.

# Current behavior

`compileSyntheticRelease` can materialize migrations and PostgreSQL Runtime state only when its caller supplies `stateRequirements`. There is no deterministic mapping from a selected AssemblyPlan component to the bounded Runtime state implementation.

# Required change

Add a Compiler-local resolver for the reference capability tuple `state.counter / system-builder.postgres-counter / 1.0.0`. For that exact selected tuple, derive a normalized SQL state requirement using symbolic `DATABASE_URL` binding and the deterministic migration required by the existing PostgreSQL Runtime adapter. Unrelated components produce no Runtime state requirement. An explicitly selected `state.counter` component with unsupported provider/version fails deterministically rather than silently falling back.

# Inputs / contracts

Existing AssemblyPlan component identity (`capability`, `provider`, `version`), `RuntimeStateRequirement`, WBS 05/06/08/13, ADR-0002 and ADR-0007.

# Outputs / contracts

A Compiler-internal deterministic materialization result containing bounded `RuntimeStateRequirement` values only. No public/canonical schema or Catalog/Assembly contract changes.

# Acceptance criteria

- equivalent AssemblyPlan component order yields byte/deep-equal materialization output;
- exact reference provider yields one normalized `RuntimeStateRequirement` for `state.counter`;
- migration identity/order/path/content are fixed and deterministic;
- output carries only symbolic binding name/kind, never secret reference/value;
- unrelated capabilities yield zero state requirements;
- selected unsupported `state.counter` provider/version fails with explicit deterministic diagnostic;
- no Catalog/Assembly/shared contract modification;
- focused positive/negative/determinism tests pass;
- declared validations pass.

# Non-goals

General capability DSL, provider plugin discovery, semver/range solving, transitive dependencies, production database policy or Compiler integration of this resolver (TASK-080).

# Evidence expected

Focused product tests for positive materialization, deterministic ordering, unrelated capabilities and unsupported/duplicate selection, plus Deterministic CI running the declared repository validations.

# Escalation

Stop if the bounded mapping requires a shared contract change, general provider policy, an Assembly/Catalog boundary change or any L4 architecture decision.
