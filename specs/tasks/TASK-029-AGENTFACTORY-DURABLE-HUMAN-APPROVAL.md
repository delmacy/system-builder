---
id: TASK-029
title: Add governed durable human approval
status: completed
priority: 53
milestone: I2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-028
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0010-durable-human-approval.md
  - docs/current/PROJECT_STATE.md
  - project_docs/agentfactory_i2/I2_PRE_RUN_GATE.md
  - project_docs/execution_governance/**
  - specs/tasks/TASK-029-AGENTFACTORY-DURABLE-HUMAN-APPROVAL.md
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/orchestrator.ts
allowed_paths:
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/tests/human-approval.test.ts
  - tooling/agent-harness/tests/github-lifecycle.test.ts
  - tooling/agent-harness/policies/HUMAN_APPROVAL.json
  - project_docs/execution_governance/HUMAN_APPROVAL.md
  - specs/tasks/TASK-029-AGENTFACTORY-DURABLE-HUMAN-APPROVAL.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - docs/evidence/approvals/**
  - project_docs/agentfactory_i2/**
  - tooling/agent-harness/src/cli.ts
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/readiness-recompute.ts
  - tooling/agent-harness/src/sequential-pipeline.ts
max_files: 9
validation:
  - npm run verify
---

# Objective

Implement ADR-0010 as a fail-closed signed durable-human-approval contract and lifecycle policy for explicitly configured solo operation.

# Rationale

GitHub cannot express self-review approval in solo operation, while merge/comment/ownership are insufficient trust evidence. A cryptographically separated human decision closes the observability gap without weakening independent review, validation or CI.

# Context

TASK-028 is bootstrap-completed but its hardened lifecycle is blocked because PR #71/#72 have review state `NONE`. The coding executor and planner must never create approval for their own work.

# Current behavior

`evaluateGitHubLifecycle` accepts only GitHub `APPROVED` when review is required. `LocalHarnessAdapter` always requests review and has no configurable alternate human authority.

# Required change

Add strict schemas, deterministic canonicalization, Ed25519 verification, explicit `TEAM_INDEPENDENT`/`SOLO_DURABLE` policy and lifecycle integration. Runtime loading must default to team mode and read only versioned policy/receipt evidence. There must be no signing API and no private-key input. Preserve raw GitHub review state and record the effective approval channel in the lifecycle receipt.

# Inputs / contracts

ADR-0010; task metadata; exact repository/PR/base/head/SHA identity; observed evaluation time; named checks and validation; versioned approval policy; optional signed approval receipt.

# Outputs / contracts

Validated human approval evaluation and GitHub lifecycle receipt whose eligibility explicitly identifies `GITHUB_REVIEW`, `DURABLE_HUMAN_APPROVAL` or `NONE`.

# Acceptance criteria

- GitHub `APPROVED` remains accepted and missing review without durable approval remains blocked.
- Valid authorized solo approval with green checks/validation satisfies review; team mode still requires independent GitHub approval.
- Wrong SHA, PR, task, repository/ref, unauthorized approver/key, rejected decision, stale/future approval or invalid signature blocks with stable reasons.
- Approval never overrides missing/pending/failed checks or failed/review-required validation.
- Unknown policy fails closed; default policy is `TEAM_INDEPENDENT`.
- No signing/private-key capability is exposed to executor, planner, lifecycle or runtime code.
- Historical merged PR without an explicit valid receipt receives no implicit approval.
- Repeated equivalent evaluation is deterministic.
- Tests cover all fifteen mandatory mission cases and `npm run verify` passes.

# Migration / compatibility concerns

The lifecycle receipt schema gains explicit policy/channel fields and remains version 1 only if all consumers are updated atomically in this task; otherwise version it. Existing calls without policy/approval must retain team-mode fail-closed behavior. Existing historical evidence is not rewritten.

# Non-goals

Generating or signing human approvals, storing private keys, retroactively changing GitHub reviews, weakening CI, multi-signature quorum, auto-merge, DAG/router/task-pack/executor/ledger/coordinator changes, product execution, I3, UI or database work.

# Evidence expected

Contract/evaluator tests, lifecycle integration tests, conservative versioned policy, operational key-custody/signing instructions, exact changed files and full verification receipt.

# Rollback

Return configuration to `TEAM_INDEPENDENT` or remove authorized keys. Preserve approval history append-only.

# Escalation

Stop if implementation requires private key access, implicit approval, executor-writable approval generation, weaker checks/validation, files outside scope or a different trust model than ADR-0010.
