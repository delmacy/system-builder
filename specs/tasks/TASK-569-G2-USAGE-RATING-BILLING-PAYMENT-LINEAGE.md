---
id: TASK-569
title: Define usage rating billing invoice and payment lineage
status: completed
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
G2-WBS-20 now has explicit measured, qualified, rated, charged, invoiced and paid evidence stages with predecessor lineage.

## Required change
Implemented separate usage evidence stages, conservative qualification, sequential stage advancement, correction/rerating ancestry and provider-evidence references without money movement or provider authority promotion.

## Inputs / contracts
Qualified price/contract revisions and subscription/entitlement facts remain upstream authority. Usage observations and provider evidence retain provenance, revision and effective-time qualification.

## Outputs / contracts
Deterministic commercial evidence contracts preserve measured != qualified != rated != billed != invoiced != paid, predecessor/correction references and PARTIAL/UNKNOWN fail-closed behavior.

## Acceptance criteria
Measured != qualified != rated != billed != invoiced != paid. Missing usage != zero. Corrections/rerating preserve predecessor lineage and reason/provenance. Provider or settlement ACK remains provider evidence and cannot silently become customer-commercial truth. PARTIAL/UNKNOWN does not strengthen any stage.

## Non-goals
No payment SDK/provider implementation, money movement, accounting ledger, tax engine, collections, FinOps cost allocation, persistence/UI, WP-13 or Production Readiness claim.

## Evidence expected
Product Proof covers normal lineage, missing usage, PARTIAL/UNKNOWN, skipped-stage rejection, correction/rerating ancestry and provider-ACK adversarial behavior. Declared repository validations remain CI authority.

## Escalation
Escalate rather than infer if implementation requires money movement, concrete payment/provider integration, accounting/tax/collections, FinOps/G2-WBS-21, persistence/UI, WP-13 or any unmaterialized scope.
