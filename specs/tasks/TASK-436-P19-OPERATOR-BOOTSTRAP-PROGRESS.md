---
id: TASK-436
title: Add deterministic bootstrap progress and result envelope
status: blocked
priority: 436
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-435
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-OPERATOR-BOOTSTRAP-01.md
  - scripts/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
  - specs/tasks/TASK-436-P19-OPERATOR-BOOTSTRAP-PROGRESS.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/postgres/**
  - packages/contracts/decision-boundary/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Expose deterministic maintainer-facing progress/result evidence for the bootstrap invocation using canonical journey stages and identities, without mutable orchestration state.

# Required change
Add only the stable progress/result envelope needed to report validated bootstrap start, canonical journey completion/failure and final auditable result. Derive stage reporting from existing canonical outputs rather than introducing callbacks, queues or a second workflow engine.

# Acceptance criteria
- progress ordering is deterministic for equivalent input;
- reported stages map to canonical existing journey boundaries and do not claim unexecuted work;
- final result preserves canonical identity/provenance and stable success/non-success semantics;
- repeated equivalent runs produce equivalent progress/result evidence;
- stale/substituted predecessor failure never emits false downstream completion;
- no mutable cross-run state, persistence, telemetry service, network side effect or runtime launch;
- declared validations pass.

# Non-goals
Live streaming infrastructure, async job lifecycle, queueing, observability platform, production UX or runtime materialization.

# Escalation
Stop if progress requires new workflow ownership, persistent job state, service topology or undeclared L4.
