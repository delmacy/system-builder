# TASK-013 — AgentFactory OpenCode adapter hardening

## Objective
Harden the OpenCode adapter so AgentFactory can execute one bounded non-interactive task and return structured execution status for I1.

## Parent
- Ignition milestone: I1
- Work Package: WP-I1-05

## Predecessor gate
`TASK-011` must be merged into current `main`, or its confirmed argument-order fix must be reconciled/reimplemented explicitly in this task before completion. Do not assume an old unmerged branch is part of the baseline.

## In scope
- deterministic OpenCode command construction;
- explicit model/agent selection inputs;
- bounded timeout/retry behavior permitted by governance;
- capture exit code/stdout/stderr in a structured adapter result;
- tests for argument ordering and failure propagation;
- preserve noninteractive execution.

## Out of scope
- model-routing policy engine;
- DAG scheduler;
- GitHub PR creation;
- autonomous retries beyond bounded adapter semantics;
- persistent `opencode serve` optimization.

## Dependencies
- TASK-011 merge/reconciliation gate;
- TASK-012 contracts for structured request/result when available. If TASK-013 starts earlier, any narrow adapter-internal shape must be reconciled before I1 closure.

## Acceptance criteria
1. OpenCode invocation order matches supported CLI semantics.
2. Prompt/file/model arguments are deterministic and covered by tests.
3. Non-zero exit and timeout propagate as failure, never false success.
4. Adapter does not bypass allowed-path/governance controls owned by the harness.
5. `npm run verify` passes.

## Allowed paths
- `tooling/agent-harness/src/executor.ts`
- OpenCode executor-specific harness files/tests.
- this task spec/evidence references where required.

## Forbidden
- changing product code;
- weakening permissions or evaluator tests;
- redesigning the whole harness.

## Evidence
Include exact command shape under tests, failure cases, verify result and relationship to TASK-011.

## Model routing
- Tier: T1 cheap executor with independent review
- Risk: medium
- Architecture impact: false unless implementation exposes a new public executor abstraction.
