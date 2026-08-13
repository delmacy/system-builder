---
id: TASK-025
title: Bind AgentFactory ledger transitions to causal evidence
status: ready
priority: 49
milestone: I2-READINESS
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-021
  - TASK-024
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/execution_governance/EVIDENCE_PROTOCOL.md
  - project_docs/execution_governance/READINESS_AND_DONE.md
  - specs/tasks/TASK-021-AGENTFACTORY-LEDGER-STATE-TRANSITION-ENGINE.md
  - specs/tasks/TASK-024-AGENTFACTORY-DURABLE-ATTEMPT-EVIDENCE.md
  - specs/tasks/TASK-025-AGENTFACTORY-CAUSAL-LEDGER-EVIDENCE.md
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/i1-proof.ts
allowed_paths:
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/src/i1-proof.ts
  - tooling/agent-harness/tests/ledger-engine.test.ts
  - specs/tasks/TASK-025-AGENTFACTORY-CAUSAL-LEDGER-EVIDENCE.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/dag.ts
  - tooling/agent-harness/src/readiness-recompute.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/git-workflow.ts
  - tooling/agent-harness/src/github-lifecycle.ts
max_files: 4
validation:
  - npm run verify
---

# Objective

Make every AgentFactory ledger transition depend on evidence that existed at the time of that transition, eliminating reuse of a future final envelope for earlier execution states.

# Context

WP-I1-10 requires legal transitions from verified events. The integrated TASK-021 engine instead requires the final TASK-019 accepted evidence envelope for every transition. TASK-023 consequently builds final evidence first and reuses it for `READY -> RUNNING`, `RUNNING -> VERIFICATION` and later states. TASK-024 now supplies durable `AFATT` attempt receipts for validation and failure outcomes, so the ledger can distinguish contemporaneous lifecycle events, attempt receipts and final accepted integration evidence without weakening DONE.

# Current behavior

`applyLedgerTransition` accepts only `AFEV` envelopes. It cannot record execution start before execution completes and cannot use a failed/blocked `AFATT` receipt for failure transitions. The transition attempt therefore records a final receipt ID even when that receipt is causally unavailable.

# Required change

Add a small content-addressed transition-event receipt for lifecycle facts that precede a completed attempt. Validate evidence by transition reason: lifecycle start/completion events for their matching early transition; TASK-024 `AFATT` receipts for validation/failure/review/blocked outcomes; and the accepted TASK-019 `AFEV` envelope for final `INTEGRATION_ACCEPTED`. Bind task/WP/reason identity, semantic integrity and observed time. Reject evidence completed or observed after the requested transition time. Preserve append-only attempts and the exact prior authoritative task on rejection.

Migrate the existing I1 proof's happy-path ledger calls to the causal evidence interface so the repository remains green. Preserve its public proof schema, committed artifact and controlled-failure semantics; the post-hardening reproof remains a later task.

# Inputs / contracts

TASK-012 task/state-transition contracts; TASK-019 accepted envelope; TASK-024 durable attempt envelope; requested transition timestamp; prior transition attempts.

# Outputs / contracts

Runtime-validated causal transition event plus a ledger receipt whose evidence receipt ID identifies `AFEV`, `AFATT` or the lifecycle event actually used.

# Acceptance criteria

- `READY -> RUNNING` is accepted from a matching content-addressed `EXECUTION_STARTED` event that exists no later than the transition.
- `RUNNING -> VERIFICATION` and `EVIDENCED -> INTEGRATING` require their matching contemporaneous lifecycle events rather than a future final envelope.
- validation pass/fail, blocked and review-required transitions accept only an identity-bound TASK-024 attempt receipt with the compatible outcome.
- `INTEGRATING -> DONE` still requires the identity-bound, integrity-valid TASK-019 accepted envelope with PASS validation, PASS acceptance and no blocked gates.
- A mismatched reason, task/WP, tampered hash, future timestamp or incompatible attempt outcome fails closed with a stable rejection reason.
- Rejection preserves the prior task and appends the rejected attempt without rewriting history.
- Tests demonstrate causal happy-path evidence and reject the former future-envelope shortcut on early transitions.
- The existing I1 proof uses causal transition inputs without changing its public receipt or committed artifact.
- `npm run verify` passes.

# Non-goals

Changing TASK-012 or TASK-024 schemas, wiring the orchestrator, changing PR lifecycle, changing the I1 proof schema/artifact/failure assertions, executing I2 or modifying product code.

# Evidence expected

Transition-event schema/builder, transition-specific evidence validation, malformed/future/incompatible evidence tests, changed-file list and full verification output.

# Escalation

Stop if causal evidence requires fabricated timestamps, weakening final DONE evidence, changing public product contracts or expanding into orchestrator/I2 execution.
