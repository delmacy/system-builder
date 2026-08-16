---
id: TASK-062
title: Emit operational DeploymentRecord from local runtime health and failure
status: ready
priority: 380
milestone: M3
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-061
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P2-PACKAGE-01.md
  - project_docs/execution_planning/P2-LOCAL-DEPLOY-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/index.ts
  - packages/deploy/local-process.ts
  - packages/contracts/factory-boundary/deployment-record.schema.json
  - tests/product/local-process-deploy.test.ts
  - specs/tasks/TASK-062-LOCAL-DEPLOYMENT-HEALTH-RECORD.md
allowed_paths:
  - packages/deploy/local-deployment.ts
  - tests/product/local-deployment.test.ts
  - specs/tasks/TASK-062-LOCAL-DEPLOYMENT-HEALTH-RECORD.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/release/**
  - packages/runtime-core/**
  - tooling/agent-harness/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Turn actual local-process runtime health/failure into deterministic operational DeploymentRecord evidence while preserving immutable release/environment boundaries.

# Context

TASK-061 supplies the first real local-process adapter. Deploy WBS 10.2.3 and 10.3 require health/acceptance evidence, failure handling and an operational DeploymentRecord. The existing dry-run path produces a canonical-compatible record from declared checks but does not observe a real generated runtime process.

# Current behavior

The local-process adapter returns actual process output/health or an explicit diagnostic. Existing `dryRunDeploy` can emit a DeploymentRecord without starting a process. No function yet converts actual local runtime execution into the canonical DeploymentRecord shape.

# Required change

Add a local deployment orchestration function under `packages/deploy/` that invokes TASK-061, converts observed RuntimeHealth success into a `succeeded` DeploymentRecord, converts post-activation runtime failure into explicit `failed` DeploymentRecord health evidence, and preserves deterministic identity from release/environment/timestamps/check results. Preflight failures that occur before process activation remain explicit diagnostics rather than false successful deployments. Ensure process/materialization cleanup is respected and release/environment data is not mutated or enriched with resolved secret values.

# Inputs / contracts

TASK-061 local-process result, canonical DeploymentRecord 1.0.0 schema, PublishedRelease/ReleaseArtifact metadata, canonical EnvironmentProfile and ADR-0007.

# Outputs / contracts

Canonical-compatible DeploymentRecord plus bounded local-deployment result. No public contract schema change.

# Acceptance criteria

- observed RuntimeHealth UP yields a deterministic `succeeded` DeploymentRecord with PASS health evidence;
- activated runtime failure yields a deterministic `failed` DeploymentRecord with FAIL health evidence;
- preflight artifact/runtime incompatibility remains an explicit diagnostic and does not fabricate success;
- process/materialization cleanup is completed for success and failure paths;
- repeated equivalent execution inputs with fixed timestamps produce identical DeploymentRecord identity;
- no secret value is embedded in immutable release metadata or DeploymentRecord;
- focused tests and repository-wide verification pass.

# Non-goals

Long-running service supervision, rollback to a previous real release, production process managers, secret resolution, infrastructure provisioning, contract changes or Docker/Vercel adapters.

# Evidence expected

Local deployment health/record tests and GitHub Deterministic CI.

# Escalation

Stop if operational evidence requires a DeploymentRecord schema change, new L4 deployment semantics, a forbidden path, or weakening Release/Environment separation.
