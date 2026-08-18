---
id: TASK-128
title: Add production SecretResolver providers
status: verification
priority: 450
milestone: M10
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-070
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P10-PACKAGE-01.md
  - project_docs/execution_planning/P10-PRODUCTION-SECRETRESOLVER-01.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/secret-resolver.ts
  - packages/deploy/local-deployment.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-070-SECRET-RESOLVER-BOUNDARY.md
  - specs/tasks/TASK-128-P10-PRODUCTION-SECRETRESOLVER-PROVIDERS.md
allowed_paths:
  - packages/deploy/secret-resolver.ts
  - tests/product/secret-resolver.test.ts
  - specs/tasks/TASK-128-P10-PRODUCTION-SECRETRESOLVER-PROVIDERS.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/runtime-core/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/compiler/**
  - docs/adr/**
  - .github/**
  - tooling/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Extend the Deploy-bounded `SecretResolver` boundary with production-grade, replaceable providers that resolve symbolic `EnvironmentProfile` secret references into ephemeral process-environment values, deterministically, without persisting or serializing resolved values.

# Context

`TASK-070` established the provider-neutral `SecretResolver` interface and a deterministic in-memory reference implementation. Production (`TD-P4-05`) requires production providers (e.g. process-environment and file-backed stores) with fail-closed behavior and no value leakage.

# Current behavior

The only resolver is `InMemorySecretResolver`. No production provider reads from the local process environment or a secret-store file.

# Required change

Add production SecretResolver providers (process-environment-backed and file-backed) that implement the existing `SecretResolver` interface, resolve only symbolic references, fail closed for missing/empty values, and never emit resolved values into serialization, diagnostics or durable evidence. Keep the canonical EnvironmentProfile and existing API contracts unchanged.

# Inputs / contracts

Existing `SecretResolver` interface and `resolveRuntimeSecretEnvironment` in `packages/deploy/secret-resolver.ts`, ADR-0002 Builder/Runtime separation, ADR-0007 no secret embedding, WBS 10.1.1/10.1.3.

# Outputs / contracts

Additive production resolver providers behind the existing interface. No canonical contract change.

# Acceptance criteria

- process-environment provider resolves references from the running process environment;
- file-backed provider reads references from a store file without leaking values into logs/errors;
- only symbolic secret-reference bindings are resolved;
- missing/empty reference or value fails closed without including the resolved value;
- providers do not serialize stored secret values;
- canonical EnvironmentProfile remains unmodified;
- no public Release/Deployment schema changes;
- declared validations pass.

# Non-goals

Positive TLS verification / server-identity policy (`TD-P8-02`, escalated to ADR), encryption-at-rest policy, Vault/cloud-specific network adapters, canonical contract changes, Runtime behavior changes.

# Evidence expected

Focused product tests proving deterministic resolution, config exclusion, fail-closed missing/empty cases and no value serialization, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P10-PRODUCTION-SECRETRESOLVER-01`. CI validation required before TASK-129 is eligible.

# Escalation

Stop if implementation requires changing canonical EnvironmentProfile/Release/Deployment contracts, Runtime behavior, or introducing an L3/L4 boundary without escalation.
