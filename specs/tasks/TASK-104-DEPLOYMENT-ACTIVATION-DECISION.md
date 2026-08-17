---
id: TASK-104
title: Implement bounded deployment activation and retention decision
status: completed
priority: 406
milestone: M8
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P7-PACKAGE-01.md
  - project_docs/execution_planning/P7-DEPLOYMENT-ROLLBACK-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/deploy/index.ts
  - packages/deploy/storage.ts
  - tests/product/deploy.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-104-DEPLOYMENT-ACTIVATION-DECISION.md
allowed_paths:
  - packages/deploy/index.ts
  - tests/product/deploy.test.ts
  - specs/tasks/TASK-104-DEPLOYMENT-ACTIVATION-DECISION.md
forbidden_paths:
  - packages/contracts/**
  - packages/catalog/**
  - packages/assembly/**
  - packages/compiler/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/runtime-core/**
  - packages/deploy/storage.ts
  - packages/deploy/postgres-state.ts
  - packages/deploy/local-deployment.ts
  - packages/deploy/local-process.ts
  - apps/**
  - tooling/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Add a bounded Deploy-owned activation decision that makes successful promotion and failed-candidate retention explicit and deterministic on top of `DeploymentRegistry`.

# Context

P7 Sprint 1 made DeploymentRecord history and active-version authority durable. P7 Sprint 2 must represent acceptance/activation outcome explicitly without introducing traffic-management infrastructure or changing canonical contracts.

# Current behavior

`DeploymentRegistry.record()` persists history and promotes successful records to active state while failed records do not replace active state. The semantic outcome is correct but there is no explicit deterministic evidence describing whether a candidate was activated or rejected while retaining a previous active deployment.

# Required change

Extend the Deploy module with an immutable activation-decision result derived from candidate DeploymentRecord status plus the active state immediately before recording. The operation must always retain candidate history, promote only successful candidates, and emit deterministic decision identity/evidence for activated, retained-active, and rejected-without-active outcomes.

# Inputs / contracts

Existing internal `DeploymentRecord`, `DeploymentRegistry`, `DeploymentRecordStorage`, deterministic hashing utilities, WBS 10.2.3/10.3.2 and controlling ADR-0002/ADR-0007.

# Outputs / contracts

Deploy-module API only: an immutable deterministic activation/retention decision and registry operation. No `packages/contracts/**` or cross-context contract is added.

# Acceptance criteria

- successful candidate is recorded and becomes active;
- failed candidate is recorded but never replaces the prior active deployment;
- failed candidate with no prior active deployment remains non-active;
- decision explicitly identifies candidate, prior active when present, resulting active when present, and bounded outcome;
- decision identity is deterministic for equivalent state and candidate input;
- decision and returned records are immutable;
- reprocessing the identical failed candidate is idempotent and yields equivalent decision evidence;
- existing `record`, `get`, `list`, `getActive` and `dryRunDeploy` behavior remains compatible;
- no production traffic switching, supervisor, secret or provider behavior is introduced;
- declared validations pass.

# Non-goals

Durable storage schema changes, PostgreSQL changes, local process orchestration, load balancers, traffic routing, Runtime changes or canonical contracts.

# Evidence expected

Focused positive/negative/idempotency product tests in the existing Deploy test file plus repository verification.

# Escalation

Stop if implementation requires a canonical contract, storage/provider interface change, another bounded context, ADR change or any forbidden path.
