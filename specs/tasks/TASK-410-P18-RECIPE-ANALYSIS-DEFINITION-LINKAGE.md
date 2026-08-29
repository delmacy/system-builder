---
id: TASK-410
title: Validate Recipe/process revision to Analysis and SystemDefinition lineage
status: ready
priority: 410
milestone: M18
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-409
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-03.md
  - project_docs/execution_planning/P18-PROCESS-SYSTEM-LINEAGE-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/contracts/process-versioning/**
  - packages/contracts/business-recipe/**
  - packages/contracts/system-analysis/**
  - packages/contracts/system-definition/**
allowed_paths:
  - packages/contracts/process-versioning/**
  - tests/product/**
  - specs/tasks/TASK-410-P18-RECIPE-ANALYSIS-DEFINITION-LINKAGE.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Satisfy the contract foundation of WBS 18.3.1 by deterministically validating the lineage from a canonical Recipe/process revision through System Analysis to SystemDefinition.

# Context
TASK-409 provides canonical WBS 18.3 lineage endpoint/hop primitives. This task composes only the upstream Recipe/process-revision -> SystemAnalysis -> SystemDefinition segment while preserving the semantics and ownership of the existing bounded-context contracts.

# Current behavior
Recipe, SystemAnalysis and SystemDefinition public contract surfaces exist, but the active package has no deterministic WBS 18.3 lineage validator binding those identities to one canonical process revision.

# Inputs / contracts
- TASK-409 lineage identity/hop descriptors;
- canonical process-versioning process artifact/revision identity;
- existing BusinessRecipe, SystemAnalysis and SystemDefinition public contract shapes;
- P18 Package 03 and Construction A boundaries.

# Outputs / contracts
Additive lineage composition/validation for the process revision -> analysis -> definition segment, with deterministic fail-closed identity and ordering checks and no mutation of predecessor contract semantics.

# Required change
Extend the process-versioning lineage contract so the analysis and definition hops are explicitly bound to the same canonical process artifact/revision and cannot be substituted, reordered or cross-linked across artifacts.

# Acceptance criteria
- canonical process revision is the upstream anchor;
- analysis and definition hops are explicit and ordered;
- mismatched process artifact/revision, missing/reversed hop, duplicate conflicting endpoint and cross-artifact substitution fail closed;
- existing BusinessRecipe/SystemAnalysis/SystemDefinition contracts are consumed as context without modifying their semantics;
- declared validations pass.

# Non-goals
No Release/Deployment linkage, persistence, compiler/runtime change or historical query.

# Evidence expected
Positive and negative predecessor-integration product tests using real public contract shapes where available.

# Escalation
Stop if linkage requires modifying existing public bounded-context semantics rather than additive lineage composition, or if L4 is discovered.