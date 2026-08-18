---
id: TASK-129
title: Prove SecretResolver fail-closed and no-value-leakage safety
status: ready
priority: 451
milestone: M10
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-128
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P10-PACKAGE-01.md
  - project_docs/execution_planning/P10-PRODUCTION-SECRETRESOLVER-01.md
  - packages/deploy/secret-resolver.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-070-SECRET-RESOLVER-BOUNDARY.md
  - specs/tasks/TASK-128-P10-PRODUCTION-SECRETRESOLVER-PROVIDERS.md
  - specs/tasks/TASK-129-P10-SECRETRESOLVER-FAILCLOSED-NOLEAKAGE.md
allowed_paths:
  - packages/deploy/secret-resolver.ts
  - tests/product/secret-resolver.test.ts
  - specs/tasks/TASK-129-P10-SECRETRESOLVER-FAILCLOSED-NOLEAKAGE.md
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

Prove the production SecretResolver providers fail closed and never leak resolved secret values across negative cases, serialization and diagnostics.

# Context

`TASK-128` adds production providers. This TASK hardens and demonstrates their safety guarantees (the negative/failure behavior required by Sprint policy) so they can be trusted at production runtime.

# Current behavior

The in-memory resolver throws on missing/empty references. Production-provider negative behavior and value-leakage guarantees are not yet asserted.

# Required change

Add focused product tests (and any bounded resolver corrections that remain inside this boundary) proving that missing/empty/duplicate bindings and unresolved references fail closed, that error diagnostics contain only symbolic references, and that serialized evidence never contains a resolved value.

# Inputs / contracts

Production SecretResolver providers from `TASK-128`, the `SecretResolver` interface, ADR-0007 no-value-leakage invariant.

# Outputs / contracts

Asserted fail-closed and no-value-leakage guarantees for the production providers. No canonical contract change.

# Acceptance criteria

- missing reference/value fails closed without resolved value in error;
- empty and duplicate bindings fail explicitly;
- error diagnostics contain only symbolic references, never resolved values;
- serialized resolver/store evidence contains no resolved value;
- positive and negative tests pass with the production providers;
- declared validations pass.

# Non-goals

TLS verification policy (`TD-P8-02`), encryption-at-rest, canonical contract changes, Runtime behavior changes.

# Evidence expected

Focused product tests in `tests/product/secret-resolver.test.ts` covering positive, negative and no-leakage cases, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P10-PRODUCTION-SECRETRESOLVER-01`. CI validation required before TASK-130 is eligible.

# Escalation

Stop if any required correction forces a canonical contract or ADR/L4 change without escalation.
