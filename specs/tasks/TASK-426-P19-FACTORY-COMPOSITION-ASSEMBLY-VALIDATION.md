---
id: TASK-426
title: Compose assembly and validation from canonical definition lineage
status: blocked
priority: 426
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-425
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-FACTORY-COMPOSITION-01.md
  - packages/assembly/**
  - packages/validation/**
  - packages/contracts/system-definition/**
  - packages/contracts/factory-boundary/**
allowed_paths:
  - packages/assembly/**
  - packages/validation/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
  - specs/tasks/TASK-426-P19-FACTORY-COMPOSITION-ASSEMBLY-VALIDATION.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/contracts/decision-boundary/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Compose AssemblyPlan and ValidationEvidence from the canonical SystemDefinition/capability lineage using existing public module behavior and no hand-authored downstream fixture stitching.

# Context
TASK-425 provides the exact canonical upstream definition/capability lineage. This TASK composes only the assembly and validation stages required by WBS 19.1.2.

# Current behavior
Assembly and validation exist as bounded behaviors, but this Sprint has not yet proven that their successor identities derive solely from the exact canonical predecessor lineage.

# Required change
Drive assembly and validation from the exact predecessor identities produced by TASK-425, preserving deterministic provenance and rejecting substituted, stale, missing or cross-system inputs.

# Inputs / contracts
Canonical SystemDefinition and capability-resolution identity/provenance from TASK-425 plus existing public assembly and validation contracts/APIs.

# Outputs / contracts
AssemblyPlan and ValidationEvidence derived deterministically from exact predecessor identity with preserved provenance.

# Acceptance criteria
- AssemblyPlan is derived through existing public assembly behavior;
- ValidationEvidence is derived from the exact assembled predecessor identity;
- no manually authored successor identity is accepted as canonical;
- stale/missing/substituted/cross-system inputs fail closed;
- declared validations pass.

# Non-goals
Compiler/release/deploy composition, runtime launch, publication side effects, persistence redesign, Decision Boundary changes or WBS 19.1.3 command/API scope.

# Evidence expected
Focused product evidence for deterministic assembly/validation derivation and rejection of stale, missing, substituted and cross-system predecessors, plus passing declared validations.

# Escalation
Stop for new bounded-context ownership, destructive contract replacement or undeclared L4.
