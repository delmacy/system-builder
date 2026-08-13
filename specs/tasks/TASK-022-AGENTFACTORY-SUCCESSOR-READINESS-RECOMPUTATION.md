---
id: TASK-022
title: Implement AgentFactory successor readiness recomputation
status: ready
priority: 46
milestone: I1
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-014
  - TASK-021
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/execution_governance/READINESS_AND_DONE.md
  - project_docs/execution_governance/EVIDENCE_PROTOCOL.md
  - specs/tasks/TASK-022-AGENTFACTORY-SUCCESSOR-READINESS-RECOMPUTATION.md
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/dag.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/harness.ts
allowed_paths:
  - tooling/agent-harness/src/readiness-recompute.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/tests/**
  - specs/tasks/TASK-022-AGENTFACTORY-SUCCESSOR-READINESS-RECOMPUTATION.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/dag.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/git-workflow.ts
max_files: 7
validation:
  - npm run verify
---

# Objective

Recompute the deterministic AgentFactory READY set after an accepted ledger transition satisfies dependency gates, while preserving unrelated DAG paths.

# Context

WP-I1-11 consumes the integrated TASK-014 `DagGraph`/`DagEvaluation` and the real TASK-021 `LedgerApplicationReceipt`. The ledger receipt provides the authoritative accepted task state and append-only attempt identity; its corresponding TASK-019 evidence provides the newly satisfied gate IDs. This task composes those existing interfaces without changing them.

# Current behavior

TASK-014 can validate a complete graph and compute READY/BLOCKED/TERMINAL nodes, but callers must reconstruct a new graph manually after task completion. TASK-021 can accept a legal evidence-backed state change, but does not update DAG nodes/gates or expose the resulting READY delta.

# Required change

Implement a pure readiness recomputation function that consumes the current DAG, an accepted TASK-021 receipt, and its matching TASK-019 evidence. Validate their task/WP/evidence-receipt identity, update only the matching completed node and explicitly satisfied dependency gates, then invoke the unchanged TASK-014 evaluator. Return a runtime-validated receipt containing the updated graph, prior/current READY sets and deterministic changed-node/gate lists. Rejected or mismatched ledger/evidence inputs must fail closed without mutating the input graph.

# Inputs / contracts

TASK-014 `DagGraph` and `DagEvaluation`; TASK-021 `LedgerApplicationReceipt`; matching TASK-019 `AgentFactoryEvidenceEnvelope` and evidence reference.

# Outputs / contracts

A deterministic readiness recomputation receipt with updated graph/evaluation, prior and current READY arrays, newly-ready IDs, changed node IDs and changed gate IDs.

# Acceptance criteria

- Only an accepted TASK-021 receipt whose final attempt identifies the supplied TASK-019 envelope can change graph state.
- The matching task/WP node becomes its authoritative accepted state; only evidence-declared gate IDs with the matching predecessor task/WP can become `SATISFIED`.
- The existing TASK-014 evaluator remains the authority for structural validation, blockers and READY ordering.
- Independent READY branches remain available and semantically unchanged when an unrelated path is recomputed.
- Input graph, ledger receipt and evidence are never mutated; mismatched/rejected input fails closed before producing an updated graph.
- Equivalent inputs produce byte-equivalent semantic receipts with stable sorted changed/newly-ready lists.
- Tests cover successor unblocking, unrelated READY preservation, unsatisfied remaining gate, rejected receipt, identity mismatch and input immutability.
- `npm run verify` passes.

# Non-goals

Ledger transition policy, evidence creation, persistent ledger writes, orchestration/PR integration, task selection/execution, product code, WP-I1-12 proof or I2 scheduling.

# Evidence expected

Readiness receipt schema/types, pure recomputation implementation, table-driven tests over real TASK-014/019/021 shapes, immutable-input assertions and passing `npm run verify`.

# Escalation

Stop if completing the task requires altering accepted DAG/ledger/evidence contracts, satisfying undeclared gates, changing unrelated nodes, or adding scheduler authority beyond readiness computation.
