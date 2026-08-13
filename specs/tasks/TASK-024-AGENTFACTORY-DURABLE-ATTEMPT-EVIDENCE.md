---
id: TASK-024
title: Persist durable AgentFactory attempt evidence
status: ready
priority: 48
milestone: I2-READINESS
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-019
context_paths:
  - AGENTS.md
  - project_docs/execution_governance/EVIDENCE_PROTOCOL.md
  - project_docs/execution_governance/READINESS_AND_DONE.md
  - project_docs/agentfactory_ignition/10-evidence-engine/README.md
  - project_docs/agentfactory_ignition/10-evidence-engine/scope/README.md
  - project_docs/agentfactory_ignition/10-evidence-engine/WBS.md
  - specs/tasks/TASK-024-AGENTFACTORY-DURABLE-ATTEMPT-EVIDENCE.md
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/execution-harness.ts
  - tooling/agent-harness/src/validation-engine.ts
  - tooling/agent-harness/src/evidence-writer.ts
allowed_paths:
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/tests/evidence-writer.test.ts
  - specs/tasks/TASK-024-AGENTFACTORY-DURABLE-ATTEMPT-EVIDENCE.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/execution-harness.ts
  - tooling/agent-harness/src/validation-engine.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/readiness-recompute.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/git-workflow.ts
max_files: 4
validation:
  - npm run verify
---

# Objective

Persist deterministic, append-only evidence for both accepted and failed AgentFactory execution attempts, with observed timing and stable failure categorization required for I2 operations.

# Context

The post-I1 review found a P1 gap: TASK-019's writer rejects executor/scope/validation failures instead of producing durable attempt evidence, while the governance protocol requires each executor run to remain auditable. It also found a P2 observability gap: receipts carry attempts and optional duration but not observed start/end timestamps. The accepted TASK-012 `ExecutionResult` already supports `FAILED`, `BLOCKED` and `NEEDS_DECISION`; no new architecture boundary is required.

# Current behavior

`buildAgentFactoryEvidence` only accepts structured executor success with non-failing validation and PASS acceptance. Controlled failures are represented transiently in test logic/journals but cannot be written through the append-only evidence interface. Timing and failure category are not bound into the evidence hash.

# Required change

Add a runtime-validated attempt-evidence builder that consumes the existing execution boundary/completion and independent validation receipt, derives `DONE`, `FAILED`, `BLOCKED` or `NEEDS_DECISION` without trusting executor self-declaration, records observed start/end timestamps, derives duration and a stable failure category, and produces the same append-only content-addressed envelope family. Preserve the accepted-only builder as a compatibility guard for callers that require DONE/NEEDS_DECISION evidence. Identity divergence must still fail closed.

# Inputs / contracts

TASK-012 `ExecutionResult`; TASK-017 `ExecutionBoundaryCompletion`; TASK-018 `ValidationGateReceipt`; observed attempt start/end timestamps; existing acceptance/gate/metrics metadata.

# Outputs / contracts

A schema-validated content-addressed AgentFactory attempt envelope for successful, failed, blocked and review-required outcomes, including task/source/head/executor/model, validation, observed start/end, derived duration and stable failure category.

# Acceptance criteria

- Executor/scope/validation failure produces a valid non-DONE `ExecutionResult` and append-only receipt rather than throwing solely because the attempt failed.
- The writer, not the executor, derives final status and failure category from enforced completion plus independent validation.
- `DONE` still requires structured executor success, PASS validation, PASS acceptance and no blocked gates.
- Task/WP/source/attempt/changed-file identity divergence remains rejected.
- Observed start/end timestamps are required, ordered and included in content hashing; duration is deterministically derived rather than estimated.
- Executor/model, validation result, retries/attempt number, outcome, failure category and evidence path remain queryable from the receipt.
- Repeated equivalent input is byte-identical; an occupied divergent path is never overwritten.
- Tests cover executor failure, scope-blocked output, validation failure, accepted success, invalid timing and identity mismatch.
- `npm run verify` passes.

# Non-goals

Changing TASK-012 contracts, ledger transition policy, orchestrator sequencing, GitHub lifecycle, provider token accounting, retry scheduling, I2 execution or product code.

# Evidence expected

Attempt-envelope schema/types, accepted compatibility wrapper, table-driven success/failure tests, append-only write assertions, changed-file list and full verification output.

# Rollback / failure considerations

The change is additive inside the evidence module. If a caller cannot supply trustworthy observed timestamps or structured identity, it must fail closed and retain its existing execution journal; it must not fabricate timing or downgrade to prose-only success.

# Escalation

Stop if failure evidence requires weakening TASK-012 DONE invariants, accepting unbound executor output, inventing provider usage, changing public product contracts or bypassing independent validation.
