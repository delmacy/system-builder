---
id: TASK-072
title: Prove secret resolution and stateful runtime end to end
status: blocked
priority: 388
milestone: M4
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-071
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
  - packages/deploy/secret-resolver.ts
  - packages/deploy/local-deployment.ts
  - tests/product/full-autonomous-local-e2e.test.ts
  - tests/product/local-deployment.test.ts
  - specs/tasks/TASK-072-SECRET-STATE-E2E.md
allowed_paths:
  - tests/product/full-autonomous-local-e2e.test.ts
  - tests/product/local-deployment.test.ts
  - specs/tasks/TASK-072-SECRET-STATE-E2E.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/runtime-core/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/deploy/**
  - tooling/agent-harness/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Extend the real autonomous local integration proof through verified artifact retrieval, external secret resolution, persistent health, the bounded stateful action and deterministic DeploymentRecord evidence.

# Context

TASK-071 completes the product path for runtime-only secret injection and a bounded stateful action. The final Sprint task must prove the complete chain using actual executable producers rather than hand-authored downstream artifacts.

# Current behavior

The full autonomous E2E proves verified artifact retrieval, persistent health, deterministic DeploymentRecord, corruption rejection and secret absence from durable evidence, but does not invoke an external SecretResolver or state action.

# Required change

Update integration tests only. Use actual Catalog/Assembly/Validation/Compiler/ArtifactStore/Release/Deploy producers, an in-memory SecretResolver containing a runtime-only secret value, and the canonical EnvironmentProfile symbolic secret reference. Prove two equivalent runs produce stable contract identities and the state action reaches value 2. Add a negative unresolved-secret case that fails before activation/materialization. Prove the resolved value is absent from Compiler output, artifact payload, PublishedRelease, health/state responses and DeploymentRecord.

# Inputs / contracts

Actual package producer APIs, TASK-070 SecretResolver, TASK-071 secret-aware Deploy/Runtime behavior, canonical EnvironmentProfile and accepted ADR boundaries.

# Outputs / contracts

End-to-end evidence only; no new product API. Evidence must demonstrate deterministic identities, bounded state transition and absence of resolved secrets from durable/runtime response content.

# Acceptance criteria

- full autonomous E2E reaches `counter.increment` twice through the persistent Runtime;
- equivalent runs preserve deterministic AssemblyPlan, ValidationEvidence, ReleaseArtifact, PublishedRelease and DeploymentRecord identities;
- unresolved symbolic secret fails deterministically before activation;
- resolved secret value never appears in immutable/durable evidence or runtime responses;
- symbolic secret reference remains confined to EnvironmentProfile/runtime configuration boundary;
- existing corruption, health and missing-binding proofs remain green;
- declared validations pass.

# Non-goals

New product behavior, production secret providers, durable database state, restart persistence or schema changes.

# Evidence expected

Updated full autonomous E2E and local deployment tests using actual producers, including positive deterministic runs, unresolved-secret pre-activation failure and explicit secret leakage assertions, plus GitHub Deterministic CI.

# Escalation

Stop if E2E completion requires product-code changes beyond TASK-071 or any forbidden path.
