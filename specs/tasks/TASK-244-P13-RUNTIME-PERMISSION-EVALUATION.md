---
id: TASK-244
title: Evaluate deterministic Runtime permissions with auditable allow deny decisions
status: ready
priority: 244
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-243]
context_paths:
  - packages/runtime-core/**
  - project_docs/27-identity-organization-authorization/WBS.md
allowed_paths:
  - packages/runtime-core/**
  - tests/product/runtime*.test.ts
  - specs/tasks/TASK-244-P13-RUNTIME-PERMISSION-EVALUATION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/compiler/**
max_files: 12
validation: [npm run test:product, npm run check:tasks, npm run verify]
---
# Objective
Evaluate declared role/resource/actions against resolved actor authority and return deterministic auditable allow/deny outcomes.

# Context
TASK-243 provides explicit resolved role/membership context under WBS 27 authorization authority.

# Current behavior
Runtime has no shared deterministic permission decision path for the Construction B descriptors.

# Required change
Evaluate exact declared permission references against resolved authority with default-deny behavior and bounded decision evidence.

# Inputs / contracts
Use TASK-243 resolved role/membership context and the RuntimeModel permission descriptors from TASK-242.

# Outputs / contracts
Deterministic allow/deny decisions with reference/reason evidence suitable for shared Runtime gating.

# Acceptance criteria
Default deny; exact declared action/resource matching; no wildcard/permissive fallback unless explicitly represented by current contract; decision evidence contains references/reasons but no secrets.

# Non-goals
Do not infer privilege, add an unbounded policy engine, change contracts/compiler, or emit secret/session credential values.

# Evidence expected
Runtime tests demonstrate deterministic allow/deny, default deny and secret-free decision evidence; repository verification passes.

# Escalation
Stop if correct evaluation requires semantics not represented by the authorized descriptors or an L4 change.
