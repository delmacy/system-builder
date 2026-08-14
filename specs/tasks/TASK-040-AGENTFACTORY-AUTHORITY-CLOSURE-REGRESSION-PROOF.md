---
id: TASK-040
title: Prove prospective authority closure regressions
status: ready
priority: 1
milestone: I2
model_tier: free
risk: medium
architecture_impact: false
executor_preference: opencode
depends_on:
  - TASK-039
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/adr/ADR-0012-agentfactory-real-run-authority-integration.md
  - docs/adr/ADR-0013-bounded-package-work-authorization.md
  - specs/tasks/TASK-039-AGENTFACTORY-PACKAGE-SPEC-AND-AUTHORITY-CLOSURE-BOOTSTRAP.md
  - tooling/agent-harness/src/authority-closure.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/sequential-pipeline.ts
  - tooling/agent-harness/tests/authority-closure.test.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
  - tooling/agent-harness/tests/sequential-pipeline.test.ts
allowed_paths:
  - tooling/agent-harness/tests/authority-closure.test.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
  - tooling/agent-harness/tests/sequential-pipeline.test.ts
  - project_docs/agentfactory_i2/AUTHORITY_CLOSURE_PROOF.md
forbidden_paths:
  - apps/**
  - packages/**
  - .github/**
  - tooling/agent-harness/policies/**
  - specs/contracts/**
  - docs/adr/**
max_files: 4
validation:
  - npm run verify
package_authorization:
  package_id: PKG-AF-I2-I5-001
  package_version: 1.0.0
  plan_hash: bc4057ba2ae0e7453a194d4182bf9ee6fe468094711906dc68b25eda68cc8c60
  descriptor_id: PWD-AF-003
  objective_id: authority-closure-regression-proof
  output_ids:
    - authority-closure-regression-suite-v1
  governance_classes:
    - ROUTINE
  dor_ids:
    - DOR-PREDECESSORS-INTEGRATED
    - DOR-PACKAGE-CONFORMANCE-PASS
  dod_ids:
    - DOD-VERIFY-PASS
    - DOD-IMPLEMENTATION-AND-STATE-CLOSED
---

# TASK-040 — AgentFactory Authority Closure Regression Proof

## Objective

Prove the integrated TASK-039 authority-closure and closure-pending behavior
against prospective, restart-safe happy and failure paths without changing the
accepted runtime implementation.

## Context

TASK-039 integrated the non-consuming package task-spec path and ADR-0012
authority closure. This first routine package task must exercise the real
interfaces that are now on `main`, strengthen regression coverage where needed
and record the bounded proof before a fresh real authority reconciliation task.

## Current behavior

The implementation has focused unit coverage for deterministic AFATT/AFEV,
ledger/readiness, append-only manifests and closure-pending delegation. A
separate package-authorized regression task is required to prove the integrated
surface from actual accepted outputs and to make any remaining gap explicit
without modifying evaluator or runtime code.

## Required change

- Extend only the declared authority-closure, orchestrator and sequential tests
  to cover prospective persisted-journal input, eligible implementation
  lifecycle, exact state manifest, restart/idempotency and external-gate stops.
- Prove that `REVIEW_REQUIRED` resolves only for the immutable validation
  receipt, change fingerprint, successful named checks and eligible lifecycle.
- Prove that technical failure, missing evaluator, content mutation, identity
  drift, divergent append-only content and premature successor readiness remain
  blocked.
- Record the exact integrated proof and validation results in
  `AUTHORITY_CLOSURE_PROOF.md`.
- Do not change production runtime/evaluator code in this task. If the proof
  exposes a product defect, stop and report the bounded finding for a successor
  descriptor instead of broadening this task.

## Inputs / contracts

Integrated TASK-039 authority-closure, evidence, Git state-manifest,
orchestrator runtime and sequential coordinator interfaces; ADR-0012; signed
package descriptor `PWD-AF-003`.

## Outputs / contracts

`authority-closure-regression-suite-v1`: deterministic regression tests and one
versioned proof document covering prospective authority closure and recovery.

## Acceptance criteria

- The proof uses the integrated TASK-039 interfaces without mocking completion
  authority or editing production files.
- Happy-path evidence includes AFATT, final AFEV, accepted causal ledger,
  recomputed readiness and exact manifest membership.
- Restart repeats no external action and produces byte-identical bundle output.
- Every declared governance-resolution and state-delivery failure remains
  fail-closed, and no successor is selected before integrated reconciliation.
- No `PackageUseReceipt` is consumed by this task specification PR.
- `npm run verify` passes.

## Non-goals

Change authority/evaluator/runtime policy; alter Supervisor behavior; rewrite
TASK-010 history; execute TASK-004 or I3; add parallelism, database, UI or
public webhook; amend or re-sign the package.

## Evidence expected

Focused test names and assertions, byte-determinism comparison, append-only
divergence failure, closure-pending coordinator proof, unchanged production
diff and successful full repository verification.

## Escalation

Stop if the integrated implementation cannot pass the proof without changing a
production/evaluator file, if package conformance fails, or if any behavior
would weaken CI, lifecycle eligibility, append-only evidence or successor DAG
gates.
