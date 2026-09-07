---
id: TASK-G2-003
title: Define typed semantic graph owner preserving contract
status: committed
priority: 1003
milestone: G2-WP-01
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-G2-002]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-PLANNING-MATERIALIZATION-01.md
  - project_docs/execution_planning/G2-SEMANTIC-IDENTITY-REVISION-CONTRACT-01.md
  - packages/contracts/**
allowed_paths:
  - packages/contracts/**
  - tests/product/**
  - specs/tasks/TASK-G2-003-TYPED-SEMANTIC-GRAPH-CONTRACT.md
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
Add typed semantic node/edge descriptors over TASK-G2-002 identity/revision/currentness primitives with explicit semantic owner/evidence and non-strengthening validation.

# Acceptance criteria
- nodes and edges carry explicit stable identity/revision and owner/evidence qualification;
- edge type/direction are explicit and deterministic;
- composition cannot upgrade `UNKNOWN`/`PARTIAL` or a remote/source claim to stronger truth;
- invalid self/ambiguous/ownerless edges fail closed where the contract forbids them;
- predecessor identity/revision primitives are reused;
- no execution or mutation authority is encoded by graph connectivity;
- declared validations pass.

# Negative/adversarial cases
Owner mismatch, stale endpoint revision, missing evidence, ambiguous direction, unknown endpoint/currentness and attempted authority strengthening fail or remain explicitly non-authoritative according to contract.

# Non-goals
No federated aggregation algorithm, authorization policy, workflow graph execution, provider mechanics or generic physical topology.

# Escalation
Stop if typed graph semantics require a new architectural owner outside G2-WBS-01.