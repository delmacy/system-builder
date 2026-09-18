---
id: TASK-564
title: Define effective-dated governance waiver exception authority and supersession
status: blocked
priority: 564
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
work_package: G2-WP-12
wbs: G2-WBS-19
sprint: G2-WP12-CONSTRUCTION-A-01
depends_on:
  - TASK-563
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-563-G2-GOVERNANCE-POLICY-DECISION-EVIDENCE.md
  - packages/contracts/governance/**
  - packages/contracts/**
allowed_paths:
  - packages/contracts/governance/**
  - tests/product/g2-governance-privacy-proof.test.ts
  - specs/tasks/TASK-564-G2-GOVERNANCE-WAIVER-SUPERSESSION.md
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
Extend G2-WBS-19 with effective-dated policy and bounded waiver/exception authority without allowing evidence, approval acknowledgement or stale revisions to silently supersede governing policy.

## Context
Depends on TASK-563 governance identities and distinctions. Authority must remain actor/scope/revision/effective-time/expiry qualified.

## Current behavior
TASK-563 establishes the base governance semantic boundary but does not yet encode bounded waiver/exception authority and deterministic supersession.

## Required change
Represent effective intervals, supersession lineage, waiver/exception issuer authority, scope, rationale/reference, expiry/revocation and currentness. Conflicting or stale revisions remain explicit and non-strengthening.

## Acceptance criteria
Policy revisions and supersession are deterministic; waiver/exception authority is bounded by issuer/scope/revision/time/expiry; ACK or evidence cannot create a waiver; expired/revoked/stale authority cannot silently remain effective.

## Non-goals
No persistence, UI, workflow mutation, commercial entitlement, FinOps, WP-13 or Production Readiness.

## Evidence expected
Cumulative positive/negative Product Proof and all declared validations.

## Escalation
On ambiguous authority or competing current revisions, preserve UNKNOWN/CONFLICTED and require reconciliation rather than selecting authority heuristically.
