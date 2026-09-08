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

# Context
Construction A established multidimensional sufficiency and conservative coverage states, while TASK-480 adds capability-aware routing. This task materializes only the negative-space/stakeholder evidence shape needed to show what expected populations, sources or applicable dimensions remain unobserved.

# Current behavior
The EKB can represent coverage and unresolved obligations but does not yet have a dedicated record family for expected-but-unobserved stakeholder/source cohorts and negative-space discovery that preserves locality, population and applicability semantics.

# Required change
Add only the EKB-owned negative-space and stakeholder/source coverage records needed to represent expected populations, sources and applicable dimensions that are missing, stale, insufficient or conflicting, while preserving locality/population scope and qualified applicability without converting absence into a substantive answer.

# Inputs / contracts
- existing EKB coverage/sufficiency/currentness and contradiction references;
- TASK-480 capability-lens routing context;
- stakeholder/source population, locality and applicability references;
- external evidence/decision semantics through existing predecessor references only.

# Outputs / contracts
- additive negative-space and stakeholder/source coverage record contract(s) under `packages/contracts/elicitation-knowledge-base/**`;
- focused proof that missing, stale or insufficient evidence remains conservative and cannot manufacture completeness;
- no survey UI, persistence, analytics scoring or identity/auth ownership.

# Evidence expected
Deterministic happy/negative/adversarial proof must cover explicit population/locality scope, UNKNOWN/PARTIAL/UNTOUCHED for expected-but-unobserved cohorts, qualified `NOT_APPLICABLE`, preservation of conflicting stakeholder claims, stale/insufficient evidence non-strengthening, HIGH/CRITICAL blockers, Fleet/local cohort separation and rejection of no-response/no-evidence coercions.

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

# Escalation
Any need to define identity/auth ownership, add analytics/scalar scoring, promote missing evidence to resolved truth, strengthen Fleet coverage into local coverage, or modify predecessor evidence/decision authority must stop this TASK and return to change-control.