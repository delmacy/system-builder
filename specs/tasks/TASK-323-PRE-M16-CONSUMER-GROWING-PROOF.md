---
id: TASK-323
title: Close PRE-M16 consumer interoperability growing proof
status: ready
priority: 323
milestone: PRE-M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-321
  - TASK-322
context_paths:
  - project_docs/execution_planning/PRE-M16-CONFORMANCE-INTEGRATION-01.md
  - specs/tasks/TASK-321-PRE-M16-COMPILER-CONSUMER-CONFORMANCE.md
  - specs/tasks/TASK-322-PRE-M16-AUDIT-CONSUMER-CONFORMANCE.md
  - packages/contracts/system-definition/**
  - packages/contracts/decision-boundary/**
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/**
  - specs/tasks/TASK-323-PRE-M16-CONSUMER-GROWING-PROOF.md
forbidden_paths:
  - packages/compiler/**
  - packages/runtime/**
  - project_docs/16-ai-gateway/**
max_files: 6
validation:
  - npm run test:unit
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Close Construction B with one integrated proof that the two PRE-M16 hardenings remain compatible through representative real consumers and that no residual bounded construction is needed.

# Required change
Add an integrated product regression composing canonical SystemDefinition publication/import identity, representative Compiler projections, canonical decision verification/audit trust, and existing authority boundaries; produce the Sprint Report with explicit Construction C disposition.

# Acceptance criteria
- the actual Compiler projection path operates with the hardened canonical SystemDefinition extensions;
- canonical audit verification remains trusted only when established by the official verification boundary;
- forged/reconstructed matching verification fails closed;
- deterministic/human/probabilistic semantics and human-reserved authority remain unchanged;
- no production Compiler/Runtime code or M16 provider behavior is added;
- Sprint Report states whether Construction C is required from evidence;
- declared validations pass.

# Non-goals
No M16/M17 implementation, unrelated productization, carried-debt absorption or architecture redesign.

# Evidence expected
Integrated product regression plus Sprint Report and exact-head repository gates.

# Escalation
Stop if a residual Package Goal gap requires unmaterialized product behavior, breaking compatibility or an L4 architecture decision.
