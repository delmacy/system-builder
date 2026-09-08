---
id: TASK-483
title: Prove integrated adaptive EKB understanding and coexistence
status: ready
priority: 483
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-482
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-02-ELICITATION-KNOWLEDGE-BASE.md
  - project_docs/execution_planning/G2-EKB-ADAPTIVE-UNDERSTANDING-01.md
  - packages/contracts/elicitation-knowledge-base/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/elicitation-knowledge-base/**
  - tests/product/g2-elicitation-knowledge-base*.test.ts
  - specs/tasks/TASK-483-G2-EKB-ADAPTIVE-INTEGRATION-PROOF.md
  - project_docs/execution_planning/G2-EKB-ADAPTIVE-UNDERSTANDING-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/knowledge-boundary/**
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
Close Construction B with an integrated deterministic proof across adaptive follow-up, capability-lens routing, negative-space/stakeholder coverage and derived traceability on top of the immutable Construction A foundation.

# Acceptance criteria
- follow-up selection remains gap/context/stage driven and fails inconclusive when required inputs are absent;
- lens routing never clones semantic ownership or chooses winners by ordering/confidence;
- missing stakeholder/source coverage remains conservative UNKNOWN/PARTIAL/UNTOUCHED and cannot be scalar-masked;
- derived traceability preserves source/target revisions, provenance, currentness, contradiction and epistemic state;
- HIGH/CRITICAL unresolved obligations still prevent false stage PASS;
- Fleet/global evidence cannot strengthen local coverage;
- predecessor contracts remain unchanged with no reverse dependency;
- no persistence, UI/Wizard, AI/provider execution, domain adoption, WP-03+ or Production Readiness claim is introduced.

# Mandatory adversarial cases
Missing context defaulting; owner cloning; first-match routing; missing stakeholder == N/A; no evidence == zero; stale source promoted; traceability == authority; latest-revision substitution; contradiction erased by summary; scalar completion masking.

# Escalation
Any need for new runtime/service topology, persistence owner, destructive predecessor edit or foreign semantic ownership must be recorded for later planning rather than absorbed.