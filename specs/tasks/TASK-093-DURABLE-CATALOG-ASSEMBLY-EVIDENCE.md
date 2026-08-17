---
id: TASK-093
title: Prove restart-safe durable Catalog to Assembly integration
status: ready
priority: 401
milestone: M7
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-092
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P6-PACKAGE-01.md
  - project_docs/execution_planning/P6-DURABLE-CATALOG-01.md
  - project_docs/05-catalog/WBS.md
  - project_docs/06-assembly/WBS.md
  - packages/catalog/index.ts
  - packages/catalog/storage.ts
  - packages/catalog/postgres.ts
  - packages/assembly/index.ts
  - tests/product/catalog-postgres.test.ts
  - tests/product/assembly.test.ts
  - tests/product/factory-e2e.test.ts
  - specs/tasks/TASK-085-ASSEMBLY-TRANSITIVE-CLOSURE.md
  - specs/tasks/TASK-086-ASSEMBLY-GRAPH-DIAGNOSTICS.md
  - specs/tasks/TASK-087-ASSEMBLY-GRAPH-EVIDENCE.md
  - specs/tasks/TASK-091-CATALOG-PERSISTENCE-BOUNDARY.md
  - specs/tasks/TASK-092-POSTGRES-CATALOG-PROVIDER.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-093-DURABLE-CATALOG-ASSEMBLY-EVIDENCE.md
allowed_paths:
  - packages/catalog/storage.ts
  - packages/catalog/postgres.ts
  - tests/product/catalog-postgres.test.ts
  - tests/product/factory-e2e.test.ts
  - specs/tasks/TASK-093-DURABLE-CATALOG-ASSEMBLY-EVIDENCE.md
forbidden_paths:
  - packages/catalog/index.ts
  - packages/assembly/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/deploy/**
  - packages/runtime-core/**
  - apps/**
  - tooling/agent-harness/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 5
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Close P6-DURABLE-CATALOG-01 with integrated evidence that a real durable PostgreSQL-backed Software Catalog can be reconstructed and then drive the unchanged P5 Catalog resolution and actual transitive Assembly path deterministically.

# Context

TASK-091 establishes the internal persistence seam and TASK-092 provides the PostgreSQL reference provider. P5 already proves deterministic structured dependencies, exact/minimum constraints, compatibility, transitive closure, multi-path combination and graph diagnostics using the process-local Catalog registry.

This TASK must prove durability is transparent to those established semantics rather than creating a parallel or hand-authored downstream path.

# Current behavior

After TASK-092, Catalog records can survive provider reconstruction in PostgreSQL, but the Sprint still needs integrated proof that reconstructed durable records feed the existing public Catalog resolution and real Assembly APIs without output or failure-behavior drift.

# Required change

Extend product evidence to populate a representative transitive Catalog graph through the durable provider, reconstruct the provider/registry boundary against the same database, resolve through current Catalog APIs and invoke actual Assembly APIs.

Prove equivalent deterministic results against a safe predecessor/control ordering and preserve explicit failure behavior after reconstruction. Production corrections are allowed only inside the internal Catalog storage/provider files when required to satisfy TASK-091/092 semantics; public Catalog and Assembly source are forbidden.

# Inputs / contracts

TASK-091/092 durable Catalog boundary/provider; current `SoftwareCatalogRegistry` and `resolveCatalogCandidates`; P5 Assembly transitive closure/diagnostics; structured dependency requirements; exact/minimum/compatibility semantics; deterministic AssemblyPlan/BOM behavior.

# Outputs / contracts

Integrated restart-safe evidence for `durable Catalog persistence -> provider reconstruction -> current Catalog resolution -> actual AssemblyPlan` with no public Catalog, Assembly or canonical contract change.

# Acceptance criteria

- actual PostgreSQL-backed records are persisted and then consumed after provider/process-style reconstruction rather than from the original in-memory instance;
- reconstructed records include a transitive dependency graph exercising structured requirements and current exact/minimum/compatibility behavior;
- current Catalog resolution over reconstructed durable data yields deterministic equivalent candidates under safe registration/order variation;
- actual `assembleSystemDefinition` consumes the reconstructed Catalog path and yields an equivalent deterministic AssemblyPlan/BOM to the established semantic control;
- unresolved/incompatible dependency behavior remains explicit after reconstruction and does not produce a false successful AssemblyPlan;
- existing P5 Assembly cycle/conflict/order-independence tests remain green through repository-wide verification;
- PostgreSQL connection material does not enter AssemblyPlan, Catalog records or durable evidence payloads;
- no `packages/catalog/index.ts`, `packages/assembly/**`, canonical contracts, Compiler, Release, ArtifactStore, Deploy or Runtime source is changed;
- declared validations pass.

# Non-goals

Release/Artifact persistence, full Factory restart E2E, production database lifecycle hardening, richer Catalog constraints/provider scoring, materializer extensibility, Runtime breadth or deployment supervision.

# Evidence expected

PostgreSQL reconstruction test using actual Catalog and Assembly APIs, deterministic equivalence evidence, explicit negative dependency behavior, full predecessor Assembly regression and final repository-wide Deterministic CI.

# Escalation

Stop if durable integration requires modifying public Catalog or Assembly semantics/source, canonical contracts, downstream Factory modules, database workflow configuration or an L4 architecture boundary.
