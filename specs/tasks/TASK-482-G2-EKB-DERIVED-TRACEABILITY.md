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