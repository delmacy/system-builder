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

## Context

The current repository policy is `SOLO_DURABLE`, which makes every lifecycle closure depend on an external signed receipt even during early product/factory development. The owner has explicitly chosen to defer that ceremony until the System Builder approaches V1 while keeping the already-built durable and team approval mechanisms available for later reactivation.

## Current behavior

A PR with matching identity, green required checks and passing validation still becomes `REVIEW_REQUIRED` when GitHub review, durable approval and package authorization are absent. This currently prevents state closure for routine development work such as TASK-043-CI even after successful CI and merge.

## Required change

- Add an explicit `DEVELOPMENT_TRUSTED` policy mode; do not fake a human approval.
- A low/medium-risk task with `architecture_impact: false` may use `approval_channel: DEVELOPMENT_TRUSTED` when identity, required checks and validation pass.
- High-risk or `architecture_impact: true` work must not receive development trust and must continue to require an existing review/approval channel.
- Development trust must never override failed/missing CI, identity mismatch, requested changes, failed validation or unknown PR observations.
- Keep `SOLO_DURABLE` and `TEAM_INDEPENDENT` behavior available for later activation.
- Keep package authorization code intact but do not require it for eligible development-trusted work.
- Activate `DEVELOPMENT_TRUSTED` in the committed policy for the current pre-V1 phase.

## Inputs / contracts

Existing human approval policy/evaluation schemas, GitHub lifecycle receipt/evaluator, task risk and `architecture_impact` metadata, required CI checks and independent validation result.

## Outputs / contracts

A lifecycle receipt that can record `approval_channel: DEVELOPMENT_TRUSTED` with `human_approval.decision: DEVELOPMENT_TRUSTED` and no approval ID/signature, while preserving all other lifecycle identity/check/validation fields.

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

## Evidence expected

A bounded six-file diff, focused tests for eligible/ineligible development trust, green deterministic CI, unchanged durable/team semantics and an exact lifecycle receipt showing the new authority channel without a synthetic `HAPR`.

## Escalation

Stop if the change requires weakening CI/validation, removing existing approval modes, changing product files, modifying public product contracts/ADRs, enabling high-risk or architecture-impact work without explicit authority, or broadening execution beyond the current pre-V1 development phase.
