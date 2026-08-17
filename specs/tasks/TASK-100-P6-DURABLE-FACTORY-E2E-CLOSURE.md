---
id: TASK-100
title: Close P6 durable Factory E2E with deterministic failure and autonomy regression proof
status: completed
priority: 408
milestone: M7
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-099
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P6-PACKAGE-01.md
  - project_docs/execution_planning/P6-DURABLE-FACTORY-E2E-01.md
  - tests/product/durable-factory-e2e.test.ts
  - tests/product/factory-e2e.test.ts
  - tests/product/capability-runtime-e2e.test.ts
  - tests/product/catalog-postgres.test.ts
  - tests/product/release-postgres.test.ts
  - tests/product/artifact-store-postgres.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-100-P6-DURABLE-FACTORY-E2E-CLOSURE.md
allowed_paths:
  - tests/product/durable-factory-e2e.test.ts
  - specs/tasks/TASK-100-P6-DURABLE-FACTORY-E2E-CLOSURE.md
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

Close the third P6 construction Sprint with deterministic, fail-closed and autonomy regression evidence across the full growing E2E proven by TASK-098 and TASK-099, without expanding product scope.

# Context

TASK-098 joins durable Factory persistence to existing Deploy. TASK-099 extends the reconstructed output through existing local Deployment into autonomous stateful Runtime. This final construction TASK must make the package proof robust against ordering/reconstruction variation and verify that predecessor failure semantics remain visible rather than being masked by the integrated path.

# Current behavior

The joined positive path exists after TASK-099. P6 still requires package-construction-level evidence that equivalent durable inputs remain deterministic across reconstruction/order changes, negative conditions fail at the correct boundary, and Builder/Factory unavailability does not affect ordinary Runtime operation.

# Required change

Extend only the durable Factory E2E test with a compact regression matrix over the actual module path already established. Do not create new helpers that duplicate production semantics when existing APIs can be called directly.

# Inputs / contracts

TASK-098 and TASK-099 evidence; current Catalog/Assembly/Validation/Compiler/Release/ArtifactStore/Deploy/Runtime failure behavior; ADR-0002; ADR-0007.

# Outputs / contracts

Final construction-Sprint evidence only. No product or contract change.

# Acceptance criteria

- equivalent durable Catalog records registered in different order reconstruct to the same deterministic AssemblyPlan and ReleaseArtifact;
- equivalent Release/Artifact reconstruction produces equivalent verified payload and deployment identity for fixed deployment inputs;
- duplicate release identity and conflicting artifact overwrite remain fail-closed after reconstruction;
- missing capability/invalid traceability/artifact mismatch or missing environment binding remains attributable to the correct existing boundary;
- corrupt/tampered ArtifactPayload remains rejected by existing verification before Runtime activation;
- ordinary Runtime operation after successful activation does not require live Catalog, Release or Artifact provider instances;
- clean redeploy preserves existing runtime state semantics and immutable release identity;
- no credentials/secret values/provider connection strings appear in durable release/artifact/deployment evidence;
- predecessor product tests remain green;
- no production source is modified;
- `npm run verify` passes.

# Non-goals

Technical-debt classification, production hardening, performance/load testing, new capabilities, new deployment topology, new observability, ADR changes or successor planning.

# Evidence expected

A deterministic positive/negative/autonomy regression matrix in the existing durable Factory E2E test plus repository-wide verification.

# Escalation

Stop if any acceptance criterion requires a production-source or public-contract change, new architecture decision, destructive migration, CI workflow modification, or broader Runtime/Deploy behavior.
