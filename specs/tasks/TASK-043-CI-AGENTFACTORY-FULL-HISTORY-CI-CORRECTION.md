---
id: TASK-043-CI
title: Preserve historical Git authority in deterministic CI
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
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/execution_governance/CONFIGURATION_MANAGEMENT.md
  - project_docs/execution_governance/QUALITY_MANAGEMENT_PLAN.md
  - project_docs/execution_governance/READINESS_AND_DONE.md
  - specs/tasks/TASK-043-AGENTFACTORY-FRESH-I2-AUTHORITY-RECONCILIATION-PROOF.md
  - .github/workflows/ci.yml
allowed_paths:
  - .github/workflows/ci.yml
  - specs/tasks/TASK-043-AGENTFACTORY-FRESH-I2-AUTHORITY-RECONCILIATION-PROOF.md
forbidden_paths:
  - apps/**
  - packages/**
  - tooling/agent-harness/src/**
  - tooling/agent-harness/tests/**
  - tooling/agent-harness/policies/**
  - specs/contracts/**
  - docs/adr/**
max_files: 2
validation:
  - npm run verify
---

# TASK-043-CI — Preserve Historical Git Authority in Deterministic CI

## Objective

Correct the deterministic GitHub Actions checkout so the bounded TASK-043 proof
can verify already-integrated implementation and state-closure commit ancestry
in CI exactly as it does from a complete local checkout.

## Context

TASK-043 implementation PR #125 passes the full repository verification on the
maintainer checkout but fails its three GO assertions on GitHub Actions. The
workflow uses the default shallow `actions/checkout` depth, so the historical
TASK-040 implementation head and state merge objects required by the accepted
proof contract are absent. Configuration management classifies CI and
validators as controlled configuration items; this correction therefore needs
its own bounded task and evaluator review rather than an out-of-scope edit to
TASK-043.

## Current behavior

The existing checkout step uses the action default depth of one commit. The
TASK-040 implementation head and state-closure merge remain valid integrated
authority, but their Git objects are absent from the CI workspace, so the
fail-closed TASK-043 reader returns `NO-GO` for all three positive-path tests.

## Required change

- Configure the existing checkout step in `.github/workflows/ci.yml` to fetch
  complete Git history.
- Add TASK-043-CI as an explicit predecessor of TASK-043 so the proof cannot be
  treated as ready against a shallow CI baseline.
- Preserve the existing workflow trigger, permissions, concurrency, Node
  version, locked dependency installation and sole `npm run verify` validation.
- Do not change proof logic, tests, authority evidence or accepted contracts.

## Inputs / contracts

The failing PR #125 `validate` job; the accepted TASK-043 task contract;
configuration-management, quality and DoR/DoD policies; the existing
deterministic CI workflow.

## Outputs / contracts

A full-history deterministic CI checkout and an explicit TASK-043 dependency on
this integrated correction.

## Acceptance criteria

- `actions/checkout@v4` is configured with `fetch-depth: 0`.
- No other workflow step, permission, trigger or command changes.
- TASK-043 depends on both TASK-042 and TASK-043-CI.
- No proof implementation, test, evidence, policy or product file changes.
- `npm run verify` passes.
- The implementation PR receives the independent evaluator authorization
  required for a controlled CI change.

## Non-goals

Change TASK-043 proof semantics; weaken fail-closed Git identity checks; add
network access to the proof reader; alter GitHub permissions; execute TASK-004;
reassess the I2 Exit Gate; enter I3.

## Evidence expected

Exact two-file diff, successful full repository verification, green
deterministic CI and accepted implementation/state lifecycle evidence.

## Escalation

Stop if the correction requires changing proof semantics, workflow permissions,
accepted contracts, governance policy or any path outside the two allowed
files.
