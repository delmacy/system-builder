---
id: TASK-482
title: Define derived elicitation traceability without semantic promotion
status: ready
priority: 482
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-481
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-02-ELICITATION-KNOWLEDGE-BASE.md
  - project_docs/execution_planning/G2-EKB-ADAPTIVE-UNDERSTANDING-01.md
  - packages/contracts/elicitation-knowledge-base/**
allowed_paths:
  - packages/contracts/elicitation-knowledge-base/**
  - tests/product/g2-elicitation-knowledge-base*.test.ts
  - specs/tasks/TASK-482-G2-EKB-DERIVED-TRACEABILITY.md
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
Define portable traceability links from elicitation answers/findings to requirement/constraint/story/use-case/scenario/acceptance/proof references while preserving each artifact's owner, revision and epistemic status.

# Context
Construction B must carry elicited knowledge forward without allowing a trace edge to become semantic authority. This task builds on explicit revision/currentness/provenance and negative-space coverage while keeping every target artifact owned by its existing external domain or decision owner.

# Current behavior
The EKB foundation preserves answer/finding lineage but does not yet expose a dedicated derived-artifact traceability contract that carries source/target revisions, derivation rationale and unresolved/currentness state without promoting source epistemic status.

# Inputs / contracts
- existing EKB answer/finding, revision, provenance/currentness and contradiction references;
- TASK-481 coverage and stakeholder/source evidence context;
- external requirement/constraint/story/use-case/scenario/acceptance/proof identities as references only.

# Outputs / contracts
- additive derivation/traceability contract(s) under `packages/contracts/elicitation-knowledge-base/**`;
- focused deterministic proof for revision pinning, epistemic preservation, supersession and stale/missing source handling;
- no target domain artifact implementation, workflow tooling or owner migration.

# Evidence expected
Proof must exercise source/target identity and revision pinning, explicit derivation kind/rationale/evidence refs, non-promotion of Claim/Assumption/InferredCandidate, historical supersession preservation, unresolved/stale currentness behavior and adversarial rejection of traceability-as-authority, latest-revision substitution, contradiction/negation erasure and canonical fan-out.

# Acceptance criteria
- source and target artifact identities/revisions are explicit;
- derivation kind and rationale/evidence refs are explicit;
- a derived story/use-case/scenario does not promote a Claim/Assumption/InferredCandidate to Fact/Decision/Requirement;
- supersession preserves historical source links;
- missing or stale source evidence yields explicit unresolved/currentness state rather than silently current traceability;
- target semantic owner remains external to EKB.

# Negative cases
Trace link treated as authority; latest-revision substitution; summary erases contradiction/negation; one source occurrence silently fans out as canonical truth; stale source treated as current acceptance evidence.

# Non-goals
Domain artifact implementation, backlog/workflow tooling, Product Proof execution, UI, persistence, WP-03+ semantics.