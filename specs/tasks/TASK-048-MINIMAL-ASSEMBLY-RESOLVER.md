---
id: TASK-048
title: Implement minimal deterministic Assembly resolver
status: ready
priority: 230
milestone: M2
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-047
context_paths:
  - AGENTS.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - project_docs/06-assembly/WBS.md
  - project_docs/execution_planning/P1-VERTICAL-01.md
  - packages/catalog/**
  - packages/contracts/system-definition/**
  - packages/contracts/factory-boundary/**
  - specs/tasks/TASK-048-MINIMAL-ASSEMBLY-RESOLVER.md
allowed_paths:
  - packages/assembly/**
  - tests/product/assembly.test.ts
  - specs/tasks/TASK-048-MINIMAL-ASSEMBLY-RESOLVER.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - tooling/agent-harness/**
max_files: 7
validation:
  - npm run verify
---

# Objective

Produce the first deterministic AssemblyPlan from SystemDefinition capability requests and Catalog resolution results.

# Context

WBS 6.1-6.3 requires capability/provider resolution, deterministic composition diagnostics and a versioned AssemblyPlan/BOM. This TASK implements only the direct-dependency slice needed for the first vertical proof.

# Current behavior

Catalog lookup can identify candidates but no executable Assembly engine exists.

# Required change

Implement an Assembly resolver that selects the stable first eligible candidate for each required capability, preserves declared direct dependencies, computes a deterministic content hash and emits the existing AssemblyPlan contract shape. Return explicit diagnostics instead of partial plans when required capabilities cannot resolve.

# Inputs / contracts

SystemDefinition capability requests, Software Catalog resolution results and the existing AssemblyPlan public contract.

# Outputs / contracts

AssemblyPlan object or deterministic assembly diagnostic.

# Acceptance criteria

- all required capabilities resolve into AssemblyPlan components.
- component ordering and contentHash are deterministic for equivalent inputs.
- missing/incompatible capability prevents plan emission and returns an explicit diagnostic.
- Assembly consumes SystemDefinition/Catalog outputs rather than BusinessRecipe internals.
- positive, negative and repeated-output product tests pass.

# Non-goals

Full transitive solver, optimization, migrations, adapters, package download, build/compiler or runtime execution.

# Evidence expected

Product tests and repository-wide verification, including a SystemDefinition -> Catalog -> AssemblyPlan proof.

# Escalation

Stop if the existing AssemblyPlan contract cannot represent the bounded resolver output without a public-contract change.
