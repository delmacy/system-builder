---
id: TASK-335
title: Define routing budget quota and fallback rule contracts
status: ready
priority: 335
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-334
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-02.md
  - project_docs/execution_planning/P16-AI-EXECUTION-GOVERNANCE-CONTRACT-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-335-P16-ROUTING-BUDGET-FALLBACK-CONTRACT.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define explicit provider-neutral routing, budget/quota and fallback rule contracts under the governance policy root.

# Context
WBS 16.2.1 requires governance rules to be explicit rather than adapter/provider hidden behavior.

# Current behavior
The canonical invocation seam has no central routing/budget/quota/fallback rule representation.

# Inputs / contracts
- TASK-334 execution-governance policy descriptor;
- integrated WBS 16.1 AI Gateway contracts.

# Outputs / contracts
- versioned rule descriptors for routing eligibility, budget/quota bounds and explicit fallback allowance/order semantics;
- deterministic fail-closed normalization and tests.

# Required change
Represent governance rules as data without executing provider selection or remote fallback. Require explicit values and reject ambiguous/invalid/duplicate rule shapes.

# Acceptance criteria
- routing/budget/quota/fallback rules are explicit and provider-neutral;
- no hidden fallback/default provider is introduced;
- invalid or ambiguous rules fail closed;
- normalization is deterministic;
- no authorization semantics are fabricated;
- declared validations pass.

# Non-goals
No provider registry, provider-specific IDs in central contracts, live routing engine, remote invocation, pricing integration or WBS 16.3 work.

# Evidence expected
Product tests covering valid rules, invalid bounds, duplicate/ambiguous rules and absence of hidden defaults.

# Escalation
Stop if rules require provider registry/topology or architecture changes outside the materialized contract boundary.
