---
id: TASK-069
title: Deploy and observe persistent generated Runtime
status: ready
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

P3-ARTIFACT-01 already forces local Deploy to retrieve independently verified Compiler payload before materialization. TASK-068 changes the actual Compiler runtime entrypoint from one-shot output to a persistent HTTP service.

# Current behavior

Local Deploy starts Node, waits for the generated process to exit, parses RuntimeHealth from the last stdout line and only then builds DeploymentRecord evidence. That lifecycle is incompatible with a healthy persistent process.

# Required change

Adapt the local process Deploy path so it starts the verified generated Runtime with an ephemeral HTTP port request, reads the bounded startup event to discover the selected loopback port, probes `/health`, validates RuntimeHealth, then sends `SIGTERM` and requires clean shutdown before cleanup. Preserve artifact verification before materialization, release/runtime/environment preflight, timeout/failure diagnostics, immutable-input checks and deterministic DeploymentRecord semantics. Extend the full autonomous local E2E through the persistent process.

# Inputs / contracts

TASK-068 actual Compiler output, TASK-065 verified artifact reader semantics, PublishedRelease/EnvironmentProfile and accepted ADR boundaries.

# Outputs / contracts

Local Deploy lifecycle that proves persistent Runtime liveness/health and controlled termination without changing canonical Release/Environment/Deployment schemas.

# Acceptance criteria

- verified actual Compiler payload starts a persistent Runtime process;
- Deploy discovers the selected local health port and successfully probes `/health`;
- health is observed while the process is still alive;
- Deploy terminates the process cleanly after successful health observation;
- Builder/Observe unavailable addresses do not prevent startup/health;
- invalid/missing runtime binding produces explicit failure without false success;
- health/startup timeout or malformed health produces failure evidence and process cleanup;
- full autonomous local E2E preserves deterministic artifact/release/deployment identities across equivalent runs;
- verified artifact corruption remains rejected before materialization;
- no resolved secret value enters immutable evidence;
- declared validations and final Sprint verification pass.

# Non-goals

Long-running external supervisor ownership, restart policy, production traffic routing/TLS, SecretResolver/stateful behavior, Docker/Vercel adapters or public schema changes.

# Evidence expected

Focused Deploy lifecycle tests and full autonomous local E2E using actual Catalog/Assembly/Validation/Compiler/Release/artifact/Deploy producers, plus GitHub Deterministic CI.

# Escalation

Stop if persistent lifecycle requires changing artifact-store, Compiler/runtime-core implementation from predecessors, public Release/Environment/Deployment schemas or accepted ADR boundaries.
