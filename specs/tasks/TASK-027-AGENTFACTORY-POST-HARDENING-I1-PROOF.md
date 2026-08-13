---
id: TASK-027
title: Re-prove AgentFactory I1 after hardening
status: completed
priority: 51
milestone: I2-READINESS
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: codex
depends_on: [TASK-024, TASK-025, TASK-026]
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/agentfactory_i1/I1_EXIT_GATE.md
  - project_docs/execution_governance/EVIDENCE_PROTOCOL.md
  - specs/tasks/TASK-023-AGENTFACTORY-I1-END-TO-END-PROOF.md
  - specs/tasks/TASK-024-AGENTFACTORY-DURABLE-ATTEMPT-EVIDENCE.md
  - specs/tasks/TASK-025-AGENTFACTORY-CAUSAL-LEDGER-EVIDENCE.md
  - specs/tasks/TASK-026-AGENTFACTORY-STATE-PR-IDENTITY.md
  - specs/tasks/TASK-027-AGENTFACTORY-POST-HARDENING-I1-PROOF.md
  - tooling/agent-harness/src/i1-proof.ts
allowed_paths:
  - tooling/agent-harness/src/i1-proof.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/tests/i1-proof.test.ts
  - docs/evidence/agentfactory/i1/**
  - specs/tasks/TASK-027-AGENTFACTORY-POST-HARDENING-I1-PROOF.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - project_docs/**
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
max_files: 4
validation: [npm run verify]
---

# Objective

Produce a new append-only I1 proof that exercises the integrated TASK-024/025/026 hardening before the I2 readiness decision.

# Context

TASK-023 remains valid historical evidence, but its failure path expected rejected failure evidence and its graph-preservation check was not an explicit before/after comparison. TASK-024 persists failures, TASK-025 requires causal evidence and TASK-026 hardens state-closure PR identity.

# Current behavior

The happy path uses causal ledger inputs for compatibility, but the public receipt still reports `evidence_rejected: true`. It does not expose durable failure evidence or state-PR identity rejection, and its graph assertion reconstructs an equal fixture.

# Required change

Version the proof additively. Persist the controlled failed attempt through TASK-024, apply an outcome-compatible failure transition, compare captured graph before/after, and assert a state lifecycle identity mismatch is blocked. Preserve the original builder/artifact and write a new content-addressed artifact.

# Inputs / contracts

Integrated TASK-024 attempt envelope, TASK-025 causal ledger evidence, TASK-026 state lifecycle observation and the representative I1 fixture.

# Outputs / contracts

A schema-validated post-hardening proof receipt and new append-only `I1PROOF2-*` JSON artifact.

# Acceptance criteria

- Happy path reaches DONE with lifecycle events, AFATT validation evidence and final AFEV evidence in causal order.
- Controlled scope failure produces durable non-DONE AFATT evidence and an accepted failure/block transition; it cannot reach DONE.
- Task and graph preservation compare captured semantic before/after values.
- A merged state PR with wrong identity is blocked and cannot authorize synchronization/DONE.
- Original proof artifact remains byte-identical and its compatibility test passes.
- New receipt is deterministic, runtime validated, append-only and committed distinctly.
- `npm run verify` passes.

# Non-goals

Changing component contracts, review documents, I2 execution, product code, merge policy or historical evidence.

# Evidence expected

Versioned proof schema/coordinator, focused assertions, new deterministic artifact, changed-file list and full verification output.

# Escalation

Stop if proof requires weakening a hardened gate, overwriting history or expanding into I2 execution.
