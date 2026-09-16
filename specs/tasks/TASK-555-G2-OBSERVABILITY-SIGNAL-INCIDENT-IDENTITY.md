---
id: TASK-555
title: Define observability signal condition alert and incident identity semantics
status: ready
priority: 555
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
work_package: G2-WP-11
wbs: G2-WBS-17
sprint: G2-WP11-CONSTRUCTION-A-01
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/current/NEXT_WORK.md
  - packages/contracts/**
  - tests/product/**
allowed_paths:
  - packages/contracts/observability/**
  - tests/product/g2-observability-operations-proof.test.ts
  - specs/tasks/TASK-555-G2-OBSERVABILITY-SIGNAL-INCIDENT-IDENTITY.md
forbidden_paths:
  - apps/**
  - .github/workflows/**
  - packages/db/**
  - project_docs/generation-2/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---

# Objective
Establish provider-neutral G2-WBS-17 contracts for telemetry signal, evaluated condition, alert and incident identities without collapsing one state into another or converting observed evidence into canonical conflict/authority.

## Context
G2-WP-11 consumes predecessor authority, evidence, trust, locality and operability contracts while preserving `AI inference != authority`, PARTIAL/UNKNOWN non-strengthening, Local/Station/Fleet and Product Proof != Production Readiness.

## Current behavior
The repository does not yet expose the G2-WBS-17 provider-neutral identity contracts required to distinguish telemetry signals, evaluated conditions, alerts and incidents with explicit provenance/currentness.

## Required change
Represent source/producer identity, producing revision, observed/effective time, locality/population and currentness where applicable. Preserve `Signal != ConfirmedConflict` and `signal != condition != alert != incident`. Missing, stale or UNKNOWN evidence must remain explicit and non-strengthening.

## Inputs / contracts
Consume predecessor authority/evidence contracts under `packages/contracts/**` by reference. Treat observed telemetry and AI inference as evidence, never as authority or confirmed conflict by implication.

## Outputs / contracts
Provide provider-neutral observability identity contracts under `packages/contracts/observability/**` plus deterministic Product Proof in `tests/product/g2-observability-operations-proof.test.ts`.

## Acceptance criteria
Distinct signal, condition, alert and incident identities/transitions are represented; source/revision/time/locality/currentness remain explicit; stale or insufficient evidence cannot strengthen into confirmed conflict or authority; positive and negative Product Proof passes.

## Non-goals
No persistence, UI, concrete telemetry provider/SDK, autonomous remediation, generic side-effect authority, WP-12/13 or Production Readiness claim.

## Evidence expected
Deterministic positive and negative Product Proof plus all validation commands declared in frontmatter, including `npm run verify` and its documentation lifecycle check.

## Escalation
If predecessor authority/evidence semantics are ambiguous or evidence is stale/UNKNOWN, preserve UNKNOWN and reconcile before retry rather than inventing ownership, authority or a transition.
