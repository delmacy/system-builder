---
id: TASK-023
title: Prove the AgentFactory I1 end-to-end slice
status: completed
priority: 47
milestone: I1
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-013
  - TASK-015
  - TASK-016
  - TASK-017
  - TASK-018
  - TASK-019
  - TASK-020
  - TASK-021
  - TASK-022
context_paths:
  - AGENTS.md
  - project_docs/agentfactory_i1/WBS_DICTIONARY.md
  - project_docs/agentfactory_i1/I1_EXIT_GATE.md
  - project_docs/execution_governance/READINESS_AND_DONE.md
  - project_docs/execution_governance/EVIDENCE_PROTOCOL.md
  - specs/tasks/TASK-023-AGENTFACTORY-I1-END-TO-END-PROOF.md
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/task-pack.ts
  - tooling/agent-harness/src/model-router.ts
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/src/execution-harness.ts
  - tooling/agent-harness/src/validation-engine.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/readiness-recompute.ts
allowed_paths:
  - tooling/agent-harness/src/i1-proof.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/tests/**
  - docs/evidence/agentfactory/i1/**
  - specs/tasks/TASK-023-AGENTFACTORY-I1-END-TO-END-PROOF.md
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
  - docs/current/**
  - project_docs/agentfactory_i1/I1_EXIT_GATE.md
  - tooling/agent-harness/src/execution-contracts.ts
  - tooling/agent-harness/src/task-pack.ts
  - tooling/agent-harness/src/model-router.ts
  - tooling/agent-harness/src/executor.ts
  - tooling/agent-harness/src/execution-harness.ts
  - tooling/agent-harness/src/validation-engine.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/readiness-recompute.ts
  - tooling/agent-harness/src/orchestrator.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/git-workflow.ts
max_files: 8
validation:
  - npm run verify
---

# Objective

Produce deterministic end-to-end proof that the integrated AgentFactory I1 components can carry one representative bounded low-risk task from READY through execution, validation, evidence, accepted integration, DONE and successor readiness, while a controlled failure stops without corrupting state.

# Context

WP-I1-12 is now executable because TASK-013 and TASK-015 through TASK-022 are integrated. Their actual interfaces cover deterministic Task Pack generation, route selection, bounded OpenCode invocation, execution-delta enforcement, independent validation, append-only evidence, GitHub lifecycle eligibility, legal ledger transitions and affected-only readiness recomputation. The proof must compose those interfaces rather than create substitute contracts or mark the exit gate by assertion.

# Current behavior

Each I1 component has isolated deterministic tests and has passed its own real GitHub PR/check/state-closure lifecycle. No single proof fixture currently drives the complete component chain or emits one schema-validated proof receipt that binds the happy path and controlled failure outcome.

# Required change

Implement a deterministic I1 proof coordinator/receipt and end-to-end tests using a representative bounded low-risk task fixture. Invoke the actual integrated component APIs in pipeline order. Exercise the real `OpenCodeExecutor` noninteractive command construction through a controlled local command runner, then feed its structured result through boundary enforcement and independent validation. Build TASK-019 evidence, evaluate an eligible TASK-020 lifecycle observation, apply legal TASK-021 transitions through DONE, and use TASK-022 to expose the successor READY delta. Also run a controlled executor/scope or validation failure and prove the pre-failure authoritative task/DAG state is preserved. Persist a reproducible machine-readable proof artifact generated from the validated receipt.

# Inputs / contracts

Integrated TASK-013 and TASK-015 through TASK-022 public/internal TypeScript interfaces; representative TASK-012-compatible task/gate/graph fixtures; controlled command-runner observations; explicitly supplied deterministic timestamps and Git identities.

# Outputs / contracts

A runtime-validated I1 proof receipt and persisted JSON evidence containing component identities, happy-path stage decisions, final DONE state, successor READY delta, controlled-failure decision and unchanged-state proof.

# Acceptance criteria

- One representative low-risk task traverses READY -> deterministic Task Pack -> selected route -> bounded OpenCode adapter result -> enforced delta -> independent validation PASS -> TASK-019 evidence -> TASK-020 integration eligibility -> legal TASK-021 DONE -> TASK-022 newly READY successor.
- The proof uses actual integrated component functions/classes; it does not reimplement their decision logic or bypass their schemas.
- OpenCode invocation is noninteractive, bounded and contains the exact prompt/file/model ordering through a controlled runner; no live model/network dependency makes verification nondeterministic.
- A controlled failure is rejected before DONE and preserves the prior authoritative task and graph semantically unchanged while retaining failure evidence.
- The proof receipt is runtime validated, deterministic for identical supplied inputs, and persisted without overwriting divergent evidence.
- Tests assert every stage identity and decision, happy-path final state/readiness, failure stop point and state preservation.
- Real PR/check/state-closure evidence for TASK-023 is required before assessing the separate I1 Exit Gate; this task must not mark the gate GO itself.
- `npm run verify` passes.

# Non-goals

I2 scheduling, product M1 execution, live model calls in CI, autonomous merge authority, changes to integrated I1 contracts, broad orchestrator redesign, or declaring I1 GO before TASK-023 state closure is integrated.

# Evidence expected

I1 proof schema/coordinator, end-to-end happy/failure tests, deterministic persisted proof JSON, component-stage assertions, task verification output and subsequent real GitHub implementation/state PR evidence.

# Escalation

Stop if the proof exposes an incompatible integrated interface, requires weakening an I1 evaluator, requires product code changes, or cannot demonstrate safe failure without changing architecture. Record the failed exit-gate item instead of advancing to I2.
