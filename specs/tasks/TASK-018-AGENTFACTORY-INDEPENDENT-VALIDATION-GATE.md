---
id: TASK-018
title: Implement the AgentFactory independent validation gate
status: ready
priority: 42
milestone: I1
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-017
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/agentfactory_ignition/09-validation-engine/README.md
  - project_docs/agentfactory_ignition/09-validation-engine/scope/README.md
  - project_docs/agentfactory_ignition/09-validation-engine/WBS.md
  - project_docs/execution_governance/QUALITY_MANAGEMENT_PLAN.md
  - project_docs/execution_governance/GOVERNANCE_GATES.md
  - project_docs/execution_governance/READINESS_AND_DONE.md
  - specs/tasks/TASK-018-AGENTFACTORY-INDEPENDENT-VALIDATION-GATE.md
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/execution-harness.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/git-workflow.ts
allowed_paths:
  - tooling/agent-harness/src/validation-engine.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/tests/**
  - specs/tasks/TASK-018-AGENTFACTORY-INDEPENDENT-VALIDATION-GATE.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/execution-harness.ts
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/src/model-router.ts
  - tooling/agent-harness/src/task-pack.ts
  - tooling/agent-harness/src/git-workflow.ts
max_files: 10
validation:
  - npm run verify
---

# Objective

Independently validate one bounded AgentFactory execution result before it may advance to integration.

# Context

TASK-017 now captures a validated executor request, repository identity and enforced post-execution delta. WP-I1-07 can use that boundary plus the existing task verification workflow to make required checks, evaluator changes and pass/fail reasons explicit without trusting the coding agent's self-report.

# Current behavior

`verifyTask` checks task/pack integrity, path scope and file count, runs declared commands, and writes a basic passing receipt. It does not expose a runtime-validated independent gate result, command failure evidence, evaluator-change review signal, or content-level proof that validation did not mutate an already-listed file.

# Required change

Add a deterministic validation engine that consumes the frozen task contract, TASK-017 boundary/delta identity and an independently supplied command runner. It must validate scope again, execute exactly the declared commands after the adapter, capture bounded command evidence, detect missing or changed evaluator inputs and detect any repository content mutation caused by validation. Integrate the result into the existing verification/orchestrator path without accepting executor claims as evidence.

# Inputs / contracts

Repository `Task`, TASK-017 boundary/completion data, pinned source commit, current changed-file fingerprints, declared validation commands, command-runner results and evaluator/governance path classification.

# Outputs / contracts

A runtime-validated validation-gate receipt with task/WP/source traceability, scope decision, ordered command results, evaluator-change signal, content-stability result, stable reason codes and `PASS`, `FAIL` or `REVIEW_REQUIRED` decision.

# Acceptance criteria

- Validation runs only after an accepted TASK-017 boundary/completion and rechecks the exact task, work package, source commit and changed-file set.
- Every task-declared validation command runs independently and in declared order; missing, skipped, timed-out or nonzero results cannot produce `PASS`.
- Changed evaluator/test/governance inputs are reported deterministically as `REVIEW_REQUIRED`; they are never silently treated as ordinary executor evidence or self-waived.
- A validation command that changes any tracked implementation file's content or file set produces `FAIL`, including mutation of a file already present before validation.
- Scope, forbidden-path and `max_files` violations remain failures even if all commands return zero.
- Command output evidence is bounded and stable reason codes distinguish command, scope, evaluator and mutation failures.
- Existing manual task verification and Git delivery remain compatible; the gate result is available for the later Evidence Writer and GitHub lifecycle tasks.
- Tests cover clean pass, command failure/timeout, evaluator review, preexisting scope failure and same-file mutation during validation.
- `npm run verify` passes.

# Non-goals

Durable execution-evidence publication, PR/check observation, merge authority, ledger transitions, successor readiness, new acceptance-ID semantics, product code or UI.

# Evidence expected

Validation receipt schema/types, independent runner and integration tests, exact failure/review reason assertions, changed files and passing `npm run verify`.

# Escalation

Stop if implementation requires changing TASK-012/017 public semantics, permitting executor-supplied pass evidence, silently approving evaluator changes, weakening existing verification/Git controls or inventing acceptance criteria absent from the task contract.
