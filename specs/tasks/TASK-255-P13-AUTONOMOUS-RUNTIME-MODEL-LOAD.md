---
id: TASK-255
title: Load materialized RuntimeModel from the autonomous runtime bundle
status: ready
priority: 255
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-254]
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-OFFLINE-AUTONOMY-01.md
  - specs/tasks/TASK-254-P13-AUTONOMOUS-RUNTIME-MODEL-BUNDLE.md
  - packages/runtime-core/**
  - packages/compiler/**
  - docs/adr/ADR-0002-autonomous-runtime.md
allowed_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - tests/product/**
  - specs/tasks/TASK-255-P13-AUTONOMOUS-RUNTIME-MODEL-LOAD.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/builder/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Make the generated autonomous runtime entrypoint consume the materialized RuntimeModel locally so normal execution can proceed without any Builder lookup.

# Current behavior
The generated runtime entrypoint proves bootstrap/configuration/health but does not yet load the complete RuntimeModel emitted by TASK-254.

# Inputs / contracts
TASK-254 generated RuntimeModel file, existing runtime bootstrap/state requirements and ADR-0002 autonomy.

# Outputs / contracts
Local deterministic RuntimeModel loading and explicit controlled failure for missing/invalid bundle data; no new public contract.

# Required change
Wire the generated entrypoint/runtime-core bootstrap to load and validate the emitted RuntimeModel from local generated files only.

# Acceptance criteria
- valid generated RuntimeModel loads locally;
- missing/corrupt model fails explicitly and non-zero where process execution applies;
- no network/Builder lookup is attempted;
- external EnvironmentProfile remains external;
- no resolved secret/provider/session value enters generated model or diagnostics.

# Non-goals
Business behavior certification, Observe publication, upgrade/rollback or new provider semantics.

# Evidence expected
Product tests prove local-only load, deterministic failure and backward compatibility.

# Escalation
Stop for any required L4 architecture or public contract change.