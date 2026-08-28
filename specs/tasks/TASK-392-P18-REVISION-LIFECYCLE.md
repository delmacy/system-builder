---
id: TASK-392
title: Define supersedes deprecated and archived revision semantics
status: ready
priority: 392
milestone: M18
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-390
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-01.md
  - project_docs/execution_planning/P18-PROCESS-VERSION-IDENTITY-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/contracts/process-versioning/**
allowed_paths:
  - packages/contracts/process-versioning/**
  - tests/product/**
  - specs/tasks/TASK-392-P18-REVISION-LIFECYCLE.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define WBS 18.1.3 explicit supersedes/deprecated/archived semantics for immutable business revisions.

# Context
WBS 18.1 lifecycle semantics must preserve the stable artifact and immutable revision identities established by TASK-390 while retaining revision history and remaining separate from semantic-change classification.

# Current behavior
TASK-390 provides the predecessor identity contract; explicit deterministic supersession, deprecation and archive relationship semantics are not yet implemented.

# Inputs / contracts
- TASK-390 stable artifact and immutable revision identity contract;
- `P18-PACKAGE-01` and `P18-PROCESS-VERSION-IDENTITY-CONTRACT-01` boundaries;
- WBS 18.1.3 lifecycle and revision-relationship requirement.

# Outputs / contracts
Deterministic lifecycle/relationship descriptors and product evidence for explicit supersession plus active, deprecated and archived revision states while preserving immutable history.

# Required change
Add deterministic lifecycle/relationship descriptors that preserve immutable revision identity, explicitly reference superseded revisions, and distinguish active, deprecated and archived states without deleting history.

# Acceptance criteria
- supersession references are explicit and cannot self-reference;
- deprecated/archive state does not rewrite prior revision identity;
- contradictory/malformed lifecycle state fails closed;
- archived/deprecated do not imply semantic diff classification;
- declared validations pass.

# Non-goals
No deletion policy, semantic breaking classification, approval workflow or deployment/release lifecycle.

# Evidence expected
Positive lifecycle and negative contradictory/self-reference product tests.

# Escalation
Stop for destructive history semantics, storage redesign or undeclared L4.