---
id: TASK-386
title: Gate catalog promotion and reuse admission on canonical human decision
status: completed
priority: 386
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-385
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-03.md
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-INTEGRATION-01.md
  - packages/catalog/**
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/decision-boundary/**
allowed_paths:
  - packages/catalog/**
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-386-P17-CATALOG-KNOWLEDGE-PROMOTION-ADMISSION.md
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
Gate representative catalog promotion/reuse admission on the canonical final WBS 17.3 promotion decision backed by real M15 `human-decision` authority.

# Context
TASK-385 may establish review readiness, but only the canonical final human-authoritative promotion decision may permit promotion/reuse admission.

# Current behavior
No catalog consumer composes WBS 17.3 final promotion/rejection truth with the existing catalog boundary.

# Inputs / contracts
- TASK-385 catalog pre-admission result;
- TASK-383/TASK-384 final promotion/rejection composition and proof;
- canonical M15 Decision Boundary as an immutable input contract.

# Outputs / contracts
A bounded catalog promotion/reuse admission result that records stable references to the canonical decision and provenance without carrying content.

# Required change
Add an additive catalog admission helper that internally validates the canonical final promotion/rejection result and admits only a human-authoritative `promote` decision whose actor/reference identity matches the M15 boundary. Reject `reject`, deterministic/probabilistic substitution, actor/ref mismatch, forged predecessor state and payload/content injection.

# Acceptance criteria
- only canonical M15 `human-decision` promotion truth can yield admission;
- eligibility, transformation, genericity or model evidence alone never yields admission;
- deterministic/probabilistic substitution and actor/ref mismatch fail closed;
- outputs preserve references/provenance and remain payload-minimal;
- Decision Boundary public contract is untouched and declared validations pass.

# Non-goals
No automatic approval, new authority category, Decision Boundary modification, catalog schema migration or raw content carriage.

# Evidence expected
Product tests with real WBS 17.1 -> 17.2 -> 17.3 composition and canonical M15 human decisions, including required negative substitutions.

# Escalation
Stop if admission cannot prove the required human authority without changing the public Decision Boundary contract.
