---
id: TASK-086
title: Diagnose Assembly graph cycles and requirement conflicts
status: ready
priority: 394
milestone: M6
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-085
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P5-PACKAGE-01.md
  - project_docs/execution_planning/P5-ASSEMBLY-GRAPH-01.md
  - specs/tasks/TASK-085-ASSEMBLY-TRANSITIVE-CLOSURE.md
  - project_docs/05-catalog/WBS.md
  - project_docs/06-assembly/WBS.md
  - packages/catalog/index.ts
  - packages/assembly/index.ts
  - tests/product/catalog-resolution.test.ts
  - tests/product/assembly.test.ts
  - specs/tasks/TASK-086-ASSEMBLY-GRAPH-DIAGNOSTICS.md
allowed_paths:
  - packages/assembly/index.ts
  - tests/product/assembly.test.ts
  - specs/tasks/TASK-086-ASSEMBLY-GRAPH-DIAGNOSTICS.md
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

Make Assembly graph failure behavior deterministic and fail-closed for cycles, unresolved transitive dependencies and incompatible multi-path requirements.

# Required change

Using TASK-085 closure as predecessor, add reproducible graph diagnostics for:

- dependency cycles with a deterministic cycle path;
- a dependency requirement that resolves to no compatible provider;
- the same capability reached through multiple paths whose exact/minimum/compatibility requirements cannot be satisfied by one selected candidate;
- divergent provider/version selections for one coalesced capability.

Diagnostics must be stable across equivalent root, dependency and Catalog registration orderings. Do not broaden Catalog range semantics or add Compiler/materializer behavior.

# Acceptance criteria

- cycle input fails with deterministic cycle evidence and no AssemblyPlan;
- unsatisfied transitive requirement fails explicitly and names the affected capability/reason;
- incompatible multi-path requirements fail deterministically rather than selecting arbitrarily;
- equivalent graph orderings yield byte-equivalent diagnostic structures;
- compatible duplicate paths remain successful;
- predecessor root-only and successful transitive proofs remain green;
- no canonical contract or L4 change is introduced.

# Non-goals

General SAT/range solver, caret/tilde/wildcards, provider scoring, materializer registry, durable persistence, Compiler changes.

# Evidence expected

Focused negative graph tests plus positive predecessor regression and repository-wide verification.

# Escalation

Stop if conflict semantics require a new general version policy or canonical cross-suite contract beyond the bounded exact/minimum model.
