---
id: TASK-340
title: Define deterministic execution governance evaluation
status: completed
priority: 340
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-02.md
  - project_docs/execution_planning/P16-AI-EXECUTION-GOVERNANCE-INTEGRATION-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-340-P16-GOVERNANCE-EVALUATION.md
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
Add a deterministic, provider-neutral evaluator for the already-integrated execution-governance rules.

# Context
Construction A defines explicit routing eligibility, budget/quota and fallback contracts but does not yet produce an invocation-time evaluation result.

# Current behavior
Rules normalize deterministically but are not evaluated against explicit invocation inputs.

# Inputs / contracts
- `ExecutionGovernancePolicyDescriptor` and `ExecutionGovernanceRuleSet`;
- `ModelCapabilityDescriptor`;
- explicit budget/quota usage values supplied by the caller.

# Outputs / contracts
A deterministic evaluation result that distinguishes eligible/ineligible conditions and explicit limit/fallback disposition without provider identity, ranking or lookup.

# Required change
Implement pure evaluation that checks required capabilities and explicit usage against declared limits. Fallback state must remain derived only from declared fallback rules; no default or provider selection may be invented.

# Acceptance criteria
- missing required capabilities fail closed as ineligible;
- usage above an explicit budget/quota limit fails closed;
- valid explicit inputs produce stable deterministic results;
- fallback is represented only when explicitly declared;
- no provider identity/ranking, network, secret, storage or authority inference exists;
- declared validations pass.

# Non-goals
No adapter invocation, provider registry, routing provider selection, pricing lookup, secret handling, WBS 16.3 or authorization semantics.

# Evidence expected
Focused product tests covering eligible, missing-capability, over-limit and explicit-fallback cases plus canonical stability.

# Escalation
Stop if evaluation semantics require external provider state or architecture beyond the materialized governance contracts.
