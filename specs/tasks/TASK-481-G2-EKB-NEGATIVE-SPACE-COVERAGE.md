---
id: TASK-481
title: Define negative-space and stakeholder coverage records
status: ready
priority: 481
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-480
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-02-ELICITATION-KNOWLEDGE-BASE.md
  - project_docs/execution_planning/G2-EKB-ADAPTIVE-UNDERSTANDING-01.md
  - packages/contracts/elicitation-knowledge-base/**
allowed_paths:
  - packages/contracts/elicitation-knowledge-base/**
  - tests/product/g2-elicitation-knowledge-base*.test.ts
  - specs/tasks/TASK-481-G2-EKB-NEGATIVE-SPACE-COVERAGE.md
  - project_docs/execution_planning/G2-EKB-ADAPTIVE-UNDERSTANDING-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/evidence-provenance/**
max_files: 7
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Represent negative-space discovery and stakeholder/source coverage explicitly so missing voices, missing evidence and unasked applicable dimensions cannot be mistaken for zero, false, not-applicable or complete.

# Acceptance criteria
- stakeholder/source population and locality scopes are explicit;
- expected-but-unobserved coverage is represented as UNKNOWN/PARTIAL/UNTOUCHED as applicable, never implicit zero;
- NOT_APPLICABLE requires explicit qualified rationale/evidence;
- conflicting stakeholder claims remain separate records and route through existing contradiction semantics;
- stale or insufficient source evidence cannot strengthen current coverage;
- HIGH/CRITICAL missing stakeholder/source obligations block false sufficiency.

# Negative cases
No response == false; no evidence == zero; missing stakeholder == not-applicable; aggregate Fleet coverage masks local missing cohort; stale interview treated as current.

# Non-goals
Survey/UI implementation, identity/auth implementation, persistence, analytics scoring, Production Readiness.