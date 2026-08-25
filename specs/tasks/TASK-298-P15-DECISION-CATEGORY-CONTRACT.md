---
id: TASK-298
title: Define canonical decision category contract
status: ready
priority: 298
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-CONTRACT-01.md
  - project_docs/15-deterministic-human-probabilistic-boundary/WBS.md
  - project_docs/15-deterministic-human-probabilistic-boundary/scope/README.md
  - docs/adr/ADR-0010-durable-human-approval.md
allowed_paths:
  - packages/contracts/decision-boundary/**
  - specs/contracts/**
  - tests/product/**
  - specs/tasks/TASK-298-P15-DECISION-CATEGORY-CONTRACT.md
forbidden_paths:
  - .github/**
  - docs/adr/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define the minimum canonical contract that distinguishes deterministic, human-decision and probabilistic decision points.
# Context
WBS 15.1.1 requires an explicit taxonomy so decision nature is not inferred from implementation details.
# Current behavior
Decision nature is represented only indirectly across existing contracts and governance mechanisms; there is no reusable product contract for this boundary.
# Required change
Add a strict additive provider-neutral decision category vocabulary and minimal versioned descriptor suitable for reuse by later guard/evaluation work.
# Inputs / contracts
WBS 15, current contract conventions, ADR-0010 as a human-authority boundary that must not be replaced.
# Outputs / contracts
A reusable decision-boundary contract with exactly the canonical categories required by WBS and deterministic validation of its base shape.
# Acceptance criteria
The three categories are explicit and unambiguous; unknown categories fail; descriptors are deterministic and backward-compatible as an additive contract; no category itself grants execution or authorization authority.
# Non-goals
No provider invocation, policy engine, human-approval receipt replacement, runtime topology, model registry or inference execution.
# Evidence expected
Focused contract/product tests plus repository validation.
# Escalation
Stop only if the task requires changing an existing architecture boundary or human-approval semantics rather than adding the bounded contract.
