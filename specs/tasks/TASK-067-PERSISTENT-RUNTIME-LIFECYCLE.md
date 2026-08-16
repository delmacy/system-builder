---
id: TASK-067
title: Define persistent autonomous Runtime lifecycle and HTTP health entrypoint
status: completed
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

The merged predecessor Runtime is a one-shot process that validates external EnvironmentProfile input, writes one RuntimeHealth JSON line and exits. WBS 13.3 requires autonomous operation and a health surface without making Observe mandatory. Because Deploy persistence is committed separately as TASK-069, this Runtime increment must preserve the predecessor one-shot activation path until Deploy explicitly requests persistent service mode.

# Current behavior

`renderAutonomousRuntimeEntrypoint` emits a deterministic script that validates runtime version and required symbolic bindings, writes health to stdout and terminates immediately.

# Required change

Add a persistent Runtime entrypoint renderer in `runtime-core` that reuses the existing environment-validation semantics. When `SYSTEM_BUILDER_RUNTIME_PORT` is explicitly supplied, bind an HTTP server to loopback (supporting port `0` for ephemeral test allocation), expose `/health`, emit the selected port in a RuntimeStarted event and remain alive until `SIGTERM`/`SIGINT`. When no persistent-port request is supplied, preserve the predecessor one-shot RuntimeHealth output so TASK-068 can integrate Compiler output without prematurely changing Deploy lifecycle. Invalid environment input must fail before either output mode.

# Inputs / contracts

Existing RuntimeEnvironmentRequirement, EnvironmentProfile semantics, ADR-0002 autonomy and WBS 13.3.

# Outputs / contracts

Deterministic persistent-capable Runtime entrypoint text and focused lifecycle/health behavior tests. No cross-context public schema is changed.

# Acceptance criteria

- renderer output is deterministic for equivalent requirement order;
- explicit port request starts an HTTP server and `/health` returns RuntimeHealth `UP`;
- startup reports the actual selected port so Deploy can discover an ephemeral port;
- process remains alive until explicit termination in persistent mode;
- `SIGTERM` causes clean process exit;
- absent port request preserves predecessor one-shot health behavior until TASK-069 opts Deploy into persistence;
- missing required binding or incompatible runtime fails before the server listens;
- generated source contains no Builder/Observe call requirement and no resolved secret value;
- existing one-shot bootstrap behavior remains regression-safe;
- declared validations pass.

# Non-goals

Compiler wiring, Deploy probing/supervision, SecretResolver, stateful actions, production HTTP routing/TLS/auth, telemetry backend or platform-specific service management.

# Evidence expected

Focused product tests covering compatibility mode and explicit persistent mode with `/health`, liveness/autonomy and controlled shutdown/failure, plus GitHub Deterministic CI.

# Escalation

Stop if persistence/health requires a new cross-context public contract, Builder/Observe dependency, resolved-secret persistence or an ADR change.

# Result

Added a deterministic persistent-capable Node Runtime renderer. Explicit `SYSTEM_BUILDER_RUNTIME_PORT` activates loopback HTTP `/health`, RuntimeStarted discovery and controlled SIGTERM/SIGINT shutdown; absence of the port request preserves predecessor one-shot RuntimeHealth behavior until Deploy is upgraded in TASK-069. Environment validation, autonomy and secret-separation rules remain unchanged.
