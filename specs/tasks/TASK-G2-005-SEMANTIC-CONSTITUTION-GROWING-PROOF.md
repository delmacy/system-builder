---
id: TASK-G2-005
title: Prove semantic identity revision and graph constitution end to end
status: committed
priority: 1005
milestone: G2-WP-01
model_tier: strong
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-G2-001, TASK-G2-002, TASK-G2-003, TASK-G2-004]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-PLANNING-MATERIALIZATION-01.md
  - project_docs/execution_planning/G2-SEMANTIC-IDENTITY-REVISION-CONTRACT-01.md
  - packages/contracts/**
  - tests/product/**
allowed_paths:
  - packages/contracts/**
  - tests/product/**
  - specs/tasks/TASK-G2-005-SEMANTIC-CONSTITUTION-GROWING-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Extend the real product proof through the complete Construction A semantic constitution without hand-authoring downstream substitutes for existing executable contract APIs.

# Acceptance criteria
- one semantic entity retains canonical identity across multiple revisions and changing provider/external identifiers;
- predecessor and successor revisions remain independently addressable;
- typed node/edge owner/evidence/currentness qualification survives normalization/serialization;
- stale/superseded revision and invalid owner/evidence/currentness are rejected or explicitly classified without invented truth;
- `PARTIAL` and `UNKNOWN` remain visible;
- attempted graph/remote claim authority strengthening is prevented;
- proof is deterministic and side-effect free;
- all declared validations pass.

# Negative/adversarial cases
Provider-ID reuse, out-of-order revisions, duplicate revision, stale endpoint, missing owner/evidence, unknown locality/population and attempted `UNKNOWN -> stronger` promotion.

# Non-goals
No Construction B federation implementation, domain authorization, workflow execution, provider cutover, data migration, deployment or physical actuation.

# Escalation
Stop if the growing proof reveals a material G2-WBS-01 architecture contradiction rather than a bounded implementation defect.