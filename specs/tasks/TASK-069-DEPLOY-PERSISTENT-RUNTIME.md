---
id: TASK-069
title: Deploy and observe persistent generated Runtime
status: completed
priority: 385
milestone: M4
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-068
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P3-PACKAGE-01.md
  - project_docs/execution_planning/P3-RUNTIME-SERVICE-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/artifact-store/index.ts
  - packages/compiler/index.ts
  - packages/deploy/local-process.ts
  - packages/deploy/local-deployment.ts
  - tests/product/local-process-deploy.test.ts
  - tests/product/local-deployment.test.ts
  - tests/product/full-autonomous-local-e2e.test.ts
  - specs/tasks/TASK-069-DEPLOY-PERSISTENT-RUNTIME.md
allowed_paths:
  - packages/deploy/local-process.ts
  - packages/deploy/local-deployment.ts
  - tests/product/local-process-deploy.test.ts
  - tests/product/local-deployment.test.ts
  - tests/product/full-autonomous-local-e2e.test.ts
  - specs/tasks/TASK-069-DEPLOY-PERSISTENT-RUNTIME.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/runtime-core/**
  - packages/release/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
max_files: 6
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Make local Deploy start the actual verified persistent Runtime, discover/probe its HTTP health surface, terminate it cleanly and preserve deterministic DeploymentRecord success/failure evidence.

# Context

P3-ARTIFACT-01 forces local Deploy through independently verified Compiler payload before materialization. TASK-067/068 add an explicit persistent mode requested by `SYSTEM_BUILDER_RUNTIME_PORT` while retaining predecessor compatibility until this Deploy increment opts in.

# Current behavior

Local Deploy starts Node and waits for process exit, so it consumes the compatibility one-shot path even though the generated Runtime is persistent-capable.

# Required change

Request ephemeral persistent mode (`SYSTEM_BUILDER_RUNTIME_PORT=0`), parse RuntimeStarted, probe loopback `/health` while the child remains alive, validate RuntimeHealth, then SIGTERM and require clean shutdown before cleanup. Preserve artifact verification/preflight, timeout/failure diagnostics, immutable-input checks and deterministic DeploymentRecord semantics.

# Inputs / contracts

TASK-068 actual Compiler output, TASK-065 verified artifact reader semantics, PublishedRelease/EnvironmentProfile and accepted ADR boundaries.

# Outputs / contracts

Local Deploy lifecycle proving persistent Runtime liveness/health and controlled termination without canonical schema changes.

# Acceptance criteria

- verified actual Compiler payload starts persistent Runtime mode;
- Deploy discovers the selected loopback health port and probes `/health` while process is alive;
- Deploy terminates cleanly after successful health observation;
- Builder/Observe unavailable addresses do not block health;
- missing binding produces explicit failure without false success;
- startup timeout/health failure produce bounded failure and cleanup;
- full autonomous local E2E preserves deterministic artifact/release/deployment identities;
- artifact corruption remains rejected before materialization;
- no resolved secret value enters immutable evidence;
- declared validations and final Sprint verification pass.

# Non-goals

External supervisor ownership, restart policy, production traffic/TLS, SecretResolver/stateful behavior, platform adapters or public schema changes.

# Evidence expected

Focused persistent Deploy lifecycle tests plus full autonomous local E2E and GitHub Deterministic CI.

# Escalation

Stop if persistent lifecycle requires changing artifact-store, Compiler/runtime-core predecessors, public schemas or accepted ADR boundaries.

# Result

Local Deploy now explicitly activates the persistent generated Runtime on an ephemeral loopback port, observes RuntimeStarted, probes HTTP RuntimeHealth while the process is alive, terminates via SIGTERM and requires clean exit before cleanup. Startup timeout/health failure, required-binding failure, artifact corruption, autonomy and secret-separation evidence remain explicit. Canonical Release/Environment/Deployment schemas are unchanged.
