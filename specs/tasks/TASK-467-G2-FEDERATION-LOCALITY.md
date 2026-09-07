---
id: TASK-467
title: Define bounded federation and locality qualification
status: ready
priority: 467
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-466
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-SEMANTIC-CONSTITUTION.md
  - project_docs/execution_planning/G2-SEMANTIC-CONTRACT-FOUNDATION-01.md
  - specs/tasks/TASK-466-G2-TYPED-SEMANTIC-GRAPH.md
  - packages/contracts/factory-boundary/**
allowed_paths:
  - packages/contracts/semantic-substrate/**
  - tests/product/g2-semantic-substrate*.test.ts
  - specs/tasks/TASK-467-G2-FEDERATION-LOCALITY.md
  - project_docs/execution_planning/G2-SEMANTIC-CONTRACT-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/deploy/**
  - packages/observe/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Add bounded inter-system/federated and local/Station/Fleet qualification references without implying shared state, shared authority or synchronized truth.

# Context
G2 federation is contract continuity between autonomous systems. Fleet/global views are projections and cannot strengthen local/Station truth or currentness.

# Current behavior
Existing factory/runtime lineage can correlate stages and local observations, but no reusable federation/locality contract expresses bilateral system/revision qualification or independent currentness boundaries.

# Required change
Define structural system/locality references and federated semantic-edge qualification using predecessor semantic identity/revision/currentness/graph primitives. Require producer/consumer system identity/revision references and explicit locality/currentness scope sufficient to prevent a remote/Fleet claim from being silently treated as local canonical truth.

# Inputs / contracts
TASK-463..466 semantic substrate primitives and current autonomous-runtime/factory lineage patterns as precedent only.

# Outputs / contracts
Portable federation/locality qualification structures and deterministic negative tests.

# Acceptance criteria
- federated relations retain bilateral system/semantic/revision qualification;
- federation does not imply shared transactionality, mutable state, authority or synchronized currentness;
- local/Station and Fleet/global scopes remain explicitly distinguishable;
- disconnected/stale/unknown remote qualification remains explicit;
- aggregate/Fleet evidence cannot silently strengthen a local/Station claim;
- duplicate-looking remote identities do not become one canonical identity without explicit owner-governed binding;
- no Deploy/Observe/Runtime owner is modified;
- declared validations pass.

# Non-goals
Fleet orchestration, remote control, deployment topology, network protocol, reconciliation jobs, physical actuation or provider binding implementation.

# Evidence expected
Product tests proving bilateral qualification, independent local/Fleet currentness and rejection of strengthening/substitution paths.

# Escalation
Stop if implementation requires shared mutable federation state, global authority, runtime control-plane topology or direct changes to Deploy/Observe/Runtime owners.