---
id: TASK-465
title: Define temporal and currentness qualification
status: ready
priority: 465
milestone: G2
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-464
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-SEMANTIC-CONSTITUTION.md
  - project_docs/execution_planning/G2-SEMANTIC-CONTRACT-FOUNDATION-01.md
  - specs/tasks/TASK-464-G2-REVISION-VECTOR.md
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/semantic-substrate/**
  - tests/product/g2-semantic-substrate*.test.ts
  - specs/tasks/TASK-465-G2-CURRENTNESS-TEMPORAL.md
  - project_docs/execution_planning/G2-SEMANTIC-CONTRACT-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/evidence-provenance/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Add portable temporal/currentness qualification so provenance or a prior PASS cannot silently become timeless current truth.

# Context
G2 distinguishes occurrence, observation, evaluation, effective and reconciliation time where material. Current bounded provenance contracts do not provide generic currentness/applicability qualification.

# Current behavior
Existing timestamps and provenance are domain-scoped. No reusable structural currentness horizon or explicit insufficient/unknown qualification exists.

# Required change
Define bounded temporal coordinates and a currentness/applicability qualification shape that can carry subject/revision scope, observation/effective times where applicable, population/locality scope, freshness/currentness horizon and an explicit insufficient/unknown state without evaluating domain truth.

# Inputs / contracts
TASK-463/464 identity and revision primitives; existing evidence-provenance contracts as precedent only.

# Outputs / contracts
Portable temporal/currentness structures and deterministic validation tests.

# Acceptance criteria
- temporal roles are explicit rather than represented by one ambiguous timestamp;
- currentness qualification is revision/scope aware;
- insufficient/unknown currentness remains explicit and cannot become PASS by default;
- provenance/source presence does not imply truth, authority or currentness;
- stale qualification cannot rewrite historical producing revision evidence;
- invalid temporal ranges or missing required scope fail closed;
- existing evidence-provenance contracts remain unchanged;
- declared validations pass.

# Non-goals
Observability SLIs/SLOs, domain-specific freshness policy, EKB coverage, production readiness scoring or reconciliation execution.

# Evidence expected
Focused deterministic tests for temporal-role distinction, stale/unknown qualification, scope requirements and historical preservation.

# Escalation
Stop if this task requires a universal truth evaluator, domain freshness policy or modification of bounded evidence owners.