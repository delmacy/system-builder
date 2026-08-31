---
id: TASK-430
title: Add repository-supported factory E2E command
status: blocked
priority: 430
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-429
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-FACTORY-E2E-01.md
  - package.json
  - scripts/**
  - packages/contracts/factory-boundary/**
allowed_paths:
  - scripts/**
  - package.json
  - tests/product/**
  - specs/tasks/TASK-430-P19-FACTORY-E2E-COMMAND.md
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
Add the smallest repository-supported command entrypoint for the complete deterministic factory journey by invoking only the TASK-429 E2E primitive.

# Context
TASK-429 exposes the canonical complete-journey primitive. WBS 19.1.3 requires a command/API that a maintainer can invoke from a supported checkout without stitching downstream fixtures manually.

# Current behavior
The repository has engineering/test commands but no dedicated supported factory-E2E command over the canonical composed journey.

# Required change
Add a thin script/command and package script wiring that parses declared deterministic inputs, invokes the TASK-429 primitive exactly once, and emits a stable machine-readable success/error result. Keep domain behavior in existing packages rather than duplicating orchestration in the script.

# Inputs / contracts
TASK-429 complete-journey primitive plus declared deterministic local input/fixture references.

# Outputs / contracts
A repository-supported command with stable exit behavior and deterministic machine-readable result/error envelope suitable for clean reproducibility evidence.

# Acceptance criteria
- command is invokable through repository-supported package/script conventions;
- command delegates domain composition to TASK-429 rather than duplicating stage logic;
- equivalent deterministic inputs produce equivalent result identity/evidence;
- invalid input exits non-successfully with bounded actionable error information;
- command performs no publication, deployment execution, runtime launch, persistence or network side effect;
- declared validations pass.

# Non-goals
Production CLI/UX, interactive prompting, operator bootstrap scope from WBS 19.2.1, external services, deployment execution, runtime launch or architecture changes.

# Evidence expected
Product/integration evidence invoking the actual repository command successfully and proving a malformed/invalid invocation fails explicitly without side effects.

# Escalation
Stop if the command requires a new execution topology, service boundary, runtime authority or undeclared L4.