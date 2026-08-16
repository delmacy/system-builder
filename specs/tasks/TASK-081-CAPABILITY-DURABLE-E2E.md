---
id: TASK-081
title: Prove full capability-driven durable Runtime vertical
status: ready
priority: 385
milestone: M5
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-080
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P4-PACKAGE-01.md
  - project_docs/execution_planning/P4-CAPABILITY-RUNTIME-01.md
  - project_docs/execution_planning/P4-POSTGRES-STATE-01.report.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - project_docs/05-catalog/WBS.md
  - project_docs/06-assembly/WBS.md
  - project_docs/08-compiler/WBS.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/assembly/index.ts
  - packages/catalog/index.ts
  - packages/validation/index.ts
  - packages/compiler/index.ts
  - packages/artifact-store/index.ts
  - packages/release/index.ts
  - packages/deploy/local-process.ts
  - packages/deploy/secret-resolver.ts
  - tests/product/postgres-state-e2e.test.ts
  - specs/tasks/TASK-081-CAPABILITY-DURABLE-E2E.md
allowed_paths:
  - tests/product/capability-runtime-e2e.test.ts
  - specs/tasks/TASK-081-CAPABILITY-DURABLE-E2E.md
forbidden_paths:
  - apps/**
  - packages/**
  - tooling/agent-harness/**
  - docs/adr/**
  - .github/**
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Prove the P4 package construction goal through actual module APIs: a real SystemDefinition capability is resolved by Catalog/Assembly, validated, compiled into durable Runtime/migration assets, published/retrieved, deployed to PostgreSQL and remains durable across clean redeploy.

# Context

TASK-079/080 make the bounded `state.counter` Runtime implementation derive from a real selected AssemblyPlan component while retaining the verified PostgreSQL migration/deploy/runtime path from the predecessor Sprint.

# Current behavior

Before this TASK, module-level tests prove capability materialization/rendering and the predecessor PostgreSQL E2E proves durable state, but no single proof traverses SystemDefinition -> Catalog -> Assembly -> Validation -> Compiler-derived capability -> ArtifactStore/Release -> Deploy -> PostgreSQL Runtime without caller-supplied state requirements.

# Required change

Add one product E2E using only existing module APIs. In CI, use the provided ephemeral PostgreSQL service to execute a capability-driven positive path twice against the same isolated database, plus negative absent-capability and unsupported-provider proofs. Do not modify product code or CI in this TASK.

# Inputs / contracts

Actual SystemDefinition/Catalog/Assembly/Validation/Compiler/ArtifactStore/Release/SecretResolver/Deploy APIs, ADR-0002/0007, WBS 05/06/08/10/13 and the CI-provided PostgreSQL test URL.

# Outputs / contracts

Integration evidence only in a product E2E test. No product contract, provider implementation or deployment topology changes.

# Acceptance criteria

- test uses actual `SoftwareCatalogRegistry`, `resolveCatalogCandidates`, `assembleSystemDefinition`, `validateTraceability`, `compileSyntheticRelease`, ArtifactStore, ReleaseRegistry, SecretResolver and local Deploy APIs;
- no caller-supplied `stateRequirements` is used in the positive capability-driven path;
- first deploy applies the generated migration and reaches state value 2;
- second clean deploy skips the migration and reaches state value 4 using the same PostgreSQL database;
- Builder/Observe-unavailable addresses do not break Runtime state operation;
- a SystemDefinition without `state.counter` reaches a valid no-state artifact/deploy and does not receive state evidence;
- an unsupported selected `state.counter` provider/version fails deterministically before artifact publication;
- immutable artifact/release/generated files, health/state/application evidence and diagnostics do not contain resolved PostgreSQL connection material;
- PostgreSQL-backed E2E runs, not skips, in GitHub Deterministic CI;
- repository-wide verify passes.

# Non-goals

Integration & Technical Debt Review, general capability graph solving, production Runtime supervision, auth/TLS/provider lifecycle, broad entities/workflows/auth/UI.

# Evidence expected

One actual capability-driven PostgreSQL product E2E covering first apply/state 2, second skip/state 4, absent capability/no state, unsupported provider failure and secret non-leakage, plus final GitHub Deterministic CI with zero skip for this test.

# Escalation

Stop if the proof requires product-code changes beyond TASK-079/080 outputs, a CI/workflow change, a canonical contract change or any L4 architecture decision.
