---
id: TASK-041
title: Decide package-scoped test evaluator authorization
status: ready
priority: 1
milestone: I2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-040
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - docs/adr/ADR-0010-solo-maintainer-durable-human-approval.md
  - docs/adr/ADR-0012-agentfactory-real-run-authority-integration.md
  - docs/adr/ADR-0013-bounded-package-work-authorization.md
  - specs/tasks/TASK-038-AGENTFACTORY-PACKAGE-WORK-AUTHORIZATION-RUNTIME.md
  - specs/tasks/TASK-039-AGENTFACTORY-PACKAGE-SPEC-AND-AUTHORITY-CLOSURE-BOOTSTRAP.md
  - specs/tasks/TASK-040-AGENTFACTORY-AUTHORITY-CLOSURE-REGRESSION-PROOF.md
  - docs/evidence/agentfactory/TASK-040/manifest.json
  - tooling/agent-harness/src/validation-engine.ts
  - tooling/agent-harness/src/package-authorization.ts
allowed_paths:
  - docs/adr/ADR-0014-package-scoped-test-evaluator-authorization.md
  - project_docs/agentfactory_i2/PACKAGE_AUTHORIZATION_OPERATIONAL_FINDING.md
forbidden_paths:
  - apps/**
  - packages/**
  - .github/**
  - tooling/agent-harness/src/**
  - tooling/agent-harness/tests/**
  - tooling/agent-harness/policies/**
  - specs/contracts/**
max_files: 2
validation:
  - npm run verify
---

# TASK-041 — Package-scoped Test Evaluator Authorization ADR

## Objective

Decide the narrow governance boundary that lets one signed 20–50 task package
authorize task-scoped test changes explicitly frozen in its descriptors without
letting package authority change validation policy or weaken evaluator gates.

## Context

TASK-040 proved ADR-0012 but exposed an operational contradiction in ADR-0013:
all remaining signed descriptors include task tests, while independent
validation classifies every test path as `EVALUATOR_CHANGED`. The implementation
and state PRs therefore required exact approval, emitted no package-use receipt,
and left successor PWD-AF-004 blocked with `DEPENDENCY_DRIFT`. Reissuing the same
descriptor set cannot meet the owner's package-level authorization objective.

## Current behavior

Package authorization accepts only validation `PASS`. Any test change returns
`REVIEW_REQUIRED`, so package authority is invalid even when the exact test path,
risk, objective, output, validation and checks were owner-signed in the package.
Production evaluator/policy changes and task-scoped regression tests are treated
identically.

## Required change

- Record the observed TASK-040/PWD-AF-003/PWD-AF-004 failure chain exactly.
- Decide whether and how a signed descriptor may pre-authorize only its explicit
  task-scoped test paths while preserving `REVIEW_REQUIRED` as a technical fact.
- Keep validation engine, policies, contracts, CI, architecture/security/data/
  release/waiver decisions and undeclared evaluator paths exact exceptions.
- Define deterministic anti-weakening, scope, lifecycle, package-use,
  predecessor, revocation, expiry and audit requirements.
- Define the smallest downstream implementation/proof task and package
  reissuance/migration rule.

## Inputs / contracts

ADR-0010, ADR-0012, ADR-0013, TASK-038 package evaluator, TASK-040 real closure
bundle, the active 23-descriptor package and observed `VALIDATION_FAILED`,
`STATE_WITHOUT_IMPLEMENTATION` and `DEPENDENCY_DRIFT` results.

## Outputs / contracts

ADR-0014 plus one versioned operational finding and a bounded downstream
implementation boundary. No runtime policy changes occur in this task.

## Acceptance criteria

- The ADR distinguishes task-scoped tests named in a signed descriptor from
  evaluator-policy/validation-engine changes.
- Package authority cannot cover deleted evaluators, removed/weakened tests,
  missing evaluators, failed checks, content mutation, identity drift or paths
  not explicitly named in the descriptor.
- Exact exception gates remain for architecture, contracts, security, data,
  release, waiver, exit-gate and production evaluator/policy decisions.
- A successful package-authorized test change can emit implementation/state
  PUSE receipts and satisfy descriptor predecessors without fabricated history.
- Existing exact approvals and TASK-040 evidence remain immutable.
- The migration requires a newly signed package baseline; old authority is not
  reinterpreted retroactively.
- `npm run verify` passes.

## Non-goals

Implement the decision; mutate the active package; auto-sign authority; weaken
CI or validation; execute PWD-AF-004/TASK-004/I3; add parallelism, database, UI,
webhook or public contract changes.

## Evidence expected

Decision alternatives and threat model, exact failure-chain references,
package-versus-exception matrix, anti-weakening and migration rules, bounded
downstream task definition and successful repository verification.

## Escalation

Stop if safe task-test authorization cannot be distinguished deterministically
from evaluator-policy authority, if anti-weakening requires semantic inference
without a governed reviewer, or if the change would relax failed validation,
CI, evidence, lifecycle, package identity or DAG gates.
