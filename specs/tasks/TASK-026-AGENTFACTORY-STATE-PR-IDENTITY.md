---
id: TASK-026
title: Bind AgentFactory state-closure PR identity
status: ready
priority: 50
milestone: I2-READINESS
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-020
  - TASK-025
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/execution_governance/CONFIGURATION_MANAGEMENT.md
  - project_docs/execution_governance/READINESS_AND_DONE.md
  - specs/tasks/TASK-020-AGENTFACTORY-GITHUB-LIFECYCLE-ADAPTER.md
  - specs/tasks/TASK-026-AGENTFACTORY-STATE-PR-IDENTITY.md
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/git-workflow.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
allowed_paths:
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/tests/github-lifecycle.test.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
  - specs/tasks/TASK-026-AGENTFACTORY-STATE-PR-IDENTITY.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/git-workflow.ts
  - tooling/agent-harness/src/i1-proof.ts
max_files: 4
validation:
  - npm run verify
---

# Objective

Require state-closure pull requests to pass the same branch/base/head/check/review identity gate already enforced for implementation pull requests.

# Context

TASK-020 integrated a hardened GitHub lifecycle receipt and the runtime uses it for implementation PRs. State-closure PRs still use the legacy observation path, which reads no branch/base/head identity and can therefore treat a stale or wrong PR record as merged. The existing `StateTaskRecord` already carries the expected state branch and commit, so no contract or architecture change is needed.

# Current behavior

`LocalHarnessAdapter.inspect` calls `observePullRequest` for recorded state PRs and uses the legacy observer when discovering them. That observer only maps aggregate CI/review/state. It neither requests nor compares `headRefName`, `baseRefName` or `headRefOid`, and it does not enforce named checks through TASK-020.

# Required change

Route both recorded and newly discovered state-closure PRs through `deriveGitHubLifecycleObservation`, using the state record's exact branch and commit, base `main`, configured required checks, PASS closure validation and configured review requirement. Request the complete GitHub identity fields when observing an existing state PR. Remove the now-unused legacy observation path if no caller remains. Make state delivery require an eligible hardened lifecycle receipt before a raw `MERGED` observation can lead to synchronization or DONE. Preserve fail-closed lifecycle mapping.

# Inputs / contracts

TASK-020 lifecycle evaluator; `StateTaskRecord` branch/commit/PR identity; GitHub PR identity, named checks and review observation.

# Outputs / contracts

A hardened `PullRequestObservation` with TASK-020 lifecycle receipt for every recorded or discovered state-closure PR.

# Acceptance criteria

- A state PR is eligible/merged only when its head branch, base branch and head commit match the `StateTaskRecord` identity.
- Missing, pending or failed named required checks retain their TASK-020 fail-closed semantics.
- Required review is applied consistently to state and implementation PRs.
- Recorded and discovered state PRs use the same hardened derivation path.
- Wrong branch, base or head produces `IDENTITY_MISMATCH` and cannot lead to DONE/state synchronization.
- A raw merged state with a blocked or missing lifecycle receipt remains blocked rather than bypassing identity gates.
- Tests cover matching state identity and each mismatch class through the state-specific adapter path.
- `npm run verify` passes.

# Non-goals

Changing Git delivery records, merge policy, auto-merge, ledger/evidence contracts, I1 proof, I2 execution or product code.

# Evidence expected

State lifecycle adapter assertions, wrong/stale PR regression cases, exact changed-file list and full verification output.

# Escalation

Stop if the fix requires weakening named checks/review, accepting an unknown commit, changing the Git state-record contract or expanding into merge automation.
