---
id: TASK-566
title: Prove cumulative G2-WBS-19 governance privacy semantics
status: ready
priority: 566
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-565
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-563-G2-GOVERNANCE-POLICY-DECISION-EVIDENCE.md
  - specs/tasks/TASK-564-G2-GOVERNANCE-WAIVER-SUPERSESSION.md
  - specs/tasks/TASK-565-G2-PRIVACY-RETENTION-RESIDENCY-DISPOSITION.md
  - packages/contracts/governance/**
  - tests/product/g2-governance-privacy-proof.test.ts
allowed_paths:
  - tests/product/g2-governance-privacy-proof.test.ts
  - packages/contracts/governance/**
  - specs/tasks/TASK-566-G2-GOVERNANCE-PRIVACY-CONSTRUCTION-A-PROOF.md
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
Close G2-WBS-19 Construction A with cumulative deterministic Product Proof over TASK-563..565, emphasizing negative/adversarial authority, currentness and residual-population cases.

## Context
This is proof closure for the committed Construction A scope, not functional overflow.

## Current behavior
TASK-563..565 define the bounded semantic surface incrementally; Construction A requires one cumulative proof that predecessor distinctions survive composition.

## Required change
Complete the cumulative Product Proof for policy/decision/enforcement/evidence/assessment separation, effective-dated waiver/supersession, privacy retention/legal hold/residency/disposition, provider migration and residual cohorts.

## Inputs / contracts
Consume the completed TASK-563..565 governance/privacy contracts and cumulative proof surface without adding successor feature scope.

## Outputs / contracts
Produce cumulative deterministic Product Proof covering the committed G2-WBS-19 Construction A semantics and adversarial non-strengthening cases.

## Acceptance criteria
Proof demonstrates absence of evidence != compliance; evidence/ACK != authority; stale/expired/revoked authority is non-effective; PARTIAL/UNKNOWN does not strengthen; legal hold and residency remain population-qualified; provider migration preserves residual obligations. Product Proof remains explicitly distinct from Production Readiness.

## Non-goals
No new feature family, persistence, UI, provider SDK, commercial/FinOps implementation, WP-13 or Production Readiness claim.

## Evidence expected
Cumulative positive, negative and adversarial Product Proof plus all declared validations and repository-wide `npm run verify`.

## Escalation
Any semantic ambiguity discovered by proof remains UNKNOWN/CONFLICTED or becomes a bounded finding; do not invent policy or absorb successor scope.
