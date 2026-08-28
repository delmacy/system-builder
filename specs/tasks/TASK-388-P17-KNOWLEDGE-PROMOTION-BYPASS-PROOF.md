---
id: TASK-388
title: Prove cross-consumer promotion and reuse bypass resistance
status: verification
priority: 388
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-387
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-03.md
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-INTEGRATION-01.md
  - packages/catalog/**
  - packages/observe/**
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - tests/product/**
  - tooling/architecture/**
  - specs/tasks/TASK-388-P17-KNOWLEDGE-PROMOTION-BYPASS-PROOF.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
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
Prove representative catalog and Observe consumers cannot bypass canonical WBS 17.3 promotion/reuse authority or provenance validation.

# Context
Consumer integration is only complete if no path can reconstruct an admitted/promoted state from eligibility, genericity, model output or caller-controlled validation.

# Current behavior
Construction A proves the contract chain in isolation; TASK-385..387 add representative consumers, but cross-consumer bypass resistance requires an explicit growing negative proof.

# Inputs / contracts
- TASK-385..387 consumer integrations;
- TASK-379..384 canonical WBS 17.3 contracts and evaluators;
- closed WBS 17.1/17.2 predecessor evaluators and M15 human-decision contract.

# Outputs / contracts
Product/architecture proof that all representative promotion/reuse consumers preserve one canonical human-authoritative, payload-minimal provenance truth.

# Required change
Add proof-only tests/gates covering denied/ineligible predecessor truth, forged review readiness, deterministic/probabilistic substitution, actor/ref mismatch, malformed/duplicate provenance, caller-injected validator attempts and payload/content injection across catalog and Observe paths.

# Acceptance criteria
- no representative consumer admits/reports promotion from eligibility/transformation/genericity alone;
- only canonical human-authoritative promote truth can reach admitted promotion state;
- rejection remains observable as rejection and cannot be laundered into reuse;
- provenance is stable and payload-minimal across consumers;
- declared validations pass.

# Non-goals
No new product behavior beyond minimal proof fixtures/gates, no Decision Boundary change and no unrelated findings/TD remediation.

# Evidence expected
Growing product proof plus architecture fixture/gate where useful, with explicit positive and negative cases.

# Escalation
Stop if proof exposes a material authority bypass; materialize/correct it boundedly before TASK-389 rather than weakening the proof.
