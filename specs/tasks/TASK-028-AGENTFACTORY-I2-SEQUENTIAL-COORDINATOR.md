---
id: TASK-028
title: Implement the AgentFactory I2 sequential coordinator
status: completed
priority: 52
milestone: I2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-027
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/agentfactory_i1/POST_I1_REVIEW.md
  - project_docs/agentfactory_i2/SEQUENTIAL_PIPELINE.md
  - project_docs/execution_governance/**
  - project_docs/agentfactory_ignition/03-dag-engine/**
  - project_docs/agentfactory_ignition/13-replanning-engine/**
  - project_docs/agentfactory_ignition/16-agentfactory-operations/**
  - specs/tasks/TASK-028-AGENTFACTORY-I2-SEQUENTIAL-COORDINATOR.md
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/dag.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/readiness-recompute.ts
  - tooling/agent-harness/src/task.ts
allowed_paths:
  - tooling/agent-harness/src/sequential-pipeline.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/tests/sequential-pipeline.test.ts
  - specs/tasks/TASK-028-AGENTFACTORY-I2-SEQUENTIAL-COORDINATOR.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - project_docs/**
  - package.json
  - package-lock.json
  - tooling/agent-harness/src/cli.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/execution-harness.ts
  - tooling/agent-harness/src/validation-engine.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/readiness-recompute.ts
  - tooling/agent-harness/src/dag.ts
  - tooling/agent-harness/src/task.ts
max_files: 4
validation:
  - npm run verify
---

# Objective

Implement the deterministic I2 coordination layer that serializes an explicitly authorized chain of dependent tasks over the integrated I1 single-task orchestrator and releases only a reconciled successor.

# Rationale

I1 already owns task pack, model route, execution, independent validation, AFATT/AFEV, PR lifecycle, causal ledger, state closure and readiness primitives. I2 must compose those real outcomes without duplicating or weakening them. The missing capability is deterministic focus-aware chain selection, cross-task serialization, authority reconciliation and restart-safe continuation.

# Context

The hardened I1 baseline is integrated through TASK-027 and the Post-I1 Review is GO for bounded I2 implementation. `project_docs/agentfactory_i2/SEQUENTIAL_PIPELINE.md` defines the accepted pipeline order and transitional dual-authority constraint. The product candidate is not executed by this task.

# Current behavior

`LocalTaskOrchestrator` advances or resumes one named task safely, but global `task:next` can select unrelated READY product work and no component serializes an authorized chain or reconciles bootstrap task/ledger state with AgentFactory receipts before releasing the successor.

# Required change

Add a pure sequential coordinator with runtime-validated plan, observation and receipt schemas. It must validate the task catalog and AgentFactory DAG, filter selection by explicit focus/milestone and ordered membership, verify DoR/dependency gates, delegate at most one task action to the existing single-task orchestrator, and stop at all external/human/failure states. A task may be treated as reconciled only when bootstrap spec plus `TASK_LEDGER.json` agree with AgentFactory DONE, accepted final ledger/evidence, eligible implementation and state PR identities, integrated state closure and matching readiness recomputation. Missing or divergent authority yields `NEEDS_DECISION`. Repeated observations must resume without duplicating actions and completed tasks must never be re-executed.

# Inputs / contracts

Approved ordered pipeline/focus; parsed task catalog; TASK-014 DAG evaluation; `LocalTaskOrchestrator` observations/actions; TASK-024 AFATT and TASK-019 AFEV; TASK-020/026 lifecycle receipts; TASK-025 ledger receipt; TASK-022 readiness receipt; bootstrap task status and `TASK_LEDGER.json` projection; explicitly supplied observation timestamps.

# Outputs / contracts

A deterministic coordinator decision/receipt containing selected task and rationale, predecessor gates, delegated transition/action, executor/model route when observed, validation/evidence references, implementation/state PR identities, reconciliation result, readiness before/after, stop reason and observed timing/duration. Provider/token cost is absent unless authoritative data exists.

# Acceptance criteria

- Selection is deterministic and limited to the explicitly authorized focus/milestone and ordered chain; unrelated READY work is never selected.
- The coordinator validates catalog/DAG acyclicity and fails closed on missing/inconsistent dependencies or gates.
- At most one dependent task is active or advanced; the successor remains blocked until predecessor implementation, final evidence/ledger, state closure and dual-authority reconciliation are integrated.
- The existing single-task orchestrator remains responsible for Task Pack, route, adapter execution, independent validation and implementation/state PR actions; the coordinator neither reimplements nor skips them.
- Executor failure, validation failure, missing/tampered evidence, wrong branch/SHA, pending/missing required check, state PR identity mismatch or ledger divergence stops the chain with a stable reason.
- Restart/resume observes completed external actions and delegates only the next missing action; already DONE/reconciled tasks are never executed again.
- Receipts capture selection reason, gates, transition/action, route, validation, evidence/PR identities, closure/reconciliation, readiness diff and observed timing without fabricated cost.
- Tests cover the fourteen mandatory cases in the I2 mission, including a two-task happy path and an independent READY task outside focus.
- `npm run verify` passes.

# Non-goals

Executing TASK-010/004/005/006, adding CLI commands, changing I1 component contracts, creating executors, I3 sprint generation, parallel scheduling, UI/database work, unrestricted auto-merge or silently unifying the two state authorities.

# Evidence expected

Coordinator schemas/types and deterministic decision logic, adapter boundary over the real single-task orchestrator, table-driven happy/failure/reconciliation/resume tests, exact changed-file list and full verification output.

# Escalation

Stop if implementation requires a new architecture/public contract decision, changes an accepted I1 primitive, cannot distinguish the two authorities, needs files outside allowed scope, weakens review/check/evidence gates or would execute product work.
