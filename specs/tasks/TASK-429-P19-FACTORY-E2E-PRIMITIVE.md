---
id: TASK-429
title: Expose canonical factory E2E invocation primitive
status: ready
priority: 429
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-PACKAGE-01-CONSOLIDATED-PREALPHA.md
  - project_docs/execution_planning/P19-FACTORY-E2E-01.md
  - project_docs/19-pre-alpha-productization/WBS.md
  - packages/contracts/factory-boundary/**
  - packages/catalog/**
  - packages/assembly/**
  - packages/validation/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
allowed_paths:
  - packages/contracts/factory-boundary/**
  - tests/product/**
  - specs/tasks/TASK-429-P19-FACTORY-E2E-PRIMITIVE.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/postgres/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Expose the smallest deterministic E2E invocation primitive over the already integrated WBS 19.1.2 composition path, preserving exact canonical predecessor identity and existing public package ownership.

# Context
WBS 19.1.2 is integrated and proves deterministic composition across catalog, assembly, validation, compiler, release-preview and deployment dry-run behavior. WBS 19.1.3 requires a supported complete-journey invocation without creating a parallel implementation.

# Current behavior
The complete composition is proven through product integration code/tests, but there is no single bounded invocation primitive designated for a repository-supported clean E2E command/API.

# Required change
Add only the public/additive factory-boundary invocation needed to call the existing composition sequence as one deterministic operation. Reuse existing public module APIs and exact predecessor identities; do not reimplement stage logic or infer missing predecessors.

# Inputs / contracts
Canonical approved/versioned process, analysis and SystemDefinition lineage from the integrated factory-journey contract plus the existing WBS 19.1.2 composition APIs.

# Outputs / contracts
One deterministic complete-journey result carrying auditable stage identities/provenance and preserving existing module-owned outputs.

# Acceptance criteria
- invocation begins from canonical integrated factory input/lineage;
- existing public package APIs remain the source of truth for every stage;
- result exposes sufficient deterministic identity/provenance to audit the complete composed journey;
- missing, incompatible or substituted canonical predecessor identity fails closed;
- no publication, deployment execution, runtime launch, persistence or external side effect occurs;
- declared validations pass.

# Non-goals
Repository CLI wiring, operator UX, runtime launch, persistence, publication/deployment execution, new bounded contexts, Decision Boundary changes, Builder/Runtime topology changes and WBS 19.2.1+.

# Evidence expected
Focused product evidence that the new primitive invokes the real integrated composition path, preserves exact lineage and rejects invalid predecessor identity without side effects.

# Escalation
Stop if implementation requires a new bounded context, topology/ownership change, destructive public-contract replacement or undeclared L4.