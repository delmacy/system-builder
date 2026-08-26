---
id: TASK-309
title: Define decision-boundary verification result contract
status: ready
priority: 309
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-VERIFICATION-01.md
  - packages/contracts/decision-boundary/index.ts
  - docs/adr/ADR-0010-durable-human-approval.md
allowed_paths:
  - packages/contracts/decision-boundary/**
  - tests/product/**
  - specs/tasks/TASK-309-P15-DECISION-BOUNDARY-VERIFICATION-RESULT.md
forbidden_paths:
  - docs/adr/**
  - tooling/agent-harness/policies/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Add a provider-neutral deterministic verification result for canonical decision-boundary descriptors and category metadata.

# Context
P15-PACKAGE-01 established the canonical categories, risk/criticality and authority guards; WBS 15.3.1 now requires dedicated checks.

# Current behavior
Normalization and authority guards exist, but there is no reusable verification result that classifies valid, rejected and invalid boundary evidence without implying authorization.

# Required change
Add a minimal additive verification result/evaluator over existing boundary contracts, fail closed on malformed or category-incompatible evidence, and prove backward compatibility.

# Inputs / contracts
DecisionBoundaryDescriptor, DecisionCategoryMetadata, DecisionRiskCriticality and existing guard semantics.

# Outputs / contracts
Provider-neutral verification result with explicit status/diagnostic/reference fields; no approval/authorization field.

# Acceptance criteria
- deterministic valid/rejected/invalid outcomes;
- malformed/unknown data fails explicitly;
- category/risk/criticality references are preserved;
- result cannot be interpreted as human approval or execution authority;
- no provider/network/secret behavior;
- declared validations pass.

# Non-goals
No provider invocation, audit storage, Runtime Audit Trail replacement, policy engine or L4 change.

# Evidence expected
Product tests covering positive, negative and malformed cases plus repository verification.

# Escalation
Stop if implementation requires changing authorization/human-approval architecture or any path outside the declared bounds.