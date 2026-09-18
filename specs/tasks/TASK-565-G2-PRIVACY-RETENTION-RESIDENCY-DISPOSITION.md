---
id: TASK-565
title: Define privacy classification retention legal hold residency and disposition population semantics
status: blocked
priority: 565
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-564
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-563-G2-GOVERNANCE-POLICY-DECISION-EVIDENCE.md
  - specs/tasks/TASK-564-G2-GOVERNANCE-WAIVER-SUPERSESSION.md
  - packages/contracts/governance/**
  - packages/contracts/**
allowed_paths:
  - packages/contracts/governance/**
  - tests/product/g2-governance-privacy-proof.test.ts
  - specs/tasks/TASK-565-G2-PRIVACY-RETENTION-RESIDENCY-DISPOSITION.md
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
Define G2-WBS-19 privacy/data-governance semantics for classification, retention, legal hold, residency and disposition across qualified populations and provider migration.

## Context
Consumes TASK-563/564 policy and bounded authority semantics while preserving source-of-truth/coexistence/residual drainage and provider qualification.

## Current behavior
Governance policy semantics do not yet represent data population obligations and residual cohorts across retention, hold, residency and disposition transitions.

## Required change
Represent classification and policy revision, qualified population/cohort, retention interval, legal-hold precedence, residency constraints, disposition eligibility/result, provider/source lineage and residual populations. Missing inventory or incomplete migration must remain PARTIAL/UNKNOWN rather than complete.

## Inputs / contracts
Consume TASK-563/564 governance authority and predecessor provider/population/currentness contracts by reference.

## Outputs / contracts
Extend provider-neutral governance contracts and cumulative Product Proof with privacy classification, retention, legal-hold, residency, disposition and residual-population semantics.

## Acceptance criteria
Legal hold prevents incompatible disposition; residency/retention decisions are revision/population qualified; provider migration does not erase obligations or residual cohorts; incomplete population evidence cannot strengthen into complete compliance/disposition.

## Non-goals
No physical deletion engine, persistence, UI, provider SDK, commercial billing, FinOps, WP-13 or Production Readiness.

## Evidence expected
Cumulative positive/negative Product Proof including provider-migration and residual-population cases plus all declared validations.

## Escalation
When population coverage or provider lineage is incomplete, preserve PARTIAL/UNKNOWN and residual cohorts explicitly.
