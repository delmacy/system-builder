---
id: TASK-039
title: Bootstrap package task-spec delivery and real-run authority closure
status: completed
priority: 1
milestone: I2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: codex
depends_on:
  - TASK-010
  - TASK-036
  - TASK-038
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/adr/ADR-0010-durable-human-approval.md
  - docs/adr/ADR-0012-agentfactory-real-run-authority-integration.md
  - docs/adr/ADR-0013-bounded-package-work-authorization.md
  - project_docs/execution_governance/GOVERNANCE_GATES.md
  - project_docs/execution_governance/HUMAN_APPROVAL.md
  - project_docs/agentfactory_i1/IMPLEMENTATION_GENERATION_RULE.md
  - project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md
  - project_docs/agentfactory_i2/SEQUENTIAL_PIPELINE.md
  - project_docs/agentfactory_i2/I2_EXIT_GATE.md
  - tooling/agent-harness/src/package-authorization.ts
  - tooling/agent-harness/src/git-workflow.ts
  - tooling/agent-harness/src/cli.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/sequential-pipeline.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/tests/package-authorization.test.ts
  - tooling/agent-harness/tests/git-workflow.test.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
  - tooling/agent-harness/tests/sequential-pipeline.test.ts
allowed_paths:
  - tooling/agent-harness/src/package-task-materializer.ts
  - tooling/agent-harness/src/package-authorization.ts
  - tooling/agent-harness/src/git-workflow.ts
  - tooling/agent-harness/src/cli.ts
  - tooling/agent-harness/src/authority-closure.ts
  - tooling/agent-harness/src/orchestrator-runtime.ts
  - tooling/agent-harness/src/sequential-pipeline.ts
  - tooling/agent-harness/src/evidence-writer.ts
  - tooling/agent-harness/tests/package-task-materializer.test.ts
  - tooling/agent-harness/tests/authority-closure.test.ts
  - tooling/agent-harness/tests/orchestrator.test.ts
  - tooling/agent-harness/tests/sequential-pipeline.test.ts
forbidden_paths:
  - tooling/agent-harness/src/supervisor-*.ts
  - tooling/agent-harness/src/pipeline-supervisor.ts
  - tooling/agent-harness/src/human-approval.ts
  - tooling/agent-harness/src/github-lifecycle.ts
  - tooling/agent-harness/src/ledger-engine.ts
  - tooling/agent-harness/src/readiness-recompute.ts
  - tooling/agent-harness/policies/**
  - docs/evidence/agentfactory/TASK-010/**
  - specs/contracts/**
  - packages/**
  - apps/**
max_files: 12
validation:
  - npm run verify
---

# TASK-039 — AgentFactory Package Spec and Authority Closure Bootstrap

## Objective

Close the two remaining I2 bootstrap gaps in one exact evaluator-governed task:
allow a signed package descriptor to deliver its rolling-wave task specification
without consuming the descriptor, and implement ADR-0012's prospective authority
closure bundle so real state PRs atomically integrate bootstrap and AgentFactory
authority.

## Context

TASK-038 is integrated and state-closed, and the owner signed
`PKG-AF-I2-I5-001` with 23 routine descriptors. The package evaluator already
authorizes exact implementation and state PRs for a task whose spec is present,
but the repository has no governed path to create that spec from the signed
descriptor. Requiring an exact signature for every rolling-wave spec PR would
defeat the accepted package operating model.

Separately, ADR-0012 is accepted but unimplemented. The preserved TASK-010
Supervisor run correctly stopped `EVIDENCE_MISSING`; bootstrap closure never
materialized AFEV, causal AgentFactory ledger or readiness authority. Both gaps
touch evaluators and therefore this task remains an exact exception outside the
routine package. Its completion unlocks PWD-AF-003; it is not package-authorized
and cannot authorize itself.

## Current behavior

Package actions are limited to implementation and state PR identities. Task
spec generation has no signed-plan loader, non-consuming conformance receipt or
bounded Git delivery path. The existing state closure stages only the bootstrap
task spec, task evidence and task ledger. `SequentialPipelineCoordinator`
reconciles completed bootstrap state before the remaining state branch actions,
and review-required validation cannot be resolved into final AFEV from an exact
eligible lifecycle decision.

## Required change

- Add a strict, deterministic package task-spec materializer that loads the
  exact signed plan from the external read-only store, validates package
  identity/signature/time/revocation/baseline and proves candidate task metadata
  narrows one descriptor before any Git action.
- Support a non-consuming `TASK_SPEC_PR` authorization/conformance path. It must
  bind package/plan/descriptor, candidate task hash, base/head/PR identity,
  required validation/checks and exact branch content, but must not emit or
  consume `PackageUseReceipt` authority.
- Deliver at most one task-spec action per invocation: validate a clean
  synchronized `main`, create the deterministic task branch, write only the
  candidate spec, validate the catalog, commit, push or open/observe its PR as
  separate restart-safe actions. Never overwrite refs or broaden the descriptor.
- Preserve the existing implementation/state consumption semantics and legacy
  GitHub/durable approval channels. An unbound task and an invalid package must
  behave exactly as before.
- Add one versioned prospective authority-closure builder for ADR-0012. Before
  a state commit, build the exact append-only bundle under
  `docs/evidence/agentfactory/<TASK-ID>/` from persisted execution/validation,
  implementation PR lifecycle, state identity, task/WP and source/head facts.
- The bundle must contain real AFATT attempt evidence when applicable, final
  AFEV, causal `ledger.json` and recomputed `readiness.json`. Reuse accepted I1
  schemas/builders; do not alias bootstrap evidence or hand-author historical
  TASK-010 authority.
- Add a versioned governance-resolution input for technically successful
  `REVIEW_REQUIRED` validation. It is valid only for the immutable validation
  receipt/change fingerprint plus exact eligible implementation PR lifecycle
  and named successful checks. It cannot resolve any technical failure,
  missing evaluator, scope/content mutation or ineligible lifecycle.
- Expand state delivery to an exact computed closure manifest containing the
  three bootstrap closure files plus the task-specific AgentFactory bundle.
  Staging remains allowlist-only, append-only and divergence-safe.
- Amend sequential ordering only for the selected task whose bootstrap state is
  completed while deterministic state delivery remains pending. Delegate one
  existing closure action, preserve all external gates, and reconcile final
  authority only after the state PR merges and synchronized `main` contains the
  exact bundle.
- Preserve the terminal TASK-010 Supervisor history, Supervisor/callback/
  heartbeat behavior, one-action semantics, approval policy, existing public
  evidence/ledger/readiness contracts and the prohibition on TASK-004/I3.

## Inputs / contracts

ADR-0012/0013; signed package plan/receipt; task metadata/catalog; validation
receipt and change fingerprint; persisted executor journal; hardened
implementation/state PR observations; I1 AFEV/AFATT, ledger and readiness
builders; bootstrap closure manifest; sequential coordinator observation.

## Outputs / contracts

Non-consuming package task-spec authorization and restart-safe materializer;
versioned governance-resolution input; deterministic prospective authority
closure bundle; exact state manifest delivery; closure-pending sequential
ordering; focused integration proof.

## Acceptance criteria

- Missing/malformed/expired/revoked/mismatched package authority, protected
  baseline drift, descriptor/path/risk/DAG/DoR/DoD drift or dirty/non-main Git
  state blocks task-spec materialization before mutation.
- A valid signed routine descriptor produces byte-identical conformance for one
  candidate task spec and can deliver its spec PR through one safe action per
  invocation without consuming or transferring the descriptor.
- A task-spec PR still requires exact identity, `npm run verify`, named green CI
  and no requested changes; package authority cannot override those facts.
- The descriptor becomes consumed only by its accepted implementation identity;
  its exact state identity remains permitted only after that implementation use.
- A real prospective state closure produces the exact AFATT/AFEV/ledger/
  readiness bundle from persisted observations and stages only the computed
  closure manifest. Repeated construction is byte-identical; divergence stops.
- `REVIEW_REQUIRED` becomes resolvable only through the exact eligible lifecycle
  and immutable validation identity described by ADR-0012; all technical failure
  variants remain blocked.
- A completed bootstrap task with pending state delivery advances exactly one
  selected-task closure action; no successor becomes READY until merged bundle,
  bootstrap ledger and AgentFactory authority reconcile on synchronized `main`.
- Preserved TASK-010 terminal events/evidence are byte-unchanged, TASK-004 is not
  executed, no Supervisor/policy/public-contract file changes, and no I3 or
  parallel scheduling occurs.
- Existing package, Git workflow, evidence, orchestrator and sequential tests
  remain green; focused prospective happy/failure/restart proofs pass.
- `npm run verify` passes.

## Non-goals

Backfill or rewrite TASK-010 authority/history; execute TASK-004/005/006; sign
or amend a package; accept an architecture/contract/security/evaluator decision
through package authority; modify Supervisor scheduling, callback or heartbeat;
enable I3/parallelism; change product/runtime contracts; add database, UI,
webhook or broad observability.

## Evidence expected

Focused package-spec fail-closed and non-consumption tests; one-action Git
restart/idempotency tests; governance-resolution positive and negative tests;
prospective authority-bundle byte-determinism/divergence tests; exact state
manifest tests; closure-pending sequential happy/failure proof; unchanged
TASK-010 terminal-history hash; `npm run verify`.

## Escalation

Stop if a task spec cannot be authorized without consuming implementation
authority, if package intent would accept evaluator content, if authority cannot
be built prospectively inside the same state PR, if existing public contracts or
Supervisor policy must change, if TASK-010 history would be rewritten, or if
files outside the declared scope are required.
