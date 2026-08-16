---
id: TASK-045
title: Establish product test harness baseline
status: ready
priority: 200
milestone: M2
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-008
context_paths:
  - AGENTS.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P1-VERTICAL-01.md
  - package.json
  - tsconfig.json
  - specs/tasks/TASK-045-PRODUCT-TEST-HARNESS.md
allowed_paths:
  - package.json
  - tsconfig.json
  - tsconfig.build.json
  - tests/product/**
forbidden_paths:
  - apps/**
  - tooling/agent-harness/src/**
max_files: 6
validation:
  - npm run verify
---

# Objective

Make product implementation TypeScript and product tests first-class inputs to repository verification before adding deterministic factory engines.

# Context

Current verification is centered on `tooling/agent-harness`; product packages/contracts exist but executable product modules do not yet participate in the normal test loop.

# Current behavior

`tsconfig.json` includes only AgentFactory TypeScript and `npm test` executes only AgentFactory unit tests.

# Required change

Extend TypeScript checking/build coverage to product packages and add a dedicated product-test script that is included by the default test/verify path. Add one smoke test proving the product-test runner executes.

# Inputs / contracts

Repository package scripts, TypeScript configuration and Sprint Mode validation requirements.

# Outputs / contracts

A deterministic product test command and repository verification path that fails when product TypeScript/tests fail.

# Acceptance criteria

- `packages/**/*.ts` participates in typecheck/build as appropriate.
- `tests/product/**/*.test.ts` can run through a dedicated npm script.
- default `npm test`/`npm run verify` executes product tests in addition to existing harness tests.
- existing AgentFactory tests remain enabled.
- a product smoke test proves the new runner is actually invoked.

# Non-goals

Changing AgentFactory runtime behavior, adding a test framework dependency, UI tests or external infrastructure.

# Evidence expected

Green `npm run verify` with visible product-test execution in GitHub CI.

# Escalation

Stop if this requires replacing the repository toolchain or weakening existing CI/AgentFactory validation.
