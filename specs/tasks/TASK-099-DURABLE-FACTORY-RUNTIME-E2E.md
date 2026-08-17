---
id: TASK-099
title: Prove durable Factory output reaches autonomous persisted Runtime
status: ready
priority: 407
milestone: M7
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-098
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P6-PACKAGE-01.md
  - project_docs/execution_planning/P6-DURABLE-FACTORY-E2E-01.md
  - packages/catalog/postgres.ts
  - packages/compiler/index.ts
  - packages/release/postgres.ts
  - packages/artifact-store/postgres.ts
  - packages/deploy/local-deployment.ts
  - packages/deploy/local-process.ts
  - packages/deploy/secret-resolver.ts
  - packages/runtime-core/index.ts
  - tests/product/capability-runtime-e2e.test.ts
  - tests/product/durable-factory-e2e.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-099-DURABLE-FACTORY-RUNTIME-E2E.md
allowed_paths:
  - tests/product/durable-factory-e2e.test.ts
  - specs/tasks/TASK-099-DURABLE-FACTORY-RUNTIME-E2E.md
forbidden_paths:
  - packages/**
  - apps/**
  - tooling/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Extend TASK-098 evidence through the existing local Deployment/process Runtime path and prove that a runtime produced from reconstructed durable Factory outputs executes autonomously and preserves existing PostgreSQL-backed state across clean redeploy without any live Builder/Factory provider dependency.

# Context

TASK-098 joins durable Catalog and durable Release/Artifact reconstruction through Deploy. Existing capability-runtime evidence already proves stateful generated Runtime persistence across clean redeploy using process-local Factory publication. This TASK combines those truths without changing Deploy or Runtime source.

# Current behavior

Durability and Runtime autonomy/state persistence are proven in separate evidence paths. The complete P6 package proof requires the Runtime to be activated from reconstructed durable release/artifact state and then continue independently of the Factory-side provider objects.

# Required change

Extend the durable Factory product test to use reconstructed PublishedRelease and verified ArtifactPayload with existing `executeLocalDeployment`/local process APIs. Use the already-integrated stateful capability/materializer path and external secret-reference resolution. Dispose/reconstruct Factory-side providers as part of the test lifecycle and perform a clean Runtime redeploy against the same isolated PostgreSQL runtime state.

# Inputs / contracts

TASK-098 durable Factory evidence; existing local Deployment API; existing SecretResolver contract; existing state.counter materializer/runtime behavior; `SYSTEM_BUILDER_TEST_POSTGRES_URL`; ADR-0002; ADR-0007.

# Outputs / contracts

Test evidence only. No Deploy, Runtime, Compiler, provider or public contract change.

# Acceptance criteria

- starts from Catalog persisted/reconstructed before Assembly and Release/Artifact persisted/reconstructed after Compiler as established by TASK-098;
- uses existing local Deployment API and actual generated runtime files, not a hand-authored substitute runtime;
- Runtime environment obtains connection material only from Environment/SecretResolver/process environment, never Release or ArtifactPayload;
- Runtime starts successfully from reconstructed durable Factory outputs;
- Factory-side Catalog/Release/Artifact provider instances may be closed/discarded before ordinary Runtime operation without breaking Runtime behavior;
- stateful capability writes/reads through the existing PostgreSQL Runtime path;
- a clean redeploy from the same immutable release/artifact against the same runtime database preserves the predecessor state semantics;
- evidence contains no Builder callback/availability dependency;
- missing secret/binding or corrupted artifact continues to fail before unsafe activation through existing behavior;
- no production source is modified;
- declared validations pass.

# Non-goals

Production supervision, remote deployment infrastructure, provider transport hardening, secret manager production providers, broader Runtime capabilities or new lifecycle semantics.

# Evidence expected

One PostgreSQL-backed integrated product proof showing reconstructed durable Factory output -> local Deployment -> autonomous Runtime -> persisted state across clean redeploy, plus fail-closed pre-activation evidence.

# Escalation

Stop if the proof requires changing Deploy/Runtime/Compiler/provider source, introducing a Runtime dependency on Builder/Factory, persisting secret values into release material, destructive migration, or any public contract change.
