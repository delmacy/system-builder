---
id: TASK-090
title: Prove transitive Factory to materializer registry integration
status: ready
priority: 398
milestone: M6
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-089
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P5-PACKAGE-01.md
  - project_docs/execution_planning/P5-MATERIALIZER-REGISTRY-01.md
  - specs/tasks/TASK-088-COMPILER-MATERIALIZER-REGISTRY.md
  - specs/tasks/TASK-089-STATE-COUNTER-MATERIALIZER-REGISTRY.md
  - project_docs/05-catalog/WBS.md
  - project_docs/06-assembly/WBS.md
  - project_docs/08-compiler/WBS.md
  - packages/catalog/index.ts
  - packages/assembly/index.ts
  - packages/validation/index.ts
  - packages/compiler/runtime-capabilities.ts
  - packages/compiler/index.ts
  - tests/product/factory-e2e.test.ts
  - tests/product/compiler.test.ts
  - tests/product/capability-runtime-e2e.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-090-MATERIALIZER-REGISTRY-EVIDENCE.md
allowed_paths:
  - packages/compiler/runtime-capabilities.ts
  - packages/compiler/index.ts
  - tests/product/compiler.test.ts
  - tests/product/factory-e2e.test.ts
  - tests/product/capability-runtime-e2e.test.ts
  - specs/tasks/TASK-090-MATERIALIZER-REGISTRY-EVIDENCE.md
forbidden_paths:
  - packages/catalog/**
  - packages/assembly/**
  - packages/contracts/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/deploy/**
  - packages/runtime-core/**
  - apps/**
  - tooling/agent-harness/**
  - docs/adr/**
  - .github/**
max_files: 6
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Close P5-MATERIALIZER-REGISTRY-01 with integrated evidence that the actual constrained/transitive Factory path reaches deterministic Compiler materializer lookup and preserves the established P4 PostgreSQL autonomous-runtime/redeploy proof.

# Context

P5-CATALOG-CONSTRAINTS-01 and P5-ASSEMBLY-GRAPH-01 are integrated in main. TASK-088/089 establish an internal deterministic registry and route the existing state.counter reference provider through it. This TASK must prove the growing E2E path through actual module APIs rather than isolated or hand-authored downstream artifacts.

# Current behavior

After TASK-089, Compiler materialization can resolve the existing state.counter identity through the registry, while current Factory graph E2E and capability-runtime E2E prove adjacent portions of the pipeline separately.

# Required change

Extend product evidence so an actual SoftwareCatalogRegistry and `resolveCatalogCandidates` produce a transitive AssemblyPlan whose selected exact capability/provider/version identity is consumed through Validation and the materializer registry by Compiler.

Evidence must prove deterministic equivalence under safe ordering changes and preserve the existing capability-driven PostgreSQL clean-redeploy regression. A test-only materializer may be used only if needed to demonstrate registry ordering/lookup extensibility without creating a second production Runtime capability.

Product changes are allowed only for bounded Compiler corrections required to preserve TASK-088/089 semantics. Catalog, Assembly, Runtime, Deploy and canonical contracts must remain unchanged.

# Inputs / contracts

Integrated Catalog constrained resolution, Assembly transitive graph, Validation traceability, TASK-088/089 registry behavior, current Compiler API and P4 capability-runtime regression.

# Outputs / contracts

Integrated evidence for `Catalog -> AssemblyPlan -> ValidationEvidence -> exact materializer registry lookup -> Compiler -> ReleaseArtifact` with no new public schema or Runtime capability contract.

# Acceptance criteria

- actual Catalog registrations and transitive Assembly resolution feed exact capability/provider/version identity into Compiler materializer lookup;
- equivalent safe ordering yields identical AssemblyPlan, ValidationEvidence and ReleaseArtifact identities;
- unsupported selected materializer identity fails explicitly and does not produce false successful compilation evidence;
- existing state.counter migration/runtime assets remain deterministic and secret-free;
- P4 capability-driven PostgreSQL clean-redeploy and predecessor migration/state redeploy tests remain green under repository-wide verify;
- no second production Runtime capability, durable provider, canonical/L4 or deployment change is introduced.

# Non-goals

P5 package Integration & Technical Debt Review, durable Catalog/Release/Artifact providers, production deployment hardening, public plugin SDK, broader generated Runtime behavior.

# Evidence expected

Actual Factory predecessor integration test, registry negative/order-independent evidence, P4 PostgreSQL regression and final deterministic repository CI.

# Escalation

Stop if integrated proof requires modifying Catalog/Assembly semantics, canonical contracts, Runtime/Deploy behavior or an L4 architecture boundary.
