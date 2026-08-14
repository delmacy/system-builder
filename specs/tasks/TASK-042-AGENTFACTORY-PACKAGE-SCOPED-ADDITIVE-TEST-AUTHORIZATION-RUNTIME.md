---
id: TASK-042
title: Implement package-scoped additive test authorization
status: ready
priority: 1
milestone: I2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-041
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - docs/adr/ADR-0010-durable-human-approval.md
  - docs/adr/ADR-0013-bounded-package-work-authorization.md
  - docs/adr/ADR-0014-package-scoped-test-evaluator-authorization.md
  - project_docs/agentfactory_i2/PACKAGE_AUTHORIZATION_OPERATIONAL_FINDING.md
  - specs/tasks/TASK-038-AGENTFACTORY-PACKAGE-WORK-AUTHORIZATION-RUNTIME.md
  - specs/tasks/TASK-039-AGENTFACTORY-PACKAGE-SPEC-AND-AUTHORITY-CLOSURE-BOOTSTRAP.md
  - tooling/agent-harness/src/package-authorization.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/validation-engine.ts
  - tooling/agent-harness/tests/package-authorization.test.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
allowed_paths:
  - tooling/agent-harness/src/package-authorization.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/tests/package-authorization.test.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
  - project_docs/agentfactory_i2/PACKAGE_SCOPED_TEST_AUTHORIZATION_PROOF.md
forbidden_paths:
  - apps/**
  - packages/**
  - .github/**
  - tooling/agent-harness/src/validation-engine.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/src/supervisor-*.ts
  - tooling/agent-harness/src/pipeline-supervisor.ts
  - tooling/agent-harness/policies/**
  - specs/contracts/**
  - docs/adr/**
max_files: 5
validation:
  - npm run verify
---

# TASK-042 — Package-scoped Additive Test Authorization Runtime

## Objective

Implement ADR-0014's deterministic additive-test classification so a newly
signed package can authorize routine tasks that create an explicitly named test
file or append bytes to an unchanged signed-baseline test blob, without
falsifying `REVIEW_REQUIRED` or weakening exact exception gates.

## Context

TASK-041 accepted ADR-0014 after TASK-040 proved that the current package
evaluator rejects every test-changing task as `VALIDATION_FAILED`, emits no
implementation PUSE and breaks descriptor predecessors. The active package is
immutable and cannot use this new rule. This task implements the correction
before a replacement package is built and signed.

## Current behavior

`PackageAuthorizationExpected` carries only the validation decision and named
checks. `evaluatePackageAuthorization` requires literal `PASS`, and PUSE schema
version 1 also serializes only `PASS`. `LocalHarnessAdapter` has the full
independent validation receipt but forwards only its decision. The lifecycle
already accepts a valid package channel for `REVIEW_REQUIRED`; no GitHub
lifecycle policy change is required.

## Required change

- Add a strict versioned additive-test proof/classification bound to package
  baseline, source/head identity and exact changed evaluator paths.
- Load the immutable independent validation receipt at implementation PR
  evaluation and pass its exact evaluator changes, missing-evaluator,
  content-stability, commands and reason codes into package evaluation.
- For each changed evaluator, require a literal file path in the signed
  descriptor. Reject globs, directories, protected/config/policy/production
  evaluator paths, absent head files, non-regular Git objects, deletes, renames,
  case ambiguity and blob-read failures.
- Read Git blob bytes from the signed `baseline_commit` and exact implementation
  `head_sha`. Accept only a new head file absent at baseline or head bytes whose
  strict prefix equals the complete non-empty baseline blob and whose length is
  greater. Do not use working-tree bytes or line-ending normalization.
- Preserve the original validation receipt as `REVIEW_REQUIRED`. Package
  authority is eligible only when its sole reason is `EVALUATOR_CHANGED`, every
  command passed, no evaluator is missing, content is stable and every changed
  evaluator has a valid additive proof.
- Evolve PUSE append-only audit semantics without invalidating schema-version-1
  historical receipts. A new implementation PUSE must record
  `REVIEW_REQUIRED`, classification, exact paths and baseline/head blob hashes;
  it must never serialize the validation as `PASS`. Existing v1 chains remain
  readable and byte-unchanged.
- Preserve exact implementation/state consumption, previous-use chaining,
  restart/idempotency, predecessor, expiry/revocation/suspension/budget and
  divergence behavior. A state action remains eligible only after the exact
  accepted implementation PUSE.
- Add deterministic positive and negative package/orchestrator proofs and a
  versioned proof document.

## Inputs / contracts

ADR-0013/0014; signed package plan/descriptor and baseline commit; immutable
`ValidationGateReceipt`; exact PR/base/head identity; existing v1 PUSE chain;
Git blob/object facts; hardened lifecycle checks.

## Outputs / contracts

Backward-compatible PUSE parsing plus a versioned additive-test authorization
record, fail-closed Git-baseline classifier, runtime receipt propagation and
`PACKAGE_SCOPED_TEST_AUTHORIZATION_PROOF.md`.

## Acceptance criteria

- A package-bound routine implementation with one exact new test file and only
  `EVALUATOR_CHANGED` becomes `VALID`, keeps validation `REVIEW_REQUIRED` and
  emits a deterministic auditable implementation PUSE.
- A strict byte-prefix append to an exact baseline test file is eligible; same
  bytes, changed existing bytes, truncation, deletion, rename, replacement,
  glob-only authorization and non-test/protected evaluator paths are blocked.
- Failed/timed-out commands, extra reason codes, missing evaluators, content
  mutation, failed/missing checks and identity/scope/DAG drift remain blocked.
- Head content is read from the exact PR SHA and baseline content from the signed
  package commit; dirty working-tree content cannot affect the decision.
- Historical schema-version-1 PUSE receipts remain valid and unchanged; new
  review-required receipts cannot claim validation `PASS` and remain
  append-only/idempotent/divergence-safe.
- State PUSE and successor descriptor conformance work only after the accepted
  implementation PUSE; no use is backfilled for TASK-040/PWD-AF-003.
- Existing `PASS` package behavior, exact durable/GitHub channels, independent
  validation receipt, authority closure and lifecycle behavior remain green.
- `validation-engine.ts`, GitHub lifecycle policy, Supervisor, package policy,
  ADRs, contracts, CI and application/product files are unchanged.
- `npm run verify` passes.

## Non-goals

Reissue/sign a package; reinterpret the active package; materialize or execute
the fresh proof; edit existing test lines under package authority; change
independent evaluator classification; execute TASK-004/I3; add parallelism,
database, UI, webhook or public product contracts.

## Evidence expected

Focused new-file/prefix-append happy tests; mutation/deletion/rename/glob/
protected-path/technical-failure negative tests; v1 compatibility and v2 PUSE
determinism tests; orchestrator propagation proof; exact Git blob identities;
proof document; full successful repository verification.

## Escalation

Stop if implementation requires changing `validation-engine.ts`, accepting
semantic test weakening, normalizing baseline bytes, reinterpreting existing
authority, mutating historical PUSE receipts, weakening CI/lifecycle/evidence,
or editing a path outside this task contract.
