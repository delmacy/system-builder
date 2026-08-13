---
id: TASK-030
title: Correct AgentFactory approval policy channel semantics
status: ready
priority: 54
milestone: I2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-028
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0010-durable-human-approval.md
  - specs/tasks/TASK-029-AGENTFACTORY-DURABLE-HUMAN-APPROVAL.md
  - specs/tasks/TASK-030-AGENTFACTORY-APPROVAL-POLICY-CHANNEL.md
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/tests/human-approval.test.ts
  - tooling/agent-harness/tests/github-lifecycle.test.ts
allowed_paths:
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/tests/human-approval.test.ts
  - tooling/agent-harness/tests/github-lifecycle.test.ts
  - specs/tasks/TASK-030-AGENTFACTORY-APPROVAL-POLICY-CHANNEL.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - docs/evidence/**
  - project_docs/**
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/policies/**
max_files: 5
validation:
  - npm run verify
---

# Objective

Correct the post-integration P1 that misclassifies disabled durable approval as an invalid artifact in `TEAM_INDEPENDENT` mode.

# Rationale

The conservative team policy must require GitHub review without treating the intentionally disabled solo channel as corrupted evidence. Stable reason semantics are part of the hardened lifecycle contract.

# Context

PR #75 integrated TASK-029. Before state closure, runtime observation returned `HUMAN_APPROVAL_INVALID` plus `REVIEW_MISSING` under the default team policy. PR #76 was closed without merge and TASK-029 remains unclosed.

# Current behavior

`evaluateStoredHumanApproval` returns `INVALID/POLICY_DISALLOWS_DURABLE`; the lifecycle converts every invalid alternate approval into a blocking `HUMAN_APPROVAL_INVALID`, changing review-only absence into CI failure semantics.

# Required change

Distinguish a disabled alternate channel from malformed/unauthorized approval evidence. Under `TEAM_INDEPENDENT`, no supplied approval must be neutral and GitHub review remains required. A supplied durable receipt in team mode must not satisfy approval and may be reported as disallowed without overriding the canonical `REVIEW_MISSING` state. Invalid solo policy/artifact remains blocking.

# Inputs / contracts

ADR-0010 policy modes, optional human approval receipt and lifecycle review/check observations.

# Outputs / contracts

Stable fail-closed lifecycle reasons that preserve team review semantics and block actual invalid solo evidence.

# Acceptance criteria

- Default team mode plus no artifact yields `REVIEW_REQUIRED/REVIEW_MISSING`, not CI failure.
- Team mode never accepts a supplied solo artifact.
- Unknown/malformed solo policy remains blocked.
- Invalid solo artifacts remain blocked with stable reasons.
- Valid solo approval and GitHub approval behavior remain unchanged.
- Full `npm run verify` passes.

# Non-goals

Changing key custody, configuring solo mode, generating approvals, state closure, product execution or other AgentFactory components.

# Evidence expected

Focused policy/lifecycle regressions and full verification receipt.

# Rollback

Revert the corrective implementation; do not alter historical approval evidence.

# Escalation

Stop if correction would accept missing review, weaken CI/validation, change ADR-0010 or require files outside scope.
