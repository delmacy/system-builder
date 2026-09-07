---
id: TASK-468
title: Prove coherent semantic substrate across owners
status: ready
priority: 468
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-467
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-SEMANTIC-CONSTITUTION.md
  - project_docs/execution_planning/G2-SEMANTIC-CONTRACT-FOUNDATION-01.md
  - specs/tasks/TASK-463-G2-SEMANTIC-IDENTITY.md
  - specs/tasks/TASK-464-G2-REVISION-VECTOR.md
  - specs/tasks/TASK-465-G2-CURRENTNESS-TEMPORAL.md
  - specs/tasks/TASK-466-G2-TYPED-SEMANTIC-GRAPH.md
  - specs/tasks/TASK-467-G2-FEDERATION-LOCALITY.md
  - packages/contracts/process-versioning/**
  - packages/contracts/evidence-provenance/**
  - packages/contracts/factory-boundary/**
allowed_paths:
  - packages/contracts/semantic-substrate/**
  - tests/product/g2-semantic-substrate*.test.ts
  - specs/tasks/TASK-468-G2-SEMANTIC-SUBSTRATE-PROOF.md
  - project_docs/execution_planning/G2-SEMANTIC-CONTRACT-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/catalog/**
  - packages/deploy/**
  - packages/observe/**
  - packages/contracts/decision-boundary/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Close Construction A with one integrated deterministic product proof that the semantic substrate composes across distinct owners without identity, revision, currentness, graph or federation strengthening.

# Context
TASK-463..467 build structural primitives independently. Construction A must exit with a growing proof through the actual exported contract surface rather than isolated fixtures only.

# Current behavior
No integrated G2 semantic-substrate proof exists on current main.

# Required change
Expose the coherent additive contract surface and add an end-to-end in-memory product proof using at least two distinct semantic owners, immutable revisions, temporal/currentness qualification, typed relations and local/federated references. Include adversarial mutations that attempt realization-identity substitution, revision substitution, owner mismatch, stale/unqualified currentness, relation strengthening and Fleet/remote-to-local truth promotion.

# Inputs / contracts
All predecessor TASK outputs plus current G1 domain-scoped identity/provenance/lineage contracts as coexistence evidence.

# Outputs / contracts
A stable exported semantic-substrate API surface and integrated product proof suitable as the predecessor evidence for Construction B planning.

# Acceptance criteria
- happy path composes at least two semantic owners through the public semantic-substrate surface;
- canonical/definition/revision/occurrence/realization identities remain distinct through round trip;
- sparse producing revision qualification remains exact and deterministic;
- stale/unknown currentness is represented rather than silently accepted;
- typed graph/federation relations preserve owner/direction/locality and do not strengthen remote claims;
- adversarial substitution/mismatch cases fail closed before stronger truth is emitted;
- existing G1 process-versioning/evidence/factory contracts remain unchanged and historically interpretable;
- no universal evaluator, mutable registry, provider facade, policy engine or Runtime->Builder dependency is introduced;
- declared validations pass.

# Non-goals
Construction B consumer migration, EKB, provider support vectors, effect disposition, workflow execution, production readiness implementation or package closure.

# Evidence expected
One focused growing product proof plus accumulated unit/negative evidence from TASK-463..467 and repository-wide gates.

# Escalation
Stop if the coherent proof can pass only by modifying foreign semantic-owner contracts, weakening validation, introducing generic authority/evaluation or broadening into Construction B scope.