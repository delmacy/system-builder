---
id: TASK-084
title: Prove deterministic Catalog constraint compatibility
status: ready
priority: 392
milestone: M6
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-083
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P5-PACKAGE-01.md
  - project_docs/execution_planning/P5-CATALOG-CONSTRAINTS-01.md
  - specs/tasks/TASK-082-CATALOG-DEPENDENCY-REQUIREMENTS.md
  - specs/tasks/TASK-083-CATALOG-VERSION-CONSTRAINTS.md
  - project_docs/05-catalog/WBS.md
  - project_docs/06-assembly/WBS.md
  - packages/catalog/index.ts
  - packages/assembly/index.ts
  - tests/product/catalog-resolution.test.ts
  - tests/product/assembly.test.ts
  - specs/tasks/TASK-084-CATALOG-CONSTRAINT-EVIDENCE.md
allowed_paths:
  - tests/product/catalog-resolution.test.ts
  - tests/product/assembly.test.ts
  - packages/catalog/index.ts
  - specs/tasks/TASK-084-CATALOG-CONSTRAINT-EVIDENCE.md
forbidden_paths:
  - packages/assembly/index.ts
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

Close P5-CATALOG-CONSTRAINTS-01 with integration evidence that structured requirements and bounded constraints are deterministic, fail closed and preserve the real predecessor Catalog→Assembly path.

# Context

TASK-082/083 add only Catalog-side metadata/constraint semantics. P5-ASSEMBLY-GRAPH-01 remains forecast and is not authorized.

# Current behavior

Existing product tests prove provider-neutral exact Catalog resolution and deterministic Assembly selection over current Catalog candidates.

# Required change

Extend product evidence to cover equivalent registration/input orderings, exact/minimum constraints, explicit incompatible diagnostics, structured dependency normalization and the unchanged predecessor Assembly path using actual `resolveCatalogCandidates`.

Product code changes are allowed only for bounded corrections needed to satisfy TASK-082/083 semantics; Assembly implementation must not change.

# Inputs / contracts

Actual Catalog and Assembly module APIs, TASK-082/083 outputs and P4/P5 predecessor tests.

# Outputs / contracts

Product evidence only, plus bounded Catalog correction if required. No new downstream behavior.

# Acceptance criteria

- equivalent Catalog registration orders produce identical normalized dependency requirements and candidate results;
- exact and minimum constraints have positive and unsatisfied negative proofs;
- malformed constraints/versions fail explicitly;
- compatibility + version constraints compose deterministically;
- legacy exact `version` request tests remain green;
- real Assembly test still consumes `resolveCatalogCandidates` successfully with unchanged Assembly implementation;
- current P4 capability/PostgreSQL predecessor regression remains green under repository-wide verify;
- no transitive dependency closure, cycle/conflict graph diagnosis or materializer registry is implemented.

# Non-goals

P5-ASSEMBLY-GRAPH-01, P5-MATERIALIZER-REGISTRY-01, durable providers, production deployment, canonical contract changes.

# Evidence expected

Catalog positive/negative/order-independent tests, predecessor Assembly integration evidence and final repository-wide deterministic CI.

# Escalation

Stop if preserving predecessor Assembly requires changing Assembly implementation or if any canonical/L4 change becomes necessary.
