---
id: TASK-182
title: Prove Observe finding through intake to triage E2E
status: ready
priority: 528
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-180
  - TASK-181
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-TRIAGE-CLASSIFICATION-01.md
  - packages/observe/index.ts
  - packages/support-evolution/index.ts
allowed_paths:
  - tests/product/support-triage-observe-e2e.test.ts
  - specs/tasks/TASK-182-P12-SUPPORT-TRIAGE-OBSERVE-E2E.md
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
Extend the real P11->P12 proof from an actual `DeploymentFinding` through `SupportEvidenceIntake` into an explicit triage decision.
# Context
The Sprint must extend the predecessor chain using actual public module APIs rather than hand-authored downstream artifacts.
# Current behavior
Sprint 1 proves finding->intake; TASK-178 proves intake linkage independently.
# Required change
Create an actual public P11 finding, map it to intake, create an explicit triage decision with stable context refs, validate/round-trip it and assert preservation of finding/intake/deployment/release/runtime linkage.
# Inputs / contracts
Public Observe and Support/Evolution APIs.
# Outputs / contracts
Integrated product-test evidence only.
# Acceptance criteria
Actual finding->intake->triage succeeds deterministically and does not expose auto-remediation, deploy or production mutation capability.
# Non-goals
Full deployment spawning, automatic classification, support-case resolution or Evolution execution.
# Evidence expected
Observe-origin E2E test and GitHub Deterministic CI.
# Escalation
Stop if Support must import Observe internals or product implementation changes outside committed scope are required.
