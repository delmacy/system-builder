---
id: TASK-020
title: Harden the AgentFactory GitHub lifecycle adapter
status: completed
priority: 44
milestone: I1
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-017
  - TASK-018
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/agentfactory_ignition/11-github-integration/README.md
  - project_docs/agentfactory_ignition/11-github-integration/scope/README.md
  - project_docs/agentfactory_ignition/11-github-integration/WBS.md
  - project_docs/execution_governance/GOVERNANCE_GATES.md
  - project_docs/execution_governance/CONFIGURATION_MANAGEMENT.md
  - specs/tasks/TASK-020-AGENTFACTORY-GITHUB-LIFECYCLE-ADAPTER.md
  - tooling/agent-harness/src/validation-engine.ts
  - tooling/agent-harness/src/git-workflow.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
allowed_paths:
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/tests/**
  - specs/tasks/TASK-020-AGENTFACTORY-GITHUB-LIFECYCLE-ADAPTER.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/execution-harness.ts
  - tooling/agent-harness/src/validation-engine.ts
  - tooling/agent-harness/src/git-workflow.ts
max_files: 9
validation:
  - npm run verify
---

# Objective

Make GitHub branch/PR/check lifecycle observations deterministic, traceable and fail-closed for AgentFactory I1.

# Context

The existing Git workflow already creates bounded branches, commits, pushes and PRs, while the orchestrator reads broad check/review state. TASK-017/018 now provide the execution and validation identities that must remain bound to the remote lifecycle. WP-I1-09 can harden observation and eligibility without changing repository governance or granting the executor merge authority.

# Current behavior

PR observation collapses all status checks to a broad state and does not validate required check names, expected head/base refs, source commit, validation decision or a stable integration receipt. A successful-looking PR may therefore lack a required check or refer to an unexpected remote identity before later closure detects the mismatch.

# Required change

Add a provider-bounded GitHub lifecycle evaluator that consumes expected task branch/base/head identity, TASK-018 validation decision, configured required check names and normalized PR/check/review observations. Return a runtime-validated lifecycle decision and stable reasons for pending, failed, review-required or integration-eligible states. Integrate this evaluator into orchestrator observation; do not add autonomous merge authority.

# Inputs / contracts

Existing Git task record, expected branch/base/head commit, TASK-018 validation receipt/decision, normalized GitHub PR fields, named check conclusions and repository review policy.

# Outputs / contracts

A deterministic lifecycle receipt containing PR identity, required-check evidence, review state, validation binding, eligibility decision and stable blocking reasons.

# Acceptance criteria

- PR head/base refs and head commit must match the recorded task branch/commit; mismatches block.
- Every configured required check must be present and successful; missing, pending, failed, cancelled or timed-out checks never become integration-eligible.
- `FAIL` validation blocks; `REVIEW_REQUIRED` validation cannot bypass required review; a clean validation still respects repository review policy.
- Closed-unmerged PRs, changed-requested reviews and unknown observations fail closed with stable reasons.
- Repeated equivalent observations produce identical lifecycle receipts; no network or merge call occurs in the pure evaluator.
- Orchestrator states derive from the hardened receipt while existing branch/commit/push/PR creation remains unchanged.
- No executor/model receives GitHub delivery or merge authority.
- Tests cover missing required check, failed/pending check, identity mismatch, review-required validation and fully eligible observation.
- `npm run verify` passes.

# Non-goals

Changing branch protection, enabling generic auto-merge, bypassing human/governance review, evidence writing, ledger mutation, successor readiness, product code or UI.

# Evidence expected

Lifecycle receipt schema/types, table-driven evaluator and orchestrator integration tests, stable reason assertions, changed files and passing `npm run verify`.

# Escalation

Stop if implementation requires changing repository protection/governance, hiding missing checks, granting merge authority, weakening TASK-018 validation or modifying existing Git delivery controls.
