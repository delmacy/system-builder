---
id: TASK-387
title: Project promotion decision provenance into representative observe path
status: verification
priority: 387
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-386
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-03.md
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-INTEGRATION-01.md
  - packages/observe/**
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - packages/observe/**
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-387-P17-OBSERVE-KNOWLEDGE-PROMOTION-PROVENANCE.md
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
Project canonical WBS 17.3 promotion/rejection provenance into a representative observe path without exposing sensitive payload or allowing caller-injected validation.

# Context
WBS 17.3.3 requires durable promotion/rejection provenance. Existing Observe integration covers WBS 17.2 enforcement references but not final promotion/rejection truth.

# Current behavior
`packages/observe/**` has no bounded projection for canonical WBS 17.3 promotion decision provenance.

# Inputs / contracts
- TASK-386 canonical catalog promotion/reuse admission decision/reference;
- TASK-383/TASK-384 canonical promotion/rejection provenance;
- existing Observe reference/evidence semantics.

# Outputs / contracts
A payload-minimal observe-facing projection of promotion/rejection status, human authority reference and predecessor provenance references.

# Required change
Add an additive Observe projection that performs validation inside the boundary using canonical WBS 17.3 normalization/evaluation, rejects malformed/duplicate/mismatched references and payload/content fields, and never accepts a caller-supplied normalizer or validator.

# Acceptance criteria
- promotion/rejection provenance is internally validated and reference-complete;
- malformed refs, duplicate evidence, authority mismatch and payload/content injection fail closed;
- caller cannot inject/replace the canonical validator/normalizer;
- deterministic/probabilistic evidence is observable only as evidence and never as promotion authority;
- declared validations pass.

# Non-goals
No telemetry backend redesign, Runtime Audit Trail replacement, Decision Boundary change or new promotion authority.

# Evidence expected
Product and architecture tests proving valid projection plus bad/good fixtures for validator-injection and malformed provenance cases.

# Escalation
Stop if Observe integration requires weakening internal validation or changing Decision Boundary/public authority semantics.
