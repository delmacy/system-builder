---
id: TASK-016
title: Implement the AgentFactory model router
status: ready
priority: 40
milestone: I1
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-012
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/README.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/execution_governance/MODEL_ROUTING.md
  - project_docs/execution_governance/RISK_MANAGEMENT.md
  - specs/tasks/TASK-016-AGENTFACTORY-MODEL-ROUTER.md
  - tooling/agent-harness/policies/MODEL_ROUTING.md
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/task.ts
allowed_paths:
  - tooling/agent-harness/src/model-router.ts
  - tooling/agent-harness/tests/**
  - specs/tasks/TASK-016-AGENTFACTORY-MODEL-ROUTER.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - tooling/agent-harness/src/execution-contracts.ts
max_files: 6
validation:
  - npm run verify
---

# Objective

Implement deterministic model/executor routing for the supported AgentFactory I1 task classes.

# Context

TASK-012 provides the validated `ExecutionRoute` vocabulary. I1 needs code, rather than runtime LLM judgment, to map approved task risk/model metadata and configured model availability into a selected route or explicit escalation/block.

# Current behavior

The OpenCode adapter checks broad eligibility and reads one optional model environment variable, but no provider-neutral router produces a validated route with a rationale code or fails closed when a requested tier is unavailable or unsafe.

# Required change

Add a pure deterministic router that consumes validated task metadata plus an explicit configured tier/executor/model map and returns a TASK-012 `ExecutionRoute`. High-risk, architecture-impact, unsupported and unconfigured cases must escalate or block rather than silently route downward.

# Inputs / contracts

TASK-012 risk/model/executor route schema, repository task metadata, governance Model Routing/Risk policies and explicit local model configuration supplied by the caller.

# Outputs / contracts

A runtime-validated `ExecutionRoute` with selected executor/model, tier, decision and stable rationale code, plus representative table-driven tests.

# Acceptance criteria

- Repeated routing of the same task/configuration produces the same result.
- Deterministic work selects T0 only with the deterministic executor.
- Supported bounded low/moderate-risk work selects only an explicitly configured compatible route.
- Architecture impact, high/critical risk or architecture-tier metadata never routes to an ordinary autonomous executor.
- Missing/unsupported configuration returns `BLOCKED` or `ESCALATION_REQUIRED`; no hidden provider/model fallback occurs.
- Returned values validate against the TASK-012 `ExecutionRoute` schema.
- No LLM or network call is used by routing logic.
- `npm run verify` passes.

# Non-goals

Provider SDK integration, cost optimization, dynamic benchmarking, OpenCode process changes, task selection, DAG evaluation, persistence, product code or UI.

# Evidence expected

Pure router implementation, table-driven selection/escalation/failure tests, schema-validation proof and passing `npm run verify`.

# Escalation

Stop if routing requires a new policy tier, implicit architecture authority, secret/provider configuration in the repository, changes to TASK-012 contracts or product-domain coupling.
