---
id: TASK-122
title: Bind managed Runtime promotion to atomic Deploy authority
status: ready
priority: 430
milestone: M10
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
  - project_docs/execution_planning/P9-PACKAGE-01.md
  - project_docs/execution_planning/P9-MANAGED-RUNTIME-PROCESS-01.report.md
  - project_docs/execution_planning/P9-ACTIVE-RUNTIME-PROMOTION-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/deploy/index.ts
  - packages/deploy/managed-process.ts
  - tests/product/managed-runtime-process.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-122-ATOMIC-ACTIVE-RUNTIME-PROMOTION.md
allowed_paths:
  - packages/deploy/active-runtime.ts
  - tests/product/active-runtime-promotion.test.ts
  - specs/tasks/TASK-122-ATOMIC-ACTIVE-RUNTIME-PROMOTION.md
forbidden_paths:
  - packages/contracts/**
  - packages/runtime-core/**
  - packages/deploy/index.ts
  - packages/deploy/managed-process.ts
  - packages/deploy/local-process.ts
  - packages/deploy/postgres-state.ts
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

Add a Deploy-local single-host active Runtime orchestrator that starts and accepts a managed candidate, derives its existing DeploymentRecord, invokes atomic deployment authority with an expected active id, and retires the prior managed Runtime only after authoritative activation succeeds.

# Context

P9 Sprint 1 provides retained managed local Runtime lifecycle. P8 provides atomic deployment authority. This TASK connects those existing seams without changing canonical contracts or inventing external traffic topology.

# Current behavior

Managed Runtime processes can be started/stopped, and DeploymentRegistry can atomically activate DeploymentRecords, but no Deploy-local component coordinates the live process transition with that authority decision.

# Required change

Introduce an additive Deploy-local orchestration API/class that owns the currently managed active process per Environment inside one orchestrator instance. Candidate process acceptance must precede atomic authority activation. Prior active process must remain running until the activation decision is known. On `activated`, the candidate becomes managed active and the prior process is then stopped.

# Inputs / contracts

Existing `startManagedLocalRuntime`, `dryRunDeploy`, `DeploymentRegistry.activateCandidateAtomically`, `DeploymentRecord`, `EnvironmentProfile`, ReleaseArtifact/PublishedRelease inputs, ADR-0002 and ADR-0007. No canonical contract change.

# Outputs / contracts

An additive Deploy-module active-runtime promotion API with deterministic, secret-free promotion result and active-process queryability.

# Acceptance criteria

- initial accepted A may be activated from explicit no-active expectation;
- B is started/health-accepted while A remains queryable and UP;
- atomic activation is invoked with caller-supplied expected active deployment id;
- on `activated`, B becomes active and A is stopped only after the decision;
- active process snapshot maps to the authority result deployment id;
- no raw child process or resolved secret is exposed;
- positive, negative and predecessor-integration tests exist;
- declared validations pass.

# Non-goals

Stale/failed contender hardening beyond the minimal negative case, durable restart reconciliation, external traffic switching, fleet/cloud topology, canonical contracts, Runtime changes.

# Evidence expected

Focused product tests proving A activation and B promotion over the actual managed-process and DeploymentRegistry APIs, including observation that A remains UP until B activation decision completes.

# Escalation

Stop if implementation requires external traffic topology, canonical contracts, Runtime changes, or edits to forbidden predecessor APIs.
