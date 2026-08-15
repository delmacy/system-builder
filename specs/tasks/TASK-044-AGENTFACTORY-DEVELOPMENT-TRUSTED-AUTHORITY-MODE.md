---
id: TASK-044
title: Add development trusted authority mode
status: ready
priority: 1
milestone: I2
model_tier: free
risk: medium
architecture_impact: false
executor_preference: opencode
depends_on:
  - TASK-042
context_paths:
  - AGENTS.md
  - project_docs/execution_governance/HUMAN_APPROVAL.md
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/policies/HUMAN_APPROVAL.json
allowed_paths:
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/tests/development-trusted.test.ts
  - tooling/agent-harness/policies/HUMAN_APPROVAL.json
  - project_docs/execution_governance/HUMAN_APPROVAL.md
  - specs/tasks/TASK-044-AGENTFACTORY-DEVELOPMENT-TRUSTED-AUTHORITY-MODE.md
forbidden_paths:
  - apps/**
  - packages/**
  - specs/contracts/**
  - docs/adr/**
  - .github/**
max_files: 6
validation:
  - npm run verify
---

# TASK-044 — Development Trusted Authority Mode

## Objective

Allow the pre-V1 System Builder factory to execute and state-close routine low/medium-risk, non-architecture tasks without GitHub review, durable owner signatures or package authorization while preserving deterministic CI, validation, task scope, Git identity, evidence, ledger and readiness controls.

## Required behavior

- Add an explicit `DEVELOPMENT_TRUSTED` policy mode; do not fake a human approval.
- A low/medium-risk task with `architecture_impact: false` may use `approval_channel: DEVELOPMENT_TRUSTED` when identity, required checks and validation pass.
- High-risk or `architecture_impact: true` work must not receive development trust and must continue to require an existing review/approval channel.
- Development trust must never override failed/missing CI, identity mismatch, requested changes, failed validation or unknown PR observations.
- Keep `SOLO_DURABLE` and `TEAM_INDEPENDENT` behavior available for later activation.
- Keep package authorization code intact but do not require it for eligible development-trusted work.
- The committed policy should activate `DEVELOPMENT_TRUSTED` for the current pre-V1 phase.

## Acceptance criteria

- Lifecycle receipts distinguish `DEVELOPMENT_TRUSTED` from human/package approval.
- No signature/store is required for eligible development-trusted tasks.
- Medium-risk, non-architecture historical merged PR with successful required checks and validation evaluates `ELIGIBLE`.
- High-risk or architecture-impact task without review remains `REVIEW_REQUIRED`.
- Missing/failed CI remains `BLOCKED` even in development mode.
- `CHANGES_REQUESTED` remains `BLOCKED`.
- Existing durable and team modes remain covered and unchanged in meaning.
- `npm run verify` passes.

## Non-goals

Remove approval infrastructure, weaken scope/DAG/evidence controls, enable I3/parallelism, bypass destructive/release safeguards, or reinterpret historical receipts as human approvals.