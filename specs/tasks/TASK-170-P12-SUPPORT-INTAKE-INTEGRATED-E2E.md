---
id: TASK-170
title: Prove Observe finding to Support intake E2E
status: ready
priority: 509
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-168
  - TASK-169
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.md
  - packages/observe/index.ts
  - packages/support-evolution/index.ts
allowed_paths:
  - tests/product/support-evidence-intake-e2e.test.ts
  - specs/tasks/TASK-170-P12-SUPPORT-INTAKE-INTEGRATED-E2E.md
forbidden_paths:
  - packages/**
  - docs/adr/**
  - .github/**
  - tooling/**
  - package.json
  - package-lock.json
max_files: 2
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Prove the real P11 deployment-finding to P12 Support-intake handoff end-to-end.

# Context
The package goal is not satisfied by isolated constructors alone. The Sprint must demonstrate that an actual public `DeploymentFinding` produced by the P11 implementation can become validated, serialized Support/Evolution intake evidence without producer-internal coupling.

# Current behavior
TASK-165 maps finding-like evidence and TASK-168/169 cover Support intake independently, but no product test joins the actual Observe public constructor to the actual Support adapter.

# Required change
Add an integration product test that creates a real `DeploymentFinding`, maps it with the Support/Evolution public API, validates/round-trips it and asserts preservation of finding/deployment/release/environment/runtime references.

# Inputs / contracts
Public P11 `DeploymentFinding` export, public Support/Evolution intake export, P12 growing-proof definition and WBS 11.3.3.

# Outputs / contracts
Integrated test evidence only. Product packages remain unchanged by this TASK.

# Acceptance criteria
Actual P11 finding -> P12 intake succeeds deterministically, preserves required correlations, round-trips losslessly and adds no automatic remediation or production-mutation capability.

# Non-goals
Full Deploy process spawning, Runtime mutation, triage/classification, priority, support-case lifecycle or evolution routing.

# Evidence expected
`tests/product/support-evidence-intake-e2e.test.ts` and GitHub Deterministic CI.

# Escalation
Stop if the E2E requires Support to depend on Observe internals or any product implementation edit.