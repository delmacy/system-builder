---
id: TASK-375
title: Gate AI Gateway pre-send path with P17 knowledge enforcement
status: completed
priority: 375
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-378
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-02.md
  - project_docs/execution_planning/P17-KNOWLEDGE-ENFORCEMENT-INTEGRATION-01.md
  - packages/contracts/ai-gateway/**
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-375-P17-AI-GATEWAY-KNOWLEDGE-ENFORCEMENT-INTEGRATION.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/decision-boundary/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Compose the P17 enforcement decision with the existing AI Gateway governed pre-send path, preserving all P16 controls.

# Context
AI Gateway currently evaluates P16 `DataKnowledgeBoundaryDescriptor`; WBS 17.2 additionally requires P17 knowledge-use enforcement. TASK-378 is a bounded conformance prerequisite that removes caller authority over validation in the preceding Observe integration.

# Current behavior
`invokeGovernedModelProvider` has no P17 enforcement input and can only evaluate the predecessor P16 allow-list boundary. The preceding Observe integration must first pass the TASK-378 correction gates so Construction B does not advance with a caller-bypassable validation seam.

# Inputs / contracts
- existing governed invocation + P16 pre-send boundary;
- TASK-367..372 P17 enforcement and payload-minimal reference contracts;
- completed TASK-378 observe-validator authority correction.

# Outputs / contracts
An additive, backward-compatible P17 enforcement gate on the governed invocation path, with explicit result/reference propagation when supplied.

# Required change
When P17 enforcement evidence is supplied, validate it fail-closed before adapter invocation. P17 enforcement must not weaken or replace P16 pre-send checks; both applicable gates must pass. No hidden default enforcement may be injected.

# Acceptance criteria
- denied/isolate/ineligible P17 state blocks provider invocation;
- malformed/mismatched enforcement fails closed;
- valid P17 state plus valid P16 boundary permits the existing path;
- P16-only historical callers remain backward-compatible;
- payload/provider secret material is not added to P17 reference metadata;
- TASK-378 is completed on an exact-head validated correction before this TASK executes;
- declared validations pass.

# Non-goals
No provider registry/routing change, WBS 17.3, secret lifecycle change or Decision Boundary edits.

# Evidence expected
Product tests proving adapter-not-called negatives and compatible positive composition through actual `invokeGovernedModelProvider`.

# Escalation
Stop if composition requires weakening existing P16 security/governance semantics.
