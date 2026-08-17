---
id: TASK-105
title: Prove bounded acceptance failure retains last known good deployment
status: ready
priority: 405
milestone: M8
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-104
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P7-PACKAGE-01.md
  - project_docs/execution_planning/P7-DEPLOYMENT-ROLLBACK-01.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/index.ts
  - tests/product/deploy.test.ts
  - specs/tasks/TASK-104-DEPLOYMENT-ACTIVATION-DECISION.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-105-DEPLOYMENT-ROLLBACK-EVIDENCE.md
allowed_paths:
  - tests/product/deployment-rollback.test.ts
  - specs/tasks/TASK-105-DEPLOYMENT-ROLLBACK-EVIDENCE.md
forbidden_paths:
  - packages/**
  - apps/**
  - tooling/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Prove bounded acceptance/rollback semantics using actual existing Deploy output: a successful active deployment A followed by candidate B whose acceptance check fails.

# Context

TASK-104 exposes the explicit activation/retention decision. This TASK must prove the behavior from executable `dryRunDeploy` results rather than hand-authoring downstream records.

# Current behavior

After TASK-104, the registry can make an explicit bounded activation decision, but there is no focused growing integration proof that drives candidate success/failure from actual Deploy acceptance checks.

# Required change

Add evidence-only product tests that create deployment A from successful `dryRunDeploy`, activate it, create candidate B from failing `dryRunDeploy` acceptance checks, evaluate B, and verify A remains authoritative while B is retained as failed history with deterministic retention evidence.

# Inputs / contracts

Existing `dryRunDeploy`, TASK-104 activation decision API, immutable DeploymentRecord semantics, EnvironmentProfile and existing Deploy module behavior.

# Outputs / contracts

Test evidence only. No product or contract source change is permitted.

# Acceptance criteria

- A is produced by actual `dryRunDeploy` with passing acceptance and becomes active;
- B is produced by actual `dryRunDeploy` with failing acceptance and is recorded as failed history;
- B decision explicitly reports retention of A rather than activation of B;
- `getActive(environmentRef)` still returns A after B;
- decision evidence is deterministic across equivalent registry state/input;
- failed B health evidence remains visible and immutable;
- evidence contains no inline secret value or provider-specific connection material;
- no product source or contract file is modified;
- declared validations pass.

# Non-goals

PostgreSQL reconstruction, actual traffic switching, Runtime process supervision, production rollback or product source changes.

# Evidence expected

One focused product integration test file plus repository verification.

# Escalation

Stop if the proof requires any product, contract, ADR or CI workflow modification.
