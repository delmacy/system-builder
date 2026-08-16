---
id: TASK-085
title: Resolve deterministic transitive Assembly closure
status: ready
priority: 393
milestone: M6
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P5-PACKAGE-01.md
  - project_docs/execution_planning/P5-ASSEMBLY-GRAPH-01.md
  - project_docs/execution_planning/P5-CATALOG-CONSTRAINTS-01.report.md
  - project_docs/05-catalog/WBS.md
  - project_docs/06-assembly/WBS.md
  - packages/catalog/index.ts
  - packages/assembly/index.ts
  - tests/product/catalog-resolution.test.ts
  - tests/product/assembly.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-085-ASSEMBLY-TRANSITIVE-CLOSURE.md
allowed_paths:
  - packages/assembly/index.ts
  - tests/product/assembly.test.ts
  - specs/tasks/TASK-085-ASSEMBLY-TRANSITIVE-CLOSURE.md
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
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Evolve Assembly from root-only capability selection into bounded deterministic acyclic transitive dependency closure using the structured dependency requirements already integrated in Catalog.

# Context

P5-CATALOG-CONSTRAINTS-01 added normalized `dependencyRequirements` carrying capability plus optional exact/minimum version constraint and compatibility, while deliberately preserving the root-only Assembly predecessor. WBS 6.1.2 now has the required upstream representation to be consumed.

# Current behavior

Assembly resolves only SystemDefinition root capabilities. It selects one deterministic candidate per root and copies legacy dependency names into the AssemblyPlan without traversing Catalog `dependencyRequirements`.

# Required change

Extend the internal Assembly resolver request/candidate shape only as needed to consume structured dependency requirements and recursively resolve selected candidate dependencies through the provided resolver. Preserve the existing deterministic provider/version selection rule for each eligible candidate set.

For an acyclic satisfiable graph, every selected root/dependency capability must appear once in the resulting AssemblyPlan components, independent of root capability order, dependency requirement order or Catalog registration order.

Do not add conflict/cycle policy beyond the minimum behavior needed for a successful acyclic graph; TASK-086 owns negative graph semantics.

# Inputs / contracts

Integrated Catalog structured requirement shape, current internal Assembly resolver/candidate API, WBS 05/06, ADR-0002/0007 and the P5 Sprint manifest.

# Outputs / contracts

A bounded internal Assembly graph-resolution behavior that produces deterministic transitive AssemblyPlan components/BOM while preserving canonical contracts and downstream interfaces.

# Acceptance criteria

- a root capability can pull a structured dependency into AssemblyPlan;
- nested dependencies resolve transitively;
- dependency exact/minimum and compatibility requirements are forwarded deterministically to the resolver;
- duplicate compatible dependency paths coalesce to one deterministic component;
- equivalent ordering produces identical AssemblyPlan content/hash;
- current root-only/no-dependency predecessor behavior remains valid;
- no Catalog, Compiler, canonical contract or Runtime implementation changes occur.

# Non-goals

Cycle diagnosis, incompatible multi-path conflict policy, materializer registry, durable providers, new version-range kinds, canonical contracts.

# Evidence expected

Positive one-hop/multi-hop/duplicate/order-independent Assembly product tests using the real `resolveCatalogCandidates`, plus repository-wide verification.

# Escalation

Stop if transitive closure cannot be implemented without changing Catalog semantics, canonical contracts or an L4 boundary.
