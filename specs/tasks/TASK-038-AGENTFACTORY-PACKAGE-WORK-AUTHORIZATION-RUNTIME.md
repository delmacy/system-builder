---
id: TASK-038
title: Implement and prove bounded package work authorization
status: ready
priority: 1
milestone: I2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-037
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/adr/ADR-0010-durable-human-approval.md
  - docs/adr/ADR-0013-bounded-package-work-authorization.md
  - project_docs/execution_governance/HUMAN_APPROVAL.md
  - project_docs/execution_governance/GOVERNANCE_GATES.md
  - project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md
  - project_docs/agentfactory_i2/I2_EXIT_GATE.md
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/task.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/tests/human-approval.test.ts
  - tooling/agent-harness/tests/github-lifecycle.test.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
  - tooling/agent-harness/tests/task.test.ts
allowed_paths:
  - tooling/agent-harness/src/package-authorization.ts
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/task.ts
  - tooling/agent-harness/src/harness.ts
  - tooling/agent-harness/tests/package-authorization.test.ts
  - tooling/agent-harness/tests/human-approval.test.ts
  - tooling/agent-harness/tests/github-lifecycle.test.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
  - tooling/agent-harness/tests/task.test.ts
  - project_docs/execution_governance/HUMAN_APPROVAL.md
forbidden_paths:
  - tooling/agent-harness/src/supervisor-*.ts
  - tooling/agent-harness/src/pipeline-supervisor.ts
  - tooling/agent-harness/src/sequential-pipeline.ts
  - tooling/agent-harness/policies/HUMAN_APPROVAL.json
  - specs/contracts/**
  - packages/**
  - apps/**
max_files: 12
validation:
  - npm run verify
---

# TASK-038 — AgentFactory Package Work Authorization Runtime

## Objective

Implement and prove the minimum fail-closed package-authorization channel
accepted by ADR-0013 so a later signed 20–50 descriptor package can authorize
routine conforming implementation and state PRs without a new signature for
each PR.

## Context

TASK-037/ADR-0013 is integrated and state-closed. The current runtime knows
only GitHub review and exact ADR-0010 durable approval. Task metadata has no
package/descriptor binding, `LocalHarnessAdapter.approvalFor` loads only an
exact task/PR receipt, and `GitHubLifecycleReceipt` has no package channel.

Package mode must be implemented and proved before the first real package is
signed. The active `HUMAN_APPROVAL.json` must remain `SOLO_DURABLE` throughout
this task so TASK-038 itself and its closure continue under the accepted exact
approval path.

## Current behavior

`evaluateStoredHumanApproval` reads
`TASK-ID-PR-NUMBER-HEADSHA.json` from the external store. A valid result or an
independent GitHub review can satisfy lifecycle review; all other missing review
states stop. No immutable package plan/receipt, descriptor conformance,
revocation/expiry/budget evaluation or package-use audit receipt exists.

## Required change

- Add strict versioned schemas/types and canonical content-derived IDs for
  `PackageAuthorizationPlan`, descriptor, signed receipt, revocation,
  `PackageTaskConformance`, evaluation and `PackageUseReceipt`.
- Reuse the configured external read-only approval store and authorized public
  keys without exposing a signing function or private-key path.
- Support 20–50 unique ordered descriptors and validate package baseline,
  focus, validity, risk, path, executor/model, validation, DAG, action/attempt,
  consecutive-failure and exhaustion bounds.
- Add an optional strict package binding to task metadata. Existing task specs
  must remain valid and unchanged. A bound task must cite package ID/hash and
  one descriptor ID plus the descriptor's exact objective/output identifiers.
- Deterministically prove that task metadata narrows the descriptor: required
  predecessors/gates remain, allowed paths are a subset, forbidden paths are
  preserved, limits are not exceeded and executor/model/validation/DoR/DoD are
  equal or stricter. Semantic authority must come from exact signed descriptor
  identifiers/strings, never an LLM judgment.
- Evaluate external signed authority, expiry, revocation, suspension/use state,
  baseline/protected-input observations and per-action budget at every use.
- Integrate a valid package evaluation as a distinct
  `PACKAGE_AUTHORIZATION` GitHub lifecycle channel for exact implementation and
  state PR identities. Preserve GitHub review and exact durable approval.
- Ensure package authority never clears failed/missing CI, failed validation,
  identity/evidence mismatch or `CHANGES_REQUESTED`.
- Reject package authority for architecture/public-contract/security/evaluator
  decisions, destructive data/release actions, waivers, scope/DAG drift or risk
  above the signed ceiling; these remain exact exceptions.
- Build deterministic `PackageUseReceipt` audit evidence bound to the exact
  package/descriptor/task/action/PR/refs/SHA/checks/validation and previous-use
  hash. Divergent append-only content must stop.
- Wire `LocalHarnessAdapter` to prefer independent GitHub review, then valid
  exact durable approval, then valid package authority only for an explicitly
  bound task. An unbound task must behave exactly as before.
- Export the public evaluator/schema/build functions needed by later bounded
  package creation and authority-closure integration.
- Update the operating documentation with external-store layout, evaluation
  order, exception behavior and the fact that no real package is activated.

## Inputs / contracts

ADR-0010/0013, current human approval policy/public key, task metadata,
`GitHubLifecycleReceipt`, exact PR observations, `LocalHarnessAdapter`, external
read-only approval store and repository Git ancestry/protected-input facts.

## Outputs / contracts

Versioned package authorization/conformance/use schemas and evaluator; optional
task package binding; lifecycle/orchestrator integration; deterministic proof
tests; documented inactive migration path for the first real package.

## Acceptance criteria

- Plans with 19 or 51 descriptors, duplicates, unsafe paths, invalid budgets or
  unknown fields fail schema/evaluation.
- Signature, identity, plan hash, policy/key, future/expiry and revocation
  failures block deterministically; no production signing capability exists.
- Conformance passes only for one exact unused descriptor and a narrowing task;
  path, risk, dependency, validation, executor/model or protected-baseline drift
  blocks with stable reason codes.
- A valid routine package evaluation can satisfy review for one exact green
  implementation PR and its exact green state PR.
- Architecture/contract/security/evaluator/data/release/waiver classes cannot
  use package authority and return an exception-required result.
- Package authority cannot override failed/missing checks, failed validation,
  requested changes, identity mismatch, exhaustion or suspension.
- Package-use receipts are byte-deterministic, exact-identity-bound, causally
  chained and append-only/divergence-safe.
- Existing `TEAM_INDEPENDENT` and `SOLO_DURABLE` tests and behavior remain
  compatible; unbound tasks never infer package authority.
- The active policy remains unchanged, no first real package is signed, and
  WP-I2-06, TASK-004, I3 and parallel scheduling are not executed.
- `npm run verify` passes.

## Non-goals

Create/sign the first real 20–50 task package, auto-generate its descriptors,
implement ADR-0012 authority closure, execute WP-I2-06/TASK-004, alter
Supervisor/callback/heartbeat scheduling, enable I3/parallelism, add a database,
webhook or UI, or weaken existing approval/CI/evidence controls.

## Evidence expected

Focused schema/signature/conformance/revocation/expiry/budget tests; green
implementation and state lifecycle proofs; exact-exception negative proofs;
unchanged legacy approval tests; `npm run verify`; no active package artifact.

## Escalation

Stop if implementation needs a mutable package plan, private-key/signing access,
semantic LLM approval, automatic ADR acceptance, changes to forbidden policy or
Supervisor paths, relaxed CI/evidence identity, or authority outside the signed
descriptor and exact PR action.
