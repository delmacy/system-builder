---
id: TASK-070
title: Define external SecretResolver boundary
status: ready
priority: 386
milestone: M4
model_tier: cheap
risk: medium
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-069
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P3-PACKAGE-01.md
  - project_docs/execution_planning/P3-SECRET-STATE-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/contracts/environment-profile/index.ts
  - specs/tasks/TASK-070-SECRET-RESOLVER-BOUNDARY.md
allowed_paths:
  - packages/deploy/secret-resolver.ts
  - tests/product/secret-resolver.test.ts
  - specs/tasks/TASK-070-SECRET-RESOLVER-BOUNDARY.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/runtime-core/**
  - packages/release/**
  - packages/artifact-store/**
  - tooling/agent-harness/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Define a provider-neutral external SecretResolver boundary that turns symbolic `EnvironmentProfile` secret references into ephemeral process-environment values without changing or enriching the canonical EnvironmentProfile.

# Context

The merged persistent Runtime accepts only symbolic bindings in EnvironmentProfile and Deploy currently passes that profile unchanged to the generated process. P3-PACKAGE-01 requires secret references to be resolved externally while keeping immutable release/deployment evidence free of resolved values.

# Current behavior

There is no explicit replaceable secret-resolution interface in the product path. Secret-reference bindings are validated for presence, but no bounded component resolves `secret://...` references into runtime-only process values.

# Required change

Add a Deploy-bounded `SecretResolver` interface, a deterministic in-memory reference implementation for tests/local proof, and a helper that resolves only `secret-reference` bindings into a runtime-only environment map. Fail closed for missing/empty references or values. Error diagnostics may contain symbolic references but never resolved values.

# Inputs / contracts

Canonical `EnvironmentProfile` symbolic bindings, ADR-0002 Builder/Runtime separation, ADR-0007 Release/Environment/Deployment separation, and WBS 10.1.1/10.1.3.

# Outputs / contracts

A provider-neutral Deploy-bounded SecretResolver API and deterministic runtime-only environment map. No canonical public schema changes.

# Acceptance criteria

- resolver contract is provider-neutral and replaceable;
- only `secret-reference` bindings are resolved;
- result keys are deterministic by binding name;
- missing reference/value fails explicitly without including the resolved value;
- in-memory reference implementation does not serialize stored secret values;
- canonical EnvironmentProfile remains unmodified;
- no public Release/Deployment schema changes;
- declared validations pass.

# Non-goals

Production Vault/cloud secret-manager adapters, encryption-at-rest policy, process spawning, Runtime state/action behavior, database provisioning or schema changes.

# Evidence expected

Focused product tests proving deterministic resolution, config exclusion, fail-closed missing/empty/duplicate cases, EnvironmentProfile immutability and serialization without secret values, plus GitHub Deterministic CI.

# Escalation

Stop if the boundary requires changing canonical EnvironmentProfile/Release/Deployment contracts or accepted architecture.
