---
id: TASK-031
title: Bootstrap external durable approval store
status: completed
priority: 55
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
  - project_docs/execution_governance/HUMAN_APPROVAL.md
  - specs/tasks/TASK-029-AGENTFACTORY-DURABLE-HUMAN-APPROVAL.md
  - specs/tasks/TASK-031-AGENTFACTORY-EXTERNAL-APPROVAL-STORE.md
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/policies/HUMAN_APPROVAL.json
allowed_paths:
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/tests/human-approval.test.ts
  - tooling/agent-harness/policies/HUMAN_APPROVAL.json
  - project_docs/execution_governance/HUMAN_APPROVAL.md
  - specs/tasks/TASK-031-AGENTFACTORY-EXTERNAL-APPROVAL-STORE.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - docs/evidence/**
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/executor.ts
max_files: 5
validation:
  - npm run verify
---

# Objective

Configure the authorized solo owner public key and add a fail-closed external read-only receipt-store adapter that avoids circular self-authorization.

# Rationale

A receipt committed through the PR it authorizes is self-referential. Signed evidence must be observable before merge from a store outside the Git delivery graph, while private key custody remains human-only.

# Context

ADR-0010 and TASK-029 are integrated; TASK-030 corrects channel semantics. The owner supplied an Ed25519 public key. PR #79 remains open with green CI and no approval.

# Current behavior

The policy is `TEAM_INDEPENDENT` with no authority and the loader reads only `docs/evidence/approvals`, which cannot bootstrap its own governed delivery.

# Required change

Select `SOLO_DURABLE`, authorize `delmacy`/`delmacy-owner-2026-01`, and require a receipt directory from `SYSTEM_BUILDER_HUMAN_APPROVAL_DIR`. Load only the exact deterministic filename, reject an absent/relative/invalid store, and never search for or access private keys. Keep signed receipt validation unchanged.

# Inputs / contracts

Owner-supplied Ed25519 public key, explicit environment configuration and exact task/PR/SHA identity.

# Outputs / contracts

Versioned solo policy plus deterministic external signed-receipt loading.

# Acceptance criteria

- Missing/relative receipt directory fails closed.
- Exact signed receipt in an absolute external directory is evaluated.
- No repository receipt can self-authorize delivery.
- Public key/identity are explicit; no private key or signing API exists.
- Existing identity/signature/check/review tests remain green.
- `npm run verify` passes.

# Non-goals

Creating signatures, reading private keys, merging state PRs, changing lifecycle semantics, product execution or archival automation.

# Evidence expected

External-store tests, configured public authority and full verification.

# Rollback

Restore `TEAM_INDEPENDENT`; external receipts remain inert historical evidence.

# Escalation

Stop if the private key becomes accessible, receipt lookup is ambiguous, checks are weakened or paths outside scope are needed.
