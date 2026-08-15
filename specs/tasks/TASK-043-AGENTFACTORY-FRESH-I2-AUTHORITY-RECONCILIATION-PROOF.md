---
id: TASK-043
title: Prove fresh real I2 authority reconciliation
status: ready
priority: 1
milestone: I2
model_tier: free
risk: medium
architecture_impact: false
executor_preference: opencode
depends_on:
  - TASK-042
  - TASK-043-CI
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/adr/ADR-0012-agentfactory-real-run-authority-integration.md
  - docs/adr/ADR-0013-bounded-package-work-authorization.md
  - docs/adr/ADR-0014-package-scoped-test-evaluator-authorization.md
  - specs/tasks/TASK-040-AGENTFACTORY-AUTHORITY-CLOSURE-REGRESSION-PROOF.md
  - specs/tasks/TASK-042-AGENTFACTORY-PACKAGE-SCOPED-ADDITIVE-TEST-AUTHORIZATION-RUNTIME.md
  - project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md
  - project_docs/agentfactory_i2/AUTHORITY_CLOSURE_PROOF.md
  - project_docs/agentfactory_i2/PACKAGE_SCOPED_TEST_AUTHORIZATION_PROOF.md
  - docs/evidence/tasks/TASK-040.json
  - docs/evidence/agentfactory/TASK-040/manifest.json
  - docs/evidence/agentfactory/TASK-040/ledger.json
  - docs/evidence/agentfactory/TASK-040/readiness.json
  - tooling/agent-harness/src/authority-closure.ts
  - tooling/agent-harness/src/sequential-pipeline.ts
  - tooling/agent-harness/src/supervisor-runtime.ts
allowed_paths:
  - tooling/agent-harness/src/i2-authority-proof.ts
  - tooling/agent-harness/tests/i2-authority-proof.test.ts
  - project_docs/agentfactory_i2/AUTHORITY_RECONCILIATION_PROOF.md
forbidden_paths:
  - apps/**
  - packages/**
  - .github/**
  - tooling/agent-harness/policies/**
  - specs/contracts/**
  - docs/adr/**
max_files: 3
validation:
  - npm run verify
package_authorization:
  package_id: PKG-AF-I2-I5-002
  package_version: 1.0.0
  plan_hash: ddeb69236c420dde6e550e634d03c7bc8e90562d59d9aa0b5e57585323211fab
  descriptor_id: PWD-AF-004
  objective_id: fresh-real-authority-reconciliation-proof
  output_ids:
    - fresh-i2-authority-proof-v1
  governance_classes:
    - ROUTINE
  dor_ids:
    - DOR-PREDECESSORS-INTEGRATED
    - DOR-PACKAGE-CONFORMANCE-PASS
  dod_ids:
    - DOD-VERIFY-PASS
    - DOD-IMPLEMENTATION-AND-STATE-CLOSED
---

# TASK-043 — Fresh Real I2 Authority Reconciliation Proof

## Objective

Prove from the integrated TASK-040 repository artifacts that one actual
AgentFactory run reconciles bootstrap completion with final AFEV, causal ledger,
readiness and exact state closure without rewriting historical runs.

## Context

TASK-040 produced the prospective real state closure after ADR-0012. TASK-041
and TASK-042 then preserved the failed original package history and integrated
the deterministic additive-test package evaluator. This replacement package's
first descriptor must now prove the real immutable TASK-040 authority bundle
before any I2 Exit Gate reassessment or product-chain authorization.

## Current behavior

The repository contains the integrated TASK-040 bundle and focused regression
coverage, but no bounded proof reader verifies the whole real identity chain
from synchronized repository files and emits a stable decision suitable for the
next governance gate.

## Required change

- Add a provider-neutral proof reader that consumes the integrated TASK-040
  task evidence, authority manifest, AFEV, ledger and readiness files.
- Recompute and verify exact file hashes, task/work-package/source/head/PR/state
  identities, lifecycle eligibility, causal DONE ledger and readiness facts.
- Return deterministic `GO` only when bootstrap and AgentFactory authorities
  reconcile; return fail-closed diagnostics for missing, mutated, divergent or
  premature evidence.
- Prove reruns are byte-identical and perform no Git, GitHub, task-selection,
  pipeline-event or repository writes.
- Record exact integrated identities and validation in
  `AUTHORITY_RECONCILIATION_PROOF.md`.

## Inputs / contracts

Integrated TASK-040 task evidence and authority closure bundle; ADR-0012;
SequentialPipelineCoordinator authority semantics; signed package descriptor
`PWD-AF-004`; integrated TASK-042 additive-test authorization runtime.

## Outputs / contracts

`fresh-i2-authority-proof-v1`: deterministic proof reader, focused tests and
versioned proof record bound to the real TASK-040 artifacts on `main`.

## Acceptance criteria

- Happy path consumes actual integrated TASK-040 files, not reconstructed,
  mocked or historical TASK-010 authority.
- Proof binds final AFEV and causal ledger to TASK-040, WP-I2-06,
  implementation PR #115/head, state PR #116/head and exact manifest.
- Missing files, hash mutation, wrong task/source/head/PR/state identity,
  non-eligible lifecycle, rejected ledger or inconsistent readiness produce a
  deterministic NO-GO with no side effect.
- The exact new test file is eligible only through ADR-0014 package-scoped
  additive-test authorization; validation remains `REVIEW_REQUIRED`.
- Repeated evaluation is byte-identical and does not select or execute TASK-004.
- Preserved TASK-010 terminal Supervisor history is unchanged.
- `npm run verify` passes.

## Non-goals

Reassess or pass the I2 Exit Gate; execute TASK-004/TASK-005/TASK-006; change
authority, coordinator, Supervisor, package, approval or lifecycle policy;
rewrite TASK-010 evidence; enter I3; add parallelism, database, UI or webhook.

## Evidence expected

Focused real-file happy/failure tests, exact hashes and Git identities,
byte-identical repeated result, zero-side-effect proof, versioned reconciliation
record and successful full repository verification.

## Escalation

Stop if the integrated TASK-040 chain cannot reconcile without changing an
accepted runtime/evaluator contract, if proof would infer missing authority, or
if package conformance, immutable evidence or DAG gates fail.
