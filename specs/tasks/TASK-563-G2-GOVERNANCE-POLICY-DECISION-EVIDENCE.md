---
id: TASK-563
title: Define governance policy decision enforcement evidence and assessment semantics
status: ready
priority: 563
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/G2-WP12-PLANNING-MATERIALIZATION-01.report.md
  - packages/contracts/**
  - tests/product/**
allowed_paths:
  - packages/contracts/governance/**
  - tests/product/g2-governance-privacy-proof.test.ts
  - specs/tasks/TASK-563-G2-GOVERNANCE-POLICY-DECISION-EVIDENCE.md
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
Establish provider-neutral G2-WBS-19 governance contracts that keep policy, decision, enforcement, evidence and assessment semantically distinct.

## Context
G2-WP-12 consumes closed predecessor authority, evidence, provider qualification, operability and observability semantics. Governance/compliance evidence must not become authority or compliance truth by inference.

## Current behavior
The repository does not yet expose the bounded G2-WBS-19 governance semantic surface required by the materialized WP-12 package plan.

## Required change
Represent policy identity/revision/effective time/scope, decision identity and basis, enforcement observation/result, evidence provenance/currentness/population and assessment outcome without collapsing these concepts. Preserve stale/PARTIAL/UNKNOWN as explicit non-strengthening states.

## Inputs / contracts
Consume predecessor identity, authority, evidence, locality and provider contracts under `packages/contracts/**` by reference; do not duplicate producer ownership.

## Outputs / contracts
Provide provider-neutral governance contracts under `packages/contracts/governance/**` and begin the cumulative Product Proof at `tests/product/g2-governance-privacy-proof.test.ts`.

## Acceptance criteria
`policy != decision != enforcement != evidence != assessment`; absence of evidence does not prove compliance or non-compliance; revision/scope/currentness/provenance remain explicit; AI inference and observed evidence do not acquire authority.

## Non-goals
No persistence, UI, concrete provider SDK, autonomous-agent authority, generic side-effect authority, commercial/FinOps implementation, WP-13 or Production Readiness claim.

## Evidence expected
Positive and negative deterministic Product Proof plus all validation commands declared in frontmatter.

## Escalation
If predecessor authority/evidence semantics are ambiguous or evidence is stale/PARTIAL/UNKNOWN, preserve the weaker state and reconcile rather than inventing authority or compliance truth.
