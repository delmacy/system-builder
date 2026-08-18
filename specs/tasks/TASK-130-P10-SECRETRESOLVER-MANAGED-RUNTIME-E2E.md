---
id: TASK-130
title: Prove production SecretResolver managed-Runtime integration E2E
status: verification
priority: 452
milestone: M10
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-129
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P10-PACKAGE-01.md
  - project_docs/execution_planning/P10-PRODUCTION-SECRETRESOLVER-01.md
  - project_docs/execution_planning/P9-RUNTIME-RECONCILIATION-E2E-01.report.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/secret-resolver.ts
  - packages/deploy/local-deployment.ts
  - packages/deploy/managed-process.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-128-P10-PRODUCTION-SECRETRESOLVER-PROVIDERS.md
  - specs/tasks/TASK-129-P10-SECRETRESOLVER-FAILCLOSED-NOLEAKAGE.md
  - specs/tasks/TASK-130-P10-SECRETRESOLVER-MANAGED-RUNTIME-E2E.md
allowed_paths:
  - packages/deploy/secret-resolver.ts
  - packages/deploy/local-deployment.ts
  - tests/product/secret-resolver-e2e.test.ts
  - specs/tasks/TASK-130-P10-SECRETRESOLVER-MANAGED-RUNTIME-E2E.md
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
max_files: 4
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Prove the growing integration proof for the package: a production SecretResolver resolves symbolic secret references into the ephemeral environment of a Deploy-owned managed Runtime, with no resolved value leaking into durable Release/Deployment evidence, and Runtime continuity with Builder/Observe unavailable.

# Context

`TASK-128`/`TASK-129` provide and harden the production providers. P9 established the managed-Runtime lifecycle and durable authority. The remaining package proof is resolving production secrets into the running managed process without value leakage.

# Current behavior

The managed-Runtime path already validates secret-reference bindings and redacts resolved values on failure, but production providers are not yet exercised in the managed-process path and no E2E asserts the no-leakage invariant end to end.

# Required change

Add a product E2E test (invoking the actual Deploy/SecretResolver/managed-process modules) that binds symbolic secret references, resolves them with a production provider into the managed Runtime process environment, asserts the Runtime starts and reports health, asserts durable Release/Deployment evidence contains no resolved value, and asserts Runtime continuity without Builder/Observe.

# Inputs / contracts

Existing `resolveRuntimeSecretEnvironment`, production providers, Deploy managed-process and durable-authority modules, ADR-0002/ADR-0007 invariants, WBS 10.1.3/10.2.2.

# Outputs / contracts

Extends the growing integrated proof. No canonical contract change.

# Acceptance criteria

- symbolic secret-reference bindings resolve into the managed Runtime process environment;
- Runtime starts and reports health UP with resolved ephemeral values;
- durable Release/Deployment evidence and serialized package evidence contain no resolved value;
- Runtime keeps operating with Builder/Observe unavailable;
- positive, negative and predecessor-integration tests exist;
- declared validations pass.

# Non-goals

TLS verification policy (`TD-P8-02`), Vault/cloud-specific adapters, canonical contract changes, process/fleet supervision or infrastructure rollback.

# Evidence expected

`tests/product/secret-resolver-e2e.test.ts` extends the package E2E chain, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P10-PRODUCTION-SECRETRESOLVER-01` as the Sprint-closing TASK. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing canonical contracts, Runtime behavior, or any L3/L4 boundary without escalation.
