---
id: TASK-435
title: Add supported operator bootstrap command
status: blocked
priority: 435
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-434
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-OPERATOR-BOOTSTRAP-01.md
  - package.json
  - scripts/**
  - packages/contracts/factory-boundary/**
allowed_paths:
  - scripts/**
  - package.json
  - tests/product/**
  - specs/tasks/TASK-435-P19-OPERATOR-BOOTSTRAP-COMMAND.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/postgres/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Add the smallest repository-supported bootstrap command that validates TASK-434 prerequisites/config and delegates exactly once to the existing canonical factory E2E invocation.

# Context
TASK-434 defines the bootstrap prerequisite/configuration boundary. The command must remain a thin maintainer-facing adapter over the already integrated WBS 19.1.3 factory E2E path.

# Current behavior
`npm run factory:e2e` exists as the canonical deterministic journey entrypoint, but there is no repository-supported bootstrap command that first applies the TASK-434 operator boundary.

# Required change
Add a thin script/package command. Parse only declared bootstrap input, validate before invocation, call the existing factory E2E primitive/command once, and preserve stable success/non-success behavior. Do not restitch domain stages in the bootstrap layer.

# Inputs / contracts
TASK-434 bootstrap prerequisite/configuration input plus the existing canonical factory E2E input contract. No authoritative business input may be synthesized by the wrapper.

# Outputs / contracts
A stable command success/error envelope derived from TASK-434 validation and the single canonical E2E invocation, preserving canonical result identity and fail-closed semantics.

# Acceptance criteria
- supported package/script invocation exists and uses TASK-434 validation;
- invalid prerequisites/config fail before canonical journey invocation;
- valid input delegates exactly once to the existing E2E path;
- repeated equivalent input yields equivalent deterministic result identity;
- no fallback, inferred defaults for authoritative inputs, persistence, network, runtime launch or deployment execution;
- focused positive, invalid-input, absent dependency/capability and no-side-effect proofs exist;
- declared validations pass.

# Non-goals
Interactive wizard, production CLI/GUI, environment installation, mutable job state, runtime materialization, publication/deployment execution or new architecture authority.

# Evidence expected
Command-level product proof showing valid single delegation, deterministic repeatability, rejection before invocation for invalid bootstrap input, absent dependency/capability handling, and no external side effects; all declared validation commands must pass.

# Escalation
Stop if command support requires a daemon/service, new bounded context, Builder/Runtime topology change or undeclared L4.
