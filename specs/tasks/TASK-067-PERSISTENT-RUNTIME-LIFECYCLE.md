---
id: TASK-067
title: Define persistent autonomous Runtime lifecycle and HTTP health entrypoint
status: ready
priority: 383
milestone: M4
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-066
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P3-PACKAGE-01.md
  - project_docs/execution_planning/P3-RUNTIME-SERVICE-01.md
  - project_docs/execution_planning/P3-ARTIFACT-01.report.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/runtime-core/index.ts
  - tests/product/runtime-core.test.ts
  - specs/tasks/TASK-067-PERSISTENT-RUNTIME-LIFECYCLE.md
allowed_paths:
  - packages/runtime-core/index.ts
  - tests/product/runtime-core.test.ts
  - specs/tasks/TASK-067-PERSISTENT-RUNTIME-LIFECYCLE.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Define the bounded persistent Runtime lifecycle semantics and render a deterministic self-contained Node entrypoint that remains alive and exposes HTTP RuntimeHealth without Builder or Observe dependencies.

# Context

The merged predecessor Runtime is a one-shot process that validates external EnvironmentProfile input, writes one RuntimeHealth JSON line and exits. WBS 13.3 requires autonomous operation and a health surface without making Observe mandatory.

# Current behavior

`renderAutonomousRuntimeEntrypoint` emits a deterministic script that validates runtime version and required symbolic bindings, writes health to stdout and terminates immediately.

# Required change

Add a persistent Runtime entrypoint renderer in `runtime-core` that reuses the existing environment-validation semantics, binds an HTTP server to loopback on an externally supplied port (supporting port `0` for ephemeral test allocation), exposes a bounded `/health` endpoint returning canonical RuntimeHealth JSON, reports the selected listening port through a deterministic startup event on stdout, and remains alive until `SIGTERM`/`SIGINT`, on which it closes cleanly. Invalid environment input must fail before listening.

# Inputs / contracts

Existing RuntimeEnvironmentRequirement, EnvironmentProfile semantics, ADR-0002 autonomy and WBS 13.3.

# Outputs / contracts

Deterministic persistent Runtime entrypoint text and focused lifecycle/health behavior tests. No cross-context public schema is changed.

# Acceptance criteria

- renderer output is deterministic for equivalent requirement order;
- valid external EnvironmentProfile starts an HTTP server and `/health` returns RuntimeHealth `UP`;
- startup reports the actual selected port so Deploy can discover an ephemeral port;
- process remains alive until explicit termination;
- `SIGTERM` causes clean process exit;
- missing required binding or incompatible runtime fails before the server listens;
- generated source contains no Builder/Observe call requirement and no resolved secret value;
- existing one-shot bootstrap behavior remains regression-safe;
- declared validations pass.

# Non-goals

Compiler wiring, Deploy probing/supervision, SecretResolver, stateful actions, production HTTP routing/TLS/auth, telemetry backend or platform-specific service management.

# Evidence expected

Focused product tests spawning the rendered persistent entrypoint, probing `/health`, proving liveness/autonomy and controlled shutdown/failure, plus GitHub Deterministic CI.

# Escalation

Stop if persistence/health requires a new cross-context public contract, Builder/Observe dependency, resolved-secret persistence or an ADR change.
