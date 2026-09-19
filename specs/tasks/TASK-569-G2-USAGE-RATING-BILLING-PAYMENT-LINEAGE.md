---
id: TASK-569
title: Define usage rating billing invoice and payment lineage
status: blocked
priority: 569
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-568
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-567-G2-COMMERCIAL-CATALOG-PRICING-CONTRACT.md
  - specs/tasks/TASK-568-G2-SUBSCRIPTION-ENTITLEMENT-SEMANTICS.md
  - packages/contracts/commercial/**
allowed_paths:
  - packages/contracts/commercial/**
  - tests/product/g2-commercial-entitlement-proof.test.ts
  - specs/tasks/TASK-569-G2-USAGE-RATING-BILLING-PAYMENT-LINEAGE.md
forbidden_paths:
  - apps/**
  - .github/workflows/**
  - packages/db/**
  - project_docs/generation-2/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---

# Objective
Define the bounded metering-to-payment evidence chain for G2-WBS-20 while keeping each commercial stage distinct and correction/rerating lineage explicit.

## Context
TASK-569 follows qualified catalog/contract and subscription/entitlement semantics. It models commercial evidence lineage only; provider acknowledgements and settlement observations remain evidence rather than customer-commercial truth.

## Current behavior
Before this task, G2-WBS-20 has no cumulative contract separating measurement, qualification, rating, charge, invoice and payment evidence with explicit correction/rerating ancestry.

## Required change
Model meter/usage measurement, qualification, rating, charge, billing/invoice and payment/settlement evidence as separate revision/provenance-qualified stages. Preserve effective-dated pricing references, corrections and rerating lineage without destructive rewrite of prior evidence.

## Inputs / contracts
Consume qualified price/contract revisions from TASK-567 and subscription/entitlement facts from TASK-568. Usage observations, provider evidence and correction reasons must retain provenance, revision and effective-time qualification.

## Outputs / contracts
Produce deterministic commercial evidence contracts for measured, qualified, rated, charged, invoiced and paid stages, including predecessor references for corrections/rerating and explicit PARTIAL/UNKNOWN states.

## Acceptance criteria
Measured != qualified != rated != billed != invoiced != paid. Missing usage != zero. Corrections/rerating preserve predecessor lineage and reason/provenance. Provider or settlement ACK remains provider evidence and cannot silently become customer-commercial truth. PARTIAL/UNKNOWN does not strengthen any stage.

## Non-goals
No payment SDK/provider implementation, money movement, accounting ledger, tax engine, collections, FinOps cost allocation, persistence/UI, WP-13 or Production Readiness claim.

## Evidence expected
Deterministic Product Proof for normal, missing, duplicate/corrected/rerated and provider-ACK cases plus declared validations.

## Escalation
Escalate rather than infer if implementation requires money movement, concrete payment/provider integration, accounting/tax/collections, FinOps/G2-WBS-21, persistence/UI, WP-13 or any unmaterialized scope.
