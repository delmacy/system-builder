---
id: TASK-013
title: Harden the AgentFactory OpenCode adapter
status: ready
priority: 37
milestone: I1
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-011
  - TASK-012
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/README.md
  - project_docs/execution_governance/AGENT_SECURITY.md
  - project_docs/execution_governance/MODEL_ROUTING.md
  - specs/tasks/TASK-011-FIX-OPENCODE-RUN-ARGUMENT-ORDER.md
  - specs/tasks/TASK-013-AGENTFACTORY-OPENCODE-ADAPTER-HARDENING.md
  - tooling/agent-harness/src/executor.ts
allowed_paths:
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/tests/**
  - specs/tasks/TASK-013-AGENTFACTORY-OPENCODE-ADAPTER-HARDENING.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
max_files: 8
validation:
  - npm run verify
---

# Objective

Harden the OpenCode adapter so AgentFactory can execute one bounded non-interactive task and return structured execution status for I1.

# Context

TASK-011 corrects the confirmed OpenCode argument-order defect. TASK-012 defines the execution request/result vocabulary this adapter should consume and produce.

# Current behavior

The existing OpenCode adapter is bounded, but I1 requires deterministic request construction and structured failure/result propagation aligned with the new execution contracts.

# Required change

Preserve noninteractive, deny-by-default execution while making prompt/file/model arguments deterministic, bounding timeout/retry semantics and returning structured exit/stdout/stderr/failure information using TASK-012 contracts.

# Inputs / contracts

TASK-011 corrected CLI ordering, TASK-012 execution contracts, Agent Security and Model Routing policies, and the existing OpenCode executor tests.

# Outputs / contracts

A hardened OpenCode adapter with deterministic invocation and structured adapter result plus regression/failure tests.

# Acceptance criteria

- OpenCode invocation order matches supported CLI semantics.
- Prompt/file/model arguments are deterministic and tested.
- Non-zero exit and timeout propagate as failure, never false success.
- Existing deny-by-default permissions and no-Git-delivery authority are preserved.
- Adapter request/result conforms to TASK-012 execution contracts.
- `npm run verify` passes.

# Non-goals

Model-routing policy engine, DAG scheduler, GitHub PR creation, unbounded autonomous retry, persistent `opencode serve`, product code or whole-harness redesign.

# Evidence expected

Exact command shape under tests, structured success/failure cases, TASK-011 relationship and passing `npm run verify`.

# Escalation

Stop if the task requires weakening permissions/evaluator controls, changing product code or exposing a new architecture boundary not covered by current governance.
