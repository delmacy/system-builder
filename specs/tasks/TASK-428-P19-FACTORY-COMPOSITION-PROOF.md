---
id: TASK-428
title: Prove deterministic factory composition end to end
status: blocked
priority: 428
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-427
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-FACTORY-COMPOSITION-01.md
  - project_docs/19-pre-alpha-productization/WBS.md
  - packages/contracts/factory-boundary/**
  - packages/catalog/**
  - packages/assembly/**
  - packages/validation/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
allowed_paths:
  - tests/product/**
  - packages/contracts/factory-boundary/**
  - packages/catalog/**
  - packages/assembly/**
  - packages/validation/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - specs/tasks/TASK-428-P19-FACTORY-COMPOSITION-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/postgres/**
  - packages/contracts/decision-boundary/**
max_files: 14
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove WBS 19.1.2 as one deterministic composition chain over real predecessor APIs and the integrated WBS 19.1.1 journey contract.

# Context
TASK-424..427 define the serial composition path from the integrated journey contract through deterministic downstream identity evidence. This TASK supplies the growing package proof for WBS 19.1.2 only.

# Current behavior
The individual composition stages are planned serially, but no focused Sprint proof yet exercises the complete path and its adversarial predecessor failures without hand-authored downstream fixture stitching.

# Required change
Add focused product evidence that starts from canonical approved/versioned process identities and exercises the composed module path through deployment-record evidence without hand-authored downstream fixture stitching. Add adversarial cases for missing, stale, incompatible and lineage-broken inputs.

# Inputs / contracts
Integrated WBS 19.1.1 journey contract plus the real composition behaviors produced by TASK-424..427 across catalog, assembly, validation, compiler, release and deploy public boundaries.

# Outputs / contracts
Deterministic end-to-end WBS 19.1.2 evidence demonstrating exact identity/provenance propagation and fail-closed invalid predecessor handling without external side effects.

# Acceptance criteria
- positive proof exercises the real composed module path and canonical journey identities;
- repeated identical input produces deterministic identity/provenance output;
- missing, stale, incompatible and lineage-broken inputs fail closed at the appropriate boundary;
- evidence proves no downstream fixture substitution is needed;
- no publication, deployment execution or runtime launch is introduced;
- declared validations pass.

# Non-goals
WBS 19.1.3 command/API entrypoint, runtime launch, publication/deployment execution, external environment mutation, new bounded contexts, Decision Boundary changes or inferred L4.

# Evidence expected
Focused positive/repeatability/predecessor-integration product tests plus adversarial missing, stale, incompatible and lineage-broken cases, with repository-wide verification and exact-head CI/Heavy evidence at Sprint boundary.

# Escalation
Stop if proof requires WBS 19.1.3 command/API scope, runtime launch, external side effects or undeclared L4.
