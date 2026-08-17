---
id: TASK-087
title: Prove deterministic Assembly graph integration
status: ready
priority: 395
milestone: M6
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-086
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P5-PACKAGE-01.md
  - project_docs/execution_planning/P5-ASSEMBLY-GRAPH-01.md
  - specs/tasks/TASK-085-ASSEMBLY-TRANSITIVE-CLOSURE.md
  - specs/tasks/TASK-086-ASSEMBLY-GRAPH-DIAGNOSTICS.md
  - project_docs/05-catalog/WBS.md
  - project_docs/06-assembly/WBS.md
  - packages/catalog/index.ts
  - packages/assembly/index.ts
  - tests/product/assembly.test.ts
  - tests/product/factory-e2e.test.ts
  - tests/product/capability-runtime-e2e.test.ts
  - specs/tasks/TASK-087-ASSEMBLY-GRAPH-EVIDENCE.md
allowed_paths:
  - tests/product/assembly.test.ts
  - tests/product/factory-e2e.test.ts
  - packages/assembly/index.ts
  - specs/tasks/TASK-087-ASSEMBLY-GRAPH-EVIDENCE.md
forbidden_paths:
  - packages/catalog/index.ts
  - packages/compiler/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/contracts/**
  - apps/**
  - tooling/agent-harness/**
  - docs/adr/**
  - .github/**
max_files: 4
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Close P5-ASSEMBLY-GRAPH-01 with integrated evidence that the actual Catalog -> Assembly path resolves a deterministic transitive BOM, fails closed for graph defects and preserves downstream Factory/P4 predecessor behavior.

# Context

TASK-085/086 establish positive transitive closure and deterministic graph failure semantics inside Assembly. This final TASK must prove those semantics through the actual Catalog resolver and downstream Factory predecessor path.

# Current behavior

After TASK-086, Assembly can resolve and diagnose the bounded graph internally, while existing Factory E2E coverage still exercises the predecessor root-only composition path.

# Required change

Extend product evidence so a real SoftwareCatalogRegistry + `resolveCatalogCandidates` drives Assembly from a SystemDefinition root through structured transitive dependencies, then continues through the existing Validation/Compiler predecessor path without hand-authoring the AssemblyPlan.

Product code changes are allowed only for bounded Assembly corrections required by TASK-085/086 semantics. Compiler, Catalog and canonical contracts must not change.

# Inputs / contracts

Actual Catalog/Assembly APIs, TASK-085/086 graph semantics, current Validation/Compiler predecessor APIs, P4 regression suite and P5 Sprint authority.

# Outputs / contracts

Integrated product evidence proving graph-derived AssemblyPlan behavior reaches existing downstream Factory stages deterministically. No new public schema or downstream implementation contract.

# Acceptance criteria

- actual Catalog registrations with structured requirements produce the expected transitive AssemblyPlan BOM;
- equivalent registration/root/dependency ordering produces identical AssemblyPlan and content hash;
- cycle/conflict/unresolved dependency failures are proven through actual Catalog resolution;
- factory E2E reaches Validation/Compiler from the graph-derived AssemblyPlan;
- current P4 capability/PostgreSQL autonomous-runtime/redeploy regression remains green under repository-wide verify;
- no materializer registry, durable provider or canonical/L4 change is introduced.

# Non-goals

P5-MATERIALIZER-REGISTRY-01, Compiler materializer changes, durable providers, production deployment, new public schemas.

# Evidence expected

Assembly positive/negative/order-independent evidence, real Factory E2E continuation and final deterministic repository CI.

# Escalation

Stop if downstream preservation requires changing Compiler/materializer behavior or canonical contracts.
