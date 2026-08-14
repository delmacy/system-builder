---
id: TASK-037
title: Accept bounded package work authorization for AgentFactory
status: completed
priority: 1
milestone: I2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: codex
depends_on:
  - TASK-036
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/adr/ADR-0010-durable-human-approval.md
  - docs/adr/ADR-0012-agentfactory-real-run-authority-integration.md
  - project_docs/execution_governance/GOVERNANCE_GATES.md
  - project_docs/execution_governance/HUMAN_APPROVAL.md
  - project_docs/agentfactory_ignition/WORK_PACKAGES.md
  - project_docs/agentfactory_ignition/DAG.md
  - project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md
  - project_docs/agentfactory_i2/I2_EXIT_GATE.md
allowed_paths:
  - docs/adr/ADR-0013-bounded-package-work-authorization.md
  - project_docs/execution_governance/HUMAN_APPROVAL.md
  - project_docs/agentfactory_i2/ASYNC_SUPERVISOR.md
  - project_docs/agentfactory_i2/I2_EXIT_GATE.md
  - specs/tasks/TASK-037-AGENTFACTORY-BOUNDED-PACKAGE-WORK-AUTHORIZATION-ADR.md
forbidden_paths:
  - tooling/agent-harness/src/**
  - tooling/agent-harness/tests/**
  - tooling/agent-harness/policies/**
  - specs/contracts/**
  - packages/**
  - apps/**
max_files: 5
validation:
  - npm run verify
---

# TASK-037 — AgentFactory Bounded Package Work Authorization ADR

## Objective

Accept the architecture and governance boundary for one durable owner decision
to authorize a bounded AgentFactory work package of 20–50 planned tasks while
preserving rolling-wave task derivation, deterministic validation, auditability,
revocation and fail-closed exception gates.

## Context

ADR-0010 correctly requires one exact signed decision per PR. That made the
solo bootstrap trustworthy, but it also requires the owner to sign routine
implementation and state-closure PRs individually. The owner has now directed
that normal AgentFactory work be authorized in packages of 20–50 tasks so the
automation can perform the approved work without repeated approval interaction.

The package cannot simply pre-authorize unknown future changes. AgentFactory
uses rolling-wave planning: later task specs must be derived from accepted Work
Packages and actual integrated predecessor outputs. The decision therefore must
define how an immutable package plan can contain bounded task descriptors/WP
slots while later exact task specs prove that they are conforming refinements.

## Current behavior

`SOLO_DURABLE` accepts only an exact receipt bound to one task, PR, ref and head
SHA. The lifecycle correctly stops every high-risk or architecture PR and every
state-closure PR until that individual signature exists. There is no package
manifest, descriptor-conformance rule, package evaluator, revocation record or
audit binding that could authorize multiple routine PR identities safely.

## Required change

- Add ADR-0013 defining a signed, content-addressed package authorization and
  its relationship to ADR-0010 exact-PR approval.
- Define immutable package identity/version/hash, repository and baseline,
  validity window, owner/key, execution focus, task-count bounds, ordered task
  descriptors or WP slots, DAG constraints, risk ceiling, executor/model rules,
  path/contract boundaries, action/budget limits and required validations.
- Define deterministic rolling-wave conformance: each materialized task must be
  traceably derived from one authorized descriptor and actual integrated
  predecessor outputs without broadening package authority.
- Separate authorization to execute and routinely merge conforming work from
  acceptance of architecture decisions, waivers and exceptional risk.
- Define fail-closed exception gates for scope drift, an unknown task/WP,
  changed baseline semantics, architecture/contract/security/evaluator policy
  decisions, destructive work, failed checks, invalid evidence or risk above
  the package ceiling.
- Define expiry, explicit revocation, key/policy rotation, package exhaustion,
  suspension after repeated failure and append-only receipts linking every
  task, PR, state closure and exception to the package identity.
- Refine WP-I2-07 and identify the smallest downstream implementation/proof
  task, without implementing the policy in this task.

## Inputs / contracts

ADR-0010, ADR-0012, governance gates, task/WP/DAG records, task generation and
state-closure lifecycle, exact PR/check/evidence identities and the owner's
explicit package-level operating requirement.

## Outputs / contracts

ADR-0013 plus a frozen WP-I2-07 implementation boundary suitable for
rolling-wave materialization after this architecture task is integrated.

## Acceptance criteria

- A package authorizes between 20 and 50 task descriptors and cannot authorize
  work outside its content-addressed manifest.
- Rolling-wave specs can be produced only as bounded refinements of authorized
  descriptors using integrated predecessor evidence; unused authority cannot be
  reinterpreted or transferred.
- Each execution, implementation PR, state PR and closure receipt binds package
  ID/hash, descriptor ID, task ID, exact refs/SHAs and governing policy version.
- Required validation, named CI checks, allowed/forbidden paths, DAG, DoR/DoD,
  evidence and state closure remain mandatory for every task.
- Routine conforming work can proceed without a new owner signature per PR;
  exception gates stop and require an exact separately signed decision.
- Architecture decisions are never silently accepted by advance package intent;
  the ADR defines the explicit acceptance boundary.
- Expired, revoked, exhausted, mismatched or suspended packages fail closed and
  cannot authorize new actions.
- The private key remains outside executor access and no signing API is added.
- WP-I2-06 authority integration, TASK-004, I3 and parallel execution are not
  executed during this task.
- `npm run verify` passes.

## Non-goals

Implement package receipt evaluation, sign a first 20–50 task package, execute
any package task, implement the WP-I2-06 authority bridge, change Supervisor
scheduling, enable parallelism, execute TASK-004, enter I3, or weaken existing
CI/evidence/security controls.

## Evidence expected

ADR alternatives and threat model, package-versus-exception decision table,
rolling-wave conformance rules, revocation/expiry semantics, audit linkage and
passing repository validation.

## Escalation

Stop if the design would make a mutable plan authoritative, permit an executor
to expand its own scope, accept an ADR before its actual decision exists, treat
merge as approval, expose signing authority, or bypass any required validation,
evidence, DAG or state-closure gate.
