---
id: TASK-017
title: Enforce the AgentFactory execution boundary
status: ready
priority: 41
milestone: I1
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-013
  - TASK-015
  - TASK-016
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/agentfactory_ignition/08-execution-harness/README.md
  - project_docs/agentfactory_ignition/08-execution-harness/scope/README.md
  - project_docs/agentfactory_ignition/08-execution-harness/WBS.md
  - project_docs/execution_governance/AGENT_SECURITY.md
  - project_docs/execution_governance/READINESS_AND_DONE.md
  - specs/tasks/TASK-017-AGENTFACTORY-EXECUTION-HARNESS-ENFORCEMENT.md
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/task-pack.ts
  - tooling/agent-harness/src/model-router.ts
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/git-workflow.ts
allowed_paths:
  - tooling/agent-harness/src/execution-harness.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/tests/**
  - specs/tasks/TASK-017-AGENTFACTORY-EXECUTION-HARNESS-ENFORCEMENT.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/task-pack.ts
  - tooling/agent-harness/src/model-router.ts
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/src/git-workflow.ts
max_files: 10
validation:
  - npm run verify
---

# Objective

Enforce a fail-closed repository and task boundary around each AgentFactory executor invocation.

# Context

TASK-013 provides a structured OpenCode request/result boundary, TASK-015 binds a task pack to a pinned source commit and declared context, and TASK-016 produces an explicit validated execution route. WP-I1-06 can now bind those outputs to the existing local orchestrator without inventing another contract.

# Current behavior

The repository workflow requires a clean `main` before task branch creation and later rejects out-of-scope files during verification. The executor invocation itself, however, is not yet preceded by one typed boundary check that proves the current branch/base/pack/route identity, and an adapter success result is not immediately reconciled against the repository delta.

# Required change

Add a narrow execution-boundary module and integrate it with the local orchestrator runtime. Before invoking an executor, require a clean prepared task baseline, the recorded task branch and base/source identity, an unchanged Task Pack/manifest, and an explicit compatible TASK-016 route; produce a validated TASK-013 `ExecutorRequest`. Immediately after invocation, capture the repository delta and fail closed when forbidden, undeclared or excess files appear, regardless of adapter-reported success. Preserve the raw structured adapter result and boundary identity in the execution journal.

# Inputs / contracts

The repository `Task`, TASK-013 `ExecutorRequest`/`ExecutorAdapterResult`, TASK-015 Task Pack manifest, TASK-016 `ExecutionRoute`, existing Git task record and current branch/worktree observations.

# Outputs / contracts

A deterministic execution-boundary snapshot, validated executor request, post-execution delta decision and journaled raw execution receipt tied to task, work package, source commit, branch and attempt.

# Acceptance criteria

- Execution refuses a dirty pre-existing implementation delta, wrong/detached branch, mismatched task/base/source commit, missing or modified Task Pack, and missing/incompatible route before the adapter runs.
- The request passed to the adapter validates against TASK-013 and exactly matches task scope, validation commands, attempt, source commit and selected route.
- Post-execution changed files are captured deterministically; forbidden paths, paths outside `allowed_paths` and `max_files` overflow convert the run to a structured failure even if the adapter reported success.
- The task specification file may be present only as the repository workflow's declared metadata exception; ignored `.agent` artifacts are not treated as implementation output.
- The execution journal preserves the validated request, raw adapter result and boundary/delta identity without granting Git delivery authority to the executor.
- Existing manual task preparation/verification and Git workflow behavior remain supported.
- Tests cover clean success plus wrong branch, dirty start, tampered pack and out-of-scope/excess post-delta failures.
- `npm run verify` passes.

# Non-goals

Independent acceptance validation, durable completion evidence, GitHub merge automation, ledger transitions, successor readiness recomputation, new route tiers, executor permission changes, product code or UI.

# Evidence expected

Execution-boundary implementation, orchestrator/runtime integration tests, exact structured failure evidence for boundary violations, changed files and passing `npm run verify`.

# Escalation

Stop if enforcement requires changing TASK-012/013/015/016 contract semantics, weakening Git/path/permission controls, adding hidden model fallback, granting executor Git authority or changing product/architecture boundaries.
