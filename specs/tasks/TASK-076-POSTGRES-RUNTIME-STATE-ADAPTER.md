---
id: TASK-076
title: Implement bounded PostgreSQL Runtime state adapter
status: ready
priority: 390
milestone: M5
model_tier: cheap
risk: medium
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-075
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P4-PACKAGE-01.md
  - project_docs/execution_planning/P4-POSTGRES-STATE-01.md
  - project_docs/execution_planning/P4-MIGRATION-STATE-01.report.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/08-compiler/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - packages/runtime-core/state-migrations.ts
  - packages/runtime-core/index.ts
  - packages/compiler/index.ts
  - tests/product/compiler.test.ts
  - specs/tasks/TASK-075-DEPLOY-MIGRATION-PREFLIGHT.md
  - specs/tasks/TASK-076-POSTGRES-RUNTIME-STATE-ADAPTER.md
allowed_paths:
  - packages/runtime-core/postgres-state.ts
  - packages/runtime-core/index.ts
  - packages/compiler/index.ts
  - tests/product/compiler.test.ts
  - specs/tasks/TASK-076-POSTGRES-RUNTIME-STATE-ADAPTER.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/deploy/**
  - packages/release/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
  - .github/**
max_files: 5
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Make the actual Compiler-generated persistent Runtime use PostgreSQL for the bounded state action whenever an accepted `RuntimeStateRequirement` is present, without introducing a Builder/runtime dependency or an external generated-runtime npm dependency.

# Context

TASK-073 established symbolic state/migration metadata and TASK-074 makes Compiler consume it. The generated Runtime still keeps `counter` in process memory because the Runtime renderer does not receive or execute state requirements.

# Current behavior

`compileSyntheticRelease` passes only environment requirements to `renderPersistentAutonomousRuntimeEntrypoint`. The generated `/state/counter/increment` route increments a process-local variable. Restarting the Runtime resets state.

# Required change

Add a Runtime-Core bounded PostgreSQL state source renderer implemented only with Node execution-plane APIs, pass normalized state requirements from Compiler to the Runtime renderer, and make `state.counter` use the externally supplied connection binding when a SQL state requirement exists. Preserve the predecessor process-local path when no state requirement exists so older artifacts/tests remain compatible. Database failures must surface sanitized Runtime state diagnostics without exposing the connection string.

# Inputs / contracts

Merged `RuntimeStateRequirement`, Compiler environment schema, ADR-0002, ADR-0007 and WBS 8.1/13.1.

# Outputs / contracts

Generated Runtime behavior only. No canonical `packages/contracts/**`, ReleaseArtifact, EnvironmentProfile or DeploymentRecord schema change.

# Acceptance criteria

- Compiler passes normalized state requirements into the Runtime renderer;
- generated Runtime contains a PostgreSQL-backed adapter only when SQL state requirements exist;
- adapter reads the connection string exclusively from the declared symbolic binding name at Runtime execution;
- generated Runtime has no import/reference to Builder or Observe and requires no external npm runtime package;
- counter increment is executed atomically in PostgreSQL and returns the persisted integer value;
- database/auth/query failures are sanitized and do not include the connection string;
- no-state predecessor compilation preserves the process-local counter behavior;
- deterministic Compiler output remains stable for equal accepted inputs;
- declared validations pass.

# Non-goals

Deploy migration execution, CI PostgreSQL service, production pooling/TLS/auth feature completeness, database provisioning, capability-driven action materialization or canonical contract changes.

# Evidence expected

Compiler/Runtime product tests proving deterministic generated source, state-requirement handoff, absence of embedded secret material/Builder dependency and predecessor compatibility, plus Deterministic CI.

# Escalation

Stop if this requires a canonical public schema change, embedding Builder modules in the Runtime, or changing accepted Builder/Runtime or Release/Environment/Deployment architecture.
