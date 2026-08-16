---
id: TASK-060
title: Prove autonomous startup and health from actual Compiler output
status: ready
priority: 360
milestone: M3
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-059
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P2-PACKAGE-01.md
  - project_docs/execution_planning/P2-RUNTIME-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/compiler/index.ts
  - packages/runtime-core/**
  - packages/contracts/environment-profile/**
  - tests/product/fixtures/factory-e2e.ts
  - tests/product/full-vertical-e2e.test.ts
  - specs/tasks/TASK-060-AUTONOMOUS-RUNTIME-PROOF.md
allowed_paths:
  - tests/product/runtime-autonomy-e2e.test.ts
  - specs/tasks/TASK-060-AUTONOMOUS-RUNTIME-PROOF.md
forbidden_paths:
  - apps/**
  - packages/**
  - tooling/agent-harness/**
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Prove that the runtime package emitted by the actual Compiler starts from generated ReleaseArtifact output plus external EnvironmentProfile data, reports health, and does not require Builder/Observe availability.

# Required proof

Build the real predecessor chain through Compiler using existing executable APIs and fixtures. Materialize the Compiler-generated files into a temporary directory, execute the generated `runtime-entry.mjs` with the repository Node executable, and supply EnvironmentProfile only through the external process environment.

The proof must include:

- successful autonomous startup and RuntimeHealth PASS;
- explicit failure for a missing required environment binding;
- successful health while Builder/Observe endpoint variables are absent or deliberately unusable;
- repeated compilation/startup proving deterministic runtime-entry content/hash and stable health semantics;
- assertion that generated immutable content contains no secret value.

# Acceptance criteria

- runtime package under test is taken from actual `compileSyntheticRelease` output, not hand-authored;
- generated process exits successfully for compatible complete external configuration;
- missing required binding exits non-zero with explicit diagnostic;
- no network call to Builder/Observe is required for startup/health;
- generated source and immutable release metadata contain no supplied secret value;
- product tests and repository-wide verification pass.

# Non-goals

Local Deploy adapter, long-running service lifecycle, HTTP health server, database connectivity, secret resolution, business endpoints/workflows or production infrastructure.

# Evidence expected

End-to-end process test using actual Compiler output and GitHub Deterministic CI.

# Escalation

Stop if the proof requires product-code changes outside predecessor TASK scope, public-contract changes, or weakening Builder/Runtime autonomy.
