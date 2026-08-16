---
id: TASK-061
title: Implement local-process Deploy adapter for runnable release artifacts
status: ready
priority: 370
milestone: M3
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-060
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
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/deploy/index.ts
  - packages/compiler/index.ts
  - packages/runtime-core/**
  - packages/contracts/environment-profile/**
  - tests/product/runtime-autonomy-e2e.test.ts
  - specs/tasks/TASK-061-LOCAL-PROCESS-DEPLOY-ADAPTER.md
allowed_paths:
  - packages/deploy/local-process.ts
  - tests/product/local-process-deploy.test.ts
  - specs/tasks/TASK-061-LOCAL-PROCESS-DEPLOY-ADAPTER.md
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

Implement the first real test/local Deploy adapter that materializes the runnable files emitted by Compiler and starts the generated autonomous Runtime without mutating the immutable release.

# Context

P2-RUNTIME-01 proved that actual Compiler output contains a deterministic `runtime-entry.mjs` that starts with an externally supplied canonical EnvironmentProfile while Builder/Observe are unavailable. Deploy WBS 10.2 requires deployment execution and ADR-0007 requires Release + Environment separation.

# Current behavior

`dryRunDeploy` validates release/environment compatibility and emits deterministic DeploymentRecord evidence from declared acceptance checks, but it does not materialize generated files or execute the runtime process. TASK-060 executes Compiler output only from an integration test, not through Deploy.

# Required change

Add a local-process adapter under `packages/deploy/` that accepts PublishedRelease metadata, ReleaseArtifact metadata, Compiler generated files and canonical EnvironmentProfile. It must validate release/artifact identity and runtime compatibility before activation, materialize generated files into an isolated temporary directory, start the actual generated `runtime-entry.mjs` with EnvironmentProfile supplied only through the child-process environment, capture deterministic process/health output, and clean the temporary materialization after completion. It must verify the immutable release inputs are not mutated.

# Inputs / contracts

PublishedRelease and ReleaseArtifact factory-boundary contracts, canonical EnvironmentProfile, actual Compiler generated-file output, ADR-0002 and ADR-0007.

# Outputs / contracts

Internal local-process execution result suitable for TASK-062 operational DeploymentRecord construction. No public contract change.

# Acceptance criteria

- valid PublishedRelease + matching runnable ReleaseArtifact + EnvironmentProfile starts the actual generated runtime entrypoint;
- incompatible runtime or artifact identity fails before process activation with an explicit diagnostic;
- missing generated runtime entrypoint fails explicitly;
- EnvironmentProfile is supplied externally and no release/generated input is mutated;
- temporary deployment materialization is removed after the process completes;
- focused tests include positive process startup and negative preflight cases using actual Compiler output;
- product tests and repository-wide verification pass.

# Non-goals

DeploymentRecord lifecycle semantics, production process supervision, Docker/Vercel adapters, secret resolution, database provisioning, traffic switching or public contract changes.

# Evidence expected

Local-process adapter tests using actual Compiler output and GitHub Deterministic CI.

# Escalation

Stop if the adapter requires changing a public contract, ADR-0002/0007 boundaries, a forbidden path, or production infrastructure semantics.
