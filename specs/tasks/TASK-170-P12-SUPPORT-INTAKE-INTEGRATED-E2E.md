---
id: TASK-170
title: Prove Observe finding to Support intake E2E
status: verification
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
Prove the actual P11 deployment-finding to P12 Support-intake handoff end-to-end.
# Context
The package goal requires integration evidence, not isolated constructors alone.
# Current behavior
Before this TASK no test joined the actual Observe public constructor to the actual Support adapter.
# Required change
Create a real `DeploymentFinding`, map it through Support public API, validate/round-trip it and assert all correlations.
# Inputs / contracts
Public P11 finding and public P12 intake APIs plus WBS 11.3.3.
# Outputs / contracts
Integrated test evidence only.
# Acceptance criteria
Actual P11 finding -> P12 intake succeeds deterministically, preserves refs, round-trips and exposes no remediation capability.
# Non-goals
Deploy spawning, Runtime mutation, triage, priority or case lifecycle.
# Evidence expected
E2E test and CI.
# Implementation evidence
Implemented in `cc2877462b77cb4503cd77cb1a7dcc69117a5a26`; CI #438 PASS.
# Escalation
Stop if Support must depend on Observe internals or product implementation must change.
